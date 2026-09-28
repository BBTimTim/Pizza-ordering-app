---
description: Csiszolás – magyar hibaüzenetek, oldalcímek és favicon, képoptimalizálás, függőségek biztonsági frissítése
argument-hint: "Mit csiszoljunk? (pl. új oldal címe, új hibaüzenet, képkezelés, csomagfrissítés)"
---

# Csiszolás (polish)

## Ami már el van készítve
- **Magyar üzenetek:** `backend/lang/hu/` (validation, auth, passwords, pagination) és `backend/lang/hu.json`; `config/app.php`: `locale` = `hu`, `fallback_locale` = `en`. A mezőnevek magyarul a `validation.php` `attributes` részében vannak. Teszt: `test_validation_messages_are_in_hungarian`.
- **Oldalcímek és favicon:** `frontend/src/components/services/usePageTitle.js` (pl. `usePageTitle("Kosár")` → „Kosár | One more slice”), `frontend/public/favicon.svg`, `frontend/index.html` (`lang="hu"`, cím, meta description, Open Graph).
- **Képoptimalizálás:** `backend/app/Services/ImageOptimizer.php` – feltöltéskor legfeljebb 1200 px széles WebP; `php artisan images:optimize` a meglévő képekhez; GD a `docker/backend/Dockerfile`-ban és a CI-ban; `loading="lazy"` a terméklistákon. Az eredeti PNG-k nem kerülnek a Docker image-be (`.dockerignore`).
- **Extra feltétek lenyitható panelben:** `frontend/src/components/products/Products.jsx` – natív `<details>`/`<summary>`, alapból becsukva; a fejléc mutatja, hány feltét van kiválasztva; a jelölőnégyzetek a `selectedToppings` state-ből vezéreltek (becsukva sem vesznek el).
- **Függőségek:** `composer audit` → a nem-Laravel csomagok frissítve (36 → 3 figyelmeztetés). A maradék 3 a Laravel 10-et érinti, ez csak Laravel 11/12-re váltással javítható.

## Feladat
$ARGUMENTS

## Elvárások
1. Minden felhasználói szöveg és hibaüzenet magyar legyen; új validációs mezőnél vedd fel a magyar nevét az `attributes` listába.
2. Új oldalnál hívd meg a `usePageTitle`-t a komponens elején.
3. Képet csak az `ImageOptimizer`-en keresztül ments; a lista-nézetekben használj `loading="lazy"`-t.
4. Csomagfrissítés előtt `composer audit` / `npm audit`; főverziót (pl. Laravel 10 → 11) ne válts a felhasználó jóváhagyása nélkül. Frissítés után `php artisan test`, `./vendor/bin/pint --test`, `npm run lint`, `npm run build`.
5. A Docker build és a `composer update` internetet igényel: ha „certificate verify failed” hibát kapsz, a vírusirtó (Avast) HTTPS-ellenőrzése az ok.
6. Böngészős ellenőrzés (http://localhost:8080): fül címe és favicon, magyar hibaüzenet egy üres mezőnél, a képek mérete a Network fülön, rendelés tesztkártyával, a feltét-panel lenyitása és a kiválasztás száma, admin rendeléskezelés.
7. A változásokat vezesd át a dokumentációba, és magyarázd el kezdőknek is érthetően.
