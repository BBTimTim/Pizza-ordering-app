# AWS telepítés – lépések és parancsok (referencia)

> Ezek a fájlok **nincsenek futtatva** – AWS-fiók kell hozzájuk, és egy részük pénzbe kerül.
> Azt mutatják meg, hogyan kerülne az alkalmazás AWS-re. A `123456789012`, `vpc-…`, `subnet-…`, `sg-…`, `fs-…`
> értékek helyőrzők: a saját fiók azonosítóira kell cserélni. Régió: `eu-central-1` (Frankfurt).

## Mappák

| Fájl | Mire való |
|---|---|
| `lightsail/launch-script.sh` | Lightsail VPS első indulásakor lefutó szkript: frissítések, Docker, deploy felhasználó, SSH hardening, ufw tűzfal, fail2ban |
| `lightsail/docker-compose.prod.yml` | éles futtatás a Lightsail szerveren, a CI által a GHCR-be feltöltött image-ekkel; naplók a CloudWatch-ba |
| `ecs/task-definition.json` | ECS Fargate „task”: a `backend` és a `web` konténer, beállítások, healthcheck, naplózás a CloudWatch-ba |
| `ecs/service.json` | ECS szolgáltatás: 2 példány, rolling deploy, automatikus visszaállás, load balancer |
| `ecs/target-group.json` | az Application Load Balancer célcsoportja, egészség-ellenőrzés a `/api/health`-en |
| `cloudwatch/alarm-5xx.json` | riasztás, ha sok a szerverhiba (5xx) |

## A) AWS Lightsail (egy VPS – a helyi `deploy/vps` bemutató „éles” párja)

1. Lightsail konzol → **Create instance** → Linux, Ubuntu 24.04 → a legkisebb, a Dockernek elegendő memóriájú csomag.
2. **Add launch script**: a `lightsail/launch-script.sh` tartalma.
3. **Networking**: a tűzfalon csak 22, 80, 443 legyen nyitva; **statikus IP** hozzárendelése.
4. Belépés és indítás:
   ```bash
   ssh -i lightsail-kulcs.pem deploy@<statikus-ip>
   cd /opt/one-more-slice                 # ide: docker-compose.prod.yml + .env (chmod 600)
   docker login ghcr.io                   # GitHub felhasználónév + token (read:packages)
   docker compose -f docker-compose.prod.yml pull
   docker compose -f docker-compose.prod.yml up -d
   ```
5. Új verzió: `IMAGE_TAG=<commit-sha> docker compose -f docker-compose.prod.yml up -d` (a CI minden `master`-re feltöltött commithoz image-et készít).
6. HTTPS: a Lightsail load balancer ingyenes tanúsítványával, vagy a szerveren egy Caddy/Certbot megoldással.

## B) AWS ECS Fargate (konténerek szerver nélkül, load balancerrel)

```bash
# 1. Fürt és naplócsoport (a naplókat 14 napig őrizzük meg)
aws ecs create-cluster --cluster-name one-more-slice
aws logs create-log-group --log-group-name /ecs/one-more-slice
aws logs put-retention-policy --log-group-name /ecs/one-more-slice --retention-in-days 14

# 2. Task definition regisztrálása (előtte: az IDE-A-… helyőrzők cseréje a saját értékekre;
#    élesben a titkokat az AWS titoktárolójában tartanánk, nem a fájlban)
aws ecs register-task-definition --cli-input-json file://ecs/task-definition.json

# 3. Load balancer célcsoport (egészség-ellenőrzés: /api/health)
aws elbv2 create-target-group --cli-input-json file://ecs/target-group.json

# 4. Adatbázis-migráció EGYSZER, külön taskként (ugyanaz az elv, mint a helyi rolling bemutatóban)
aws ecs run-task --cluster one-more-slice --launch-type FARGATE --task-definition one-more-slice \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0aaaaaaaaaaaaaaaa],securityGroups=[sg-0cccccccccccccccc],assignPublicIp=ENABLED}" \
  --overrides '{"containerOverrides":[{"name":"backend","command":["true"],"environment":[{"name":"RUN_MIGRATIONS","value":"true"}]}]}'

# 5. Szolgáltatás indítása (2 példány a load balancer mögött)
aws ecs create-service --cli-input-json file://ecs/service.json

# 6. Deploy (rolling): új task definition revízió, majd a szolgáltatás frissítése
aws ecs update-service --cluster one-more-slice --service one-more-slice --task-definition one-more-slice:2
#    minimumHealthyPercent 100 / maximumPercent 200: előbb elindulnak az újak, csak utána állnak le a régiek.
#    deploymentCircuitBreaker: ha az új példányok nem lesznek egészségesek, az ECS magától visszaáll.

# 7. Kézi visszaállás: az előző revízióra
aws ecs update-service --cluster one-more-slice --service one-more-slice --task-definition one-more-slice:1
```

## C) CloudWatch riasztás

```bash
aws sns create-topic --name one-more-slice-riasztasok
aws sns subscribe --topic-arn arn:aws:sns:eu-central-1:123456789012:one-more-slice-riasztasok --protocol email --notification-endpoint te@example.com
aws cloudwatch put-metric-alarm --cli-input-json file://cloudwatch/alarm-5xx.json
```

## Költségkontroll – mindig ezzel kezdd!

- **AWS Budgets**: költségriasztás (pl. 5 USD felett e-mail), még az első erőforrás előtt.
- A load balancer, a Fargate és az RDS óradíjas: a bemutató után **mindent törölj**:
  ```bash
  aws ecs update-service --cluster one-more-slice --service one-more-slice --desired-count 0
  aws ecs delete-service --cluster one-more-slice --service one-more-slice
  aws ecs delete-cluster --cluster one-more-slice
  aws elbv2 delete-load-balancer --load-balancer-arn <arn>
  ```

## Hogyan kapcsolódik a helyi bemutatókhoz?

| Helyi bemutató | AWS megfelelője |
|---|---|
| `deploy/vps` (Debian konténer, SSH, nginx + php-fpm) | Lightsail példány |
| `deploy/rolling` (Swarm, 3 replika, start-first, rollback) | ECS service, `minimumHealthyPercent`/`maximumPercent`, circuit breaker |
| `deploy/blue-green` (router nginx, két szín) | ALB két target grouppal, vagy ECS + CodeDeploy blue/green |
| `/api/health` + Docker healthcheck | ALB target group health check, ECS container health check |
| `ops/logs-report.sh`, `docker compose logs` | CloudWatch Logs, metrikák és riasztások |
| `ops/backup.sh` | RDS automatikus mentések, Lightsail snapshot |
