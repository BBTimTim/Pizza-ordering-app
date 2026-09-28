# „VPS” szimuláció: egy Debian Linux szerver, mintha egy bérelt gép lenne (pl. AWS Lightsail).
# Rajta: SSH (csak kulccsal), nginx, php-fpm, MariaDB – ugyanúgy telepítve, ahogy egy valódi szerverre tennénk.
FROM debian:bookworm-slim

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        openssh-server sudo curl ca-certificates procps less nano \
        nginx mariadb-server \
        php8.2-fpm php8.2-cli php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl \
    && rm -rf /var/lib/apt/lists/*

# A „deploy” felhasználó: ezzel lépünk be SSH-n, és ő telepíti az alkalmazást (nem root!)
RUN useradd --create-home --shell /bin/bash --groups www-data deploy \
    && ssh-keygen -A

# SSH hardening: csak kulccsal, csak a deploy felhasználó, root belépés tiltva
COPY server/sshd-hardening.conf /etc/ssh/sshd_config.d/hardening.conf
# A deploy felhasználó sudo-val kizárólag a php-fpm újratöltését futtathatja (legkisebb jogosultság elve)
COPY server/sudoers-deploy /etc/sudoers.d/deploy
# nginx site konfiguráció és PHP beállítások
COPY server/nginx-site.conf /etc/nginx/sites-available/onemoreslice
COPY server/php.ini /etc/php/8.2/fpm/conf.d/99-onemoreslice.ini
COPY server/start.sh /usr/local/bin/start.sh

RUN sed -i 's/\r$//' /usr/local/bin/start.sh /etc/sudoers.d/deploy /etc/ssh/sshd_config.d/hardening.conf \
    && chmod 0440 /etc/sudoers.d/deploy \
    && chmod +x /usr/local/bin/start.sh \
    && rm -f /etc/nginx/sites-enabled/default \
    && ln -s /etc/nginx/sites-available/onemoreslice /etc/nginx/sites-enabled/onemoreslice

EXPOSE 22 80
CMD ["/usr/local/bin/start.sh"]
