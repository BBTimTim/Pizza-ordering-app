---
description: A pizzéria nyitvatartásának módosítása, és hogy zárva tartás alatt ne lehessen rendelni
argument-hint: "Mit módosítsunk? (pl. új nyitvatartás, szünnap, ünnepnap, rendelési határidő zárás előtt)"
---

# Nyitvatartás (opening hours)

## Felépítés
- **Beállítás:** `backend/config/shop.php` – `timezone` (`Europe/Budapest`) és `opening_hours`: a hét napja (1 = hétfő … 7 = vasárnap) → `['11:00', '22:00']`, vagy `null` = zárva. Jelenleg: hétfő zárva, kedd–vasárnap 11:00–22:00.
- **Logika:** `backend/app/Services/ShopHours.php` – `isOpen()`, `nextOpening()`, `message()` („Nyitva 22:00-ig”, „Zárva – nyitás: holnap 11:00”), `weekly()` (heti lista).
- **API:** `GET /api/shop-status` → `{ open, message, hours: [{ day, hours }] }` (`backend/routes/api.php`).
- **Rendelés tiltása:** `OrderController@checkout` zárva tartáskor 422-t ad (`errors.shop`), rendelés nem jön létre.
- **Frontend:** `frontend/src/components/redux/shop/shopSlice.js` (`useGetShopStatusQuery`), `components/common/ShopStatus.jsx` (jelzés, `showHours` = heti lista, percenként frissül), a láblécben (`layout/Footer.jsx`) és a rendelés oldalon (`order/AddOrder.jsx`: zárva tartáskor figyelmeztetés és letiltott gomb).
- **Tesztek:** `backend/tests/Feature/ShopHoursTest.php`; az `OrderTest` rögzített, nyitvatartási időben fut (`Carbon::setTestNow`, kedd 12:00).

## Feladat
$ARGUMENTS

## Elvárások
1. A nyitvatartást csak a `config/shop.php`-ban módosítsd; a frontend és az üzenetek onnan veszik.
2. Az időt mindig magyar idő (`Europe/Budapest`) szerint kezeld, akkor is, ha az alkalmazás UTC-ben tárol.
3. A döntés a szerveré: a checkout zárva tartáskor elutasít, a frontend csak jelzi.
4. Időfüggő tesztnél rögzítsd az időt (`Carbon::setTestNow`), különben a teszt napszaktól függően bukhat el. Futtasd: `php artisan test`.
5. Minden üzenet magyar legyen; a változást vezesd át a dokumentációba, és magyarázd el kezdőknek is érthetően.
