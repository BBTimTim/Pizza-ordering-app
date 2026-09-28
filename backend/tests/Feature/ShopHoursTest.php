<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class ShopHoursTest extends TestCase
{
    use RefreshDatabase;

    private function at(string $time): void
    {
        // 2026-09-28 hétfő, 29 kedd, 2026-10-04 vasárnap
        Carbon::setTestNow(Carbon::parse($time, 'Europe/Budapest'));
    }

    public function test_status_while_open(): void
    {
        $this->at('2026-09-29 12:00');

        $this->getJson('/api/shop-status')
            ->assertOk()
            ->assertJsonPath('open', true)
            ->assertJsonPath('message', 'Nyitva 22:00-ig')
            ->assertJsonPath('hours.0', ['day' => 'hétfő', 'hours' => 'zárva'])
            ->assertJsonPath('hours.1', ['day' => 'kedd', 'hours' => '11:00–22:00']);
    }

    public function test_status_before_opening_and_after_closing(): void
    {
        $this->at('2026-09-29 09:30');
        $this->getJson('/api/shop-status')->assertJsonPath('open', false)->assertJsonPath('message', 'Zárva – nyitás: ma 11:00');

        $this->at('2026-09-29 22:00');
        $this->getJson('/api/shop-status')->assertJsonPath('open', false)->assertJsonPath('message', 'Zárva – nyitás: holnap 11:00');
    }

    public function test_monday_is_closed_and_sunday_night_points_to_tuesday(): void
    {
        $this->at('2026-09-28 15:00');
        $this->getJson('/api/shop-status')->assertJsonPath('open', false)->assertJsonPath('message', 'Zárva – nyitás: holnap 11:00');

        $this->at('2026-10-04 23:00');
        $this->getJson('/api/shop-status')->assertJsonPath('message', 'Zárva – nyitás: kedd 11:00');
    }

    public function test_orders_are_rejected_while_closed(): void
    {
        $this->at('2026-09-28 15:00');
        config(['services.stripe.secret' => 'sk_test_dummy']);
        $product = Product::create(['name' => 'Margherita', 'description' => 'Paradicsom, mozzarella', 'price' => 2000, 'status' => 'active', 'is_featured' => 'no']);

        $this->postJson('/api/checkout', [
            'name' => 'Kiss Pista', 'email' => 'kiss@example.com', 'phone' => '+36701234567',
            'city' => 'Budapest', 'zip' => '1111', 'address' => 'Fő utca 1.',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])
            ->assertStatus(422)
            ->assertJsonPath('errors.shop.0', 'Most zárva vagyunk, ezért nem tudunk rendelést fogadni. Zárva – nyitás: holnap 11:00.');

        $this->assertDatabaseCount('orders', 0);
    }
}
