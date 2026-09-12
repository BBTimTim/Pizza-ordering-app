# One more slice

Pizza rendelési webalkalmazás React frontenddel és Laravel backenddel.

## Rendszer célja
A projekt célja, hogy a felhasználók böngészhessenek a termékek között, kosárba tegyék a kiválasztott ételeket, leadják a rendelést, valamint adminisztrátori felületen kezeljék a termékeket, méreteket, feltéteket és rendelések állapotát.

## Főbb funkciók
- publikus terméklista és keresés
- kosár és rendelésleadás
- bejelentkezés és regisztráció
- profil kezelés és jelszó-visszaállítás
- admin termékkezelés (létrehozás, módosítás, törlés)
- admin méret- és topping-kezelés
- rendeléskezelés és jogosultságkorlátozás

## Technológiai stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS + DaisyUI

### Backend
- Laravel 10
- PHP 8.1
- Eloquent ORM
- Sanctum autentikáció
- REST API

### Adatbázis
- MySQL / MariaDB kompatibilis relációs adatbázis
- Laravel migrációk

## Projekt struktúra

```text
One-more-slice/
├── backend/        # Laravel API és üzleti logika
├── frontend/       # React alkalmazás
├── docs/           # technikai dokumentáció
├── README.md       # projekt összefoglaló
└── .gitignore
```

## Fejlesztői környezet

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Alap API végpontok
```text
POST /api/register
POST /api/login
GET  /api/products
GET  /api/featured-products
GET  /api/popular-products
POST /api/addorder
```

## Szerepkörök
- Guest: publikus oldalakon böngészés, regisztráció, bejelentkezés
- User: kosár, profil, rendelésleadás
- Admin: teljes adminisztrációs felület és CRUD műveletek

## Dokumentáció
A részletesebb technikai leírás itt található:

- [docs/TECHNIKAI_DOKUMENTACIO.md](docs/TECHNIKAI_DOKUMENTACIO.md)

## Megjegyzés
A projekt lokális fejlesztésre van hangolva, és jelenleg a frontend és backend külön, saját dev szervereken fut.

```text
src/
│
├── app/
│   └── api/
│       └── apiSlice.js
│
├── components/
│   │
│   ├── admin/
│   │   └── AddProducts/
│   │
│   ├── user/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Resetpassword/
│   │   ├── Forgetpassword/
│   │   ├── UserProfile/
│   │   └── Profile/
│   │
│   ├── common/
│   │   ├── Loader/
│   │   ├── Errors/
│   │   └── ErrorFallback/
│   │
│   ├── products/
│   │   └── Products/
│   │
│   ├── cart/
│   │
│   ├── css/
│   │   └── loader.css
│   │
│   ├── pages/
│   │   ├── Contact/
│   │   ├── Hero/
│   │   └── Home/
│   │
│   ├── layout/
│   │   ├── Footer/
│   │   ├── GuestLayout/
│   │   └── Header/
│   │
│   └── redux/
│       │
│       ├── auth/
│       │   ├── authSlice.js
│       │   └── authApiSlice.js
│       │
│       ├── productSlice.jsx
│       ├── cartSlice.jsx
│       └── store.jsx
│
├── app.css
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
