# Technikai dokumentáció – One more slice

## 1. Projekt áttekintése

### 1.1 Rövid projektleírás
A One more slice egy pizza rendelési és adminisztrációs webalkalmazás, amely React frontendből és Laravel backendből épül fel. A rendszer célja, hogy a felhasználók böngésszenek a termékek között, kosárba tegyék a kiválasztott ételeket, leadják a rendelést, valamint adminisztrátori felületen kezeljék a termékek, méretek, feltétek és rendelések állapotát.

### 1.2 Funkcionális összefoglaló
A rendszer fő funkciói:

- látogató és bejelentkezett felhasználói szerepkörök kezelése
- terméklista és keresés
- kiemelt termékek megjelenítése
- kosár és rendelés leadás
- profil és jelszó-visszaállítás
- admin termékkezelés (hozzáadás, szerkesztés, törlés)
- admin méret- és topping-kezelés
- rendelés- és felhasználói adatok kezelése

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
| Guest | nem bejelentkezett látogató | publikus termékek és regisztráció, bejelentkezés, kosár megtekintése |
| User | bejelentkezett vásárló | termékek, kosár, profil, rendelés leadása | - (jelenleg még fejlesztés alatt)
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
| További bibliotékok | React Icons, Google Maps, EmailJS |

A frontend fő feladata az ügyféloldali navigáció, terméklista megjelenítése, kosárkezelés, bejelentkezés és rendelésleadás.

### 2.2 Backend

| Elem | Technológia |
| --- | --- |
| Framework | Laravel 10 |
| Nyelv | PHP 8.1 |
| Autentikáció | Laravel Sanctum |
| Architektúra | monolitikus Laravel alkalmazás |
| ORM | Eloquent ORM |
| Validáció | Laravel request validáció |
| Middleware | StatusMiddleware, autentikációs és route middleware |
| Email / reset | Laravel Password reset és email verification |

A backend monolitikus megoldás: központi API, Eloquent modellek és kontrollerek kezelik a logikát.

### 2.3 Adatbázis

| Elem | Leírás |
| --- | --- |
| Típus | relációs adatbázis (MySQL/MariaDB kompatibilis) |
| ORM | Eloquent |
| Főbb táblák | users, products, sizes, toppings, orders, order_items, carts, cart_items |
| Migrációs stratégia | Laravel migrációk |

### 2.4 Infrastruktúra
A projekt lokális fejlesztésre optimalizált környezetben működik:

- frontend: Vite dev server (`localhost:5173`)
- backend: Laravel artisan dev szerver (`localhost:8000`)
- verziókezelés: Git
- CI/CD: jelenleg nincs beüzemeltetett automatizált pipeline
- logging: Laravel logfájlok a `storage/logs` könyvtárban

---

## 3. Rendszerarchitektúra

### 3.1 Komponensek és funkciók

- Frontend (React): felhasználói felület, API hívások, állapotmenedzsment
- Backend API (Laravel): üzleti logika, validáció, jogosultságkezelés
- Adatbázis: entitások és kapcsolatok tárolása
- Külső szolgáltatások: email küldés, jelszó-visszaállítás, Google Maps integráció, EmailJS

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
- `OrderController`: rendelés létrehozása és karbantartása
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
1. A felhasználó kiválaszt termékeket és beteszi a kosárba.
2. A frontend elküldi a rendelés payloadet a `/api/addorder` végpontra.
3. A backend validálja a mezőket.
4. A `Order` rekord létrejön.
5. A rendelt tételek elkülönült `order_items` rekordokként kerülnek mentésre.
6. A backend válaszként a létrehozott rendelést küldi vissza.

### 4.3 Hibakezelési folyamatok
- Laravel validációs hiba esetén 422-es válaszkód és hibaüzenetek érkeznek.
- Jogosultsági hiba esetén a `StatusMiddleware` 403-as választ ad.
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
- `status`
- `payment_method`
- `payment_status`
- `city`, `county`, `zip`, `address`, `phone`
- `timestamps`

#### `order_items`
- `id`
- `order_id`
- `product_id`
- `name`
- `price`
- `quantity`

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
- `users.email` (egyedi index)

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
| POST | `/api/addorder` | rendelés létrehozása |

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

```json
{
  "user_id": 1,
  "name": "Kiss Pista",
  "email": "kiss@example.com",
  "grand_total": 2500,
  "sub_total": 2200,
  "delivery_charges": 300,
  "status": "new",
  "payment_method": "card",
  "payment_status": "paid",
  "city": "Budapest",
  "zip": "1111",
  "address": "Fő utca 1.",
  "phone": "+36701234567",
  "items": [
    {
      "id": 5,
      "name": "Margherita",
      "quantity": 2,
      "price": 1200
    }
  ]
}
```

### 6.4 Hibakódok
- `200 OK`: sikeres művelet
- `201 Created`: sikeres létrehozás
- `403 Forbidden`: jogosultság hiánya
- `422 Unprocessable Entity`: validációs hiba
- `500 Internal Server Error`: szerveroldali kivétel

---

## 7. Biztonsági megoldások

### 7.1 Hitelesítés
A rendszer Laravel Sanctum token alapú autentikációt használ. A bejelentkezés után a frontend megkapja a tokent, amit az `Authorization: Bearer <token>` headerben küld tovább.

### 7.2 Jogosultságkezelés
A `StatusMiddleware` ellenőrzi, hogy a felhasználó `admin` státuszú-e. Csak ezek az adminisztrációs route-ok érhetők el admin felhasználó számára.

### 7.3 Token kezelés
- token a bejelentkezéskor jön létre
- a frontend a Redux store-ban tárolja
- a request préparáláskor a `apiSlice` automatikusan hozzáadja a headerhez

### 7.4 Adatvédelem és titkosítás
- jelszavak a Laravel `Hash` osztállyal kerülnek titkosításra
- e-mail ellenőrzés támogatott (`MustVerifyEmail`)
- password reset és email verification rendszerek be vannak kötve

### 7.5 OWASP szemlélet
A rendszer alapvető OWASP szempontokból:
- validáció minden inputnál
- jelszóhash-elés
- token-alapú autentikáció
- jogosultsági korlátozás admin route-oknál
- érzékeny adatokat és hibákat nem közvetlenül „nyers” formában ad vissza

---

## 8. Fejlesztői környezet

### 8.1 Előfeltételek
- PHP 8.1+
- Composer
- Node.js 18+
- npm
- MySQL vagy MariaDB
- Git

### 8.2 Környezeti változók
A Laravel `.env` fájlban kell konfigurálni:

- `DB_CONNECTION`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `APP_KEY`
- `APP_URL`
- `SANCTUM_STATEFUL_DOMAINS` (ha szükséges)

### 8.3 Helyi futtatás
Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

### 8.4 Build és tesztelés
Frontend build:

```bash
cd frontend
npm run build
```

Backend tesztek:

```bash
cd backend
php artisan test
```

### 8.5 Debugolási lehetőségek
- Laravel logok: `backend/storage/logs/laravel.log`
- frontend konzol: browser devtools
- `php artisan route:list` a végpontök ellenőrzéséhez
- `php artisan migrate:fresh --seed` a teljes adatbázis újraépítéséhez

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
│   │   └── Notifications/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   └── tests/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
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
| `Undefined array key 