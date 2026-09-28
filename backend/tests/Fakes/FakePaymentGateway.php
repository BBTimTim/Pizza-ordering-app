<?php

namespace Tests\Fakes;

use App\Models\Order;
use App\Services\PaymentGateway;

/**
 * Tesztekben a Stripe helyett: nem hív külső szolgáltatást, a fizetés eredménye beállítható.
 */
class FakePaymentGateway implements PaymentGateway
{
    public bool $paid = true;

    public function createPayment(Order $order): array
    {
        return ['id' => 'pi_test_'.$order->id, 'client_secret' => 'pi_test_'.$order->id.'_secret'];
    }

    public function isPaid(Order $order): bool
    {
        return $this->paid;
    }
}
