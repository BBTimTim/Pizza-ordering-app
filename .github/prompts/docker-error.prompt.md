---
name: docker-hibakereses
description: A Docker Compose fejlesztői környezet indítása, és a gyakori hibák (build, adatbázis, 502, képfeltöltés, e-mail) diagnosztizálása
---

# Docker környezet indítása és hibakeresés

## Felépítés
- `docker-compose.yml`: `db` (MySQL 8.4), `backend` (Laravel php-fpm, `docker/backend/Dockerfile`), `web` (nginx + React build, `docker/web/Dockerfile`, `docker/web/default.conf`), `mailpit` (levélfogó, http://localhost:8025).
- Az oldal címe: http://localhost:8080. Az `/api/*` kéréseket az nginx FastCGI-n továbbítja a php-fpm-nek, az `/uploads/*` egy közös volume-ból jön.
- Indításkor az `entrypoint.sh` lefuttatja: `config:cache`, `migrate --force`, `db:seed --force`.

## Feladat
${input:hiba:A jelenség vagy a hibaüzenet}

## Diagnosztika sorrendje
1. `docker compose ps`: melyik szolgáltatás nem `healthy`?
2. `docker compose logs <szolgáltatás> --tail=100`.
3. Gyakori okok:
   - build közben `certificate verify failed`: a gépen futó vírusirtó HTTPS-ellenőrzése (pl. Avast Web-pajzs), ezt ki kell kapcsolni;
   - `entrypoint.sh: not found`: CRLF sorvége (a `.gitattributes` és a Dockerfile `sed` lépése kezeli);
   - 502 Bad Gateway: a `backend` nem fut vagy nem healthy;
   - 413: túl nagy kép (`client_max_body_size` / `upload_max_filesize`);
   - az e-mail nem jön meg: nézd meg a Mailpitet.
4. `curl http://localhost:8080/api/health` ellenőrzés.
5. Tiszta újrakezdés (**törli az adatbázist**, csak jóváhagyással): `docker compose down -v && docker compose up -d --build`.

Magyarázd el a hiba okát egyszerűen, mert a felhasználó a vizsgán is el szeretné tudni mondani.
