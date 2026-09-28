---
name: monitoring-backup
description: Naplók elemzése (nginx, Laravel), adatbázis- és képmentés, visszaállítási próba és visszaállítás
---

# Monitoring és backup

## Eszközök (`ops/`)
- `logs-report.sh [időtartam]` – az nginx naplóból: kérések száma, státuszkódok, leggyakoribb és leglassabb végpontok, 5xx hibák. A naplóformátum (`timed`) a `docker/web/default.conf`-ban van, benne a válaszidővel.
- `backup.sh` – `mysqldump --single-transaction` + az `uploads` volume mentése a `backups/` mappába, a legutóbbi 7 marad.
- `backup-verify.sh` – a legutóbbi mentést egy külön tesztadatbázisba tölti vissza, és táblánként összeveti a sorok számát. Az éles adatot nem érinti.
- `restore.sh <db-mentés> [képek]` – valódi visszaállítás, megerősítéssel és előtte biztonsági mentéssel.
- Laravel naplók: `docker compose logs backend`; nginx: `docker compose logs web`.

## Feladat
${input:feladat:Mit szeretnél? (pl. naplóelemzés egy hibához, mentés, visszaállítási próba)}

## Elvárások
1. Hibakeresésnél előbb a `logs-report.sh`-t futtasd, 5xx esetén a backend naplóját is nézd meg.
2. Mentés után mindig futtass visszaállítási próbát (`backup-verify.sh`) – egy mentés csak akkor ér valamit, ha vissza is lehet állítani.
3. Az éles adatbázist csak a `restore.sh`-val és a felhasználó kifejezett jóváhagyásával írd felül.
4. A mentések nem kerülhetnek a Gitbe (`backups/` a `.gitignore`-ban).
5. Az eredményt számokkal és kezdőknek is érthetően foglald össze.
