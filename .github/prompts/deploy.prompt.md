---
name: deploy
description: Leállás nélküli deploy minták (blue-green, rolling) futtatása, bemutatása vagy módosítása, a leállás-figyelővel együtt
---

# Deploy minták – blue-green és rolling

## Felépítés
- `deploy/blue-green/` – két teljes példány (blue, green) közös MySQL-lel, előttük egy router nginx (http://localhost:8090). Az aktív színt a `router/active/upstream.conf` egyetlen sora adja meg. A `deploy.sh <verzió>` a nem aktív színen indítja az új verziót, a `/api/health` alapján ellenőrzi, majd `nginx -s reload`-dal átvált. A `rollback.sh` visszavált.
- `deploy/rolling/` – Docker Swarm stack (http://localhost:8095): 3 backend replika, `update_config: parallelism 1, order start-first, failure_action rollback`, php-fpm `SIGQUIT`-tel áll le. A migrációt egy `replicated-job` futtatja egyszer (`RUN_MIGRATIONS=false` a replikákban).
- `deploy/check-downtime.sh [URL]` – másodpercenként kb. 5 kérés a `/api/health`-re; kiírja a HTTP kódot és a verziót, Ctrl+C-re összesít.
- A `/api/health` az `APP_VERSION`-t is visszaadja; ebből látszik, melyik verzió válaszol.

## Feladat
${input:feladat:Mit szeretnél? (pl. bemutató futtatása, új lépés a deploy.sh-ba, hibakeresés)}

## Elvárások
1. A fő környezet (8080) image-eit használd (`one-more-slice/backend:local`, `one-more-slice/web:local`); ha hiányoznak, `docker compose build backend web`.
2. Minden deploy-változtatást bizonyíts a `check-downtime.sh`-val: a végén „sikertelen: 0” legyen, és írd le a mért számokat.
3. Adatbázis-változásnál ügyelj a visszafelé kompatibilitásra (expand–contract), mert a régi és az új verzió közös adatbázist használ.
4. A bemutató után állítsd le a környezetet (`down.sh`; rollingnál `down.sh --leave` a Swarmot is kikapcsolja).
5. Magyarázd el kezdőknek is érthetően, mi történt és miért; az új tudnivalókat vezesd át a dokumentációba.
