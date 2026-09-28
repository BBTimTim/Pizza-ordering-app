<?php

namespace App\Services;

use App\Models\Order;

/**
 * Fizetési szolgáltató absztrakciója – élesben Stripe, tesztekben hamis (fake) implementáció.
 */
interface PaymentGateway
{
    /**
     * Fizetési szándékot hoz létre a rendeléshez.
     *
     * @return array{id: string, client_secret: string}
     */
    public function createPayment(Order $order): array;

    /**
     * Igaz, ha a fizetés sikeresen lezárult, és az összege egyezik a rendelésével.
     */
    public function isPaid(Order $order): bool;
}
