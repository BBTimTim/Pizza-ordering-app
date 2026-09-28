---
name: rendeles-arazas
description: A rendelési és árazási logika módosítása (szállítási díj, méretszorzó, feltétek, fizetés) úgy, hogy a backend és a frontend szinkronban maradjon
---

# Rendelés és árazás módosítása

## Háttér
- A végleges árat **mindig a backend számolja**: `backend/app/Services/OrderPricing.php`. A kliens által küldött árakat figyelmen kívül hagyja.
- A szabályok: tételár = `round(product.price * size.price_multiplier) + feltétárak összege`; a szállítás `config/shop.php` szerint 1200 Ft, 15000 Ft részösszegtől ingyenes.
- A frontend `frontend/src/components/redux/cart/cartSlice.js` ugyanezt számolja, de **csak megjelenítésre**.
- Folyamat: `POST /api/checkout` (rendelés `not_paid` + Stripe PaymentIntent) → Stripe Payment Element a frontenden → `POST /api/orders/{id}/confirm-payment` (a backend a Stripe-tól ellenőrzi) → `paid` + visszaigazoló e-mail (`App\Mail\OrderConfirmation`).
- A Stripe a `PaymentGateway` interfészen keresztül érhető el; tesztekben a `tests/Fakes/FakePaymentGateway.php` helyettesíti.

## Feladat
${input:valtozas:A kívánt változás leírása}

## Elvárások
1. Módosítsd a `config/shop.php` / `OrderPricing` logikát, és **ugyanúgy** a `cartSlice.js`-t, hogy a kosárban látott ár egyezzen a fizetendővel.
2. Bővítsd a `backend/tests/Feature/OrderTest.php` teszteket a változás határeseteivel, és futtasd: `php artisan test`.
3. A rendelési tételek a rendelés pillanatában rögzítik a nevet, a méretet és a feltéteket (`order_items`), ezt ne törd el.
4. Minden új üzenet magyar legyen.
5. Frissítsd a `docs/TECHNIKAI_DOKUMENTACIO.md` 4.2 és 6.3 szakaszát.
