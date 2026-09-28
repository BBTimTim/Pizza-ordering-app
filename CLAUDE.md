# CLAUDE.md

Ez a fájl útmutatást ad a Claude Code (claude.ai/code) számára a repository kódjával való munkához.

A „One more slice” egy pizzarendelő webalkalmazás: egy React SPA (`frontend/`), amely egy Laravel 10 REST API-val (`backend/`) kommunikál. A kettő külön dev szerveren fut. A felhasználói felület szövegei, a validációs és hibaüzenetek, a README és a `docs/TECHNIKAI_DOKUMENTACIO.md` magyar nyelvűek — az új UI-szövegeket és API-üzeneteket is magyarul kell írni.

## Parancsok

Docker (ajánlott; `docker-compose.yml`, beállítások a gyökér `.env`-ben, minta: `.env.example`):
```bash
docker compose up -d --build   # app: http://localhost:8080, phpMyAdmin: :8081, Mailpit: :8025
docker compose logs backend --tail=100
docker compose down -v         # az adatbázis volume-ot is törli
```
A `backend` konténer induláskor lefuttatja a `migrate --force` és `db:seed --force` parancsokat. A seeder csak üres adatbázisba tölt: `admin@onemoreslice.hu` / `Admin123!`, `vasarlo@onemoreslice.hu` / `Vasarlo123!`, méretek, feltétek és 8 termék. Ha a gépen az Avast HTTPS-ellenőrzése be van kapcsolva, a buildben a TLS hibára fut (npm, composer, apk).

Backend (`backend/`, PHP 8.1, MySQL XAMPP-on keresztül — az adatbázis-beállítások a `.env`-ben, lásd `.env.example`):
```bash
composer install && cp .env.example .env && php artisan key:generate
php artisan migrate            # újraépítés: php artisan migrate:fresh --seed
php artisan serve              # http://127.0.0.1:8000
php artisan test               # PHPUnit, memóriában futó SQLite-on (phpunit.xml) — MySQL nem kell
php artisan test --filter=OrderTest
./vendor/bin/pint              # kódstílus
```

Frontend (`frontend/`):
```bash
npm install
npm run dev                    # Vite, http://localhost:5173
npm run build
npm run lint                   # ESLint (tesztfuttató nincs beállítva)
```

Frontend környezeti változók (`frontend/.env` Docker nélkül, a gyökér `.env` Dockerben; minta: `frontend/.env.example`): `VITE_API_URL`, `VITE_IMG_URL`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_GOOGLE_API_KEY` (térkép), `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` (kapcsolati űrlap), `VITE_EMAILJS_TEMPLATE_ID2` (rendelés-visszaigazolás), `VITE_EMAILJS_PUBLIC_KEY`. A `VITE_` változók a böngészőbe kerülnek, titkos kulcs (pl. `STRIPE_SECRET`) soha nem lehet `VITE_` előtagú. Backend: `STRIPE_SECRET`, `FRONTEND_URL`. A vásárlóknak szóló e-maileket a kliens küldi EmailJS-en keresztül, nem a Laravel (a Laravel csak a regisztráció-megerősítő és jelszó-visszaállító értesítéseket küldi). A rendelés-visszaigazolás a vizsgafeladat követelménye, maradjon EmailJS-en.

## Architektúra

### URL-ek és a Docker-felépítés
A frontend és a backend címei környezeti változókból jönnek; új helyen ne égess be `localhost` URL-t:
- `frontend/src/app/api/apiSlice.js` és `frontend/config.js` — `VITE_API_URL` / `VITE_IMG_URL`; alapértelmezés: `http://127.0.0.1:8000/api` és `/uploads`
- `backend/routes/api.php` — az e-mail-megerősítés a `config('app.frontend_url')` (`FRONTEND_URL`) `/login` oldalára irányít át
- Dockerben az nginx (`docker/web/default.conf`) szolgálja ki a React buildet, az `/api/*` kéréseket FastCGI-n a php-fpm-nek adja, az `/uploads/*`-ot pedig egy közös volume-ból. Így a frontend relatív `/api` címet használ, és nincs CORS. A `GET /api/health` a healthcheckekhez van.

### Autentikáció és szerepkörök
- Laravel Sanctum personal access tokenek. A `GuestController@login` tokent ad vissza; a frontend a `token`-t és a `user`-t a `localStorage`-ban tárolja (`redux/auth/authSlice.js`), az `apiSlice` pedig `Authorization: Bearer` fejlécben küldi.
- A szerepkör a `users.status` enumban van (`user` | `admin`). A backend admin útvonalai az `auth:sanctum` + egyedi `status:admin` middleware-t használják (`app/Http/Middleware/StatusMiddleware.php`, alias a `Http/Kernel.php`-ban). A frontend ezt a `components/routes/AdminRoutes.jsx` (ellenőrzi: `user.status === "admin"`) és a `ProtectedRoutes.jsx` segítségével tükrözi.
- A `routes/api.php`-ban néhány `GET` útvonal (`products`, `sizes`, `toppings`) az admin csoportban és alul publikusan is regisztrálva van; a későbbi, publikus regisztráció érvényesül. Ezért a `ProductController@index` maga ágazik el az (opcionális) felhasználó alapján: az admin minden terméket lát, mindenki más csak a `status = active` termékeket, 8-asával lapozva.

### Frontend állapotkezelés
- Egyetlen Redux store (`components/redux/store.jsx`) `auth` és `cart` slice-okkal, valamint az RTK Query `api` reducerrel.
- Minden szerverhívás RTK Query-n keresztül megy: minden domainfájl (`redux/products/productSlice.js`, `size/`, `toppings/`, `order/`, `auth/authApiSlice.js`, `auth/userApiSlice.js`) az `apiSlice.injectEndpoints(...)`-ot hívja. Új végpontot is így kell felvenni, `providesTags`/`invalidatesTags` használatával (pl. `"Products"`) a cache frissítéséhez.
- A kosár teljesen kliensoldali (`redux/cart/cartSlice.js`, `localStorage`-ba mentve). A kosártételeket a termék + választott méret + választott feltétek azonosítják. A kosárban látott ár csak tájékoztató; a végleges árat a backend `App\Services\OrderPricing` számolja ugyanazokkal a szabályokkal: tételár = `round(product.price * size.price_multiplier) + feltétárak összege`; a szállítás 1200 Ft, 15000 Ft részösszegtől ingyenes (`config/shop.php`). Árazási változásnál mindkét helyet módosítani kell. A backend `carts` / `cart_items` táblái és modelljei léteznek, de a frontend nem használja őket.
- Az útvonalak a `src/App.jsx`-ben vannak: a publikus oldalak a `components/layout/Layout` alatt, az admin oldalak `/admin/*` alatt a `components/admin/Layout`-tal.

### Rendelések
- Folyamat: `POST /api/checkout` (publikus, vendég is rendelhet; a `user_id`-t a backend a Sanctum tokenből veszi, ha van) → a kliens csak `product_id`, `size_id`, `topping_ids`, `quantity` értékeket küld, árat nem → `OrderPricing` számol, létrejön az `Order` (`payment_status: not_paid`) és az `order_items` tételek (név, `size_name`, `toppings` JSON, egységár rögzítve) → Stripe PaymentIntent, a válaszban `client_secret` → a frontend Stripe Payment Elementtel fizettet (`components/order/StripePayment.jsx`) → `POST /api/orders/{id}/confirm-payment`: a backend a Stripe-tól ellenőrzi (státusz, összeg, metadata), és csak ezután `paid` → a frontend EmailJS-szel küldi az összesítőt (`components/order/OrderConfirmation.jsx`).
- A Stripe a `App\Services\PaymentGateway` interfész mögött van (`StripePaymentGateway`, bekötés az `AppServiceProvider`-ben). Tesztekben a `tests/Fakes/FakePaymentGateway` helyettesíti, így a tesztek nem hívnak külső szolgáltatást.
- Vásárló: `GET /api/my-orders` (auth:sanctum). Admin: `GET /api/orders` (lapozott, `?status=` szűrő), `GET /api/orders/{id}`, `POST /api/orders/{id}/status`; frontend: `components/admin/Orders.jsx`, a státuszok magyar nevei a `components/order/orderStatus.js`-ben.
- A rendelés `status` enumja: `pending`, `out_for_delivery`, `delivered`, `cancelled`; a `payment_method` csak `card` lehet; a `payment_status`: `paid`, `not_paid`.
- A `register`, `login`, `resetpassword`, `forgetpassword` és `checkout` végpontokon `throttle:10,1` van.
- Nyitvatartás: `config/shop.php` (`opening_hours`, `Europe/Budapest`; hétfő zárva, kedd–vasárnap 11–22), logika: `App\Services\ShopHours`, API: `GET /api/shop-status`. Zárva tartáskor a `checkout` 422-t ad (`errors.shop`); a frontend a láblécben és a rendelés oldalon jelzi (`components/common/ShopStatus.jsx`). Időfüggő teszteknél `Carbon::setTestNow` kell (az `OrderTest` kedd 12:00-ra rögzít).

### Termékek és képek
- A termékképek multipart űrlappal töltődnek fel az `addproducts` / `editproduct/{id}` végpontokra (a szerkesztés `POST`, nem `PUT`), és a `backend/public/uploads/products/` mappába kerülnek; a frontend a képek URL-jét a `config.img_url`-ből állítja össze. Módosításkor és törléskor a régi kép törlődik. Mentéskor az `App\Services\ImageOptimizer` legfeljebb 1200 px széles WebP-vé alakítja (GD kell hozzá; a XAMPP PHP-jában nincs, ott az eredeti marad); régi képekhez: `php artisan images:optimize`. A demó seeder a repóban lévő `.webp` fájlokat használja, az eredeti PNG-k nem kerülnek a Docker image-be.
- Nyelv: `locale` = `hu` (`lang/hu/`, `lang/hu.json`); új validációs mezőnél a magyar nevét a `lang/hu/validation.php` `attributes` részébe kell felvenni. Új frontend oldalnál `usePageTitle("…")` állítja a böngészőfül címét.
- A termékeknek van `status` (`active` | `block`) és `is_featured` (`yes` | …) mezője, ezek határozzák meg a publikus, a kiemelt és a népszerű listákat. A méreteknek `price_multiplier` szorzójuk van, a feltéteknek fix `price` áruk.
