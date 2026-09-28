---
description: Új API végpont végigvezetése a Laravel backendtől az RTK Query endpointig, teszttel és dokumentációval
argument-hint: "Mit csináljon a végpont, és ki érheti el (publikus / bejelentkezett / admin)?"
---

# Új végpont (fullstack)

## Feladat
$ARGUMENTS

## Lépések
1. **Útvonal** a `backend/routes/api.php`-ban:
   - publikus;
   - `auth:sanctum` (bejelentkezett);
   - `['auth:sanctum', 'status:admin']` csoport (admin).
   Figyelj: néhány `GET` útvonal az admin csoportban és publikusan is szerepel, a későbbi regisztráció érvényesül. Érzékeny végpontra tegyél `throttle` middleware-t.
2. **Controller**: validáció `$request->validate(...)`, magyar egyedi üzenetekkel, ahol a mező neve nem egyértelmű. Válaszforma a meglévők szerint: `['success' => '...', 'data' => ...]`, hibánál `['errors' => [...]]` és megfelelő státuszkód (201, 403, 422…).
3. **Frontend**: a megfelelő `frontend/src/components/redux/*/…Slice.js` fájlban `apiSlice.injectEndpoints(...)`, `providesTags` / `invalidatesTags` beállítással, és a generált hook exportálásával.
4. **Teszt**: Feature teszt a `backend/tests/Feature` alá (sikeres eset, jogosultság, validáció). Admin/user szerepkörhöz használj `Sanctum::actingAs(User::factory()->create(['status' => 'admin']))`-t.
5. `php artisan test` és `npm run lint` fusson zölden.
6. Vedd fel a végpontot a `docs/TECHNIKAI_DOKUMENTACIO.md` 6.1 vagy 6.2 táblázatába.
