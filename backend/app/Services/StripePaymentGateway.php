<?php

namespace App\Services;

use App\Models\Order;
use Stripe\StripeClient;

class StripePaymentGateway implements PaymentGateway
{
    public function __construct(private StripeClient $stripe) {}

    public function createPayment(Order $order): array
    {
        $intent = $this->stripe->paymentIntents->create([
            // A Stripe a forintot is két tizedessel kéri: 2490 Ft = 249000
            'amount' => $order->grand_total * 100,
            'currency' => config('shop.currency'),
            'automatic_payment_methods' => ['enabled' => true],
            'receipt_email' => $order->email,
            'metadata' => ['order_id' => $order->id],
        ]);

        return ['id' => $intent->id, 'client_secret' => $intent->client_secret];
    }

    public function isPaid(Order $order): bool
    {
        $intent = $this->stripe->paymentIntents->retrieve($order->payment_intent_id);

        return $intent->status === 'succeeded'
            && $intent->amount === $order->grand_total * 100
            && (int) $intent->metadata['order_id'] === $order->id;
    }
}
