# BBB-cms-api

Backendova cast pro [bbb-vue-web](https://github.com/otevrenamesta/bbb-vue-web).
Obsahuje:
- API pro editaci dat (__D__) 
- API pro generovani zakladnich souboru webu (ZS):
  - style.css - vyrenderovany sass based styl
  - vendor.js - concatenovany soubor JS zavislosti (vcetne buildu bbb-vue-web)
  - routes.json - seznam routes webu ze stromu souboru YAML.
- webDAV server pro editaci cele **_service** slozku - pristup pro webare, spravce, ...

## Predpoklady

Predpoklada se pouziti reverse proxy __RP__ (napr. nginx), ktera:
- nejlepe serviruje staticke soubory __D__
- caching generovanych souboru (ZS, [viz. routes.js](./routes.js))

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES, jsou samovysvětlující:
- PORT: default 3000
- HOST: default 127.0.0.1
- WEBDATA_FOLDER: Slozka s podslozkami (pojmenovanymi domenami, ktere backend serviruje) 
obsahujicimi data jednotlich webu na tech domenach (__D__).
Mozno pripojit do adresare weby pomoci submodulu z externich git repositaru 
a ziskat tim backup a historii.
Default neni = __nutno explicitne tuto envvar zadat__. 
- DOMAIN: (pro debugging, kdyz nebezi za __RP__) override domeny __D__.
- WEBDAV_HOST: 
- WEBDAV_PATH:

[Dockerfile](Dockerfile) umožňuje nasadit jako kontejner,
idealně pomocí orchestrátoru jako např. [kubernetes](https://kubernetes.io/).

## local dev

Pro lokalni devel je uzitecne mit mock auth service.
Pro zapnuti je nutne nastavit SESSION_MOCK a SESSION_SERVICE env vars.
Paklize neni __RP__ je mozne nechat express servirovat staticke soubory.

Tedy spusteni Napr.:
```
SERVE_STATIC=1 \
DOMAIN=pokus.cz \
WEBDATA_FOLDER=./data \
SESSION_MOCK=3333 \
SESSION_SERVICE=http://localhost:3333 \
npm run startdbg
```

## Pripojeni pres web dav

Working: z VSCode pres plugin [remote-workspace](https://marketplace.visualstudio.com/items?itemName=liveecommerce.vscode-remote-workspace).

## Lokalni webdesign

Predpoklada se, ze data jsou v repositari, ktery je vyclonovan ve slozce $REPO.
Pro priklad demoweb (https://github.com/otevrenamesta/demo.stredni),
ktery je nasazen na adrese [https://stredni.web.otevrenamesta.cz](https://stredni.web.otevrenamesta.cz/).

_NOTE_: predpokladam, ze mam nainstalovany node (i npm).
Je rada zpusobu, napr. [nvm](https://github.com/nvm-sh/nvm).

```
cd /tmp

# vyklonuji repositar s webem do slozky web
git clone https://github.com/otevrenamesta/demo.stredni web
REPO=`pwd`/web

# vyklonuji repositar s backendem do server
git clone https://github.com/otevrenamesta/bbb-cms-api server
cd server
npm i --production
PROXIES='{"/api":"https://stredni.web.otevrenamesta.cz","/cdn":"https://stredni.web.otevrenamesta.cz/"}' \
WEB_REPO_PATH=$REPO \
npm run webdev
```