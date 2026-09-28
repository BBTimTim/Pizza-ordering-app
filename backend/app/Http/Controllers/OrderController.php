<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderPricing;
use App\Services\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;

class OrderController extends Controller
{
    public const STATUSES = ['pending', 'out_for_delivery', 'delivered', 'cancelled'];

    // Admin: összes rendelés, opcionálisan státusz szerint szűrve
    public function index(Request $request)
    {
        $orders = Order::with('items')
            ->when($request->query('status'), fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20);

        return response()->json($orders, 200);
    }

    // Admin: egy rendelés részletei
    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);

        return response()->json([
            'data' => $order,
        ], 200);
    }

    // Bejelentkezett vásárló saját rendelései
    public function myOrders(Request $request)
    {
        $orders = $request->user()->orders()->with('items')->latest()->get();

        return response()->json([
            'data' => $orders,
        ], 200);
    }

    // Rendelés létrehozása + Stripe fizetési szándék. Az árakat a szerver számolja.
    public function checkout(Request $request, OrderPricing $pricing, PaymentGateway $payments)
    {
        $validated = $request->validate([
            'name' => ['required', 'max:100'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'min:8', 'max:20'],
            'county' => ['nullable', 'min:3', 'max:50'],
            'city' => ['required', 'min:3', 'max:50'],
            'zip' => ['required', 'min:4', 'max:6'],
            'address' => ['required', 'min:3', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.size_id' => ['nullable', 'integer'],
            'items.*.topping_ids' => ['array'],
            'items.*.topping_ids.*' => ['integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ], [
            'items.required' => 'A kosár üres.',
        ]);

        if (! config('services.stripe.secret')) {
            return response()->json([
                'errors' => ['payment' => ['Az online fizetés nincs beállítva (STRIPE_SECRET).']],
            ], 503);
        }

        $totals = $pricing->calculate($validated['items']);

        try {
            $result = DB::transaction(function () use ($validated, $totals, $request, $payments) {
                $order = Order::create([
                    ...collect($validated)->except('items')->all(),
                    'user_id' => $request->user('sanctum')?->id,
                    'sub_total' => $totals['sub_total'],
                    'delivery_charges' => $totals['delivery_charges'],
                    'grand_total' => $totals['grand_total'],
                    'status' => 'pending',
                    'payment_method' => 'card',
                    'payment_status' => 'not_paid',
                ]);

                $order->items()->createMany($totals['items']);

                $payment = $payments->createPayment($order);
                $order->update(['payment_intent_id' => $payment['id']]);

                return ['order' => $order->load('items'), 'client_secret' => $payment['client_secret']];
            });
        } catch (ApiErrorException $e) {
            Log::error('Stripe hiba a rendelés létrehozásakor', ['message' => $e->getMessage()]);

            return response()->json([
                'errors' => ['payment' => ['A fizetés indítása nem sikerült, kérjük, próbáld újra később.']],
            ], 502);
        }

        return response()->json([
            'success' => 'Rendelés létrehozva, fizetésre vár.',
            'data' => $result['order'],
            'client_secret' => $result['client_secret'],
        ], 201);
    }

    // A frontend a sikeres Stripe fizetés után hívja; a státuszt a Stripe-tól kérdezzük le, nem a klienstől fogadjuk el
    public function confirmPayment($id, PaymentGateway $payments)
    {
        $order = Order::with('items')->findOrFail($id);

        if ($order->payment_status === 'paid') {
            return response()->json(['success' => 'A rendelés már ki van fizetve.', 'data' => $order], 200);
        }

        if (! $order->payment_intent_id || ! $payments->isPaid($order)) {
            return response()->json([
                'errors' => ['payment' => ['A fizetés még nem sikerült.']],
            ], 402);
        }

        $order->update(['payment_status' => 'paid']);

        // A vásárlói visszaigazoló e-mailt a frontend küldi EmailJS-szel ezekből az adatokból
        return response()->json([
            'success' => 'Sikeres fizetés, köszönjük a rendelést!',
            'data' => $order,
        ], 200);
    }

    // Admin: rendelés státuszának módosítása
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:'.implode(',', self::STATUSES)],
        ]);

        $order = Order::findOrFail($id);
        $order->update($validated);

        return response()->json([
            'success' => 'Sikeres módosítás!',
            'data' => $order->load('items'),
        ], 200);
    }
}
