---
description: Commit előtti ellenőrzés – kódstílus, lint, tesztek, build, titkok és dokumentáció
---

# Commit előtti ellenőrzés

Nézd át a változásokat (`git status`, `git diff`), és futtasd le:

1. Backend: `cd backend && ./vendor/bin/pint --test` és `php artisan test`.
2. Frontend: `cd frontend && npm run lint` és `npm run build`.
3. Keresd meg, és jelezd:
   - titkos értékek (`.env`, API kulcsok, `sk_`/`pk_` Stripe kulcsok) a diffben;
   - bent felejtett `console.log`, `dd(`, `dump(`;
   - új, beégetett `localhost` / `127.0.0.1` URL (a `VITE_API_URL` / `FRONTEND_URL` változókat kell használni);
   - angol nyelvű felhasználói szöveg vagy hibaüzenet.
4. Ha változott végpont, migráció, env változó vagy funkció: frissítsd a `README.md`-t és a `docs/TECHNIKAI_DOKUMENTACIO.md`-t.
5. Javasolj rövid, kisbetűs, angol commit-üzenetet a meglévő `git log` stílusában.

Ne commitolj magadtól, csak foglald össze az eredményt és a javasolt üzenetet.

## Kiegészítés
$ARGUMENTS
