# One more slice

Pizza rendelési webalkalmazás React frontenddel és Laravel backenddel.

## Rendszer célja
A projekt célja, hogy a felhasználók böngészhessenek a termékek között, kosárba tegyék a kiválasztott ételeket, leadják a rendelést, valamint adminisztrátori felületen kezeljék a termékeket, méreteket, feltéteket és rendelések állapotát.

## Főbb funkciók
- publikus terméklista és keresés
- kosár és rendelésleadás, szerveroldali árszámítással
- bankkártyás fizetés (Stripe teszt mód)
- rendelés-visszaigazoló e-mail összesítővel (EmailJS)
- bejelentkezés és regisztráció
- profil, rendelési előzmények és jelszó-visszaállítás
- admin termékkezelés (létrehozás, módosítás, törlés)
- admin méret- és topping-kezelés
- admin rendeléskezelés (szűrés, státuszváltás) és jogosultságkorlátozás

## Technológiai stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS + DaisyUI
- Stripe Payment Element, EmailJS

### Backend
- Laravel 10
- PHP 8.1+
- Eloquent ORM
- Sanctum autentikáció
- REST API
- Stripe PHP SDK

### Infrastruktúra
- Docker, Docker Compose (nginx, php-fpm, MySQL, Mailpit, phpMyAdmin)

### Adatbázis
- MySQL / MariaDB kompatibilis relációs adatbázis
- Laravel migrációk

## Projekt struktúra

```text
One-more-slice/
├── backend/            # Laravel API és üzleti logika
├── frontend/           # React alkalmazás
├── docker/             # Dockerfile-ok és nginx konfiguráció
├── docs/               # technikai dokumentáció
├── .claude/commands/   # Claude Code parancsok (/deploy, /vps, /polish …)
├── docker-compose.yml  # a teljes helyi környezet
├── .env.example        # Docker Compose beállítások mintája
└── README.md           # projekt összefoglaló
```

## Fejlesztői környezet

### Dockerrel (ajánlott)
```bash
cp .env.example .env    # Stripe és EmailJS kulcsok kitöltése
docker compose up -d --build
```

| Szolgáltatás | Cím |
| --- | --- |
| alkalmazás | http://localhost:8080 |
| phpMyAdmin | http://localhost:8081 |
| Mailpit (levélfogó) | http://localhost:8025 |

Demó fiókok: `admin@onemoreslice.hu` / `Admin123!`, `vasarlo@onemoreslice.hu` / `Vasarlo123!`. Stripe tesztkártya: `4242 4242 4242 4242`.

### Docker nélkül – backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Docker nélkül – frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Tesztek és ellenőrzés
```bash
cd backend && php artisan test && ./vendor/bin/pint --test
cd frontend && npm run lint && npm run build
```

## Alap API végpontok
```text
POST /api/register
POST /api/login
GET  /api/products
GET  /api/featured-products
GET  /api/popular-products
POST /api/checkout
POST /api/orders/{id}/confirm-payment
GET  /api/my-orders
GET  /api/health
```

## Szerepkörök
- Guest: publikus oldalakon böngészés, regisztráció, bejelentkezés, rendelés vendégként
- User: kosár, profil, rendelésleadás, saját rendelések
- Admin: teljes adminisztrációs felület, CRUD műveletek és rendeléskezelés

## Dokumentáció
A részletesebb technikai leírás itt található:

- [docs/TECHNIKAI_DOKUMENTACIO.md](docs/TECHNIKAI_DOKUMENTACIO.md)
- [docs/devops/README.md](docs/devops/README.md) – DevOps & infra követelmény-mátrix: Docker, CI/CD, deploy minták (blue-green, rolling, zero-downtime), VPS és SSH, monitoring, backup, AWS

## Claude Code parancsok

A `.claude/commands/` mappában újrahasznosítható utasítások vannak a gyakori feladatokhoz. A Claude Code-ban `/név` formában hívhatók, a név utáni szöveg a konkrét feladat (pl. `/opening-hours vasárnap is legyen zárva`).

| Parancs | Mire való |
|---|---|
| `/new-api` | új API végpont a Laravel route-tól az RTK Query-ig, teszttel |
| `/admin-crud` | új admin erőforrás (migráció, modell, végpontok, React oldalak) |
| `/order` | rendelési és árazási logika módosítása |
| `/opening-hours` | nyitvatartás módosítása |
| `/polish` | csiszolás: magyar üzenetek, oldalcímek, képek, csomagfrissítés |
| `/docker-error` | Docker indítása és hibakeresés |
| `/deploy` | blue-green és rolling deploy bemutató |
| `/vps` | VPS, SSH és zero-downtime Laravel deploy |
| `/monitoring-backup` | naplóelemzés, mentés, visszaállítás |
| `/before-commit` | commit előtti ellenőrzés |
| `/technikai-dokumentacio` | a technikai dokumentáció elkészítése |

A magyar dokumentáció frissítéséhez a `docs-update-hu` skill tartozik (`.claude/skills/`).

## Megjegyzés
A projekt lokális fejlesztésre van hangolva. Dockerrel egyetlen címen (`localhost:8080`) fut minden; Docker nélkül a frontend és a backend külön, saját dev szervereken fut.

A frontend `src/` mappa szerkezete:

```text
src/
├── app/api/apiSlice.js     # RTK Query alap (VITE_API_URL)
├── components/
│   ├── admin/              # admin oldalak: termékek, méretek, feltétek, rendelések
│   ├── cart/               # kosár
│   ├── common/             # Loader, Errors, ErrorFallback, modálok
│   ├── context/            # ModalContext, ModalProvider
│   ├── layout/             # Header, Footer, Layout, kereső
│   ├── map/                # Google térkép
│   ├── order/              # rendelés, Stripe fizetés, EmailJS visszaigazolás, státuszcímkék
│   ├── pages/              # Home, Hero, Contact, About, ÁSZF, adatvédelem
│   ├── products/           # terméklista, kiemelt termékek
│   ├── redux/              # store, auth, cart, order, products, size, toppings slice-ok
│   ├── routes/             # AdminRoutes, ProtectedRoutes
│   ├── services/           # useDebounce
│   └── user/               # bejelentkezés, regisztráció, jelszó, profil
├── App.jsx
└── main.jsx
```

## Design

A frontend kialakításához Tailwind CSS használható.

### Főbb szempontok

- Reszponzív design
- Egyszerű navigáció
- Kosár kezelése
- Loading állapotok
- Hibaüzenetek
- Külön User és Admin felület

## Technológiák

### Frontend

- React
- React Router
- Redux Toolkit
- Tailwind CSS
- Vite
- JavaScript

### Backend

- Laravel
- REST API
- MySQL
- Stripe (teszt mód)

## Projekt célja

A projekt célja egy teljes értékű pizza rendelési rendszer létrehozása, amelyben a Guest, User és Admin felhasználók különböző jogosultságokkal és felületekkel rendelkeznek.

A főbb funkciók:

- Pizza és termék megjelenítés
- Kosár
- Rendelés
- Authentication
- Admin felület
- Termék CRUD
- Felhasználókezelés
- Rendeléskezelés
- Reszponzív design
- Hibakezelés
