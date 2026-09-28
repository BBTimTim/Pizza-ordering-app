---
description: Egy technikai dokumentációt létrehozó prompt
---

# Technikai Dokumentáció Készítéséhez Használható Prompt

## Feladat
Készíts egy részletes, professzionális, IT szakmai színvonalú technikai dokumentációt a megadott webalkalmazásról vagy weboldalról. A dokumentáció célja, hogy egy új fejlesztő, üzemeltető vagy architekt gyorsan megértse a rendszer felépítését, működését, technológiai hátterét és integrációit.

## Elvárt dokumentációs struktúra

### 1. Projekt áttekintése
- A rendszer rövid üzleti és technikai célja.
- A projekt funkcionális összefoglalója.
- A rendszer főbb moduljai.
- A célfelhasználók és szerepkörök bemutatása.

### 2. Technológiai stack
Részletezd az alkalmazásban használt technológiákat:

#### Frontend
- Framework (pl. Angular, React, Vue, MVC stb.)
- Programozási nyelv
- UI komponens könyvtárak
- State management megoldások
- Build és deployment technológiák

#### Backend
- Framework és verzió
- Programozási nyelv
- Architektúra (Monolith, Microservice, Clean Architecture, Onion Architecture stb.)
- Dependency Injection használata
- Middleware komponensek
- Logging megoldások
- Authentication és Authorization mechanizmusok

#### Adatbázis
- Adatbázis típusa
- ORM keretrendszer
- Adatbázis séma rövid ismertetése
- Migrációs stratégia
- Indexelési és teljesítményoptimalizálási megoldások

#### Infrastruktúra
- Hosting környezet
- Docker/Kubernetes használata
- CI/CD folyamatok
- Verziókezelési stratégia
- Monitoring és naplózás

### 3. Rendszerarchitektúra
Mutasd be részletesen:
- A rendszer komponenseit.
- Az egyes komponensek feladatait.
- A komponensek közötti kapcsolatokat.
- A kommunikáció módját (REST API, GraphQL, Message Queue, WebSocket stb.).
- Külső rendszerekkel való integrációkat.

Készíts szöveges architektúra leírást és diagram jellegű ASCII ábrát is.

### 4. Adatfolyamok
Részletezd:
- Egy tipikus felhasználói kérés útját.
- Backend feldolgozási folyamatot.
- Adatbázis műveleteket.
- Külső szolgáltatások hívásait.
- Hibakezelési folyamatokat.

### 5. Adatbázis kapcsolatok
Mutasd be:
- A főbb entitásokat.
- Az entitások közötti kapcsolatokat.
- Egy-a-többhöz, több-a-többhöz és egy-az-egyhez kapcsolatok leírását.
- Fontos adattáblákat és azok szerepét.
- Kulcsmezőket.
- Indexeket.

### 6. API dokumentáció
Minden fontos API végpontról írd le:
- Funkció
- HTTP metódus
- URL
- Request paraméterek
- Request body
- Response struktúra
- Hibakódok
- Autentikációs követelmények

### 7. Biztonsági megoldások
Térj ki az alábbiakra:
- Hitelesítés
- Jogosultságkezelés
- Token kezelés
- Titkosítás
- Adatvédelmi megoldások
- OWASP releváns védelmek

### 8. Fejlesztői környezet
Írd le:
- Telepítési előfeltételek
- Környezeti változók
- Futtatás helyi gépen
- Build folyamat
- Tesztelési folyamat
- Debugolási lehetőségek

### 9. Fontos fejlesztői információk
Tartalmazza:
- Kódolási irányelvek
- Projektstruktúra magyarázata
- Névkonvenciók
- Branch stratégia
- Release folyamat
- Gyakori hibák és megoldásaik
- Kritikus komponensek
- Technikai adósságok
- Jövőbeli fejlesztési javaslatok

### 10. Függőségek
Sorold fel:
- Fontos NuGet/NPM csomagokat
- Külső szolgáltatásokat
- Harmadik féltől származó integrációkat
- Verzió információkat

## Dokumentációs követelmények

- Professzionális IT dokumentáció legyen.
- Használj szakszerű terminológiát.
- Térj ki minden olyan technikai részletre, amely fontos lehet egy új fejlesztő onboardingja során.
- A dokumentáció legyen strukturált, áttekinthető és karbantartható.
- Minden fejezet tartalmazzon konkrét technikai részleteket, ne csak általános leírást.
- Alkalmazz táblázatokat, felsorolásokat és diagramokat, ahol indokolt.
- Írj kifejezetten fejlesztői, üzemeltetői és architekt szemlélettel.

## Kiegészítés
$ARGUMENTS
