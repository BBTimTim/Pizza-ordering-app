# Pizza-ordering-app

## Projekt leírása

Pizza rendelő webalkalmazás React frontenddel és Laravel backenddel.

Az alkalmazás három fő felhasználói szerepköre:

- Guest
- User
- Admin

## Tervezés

Az alkalmazás különböző felületekre és funkciókra van osztva.

- Guest felület
- User felület
- Admin felület
- Termék megjelenítés
- Kosár
- Rendelés
- Jogosultságkezelés

## Guest felület:
### Funkciók

- Főoldal 
- Termékek 
- Regisztráció
- Bejelentkezés
- Kosár

## User felület:
### Funkciók

- Profil oldal
- Profil kezelése
- Termékek megtekintése
- Kosár 
- Termék mennyiségének módosítása
- Termék eltávolítása a kosárból
- Rendelés leadása
- Kijelentkezés

## Admin felület:
### Funkciók

* Dashboard
- Termékek kezelése
- Új termék létrehozása
- Termék módosítása
- Termék törlése
- Kép feltöltése
- Termék státuszának kezelése
- Kiemelt termék kezelése
* Felhasználók kezelése
- Rendelések kezelése
- Rendelés státuszának módosítása

## Layoutok

### Guest Layout

- Header
- Home
- Products
- Cart
- Footer

### Admin Layout



## Termékek

A termékek a Laravel API-ból érkeznek.

Egy termék adatai:

- ID
- Név
- Leírás
- Ár
- Kép
- mennyiség választó
- Státusz
- Kiemelt státusz

Hozzá kapcsolódó adatok:
- méret választó
- feltétek

A termékek Redux `productSlice` segítségével kerülnek tárolásra.

A termékek megjelenítése `.map()` segítségével történik.

## Kosár

### Funkciók

- Termék hozzáadása
- Termék eltávolítása
- Mennyiség növelése
- Mennyiség csökkentése
- Részösszeg számítása
- Teljes végösszeg számítása

A kosár állapotát Redux Toolkit kezeli.

## Redux

A frontend állapotkezelésére Redux Toolkit használható.

### Redux struktúra

```text
redux/
├── store
├── userSlice
├── productSlice
└── cartSlice
```

### User Slice

A bejelentkezett felhasználó állapotát kezeli.

```js
{
  email: "",
  token: "",
  isLoggedIn: false
}
```

### Product Slice

A termékeket kezeli.

```js
{
  products: []
}
```

### Cart Slice

A kosár tartalmát kezeli.

```js
{
  cart: []
}
```

## Authentication

A bejelentkezés Laravel API-n keresztül történik.

## API kommunikáció

A React frontend REST API-n keresztül kommunikál a Laravel backenddel.

### Authentication

```text
POST /api/register
POST /api/login
POST /api/logout
```

### Products

```text
GET    /api/products
POST   /api/products
PATCH  /api/products/{id}
DELETE /api/products/{id}
```

### Orders

```text
GET  /api/orders
POST /api/orders
PATCH  /api/orders/{id}
```

## Jogosultságkezelés


### Guest

Csak a publikus oldalak érhetők el.

### User

A bejelentkezett felhasználók számára elérhetők a User oldalak.

### Admin

Az Admin kizárólag megfelelő jogosultsággal érheti el az adminisztrációs felületet.

## Hibakezelés

A Laravel validációs hibákat JSON formátumban küldi vissza.

A hibák megjelenítését egy újrahasznosítható `Errors` komponens végzi.

## Projekt struktúra

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
