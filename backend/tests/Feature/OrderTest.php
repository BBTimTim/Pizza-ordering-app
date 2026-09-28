<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\Size;
use App\Models\Topping;
use App\Models\User;
use App\Services\PaymentGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Fakes\FakePaymentGateway;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private FakePaymentGateway $payments;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.stripe.secret' => 'sk_test_dummy']);
        $this->payments = new FakePaymentGateway;
        $this->app->instance(PaymentGateway::class, $this->payments);
    }

    private function customer(array $items): array
    {
        return [
            'name' => 'Kiss Pista',
            'email' => 'kiss@example.com',
            'phone' => '+36701234567',
            'city' => 'Budapest',
            'zip' => '1111',
            'address' => 'Fő utca 1.',
            'items' => $items,
        ];
    }

    private function product(array $attributes = []): Product
    {
        return Product::create([
            'name' => 'Margherita',
            'description' => 'Paradicsomszósz, mozzarella',
            'price' => 2000,
            'status' => 'active',
            'is_featured' => 'no',
            ...$attributes,
        ]);
    }

    public function test_the_server_calculates_prices_and_ignores_client_prices(): void
    {
        $product = $this->product();
        $size = Size::create(['name' => 32, 'price_multiplier' => 1.5]);
        $topping = Topping::create(['name' => 'Sonka', 'price' => 400]);

        $response = $this->postJson('/api/checkout', $this->customer([[
            'product_id' => $product->id,
            'size_id' => $size->id,
            'topping_ids' => [$topping->id],
            'quantity' => 2,
            'price' => 1,
        ]]) + ['grand_total' => 1, 'payment_status' => 'paid']);

        // (2000 * 1,5 + 400) * 2 = 6800, 15000 alatt 1200 Ft szállítással
        $response->assertCreated()
            ->assertJsonPath('data.sub_total', 6800)
            ->assertJsonPath('data.delivery_charges', 1200)
            ->assertJsonPath('data.grand_total', 8000)
            ->assertJsonPath('data.payment_status', 'not_paid')
            ->assertJsonPath('data.items.0.size_name', '32 cm')
            ->assertJsonPath('data.items.0.toppings.0.name', 'Sonka')
            ->assertJsonPath('client_secret', 'pi_test_1_secret');
    }

    public function test_delivery_is_free_from_15000(): void
    {
        $product = $this->product(['price' => 5000]);

        $this->postJson('/api/checkout', $this->customer([['product_id' => $product->id, 'quantity' => 3]]))
            ->assertCreated()
            ->assertJsonPath('data.delivery_charges', 0)
            ->assertJsonPath('data.grand_total', 15000);
    }

    public function test_blocked_products_cannot_be_ordered(): void
    {
        $product = $this->product(['status' => 'block']);

        $this->postJson('/api/checkout', $this->customer([['product_id' => $product->id, 'quantity' => 1]]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('items.0.product_id');

        $this->assertSame(0, Order::count());
    }

    public function test_the_order_is_linked_to_the_logged_in_user(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/checkout', $this->customer([['product_id' => $this->product()->id, 'quantity' => 1]]))
            ->assertCreated()
            ->assertJsonPath('data.user_id', $user->id);
    }

    public function test_confirming_a_successful_payment_marks_the_order_paid_and_returns_the_summary(): void
    {
        $orderId = $this->postJson('/api/checkout', $this->customer([['product_id' => $this->product()->id, 'quantity' => 1]]))
            ->json('data.id');

        // A válasz tartalmazza a tételeket is, ebből készül az EmailJS-es összesítő
        $this->postJson("/api/orders/$orderId/confirm-payment")
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'paid')
            ->assertJsonPath('data.email', 'kiss@example.com')
            ->assertJsonPath('data.items.0.name', 'Margherita');
    }

    public function test_an_unsuccessful_payment_is_not_accepted(): void
    {
        $orderId = $this->postJson('/api/checkout', $this->customer([['product_id' => $this->product()->id, 'quantity' => 1]]))
            ->json('data.id');
        $this->payments->paid = false;

        $this->postJson("/api/orders/$orderId/confirm-payment")->assertStatus(402);

        $this->assertSame('not_paid', Order::find($orderId)->payment_status);
    }

    public function test_only_admins_can_list_orders_and_change_their_status(): void
    {
        $orderId = $this->postJson('/api/checkout', $this->customer([['product_id' => $this->product()->id, 'quantity' => 1]]))
            ->json('data.id');

        Sanctum::actingAs(User::factory()->create(['status' => 'user']));
        $this->getJson('/api/orders')->assertForbidden();
        $this->postJson("/api/orders/$orderId/status", ['status' => 'delivered'])->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['status' => 'admin']));
        $this->getJson('/api/orders')->assertOk()->assertJsonPath('data.0.id', $orderId);
        $this->postJson("/api/orders/$orderId/status", ['status' => 'nonsense'])->assertStatus(422);
        $this->postJson("/api/orders/$orderId/status", ['status' => 'out_for_delivery'])
            ->assertOk()
            ->assertJsonPath('data.status', 'out_for_delivery');
    }

    public function test_customers_only_see_their_own_orders(): void
    {
        $product = $this->product();
        $alice = User::factory()->create();
        $bob = User::factory()->create();

        Sanctum::actingAs($alice);
        $this->postJson('/api/checkout', $this->customer([['product_id' => $product->id, 'quantity' => 1]]));
        Sanctum::actingAs($bob);
        $this->postJson('/api/checkout', $this->customer([['product_id' => $product->id, 'quantity' => 2]]));

        $this->getJson('/api/my-orders')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user_id', $bob->id);
    }

    public function test_health_endpoint_reports_ok(): void
    {
        $this->getJson('/api/health')->assertOk()->assertJson(['status' => 'ok']);
    }
}
