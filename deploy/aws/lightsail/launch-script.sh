#!/bin/bash
# AWS Lightsail „launch script” (indítószkript) – a szerver LEGELSŐ indulásakor egyszer, rootként fut le.
# A Lightsail konzolon a példány létrehozásakor az „Add launch script” mezőbe kell bemásolni.
# Ubuntu 24.04 LTS operációs rendszerhez készült. (Bemutató: nem futtatjuk, AWS-fiók kell hozzá.)
set -euo pipefail

# 1. Frissítések – a biztonsági javítások miatt a legelső lépés
apt-get update && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
# Automatikus biztonsági frissítések a jövőben is
DEBIAN_FRONTEND=noninteractive apt-get install -y unattended-upgrades

# 2. Docker és Docker Compose telepítése (a hivatalos telepítőszkripttel)
curl -fsSL https://get.docker.com | sh

# 3. Külön „deploy” felhasználó (nem root-ként dolgozunk); a docker csoport tagja, hogy konténert indíthasson
useradd --create-home --shell /bin/bash --groups docker deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
# A Lightsail alapfelhasználójának (ubuntu) kulcsát átmásoljuk a deploy felhasználóhoz
install -m 600 -o deploy -g deploy /home/ubuntu/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys

# 4. SSH hardening – ugyanaz, mint a helyi VPS bemutatóban (deploy/vps/server/sshd-hardening.conf)
cat > /etc/ssh/sshd_config.d/hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy ubuntu
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
EOF
systemctl reload ssh

# 5. Tűzfal (ufw): csak az SSH, a HTTP és a HTTPS port legyen nyitva
#    (a Lightsail saját tűzfalát a konzolon ugyanígy kell beállítani: 22, 80, 443)
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 6. fail2ban: ha valaki sokszor próbálkozik rossz adatokkal SSH-n, az IP-címét ideiglenesen kitiltja
apt-get install -y fail2ban
systemctl enable --now fail2ban

# 7. Az alkalmazás mappája; ide kerül a docker-compose.prod.yml és a .env (titkokkal, 600-as joggal)
install -d -m 750 -o deploy -g deploy /opt/one-more-slice
