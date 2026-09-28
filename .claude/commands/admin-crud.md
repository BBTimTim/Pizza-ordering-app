---
description: Új adminisztrálható erőforrás (migráció, modell, admin végpontok, React lista- és űrlapoldal, menüpont) a Sizes/Toppings minta szerint
argument-hint: "Az erőforrás neve és mezői, pl. kupon (kód, kedvezmény %, lejárat)"
---

# Új admin erőforrás

## Feladat
$ARGUMENTS

## Minta
A méretek kezelése a mintája: `backend/app/Http/Controllers/admin/SizeController.php`, `frontend/src/components/admin/AddSizes.jsx` (űrlap), `frontend/src/components/admin/Sizes.jsx` (lista), `frontend/src/components/redux/size/sizeSlice.js`.

## Lépések
1. Migráció és Eloquent modell (`$fillable`, szükség esetén `$casts`, kapcsolatok).
2. Admin controller a `backend/app/Http/Controllers/admin/` alá, az útvonalak az `['auth:sanctum', 'status:admin']` csoportba.
3. RTK Query slice az új erőforráshoz, egyedi tag-gel.
4. Két React oldal (`AddX.jsx`, `X.jsx`) a meglévő Tailwind/DaisyUI stílusban, és `/admin/...` útvonal az `App.jsx`-ben (lazy importtal).
5. Menüpont a `frontend/src/components/admin/SettingsButton.jsx`-ben.
6. Seeder demó adatokkal a `DatabaseSeeder.php`-ben (csak üres adatbázisba tölt).
7. Feature teszt, `php artisan test`, `npm run lint`, `npm run build`; a dokumentáció 5.1 és 6.2 szakaszának frissítése.
