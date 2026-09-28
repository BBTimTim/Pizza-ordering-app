# Technikai dokumentáció – One more slice

## 1. Projekt áttekintése

### 1.1 Rövid projektleírás
A One more slice egy pizza rendelési és adminisztrációs webalkalmazás, amely React frontendből és Laravel backendből épül fel. A rendszer célja, hogy a felhasználók böngésszenek a termékek között, kosárba tegyék a kiválasztott ételeket, leadják a rendelést, valamint adminisztrátori felületen kezeljék a termékek, méretek, feltétek és rendelések állapotát.

### 1.2 Funkcionális összefoglaló
A rendszer fő funkciói:

- látogató és bejelentkezett felhasználói szerepkörök kezelése
- terméklista és keresés
- kiemelt termékek megjelenítése
- kosár és rendelés leadás, szerveroldali árszámítással
- bankkártyás fizetés Stripe teszt módban
- rendelés-visszaigazoló e-mail összesítővel (EmailJS)
- profil, rendelési előzmények és jelszó-visszaállítás
- admin termékkezelés (hozzáadás, szerkesztés, törlés)
- admin méret- és topping-kezelés
- admin rendeléskezelés (lista, szűrés, státuszváltás)

### 1.3 Főbb modulok
- Frontend: React + Vite + Redux Toolkit
- Backend: Laravel 10 + PHP 8.1
- API: REST JSON API a frontend és backend között
- Adatbázis: MySQL / MariaDB kompatibilis relációs adatbázis
- Autentikáció: Laravel Sanctum token alapú hitelesítés
- Jogosultságkezelés: saját `status` middleware alapján admin/user különbségtétel

### 1.4 Célfelhasználók és szerepkörök

| Szerepkör | Leírás | Jogosultságok |
| --- | --- | --- |
| Guest | nem bejelentkezett látogató | publikus termékek, regisztráció, bejelentkezés, kosár, rendelés leadása vendégként |
| User | bejelentkezett vásárló | termékek, kosár, profil, rendelés leadása, saját rendelések megtekintése |
| Admin | adminisztrátor | teljes termék-, méret-, topping- és rendeléskezelés |

---

## 2. Technológiai stack

### 2.1 Frontend

| Elem | Technológia |
| --- | --- |
| Framework | React 19 |
| Build/eszköz | Vite 8 |
| Programozási nyelv | JavaScript (ESM) |
| Routing | React Router DOM 7 |
| State management | Redux Toolkit |
| API kommunikáció | RTK Query |
| UI könyvtárak | Tailwind CSS, DaisyUI |
| További bibliotékok | React Icons, Google Maps, EmailJS, Stripe (`@stripe/react-stripe-js`) |

A frontend fő feladata az ügyféloldali navigáció, terméklista megjelenítése, kosárkezelés, bejelentkezés és rendelésleadás.

### 2.2 Backend

| Elem | Technológia |
| --- | --- |
| Framework | Laravel 10 |
| Nyelv | PHP 8.1+ (a Docker image PHP 8.2-t használ) |
| Autentikáció | Laravel Sanctum |
| Fizetés | Stripe PHP SDK (`stripe/stripe-php`), teszt mód |
| Architektúra | monolitikus Laravel alkalmazás |
| ORM | Eloquent ORM |
| Validáció | Laravel request validáció |
| Middleware | StatusMiddleware, autentikációs és route middleware |
| Email / reset | Laravel Password reset és email verification (a vásárlói leveleket a frontend küldi EmailJS-szel) |
| Rate limit | `throttle` middleware a bejelentkezésen, regisztráción, jelszó-visszaállításon és a fizetésen |
| Nyelv | magyar (`locale` = `hu`, `lang/hu/`): validációs, hitelesítési és jelszó-visszaállítási üzenetek |
| Képkezelés | PHP GD: feltöltéskor legfeljebb 1200 px széles WebP (`App\Services\ImageOptimizer`); meglévő képekhez `php artisan images:optimize` |

A backend monolitikus megoldás: központi API, Eloquent modellek és kontrollerek kezelik a logikát.

### 2.3 Adatbázis

| Elem | Leírás |
| --- | --- |
| Típus | relációs adatbázis (MySQL/MariaDB kompatibilis) |
| ORM | Eloquent |
| Főbb táblák | users, products, sizes, toppings, orders, order_items, carts, cart_items |
| Migrációs stratégia | Laravel migrációk |

### 2.4 Infrastruktúra
A projekt két módon futtatható:

**Docker Compose (ajánlott, `docker-compose.yml`):**

| Szolgáltatás | Image / build | Feladat | Cím |
| --- | --- | --- | --- |
| `web` | `docker/web/Dockerfile` (node build → nginx) | a React build kiszolgálása, reverse proxy az `/api` felé, `/uploads` képek | `http://localhost:8080` |
| `backend` | `docker/backend/Dockerfile` (composer → php-fpm) | Laravel API; induláskor `migrate` és `db:seed` | csak belső hálózaton (9000) |
| `db` | `mysql:8.4` | adatbázis, `db-data` volume | `localhost:3307` |
| `mailpit` | `axllent/mailpit` | levélfogó a regisztrációs és jelszó-visszaállító levelekhez | `http://localhost:8025` |
| `phpmyadmin` | `phpmyadmin:5` | adatbázis-kezelő felület | `http://localhost:8081` |

- az nginx és a frontend ugyanazon a címen éri el az API-t, ezért nincs CORS-probléma
- két hálózat: `frontend-net` (web ↔ backend) és `backend-net` (backend ↔ db); a `web` nem látja közvetlenül az adatbázist
- volume-ok: `db-data` (adatbázis), `uploads` (termékképek, a backend és az nginx közösen használja), `storage` (Laravel storage, automatikusan generált `APP_KEY`)

**Docker nélkül (XAMPP):**

- frontend: Vite dev server (`localhost:5173`)
- backend: Laravel artisan dev szerver (`localhost:8000`)

Egyéb:

- verziókezelés: Git
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`) – lint (ESLint, Pint), tesztek, build, Docker füstteszt, image-publikálás a GHCR-be a `master` ágon
- deploy minták (blue-green, rolling, VPS zero-downtime), monitoring és backup, AWS konfigurációk: `deploy/`, `ops/` – áttekintés és követelmény-mátrix: [docs/devops/README.md](devops/README.md)
- logging: Dockerben `docker compose logs`, XAMPP alatt a `storage/logs` könyvtár

---

## 3. Rendszerarchitektúra

### 3.1 Komponensek és funkciók

- Frontend (React): felhasználói felület, API hívások, állapotmenedzsment
- Backend API (Laravel): üzleti logika, validáció, jogosultságkezelés
- Adatbázis: entitások és kapcsolatok tárolása
- Külső szolgáltatások: Stripe (bankkártyás fizetés, teszt mód), EmailJS (kapcsolati űrlap és rendelés-visszaigazolás), Google Maps, Laravel levelek (regisztráció-megerősítés, jelszó-visszaállítás)

### 3.2 Kommunikációs modell
A frontend és backend között REST API-alapú JSON kommunikáció történik. A frontend a Redux Toolkit Query segítségével hívja meg az endpointokat.

### 3.3 Architektúra diagram

```text
+---------------------+      REST/JSON      +-------------------------+
|                     | ------------------> |                         |
| React Frontend      |                     | Laravel Backend API     |
| - components        |                     | - Controllers           |
| - Redux store       | <------------------ | - Middleware            |
| - RTK Query        |                     | - Eloquent Models       |
|                     |                     | - Validation           |
+---------------------+                     +-----------+-------------+
                                                       |
                                                       |
                                                       v
                                               +---------------------+
                                               | Relational DB       |
                                               | users, products     |
                                               | orders, order_items |
                                               | sizes, toppings     |
                                               +---------------------+
```

### 3.4 Főbb backend komponensek

- `ProductController`: terméklistázás, előnézet, létrehozás, módosítás, törlés
- `OrderController`: checkout, fizetés-visszaigazolás, saját rendelések, admin rendeléslista és státuszváltás
- `App\Services\OrderPricing`: a rendelés árának kiszámítása az adatbázis árai alapján (a kliens által küldött árat figyelmen kívül hagyja)
- `App\Services\PaymentGateway` (interfész) és `StripePaymentGateway`: Stripe PaymentIntent létrehozása és ellenőrzése; tesztekben a `tests/Fakes/FakePaymentGateway` helyettesíti
- `GuestController`: regisztráció, bejelentkezés, jelszóemlékeztető, jelszó-visszaállítás
- `SearchController`: termékkeresés
- `StatusMiddleware`: admin jogosultság ellenőrzése

---

## 4. Adatfolyamok

### 4.1 Tipikus felhasználói kérés - terméklista lekérdezése
1. A frontend elküldi a GET `/api/products` kérést.
2. A Laravel router a `ProductController@index` metódushoz továbbítja.
3. A kontrollor ellenőrzi a felhasználó státuszát.
4. Ha a felhasználó admin, az összes terméket adja vissza; különben csak az `active` státuszú termékek jönnek vissza.
5. A JSON response a frontend számára érkezik.
6. A React kliens a Redux store-ban tárolja az adatokat.

### 4.2 Rendelés leadás folyamata
1. A felhasználó termékeket tesz a kosárba méret- és feltétválasztással. A kosár kliensoldali (`cartSlice.js`, `localStorage`), az ott látott ár csak tájékoztató jellegű.
2. A szállítási adatok kitöltése után a frontend a `POST /api/checkout` végpontra küldi a vásárló adatait és a tételeket. Árat nem küld, csak `product_id`, `size_id`, `topping_ids` és `quantity` értékeket.
3. A backend validál, majd az `OrderPricing` az adatbázisból számolja az árat:
   - tételár = `round(product.price * size.price_multiplier) + a feltétek árainak összege`
   - szállítás: `1200 Ft`, `15000 Ft` részösszegtől ingyenes (`config/shop.php`)
   - inaktív (`block`) termék nem rendelhető (422)
4. Létrejön az `Order` (`payment_status: not_paid`, bejelentkezett vásárlónál a `user_id`-vel) és az `order_items` tételek. A név, a méret és a feltétek a rendelés pillanatában rögzülnek.
5. A backend Stripe PaymentIntentet hoz létre, és visszaadja a `client_secret`-et.
6. A frontend a Stripe Payment Elementtel fizettet. A kártyaadatok közvetlenül a Stripe-hoz mennek, nem a saját szerverhez.
7. Sikeres fizetés után a frontend a `POST /api/orders/{id}/confirm-payment` végpontot hívja. A backend a Stripe-tól ellenőrzi a fizetést (státusz, összeg, rendelésazonosító), és csak ezután állítja `paid`-re.
8. A frontend a visszaigazolt rendelés adataiból EmailJS-szel elküldi a vásárlónak az összesítő e-mailt, majd üríti a kosarat.
9. Az admin a rendelést a `pending → out_for_delivery → delivered` (vagy `cancelled`) státuszokon viszi végig. A vásárló a profiljában látja a változást.

### 4.3 Hibakezelési folyamatok
- Laravel validációs hiba esetén 422-es válaszkód és hibaüzenetek érkeznek.
- Jogosultsági hiba esetén a `StatusMiddleware` 403-as választ ad.
- Sikertelen vagy még le nem zárt fizetésnél a `confirm-payment` 402-es választ ad, a rendelés `not_paid` marad.
- Ha a Stripe nem érhető el, a checkout 502-t, ha nincs beállítva a `STRIPE_SECRET`, 503-at ad.
- Ha az EmailJS-es visszaigazolás nem megy ki, a rendelés sikeres marad, és erről a felület tájékoztatja a vásárlót.
- Az alkalmazás frontend oldalon `ErrorBoundary` és általános API hiba-kezelés működik.

---

## 5. Adatbázis kapcsolatok

### 5.1 Főbb entitások

#### `users`
- `id`
- `name`
- `email`
- `password`
- `status` (`user`, `admin`)
- `email_verified_at`
- `timestamps`

#### `products`
- `id`
- `name`
- `image`
- `description`
- `price`
- `status` (`active`, `block`)
- `is_featured` (`yes`, `no`)
- `timestamps`

#### `orders`
- `id`
- `user_id`
- `name`
- `email`
- `grand_total`
- `sub_total`
- `delivery_charges`
- `status` (`pending`, `out_for_delivery`, `delivered`, `cancelled`)
- `payment_method` (`card`)
- `payment_status` (`paid`, `not_paid`)
- `payment_intent_id` (Stripe azonosító, egyedi; az API válaszaiban rejtett)
- `city`, `county`, `zip`, `address`, `phone`
- `timestamps`

#### `order_items`
- `id`
- `order_id` (a rendelés törlésekor a tételei is törlődnek)
- `product_id` (nullable; a termék törlésekor `null` lesz, a tétel megmarad)
- `size_id` (nullable)
- `name` (a termék neve a rendelés pillanatában)
- `size_name` (pl. `32 cm`, nullable)
- `toppings` (JSON: a választott feltétek `id`, `name`, `price` értékei)
- `price` (egységár, méretszorzóval és feltétekkel)
- `quantity`
- `timestamps`

#### `sizes`
- `id`
- `name`
- `price_multiplier`

#### `toppings`
- `id`
- `name`
- `price`

#### `carts` és `cart_items`
- kosárhoz kapcsolódó adatok
- a vendég vagy bejelentkezett felhasználó kosarához kötődnek

### 5.2 Kapcsolatok

- `User` -> `Order`: egy felhasználóhoz több rendelés tartozhat (`hasMany`)
- `Order` -> `OrderItems`: egy rendeléshez több rendelési tétel tartozik (`hasMany`)
- `Product` -> `OrderItems`: egy termékhez több rendelési tétel kapcsolódhat (`hasMany`)
- `Size` -> `OrderItems`: a rendelési tétel a választott méretre hivatkozik (`size_id`, idegen kulcs)
- `Cart` -> `CartItem`: egy kosárhoz több kosár elem tartozik
- `User` -> `Cart`: egy felhasználóhoz egy kosár tartozik

### 5.3 Kulcsmezők és indexek
A projektben legfontosabb kulcsmezők:

- `users.id`
- `products.id`
- `orders.id`
- `order_items.id`
- `order_items.order_id`
- `order_items.product_id`
- `order_items.size_id`
- `users.email` (egyedi index)
- `orders.payment_intent_id` (egyedi index)

A Laravel Eloquent és az adatbázis migrációk alapján a relációs kulcsok a kapcsolatokhoz szükségesek.

---

## 6. API dokumentáció

Az API gyökere: `/api`

### 6.1 Publikus végpontok

| Metódus | Végpont | Leírás |
| --- | --- | --- |
| POST | `/api/register` | új felhasználó regisztrációja |
| POST | `/api/login` | bejelentkezés, Sanctum token visszaadása |
| POST | `/api/resetpassword` | jelszó-visszaállítási kérelem |
| POST | `/api/forgetpassword` | jelszó visszaállításának emailes kezdeményezése |
| GET | `/api/products` | publikus terméklista |
| GET | `/api/featured-products` | kiemelt termékek |
| GET | `/api/popular-products` | népszerű termékek |
| GET | `/api/sizes` | méretek listázása |
| GET | `/api/toppings` | feltétek listázása |
| GET | `/api/products-result` | kereséses terméklekérdezés |
| POST | `/api/checkout` | rendelés létrehozása szerveroldali árszámítással, Stripe `client_secret` visszaadása |
| POST | `/api/orders/{id}/confirm-payment` | fizetés ellenőrzése a Stripe-nál, sikeres fizetésnél `paid` státusz |
| GET | `/api/health` | állapotellenőrzés (adatbázis-kapcsolattal), a Docker healthcheck használja |
| GET | `/api/shop-status` | nyitvatartás: `open`, `message` (pl. „Zárva – nyitás: holnap 11:00”), heti lista; hétfő zárva, kedd–vasárnap 11:00–22:00 (`config/shop.php`). Zárva tartáskor a `checkout` 422-t ad (`errors.shop`) |

A `register`, `login`, `resetpassword`, `forgetpassword` és `checkout` végpontok percenként 10, a `confirm-payment` 20 kérést fogad (`throttle`), efölött 429-es választ adnak.

Bejelentkezett felhasználó (`auth:sanctum`) számára:

| Metódus | Végpont | Leírás |
| --- | --- | --- |
| GET | `/api/user` | a bejelentkezett felhasználó adatai |
| GET | `/api/my-orders` | a saját rendelések tételekkel, a legújabb elöl |

### 6.2 Adminisztrációs végpontok
Az alábbi végpontok csak hitelesített admin felhasználó számára elérhetők.

| Metódus | Végpont | Leírás |
| --- | --- | --- |
| POST | `/api/addproducts` | új termék létrehozása |
| GET | `/api/products` | admin terméklista |
| GET | `/api/products/{id}` | termék adatai |
| POST | `/api/editproduct/{id}` | termék módosítása |
| DELETE | `/api/products/{id}` | termék törlése |
| POST | `/api/addsizes` | új méret hozzáadása |
| GET | `/api/sizes` | méretek lekérdezése |
| DELETE | `/api/sizes/{id}` | méret törlése |
| POST | `/api/addtoppings` | új topping létrehozása |
| GET | `/api/toppings` | toppingok lekérdezése |
| DELETE | `/api/toppings/{id}` | topping törlése |
| GET | `/api/orders` | rendelések tételekkel, 20-asával lapozva, opcionális `?status=` szűrővel |
| GET | `/api/orders/{id}` | egy rendelés adatai |
| POST | `/api/orders/{id}/status` | rendelés státuszának módosítása (`pending`, `out_for_delivery`, `delivered`, `cancelled`) |

### 6.3 Request/response példák

#### Regisztráció
Request body:

```json
{
  "name": "Teszt User",
  "email": "user@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}
```

Response:

```json
{
  "success": "Sikeres regisztráció!"
}
```

#### Rendelés létrehozása
Request body:

`POST /api/checkout` – a kliens nem küld árat, csak azt, mit és hány darabot kér. A `user_id`-t a backend a Sanctum tokenből állapítja meg.

```json
{
  "name": "Kiss Pista",
  "email": "kiss@example.com",
  "phone": "+36701234567",
  "city": "Budapest",
  "zip": "1111",
  "address": "Fő utca 1.",
  "items": [
    {
      "product_id": 1,
      "size_id": 2,
      "topping_ids": [1],
      "quantity": 2
    }
  ]
}
```

Response (`201 Created`) – Margherita (2490 Ft), 32 cm-es méret (szorzó: 1,3), Extra sajt feltét (350 Ft): (2490 × 1,3 + 350) × 2 = 7174 Ft, 15000 Ft alatt 1200 Ft szállítással:

```json
{
  "success": "Rendelés létrehozva, fizetésre vár.",
  "data": {
    "id": 1,
    "user_id": null,
    "name": "Kiss Pista",
    "sub_total": 7174,
    "delivery_charges": 1200,
    "grand_total": 8374,
    "status": "pending",
    "payment_method": "card",
    "payment_status": "not_paid",
    "items": [
      {
        "name": "Margherita",
        "size_name": "32 cm",
        "toppings": [{ "id": 1, "name": "Extra sajt", "price": 350 }],
        "price": 3587,
        "quantity": 2
      }
    ]
  },
  "client_secret": "pi_..._secret_..."
}
```

A frontend a `client_secret`-tel fizettet a Stripe-on keresztül, majd meghívja a `POST /api/orders/1/confirm-payment` végpontot. Sikeres fizetésnél a válasz `200`, benne `"payment_status": "paid"`, különben `402`.

### 6.4 Hibakódok
- `200 OK`: sikeres művelet
- `201 Created`: sikeres létrehozás
- `401 Unauthorized`: hiányzó vagy érvénytelen token
- `402 Payment Required`: a fizetés még nem sikerült (`confirm-payment`)
- `403 Forbidden`: jogosultság hiánya
- `422 Unprocessable Entity`: validációs hiba (pl. nem rendelhető termék)
- `429 Too Many Requests`: túl sok kérés (`throttle`)
- `500 Internal Server Error`: szerveroldali kivétel
- `502 Bad Gateway`: a Stripe nem érhető el a rendelés létrehozásakor
- `503 Service Unavailable`: nincs beállítva az online fizetés (`STRIPE_SECRET`), vagy a `/api/health` nem éri el az adatbázist

---

## 7. Biztonsági megoldások

### 7.1 Hitelesítés
A rendszer Laravel Sanctum token alapú autentikációt használ. A bejelentkezés után a frontend megkapja a tokent, amit az `Authorization: Bearer <token>` headerben küld tovább.

### 7.2 Jogosultságkezelés
A `StatusMiddleware` ellenőrzi, hogy a felhasználó `admin` státuszú-e. Csak ezek az adminisztrációs route-ok érhetők el admin felhasználó számára.

### 7.3 Token kezelés
- token a bejelentkezéskor jön létre
- a frontend a Redux store-ban és a `localStorage`-ban tárolja (a `user` objektummal együtt; szerepkör-változás után újra be kell jelentkezni)
- a request préparáláskor a `apiSlice` automatikusan hozzáadja a headerhez

### 7.4 Adatvédelem és titkosítás
- jelszavak a Laravel `Hash` osztállyal kerülnek titkosításra
- e-mail ellenőrzés támogatott (`MustVerifyEmail`)
- password reset és email verification rendszerek be vannak kötve
- bankkártyaadat nem érinti a saját szervert: a Stripe Payment Element közvetlenül a Stripe-nak küldi
- titkos kulcs (`STRIPE_SECRET`) csak a backend környezeti változójában van; a frontendbe kizárólag publikus (`VITE_`) kulcs kerül
- a `.env` fájlokat a `.gitignore` és a `.dockerignore` kizárja

### 7.5 OWASP szemlélet
A rendszer alapvető OWASP szempontokból:
- validáció minden inputnál
- jelszóhash-elés
- token-alapú autentikáció
- jogosultsági korlátozás admin route-oknál
- érzékeny adatokat és hibákat nem közvetlenül „nyers” formában ad vissza
- a rendelés végösszegét és fizetési státuszát a szerver határozza meg; a kliens által küldött ár és `payment_status` figyelmen kívül marad (manipulált kérésre is a szerver ára érvényes, ezt Feature teszt ellenőrzi)
- a fizetés sikerességét a backend közvetlenül a Stripe-tól kérdezi le, nem a klienstől fogadja el
- brute force elleni védelem: `throttle` a hitelesítési és fizetési végpontokon
- függőségek: `composer audit` alapján a sebezhető csomagok frissítve (36 → 3 figyelmeztetés); a maradék 3 a Laravel 10-et érinti (a 10-es ág támogatása lejárt), ezek csak Laravel 11/12-re váltással javíthatók

---

## 8. Fejlesztői környezet

### 8.1 Előfeltételek
Docker futtatáshoz:

- Docker Desktop (Docker Compose v2+)
- Git

Docker nélküli futtatáshoz:

- PHP 8.1+ (`pdo_mysql`, tesztekhez `pdo_sqlite`)
- Composer
- Node.js 20.19+ vagy 22.12+ (a Vite 8 követelménye)
- npm
- MySQL vagy MariaDB (pl. XAMPP)
- Git

### 8.2 Környezeti változók
Három `.env` fájl van, mindegyikhez tartozik egy `.env.example` minta. Titkos értéket soha ne commitolj.

| Fájl | Mikor kell | Fontosabb változók |
| --- | --- | --- |
| gyökér `.env` | Docker Compose | `APP_PORT`, `APP_KEY` (üresen automatikusan generálódik), `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `DB_PORT`, `STRIPE_SECRET`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_GOOGLE_API_KEY`, `VITE_EMAILJS_*` |
| `backend/.env` | Docker nélkül | `DB_*`, `APP_KEY`, `APP_URL`, `FRONTEND_URL` (az e-mail-megerősítés átirányítási címe), `MAIL_*`, `STRIPE_SECRET` |
| `frontend/.env` | Docker nélkül (`npm run dev`) | `VITE_API_URL`, `VITE_IMG_URL`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_GOOGLE_API_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_TEMPLATE_ID2`, `VITE_EMAILJS_PUBLIC_KEY` |

- a `VITE_` előtagú változók a böngészőbe kerülnek, ezért csak publikus érték lehet bennük (a Stripe-nál a `pk_test_...`, soha nem az `sk_test_...`)
- a `VITE_API_URL` / `VITE_IMG_URL` Dockerben relatív (`/api`, `/uploads`), Docker nélkül alapértelmezésként `http://127.0.0.1:8000/...`
- a Stripe teszt kulcsai a Stripe Dashboard **Developers → API keys** oldalán érhetők el

### 8.3 Helyi futtatás
Dockerrel (ajánlott):

```bash
cp .env.example .env      # majd a Stripe és EmailJS kulcsok kitöltése
docker compose up -d --build
```

- alkalmazás: `http://localhost:8080`
- phpMyAdmin: `http://localhost:8081` (felhasználó: `DB_USERNAME`, jelszó: `DB_PASSWORD`)
- Mailpit: `http://localhost:8025`
- demó fiókok (a seeder üres adatbázisba tölti be, megerősített e-mail-címmel): `admin@onemoreslice.hu` / `Admin123!`, `vasarlo@onemoreslice.hu` / `Vasarlo123!`
- Stripe tesztkártya: `4242 4242 4242 4242`, bármilyen jövőbeli lejárat és CVC
- leállítás: `docker compose down`; az adatbázis törlésével együtt: `docker compose down -v`

Docker nélkül – backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Docker nélkül – frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 8.4 Build és tesztelés
Frontend build:

```bash
cd frontend
npm run build
```

Backend tesztek (memóriában futó SQLite adatbázison, `phpunit.xml`, így MySQL nélkül is futnak; a Stripe-ot a `FakePaymentGateway` helyettesíti):

```bash
cd backend
php artisan test
./vendor/bin/pint --test   # kódstílus-ellenőrzés
```

A `tests/Feature/OrderTest.php` ellenőrzi a szerveroldali árszámítást (manipulált árral is), az ingyenes szállítás határát, az inaktív termék elutasítását, a fizetés-visszaigazolást, a jogosultságokat és a `/api/health` végpontot.

Frontend lint:

```bash
cd frontend
npm run lint
```

### 8.5 Debugolási lehetőségek
- Docker: `docker compose ps` (egészségi állapot), `docker compose logs backend --tail=100`
- Laravel logok Docker nélkül: `backend/storage/logs/laravel.log`
- frontend konzol: browser devtools
- `php artisan route:list` a végpontök ellenőrzéséhez
- `php artisan migrate:fresh --seed` a teljes adatbázis újraépítéséhez
- `php artisan images:optimize` a régi, nagy termékképek WebP-re alakításához (GD kell hozzá; Dockerben: `docker compose exec backend php artisan images:optimize`)

---

## 9. Fontos fejlesztői információk

### 9.1 Kódolási irányelvek
- Laravel kontrollerekben a validáció mindig a művelet elején történjen
- lényeges üzleti logika modellekbe vagy services-be szervezhető
- frontend és backend műveletek legyenek szigetelten elkülönítve
- API response formatum legyen következetes

### 9.2 Projektstruktúra magyarázata

```text
One-more-slice/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   ├── Notifications/
│   │   └── Services/          # OrderPricing, PaymentGateway, StripePaymentGateway
│   ├── config/                # shop.php: szállítási díj, ingyenes szállítás határa
│   ├── database/
│   ├── public/uploads/        # feltöltött termékképek
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   └── tests/                 # Feature tesztek, Fakes/FakePaymentGateway
├── frontend/
│   ├── src/
│   ├── public/
│   ├── config.js              # api_url, img_url (VITE_API_URL / VITE_IMG_URL)
│   ├── package.json
│   └── vite.config.js
├── docker/
│   ├── backend/               # Dockerfile, php.ini, entrypoint.sh
│   └── web/                   # Dockerfile, nginx default.conf
├── .claude/commands/          # Claude Code parancsok (/deploy, /vps, /polish …), .claude/skills/
├── docker-compose.yml
├── .env.example
├── README.md
└── docs/
```

### 9.3 Névkonvenciók
- Laravel modellek `PascalCase` osztálynévvel
- kontrollerek a megfelelő névtérben (`admin`, `Auth`, stb.)
- frontend komponensek relatív útvonalakkal és JSX fájlokkal
- Redux slice fájlok a `*Slice.js` konvenció szerint

### 9.4 Branch és release stratégia
A projektben jelenleg nincs formalizált branching stratégia dokumentálva, de a tipikus workflow:

- feature branch fejlesztés
- pull request ellenőrzés
- merge a `main` ágba
- releasehez a frontend build és backend migráció ellenőrzése

### 9.5 Gyakori hibák és megoldásaik

| Hiba | Lehetséges oka | Megoldás |
| --- | --- | --- |
| 403 jogosultsági hiba | nincs admin státusz | `status` mező ellenőrzése, Sanctum token validálása |
| admin státusz után sem látszik az admin felület | a frontend a régi `user` objektumot tárolja a `localStorage`-ban | ki- és újra bejelentkezés |
| Docker build közben `certificate verify failed` / `UNABLE_TO_VERIFY_LEAF_SIGNATURE` | a vírusirtó HTTPS-ellenőrzése (pl. Avast Web-pajzs) | a HTTPS-ellenőrzés ideiglenes kikapcsolása a build idejére |
| 502 Bad Gateway a `localhost:8080`-on | a `backend` konténer nem fut vagy nem egészséges | `docker compose ps`, `docker compose logs backend` |
| 413 képfeltöltéskor | túl nagy kép | `client_max_body_size` (`docker/web/default.conf`) és `upload_max_filesize` (`docker/backend/php.ini`), jelenleg 32 MB |
| checkout 503 | nincs beállítva a `STRIPE_SECRET` | a kulcs beírása a megfelelő `.env`-be, majd `docker compose up -d backend` |
| nem jön meg a rendelés-visszaigazoló e-mail | EmailJS domain-korlátozás vagy elfogyott keret | böngészőkonzol `EmailJS hiba:` sora; az EmailJS felületén az Account → Security oldalon a domain engedélyezése |
| a XAMPP phpMyAdmin nem mutatja az adatokat | a Docker MySQL külön adatbázis | a `http://localhost:8081` phpMyAdmin használata |
