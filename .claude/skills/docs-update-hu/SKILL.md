---
name: docs-update-hu
description: A One more slice magyar nyelvű dokumentációjának (README.md és docs/TECHNIKAI_DOKUMENTACIO.md, szükség esetén CLAUDE.md) szinkronban tartása a kóddal. Használd, amikor a felhasználó a dokumentáció, a README vagy a technikai doksi frissítését, ellenőrzését, kiegészítését kéri ("frissítsd a doksit", "update the docs", "dokumentáld az új végpontot", "is the README still accurate?"), vagy amikor egy kódváltoztatás után (új végpont, migráció, env változó, szerepkör, függőség, új oldal/funkció) a dokumentáció elavulhat — akkor is, ha a felhasználó nem említi kifejezetten a dokumentációt, de commit/PR előtt "mindent rendbe tennél".
---

# Magyar dokumentáció frissítése

A projekt dokumentációja magyar nyelvű, és két fájlban él:

- `README.md` — rövid áttekintés: cél, főbb funkciók, stack, projektstruktúra, indítás, alap végpontok, szerepkörök.
- `docs/TECHNIKAI_DOKUMENTACIO.md` — számozott fejezetekből álló részletes leírás (1–9. fejezet: áttekintés, stack, architektúra, adatfolyamok, adatbázis, API, biztonság, fejlesztői környezet, fejlesztői információk).

A `CLAUDE.md` is magyar; akkor frissítsd, ha egy architekturális tény változik, amit ott rögzítettek (beégetett URL-ek, auth, árazás, rendelés enumok, hiányzó migrációk stb.).

A cél, hogy a dokumentáció **igaz** legyen: egy új fejlesztő vagy vizsgáztató ebből tanulja meg a rendszert, ezért egy rossz enum-érték vagy szállítási díj többet árt, mint egy hiányzó bekezdés.

## Munkafolyamat

### 1. Derítsd ki, mi változott

- Ha a felhasználó megnevezi a változást, abból indulj ki.
- Egyébként nézd meg a különbséget: `git diff main...HEAD --stat` és `git status` (a nem commitolt változások is számítanak). Ha a felhasználó teljes átnézést kér ("ellenőrizd, pontos-e a doksi"), akkor nem a diffből, hanem a teljes kódból dolgozz.

### 2. Rendeld hozzá a változásokat a doksi szakaszaihoz

| Kódrész | Érintett doksi szakasz |
| --- | --- |
| `backend/routes/api.php` | Tech. 6.1 (publikus) / 6.2 (admin) táblák; README „Alap API végpontok” csak kulcsfontosságú végpontnál |
| `backend/database/migrations/`, `app/Models/` | Tech. 5.1 entitások, 5.2 kapcsolatok, 5.3 kulcsmezők |
| Controllerek (validáció, válaszok, státuszkódok) | Tech. 6.3 példák, 6.4 hibakódok, 4.x adatfolyamok |
| Middleware, Sanctum, `users.status` | Tech. 1.4, 7.x; README „Szerepkörök” |
| `backend/.env.example`, `frontend/.env` változók | Tech. 8.2 |
| `composer.json`, `frontend/package.json` | Tech. 2.x; README „Technológiai stack” |
| `frontend/src/components/redux/cart/cartSlice.js` (árazás, szállítás) | Tech. 4.2 és a 6.3 rendelés-példa összegei |
| `frontend/src/App.jsx`, mappaszerkezet | Tech. 9.2; README „Projekt struktúra” |
| Új felhasználói funkció | Tech. 1.2; README „Főbb funkciók” |

Olvasd el az érintett szakaszt a fájlban, mielőtt szerkeszted — a táblázat csak kiindulópont, a fejezetszámok eltolódhatnak.

### 3. Ellenőrizd a tényeket a forráskódban

Minden leírt értéket (végpont útvonala és metódusa, mezőnév, enum-érték, díj, env változó neve, válaszüzenet) a kódból vegyél, ne a meglévő doksiból és ne emlékezetből. A meglévő doksi maga is tartalmazhat hibát; ha a szerkesztett szakasz közelében ilyet találsz (pl. rendelés `status` értéke a példában nem létező enum), javítsd, és említsd meg a beszámolóban.

Ha valamit nem tudsz a kódból igazolni, ne találd ki — hagyd ki vagy jelezd a felhasználónak.

### 4. Szerkessz minimálisan, a meglévő stílusban

- Csak azt módosítsd, amit a változás érint; ne írd át a teljes dokumentumot, ne rendezd át a fejezeteket.
- Tartsd meg a számozást (`### 6.2`), és ha új alfejezet kell, a következő szabad számot használd a megfelelő fejezeten belül.
- Az új szöveg magyarul legyen, a környező szöveg hangnemében (tárgyilagos, rövid, felsorolásos).

### 5. Számolj be

Röviden sorold fel, melyik fájl melyik szakaszát módosítottad, és külön jelezd a menet közben talált, már korábban is hibás állításokat. A beszámoló a felhasználó nyelvén szóljon (ha angolul ír, angolul).

## Stílus és formátum

- Kódelemek (útvonal, mező, fájlnév, enum-érték, env változó) backtickben: `` `POST /api/addorder` ``, `` `status` (`active`, `block`) ``.
- Végpontok táblázatban, a meglévő oszlopokkal: `| Metódus | Végpont | Leírás |`, a leírás kisbetűvel kezdődik, pont nélkül.
- Entitások mezőlistája `#### \`táblanév\`` alcím alatt, soronként egy mező; enumoknál zárójelben a lehetséges értékek.
- Példák: `json` kódblokk, valószerű magyar adatokkal (pl. „Kiss Pista”, „Budapest”, `+36...`), és az összegek legyenek konzisztensek a valós árazási szabályokkal (`sub_total + delivery_charges = grand_total`).
- Szóhasználat: új szövegben a „feltét” szót használd (a UI is így hívja); ha a környező szakasz „topping”-ot ír, ott ne keverd a kettőt egy mondaton belül. „Végpont”, „migráció”, „jogosultság”, „hitelesítés”, „rendelési tétel”.
- Pénzösszegek: `1200 Ft`, `15000 Ft` formában.

## Mire figyelj

- A `routes/api.php`-ban néhány `GET` útvonal az admin csoportban és publikusan is szerepel — a doksiban a tényleges viselkedést írd le (a publikus regisztráció érvényesül, a `ProductController@index` a felhasználó alapján ágazik el).
- A vásárlói e-maileket (kapcsolat, rendelés-visszaigazolás) a frontend küldi EmailJS-szel, nem a Laravel — ne írd a backendhez.
- Titkos értéket (API kulcs, jelszó) soha ne írj a doksiba, csak a változó nevét.
