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
- DATA_FOLDER: Slozka s podslozkami (pojmenovanymi domenami, ktere backend serviruje) 
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
DATA_FOLDER=./data \
SESSION_MOCK=3333 \
SESSION_SERVICE=http://localhost:3333 \
npm run startdbg
```