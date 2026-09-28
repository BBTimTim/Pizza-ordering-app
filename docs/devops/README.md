# DevOps & infra – követelmény-mátrix

Ez a dokumentum a DevOps & infra követelmények minden pontja mellé megadja, **hol teljesül** a projektben, és **hogyan mutatható be**.

Jelmagyarázat: ✅ megvalósítva és kipróbálva · 📄 konfiguráció és leírás, futtatás nélkül (fizetős szolgáltatás)

Minden helyi bemutató ingyenes, és a Docker Desktopon kívül nem igényel semmit.

---

## 1. Linux & VPS alapok

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| WSL | ✅ | a Docker Desktop a WSL2 Linux-kernelén fut | `docker info --format '{{.KernelVersion}}'` |
| VPS | ✅ | `deploy/vps/` – Debian „szerver” konténer (SSH, nginx, php-fpm, MariaDB) | `./deploy/vps/setup.sh` |
| SSH, kulcsos belépés | ✅ | `deploy/vps/setup.sh` (ed25519 kulcspár), `server/start.sh` (`authorized_keys`, `600`) | `./deploy/vps/ssh.sh` |
| Fájlkezelés, alap parancsok | ✅ | `deploy/vps/server/release.sh`: `mkdir`, `tar`, `ln -s`, `mv -T`, `readlink`, `rm`, `curl`, `ls -1dt`, `xargs` | `./deploy/vps/ssh.sh "ls -la /var/www/onemoreslice"` |
| Jogosultságok | ✅ | `server/start.sh`: `chown`, `chgrp`, `chmod 640` (.env), `2775` + setgid (storage); `server/sudoers-deploy` | `./deploy/vps/ssh.sh "stat -c '%A %U:%G %n' /var/www/onemoreslice/shared/.env"` |

## 2. Nginx & php-fpm alapok

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| Reverse proxy | ✅ | `docker/web/default.conf` (`/api` → php-fpm), `deploy/blue-green/router/nginx.conf` (`proxy_pass` az aktív színre) | böngésző: http://localhost:8080 |
| Site config | ✅ | `deploy/vps/server/nginx-site.conf` (`sites-available` + `sites-enabled` symlink) | `./deploy/vps/ssh.sh "cat /etc/nginx/sites-enabled/onemoreslice"` |
| php-fpm működés | ✅ | FastCGI: TCP-n (`backend:9000`, Docker) és Unix socketen (`/run/php/php8.2-fpm.sock`, VPS); kíméletes `reload` deploykor | `./deploy/vps/deploy.sh v2` 5. lépése |
| Access / error log | ✅ | `log_format timed` válaszidővel (`docker/web/default.conf`); VPS: `/var/log/nginx/onemoreslice.access.log` / `.error.log` | `./ops/logs-report.sh 1h` |

## 3. Docker

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| Image | ✅ | `docker/backend/Dockerfile`, `docker/web/Dockerfile`, `deploy/vps/Dockerfile` | `docker image ls one-more-slice/*` |
| Container | ✅ | `docker-compose.yml` szolgáltatásai, healthcheckekkel | `docker compose ps` |
| Volume | ✅ | `db-data`, `uploads`, `storage` (`docker-compose.yml`) | `docker volume ls` |
| Network | ✅ | `frontend-net` és `backend-net`: a `web` nem látja közvetlenül az adatbázist | `docker network ls` |
| Multi-stage build | ✅ | backend: base → vendor (composer) → runtime; web: node build → nginx | `docker/backend/Dockerfile` |

## 4. Docker Compose – fejlesztői környezet

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| Több szolgáltatás együtt | ✅ | `docker-compose.yml`: web (nginx), backend (php-fpm), db (MySQL), mailpit, phpmyadmin | `docker compose up -d --build` |
| Beállítások környezeti változóból | ✅ | `.env.example` (gyökér), `frontend/.env.example`, `backend/.env.example` | `cp .env.example .env` |

## 5. CI/CD – GitHub Actions

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| Linting (ESLint, Pint) | ✅ | `.github/workflows/ci.yml` – frontend és backend job | GitHub → Actions |
| Build | ✅ | `npm run build` + a teljes Docker környezet felépítése | GitHub → Actions |
| Test | ✅ | `php artisan test` (11 Feature teszt) + füstteszt a futó Docker környezeten | GitHub → Actions |
| Egyszerű deployment workflow | ✅ | `.github/workflows/deploy.yml`: ha a CI a `master`-en zöld, SSH-n telepít a VPS-re (`deploy/vps/deploy.sh`) és ellenőrzi a verziót; a kész image-ek a GHCR-be is felkerülnek | GitHub → Actions → Deploy (vagy „Run workflow”) |

## 6. AWS Lightsail, ECS/Fargate alapok

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| Lightsail | 📄 | `deploy/aws/lightsail/launch-script.sh`, `docker-compose.prod.yml` | `deploy/aws/PARANCSOK.md` (A rész) |
| Task definition | 📄 | `deploy/aws/ecs/task-definition.json` (Fargate, 2 konténer, SSM titkok, EFS, awslogs) | fájl bemutatása |
| Service | 📄 | `deploy/aws/ecs/service.json` (2 példány, rolling, circuit breaker) | fájl bemutatása |
| Load balancer | 📄 | `deploy/aws/ecs/target-group.json` | fájl bemutatása |
| Healthcheck | ✅ / 📄 | `GET /api/health` (adatbázissal és verzióval); Docker, Swarm, ECS és ALB healthcheck | `curl http://localhost:8080/api/health` |

## 7. Deployment minták

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| Blue-green | ✅ | `deploy/blue-green/` | `up.sh`, majd `deploy.sh v2` és `rollback.sh` |
| Rolling deploy | ✅ | `deploy/rolling/` (Docker Swarm, 3 replika, start-first) | `up.sh`, majd `deploy.sh v2` és `rollback.sh` |
| Zero-downtime Laravel deploy | ✅ | `deploy/vps/` (releases/, shared/, atomi `current` symlink, php-fpm reload) | `setup.sh`, `deploy.sh v1`, `deploy.sh v2`, `rollback.sh` |
| Összehasonlítás: naiv újraindítás | ✅ | fő környezet | `docker compose up -d --force-recreate backend` a figyelő alatt |

## 8. Monitoring & biztonság

| Követelmény | Állapot | Hol van | Bemutatás |
|---|---|---|---|
| CloudWatch logok | 📄 | `awslogs` naplózás (`task-definition.json`, `docker-compose.prod.yml`), riasztások (`deploy/aws/cloudwatch/`) | `deploy/aws/PARANCSOK.md` (C rész) |
| Nginx logolás | ✅ | naplóformátum válaszidővel, `ops/logs-report.sh` | `./ops/logs-report.sh 1h` |
| SSH hardening | ✅ | `deploy/vps/server/sshd-hardening.conf`, `sudoers-deploy`; Lightsail: + ufw, fail2ban | jelszavas és root belépés próbája |
| Backup alapok | ✅ | `ops/backup.sh` (mysqldump + képek, 7 napos rotáció), `ops/backup-verify.sh`, `ops/restore.sh` | `./ops/backup.sh`, majd `./ops/backup-verify.sh` |
| Alkalmazásbiztonság (kiegészítés) | ✅ | szerveroldali árszámítás, Stripe-ellenőrzés a szerveren, rate limit, titkok `.env`-ben | `php artisan test` |

---

## Vizsgabemutató – javasolt sorrend

1. `docker compose up -d --build` → `docker compose ps` (Docker, Compose, healthcheck)
2. GitHub → Actions: egy zöld CI futás (CI/CD)
3. `./deploy/vps/setup.sh`, `./deploy/vps/ssh.sh` – SSH, jogosultságok, jelszavas belépés elutasítása (Linux, biztonság)
4. Második ablakban `./deploy/check-downtime.sh http://localhost:8100/api/health`, közben `./deploy/vps/deploy.sh v2`, majd `rollback.sh` (zero-downtime)
5. Ugyanígy a blue-green (`deploy/blue-green`) és a rolling (`deploy/rolling`) bemutató
6. `./ops/logs-report.sh`, `./ops/backup.sh`, `./ops/backup-verify.sh` (monitoring, backup)
7. `deploy/aws/` fájlok és a `PARANCSOK.md` – hogyan kerülne mindez AWS-re (Lightsail, ECS, CloudWatch)
8. Bemutató után: `down.sh` minden bemutató mappában (rollingnál `--leave`)

Részletes, kezdőknek szóló magyarázat: a projekt Word-összefoglalója és a `docs/TECHNIKAI_DOKUMENTACIO.md`.
