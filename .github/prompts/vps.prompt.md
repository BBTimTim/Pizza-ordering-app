---
name: vps
description: A „VPS” szerver (Linux, SSH, nginx + php-fpm, MariaDB) kezelése és a zero-downtime Laravel deploy (releases + current symlink)
---

# VPS és zero-downtime Laravel deploy

## Felépítés (`deploy/vps/`)
- Debian konténer mint szerver: SSH a 2222-es porton, weboldal a http://localhost:8100 címen.
- SSH hardening (`server/sshd-hardening.conf`): csak kulccsal, csak a `deploy` felhasználó, root tiltva, `MaxAuthTries 3`.
- A `deploy` felhasználó sudo-val kizárólag a `service php8.2-fpm reload`-ot futtathatja (`server/sudoers-deploy`).
- Könyvtárak: `/var/www/onemoreslice/releases/<időbélyeg>`, `shared/` (.env, storage, uploads), `current` symlink.
- nginx: `server/nginx-site.conf`, a PHP-nak `$realpath_root`-tal adja át az útvonalat, saját access/error log.
- Scriptek: `setup.sh` (kulcs, szerver, képek), `deploy.sh <verzió>` (artifact a Docker image-ekből → scp → `server/release.sh` ssh-n), `rollback.sh`, `ssh.sh`, `down.sh`.

## Feladat
${input:feladat:Mit szeretnél? (pl. deploy, visszaállás, jogosultság ellenőrzése, naplók megnézése)}

## Elvárások
1. A szerveren a `deploy` felhasználóként dolgozz (`./deploy/vps/ssh.sh`), rootként ne.
2. A symlink-cserét mindig atomian végezd (`ln -sfn` ideiglenes linkre, majd `mv -T`), és utána `php-fpm reload`.
3. Jogosultságnál a legkisebb jogosultság elvét kövesd; írd le a `chmod`/`chown` értékek jelentését (pl. `640`, `2775`).
4. Deploy után ellenőrizd a `/api/health`-et és a `check-downtime.sh`-val a leállásmentességet.
5. Titkot (jelszó, kulcs) ne írj a repóba; a `deploy/vps/keys/` a `.gitignore`-ban van.
