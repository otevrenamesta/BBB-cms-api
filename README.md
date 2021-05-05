# BBB-cms-api

Api pro editaci dat (__D__) a stylu pro [bbb-vue-web](https://github.com/vencax/bbb-vue-web) a generovani zakladnich souboru webu (ZS):
- index.html
- style.css
- vendor.js
- routes.json

## Predpoklady

Predpoklada se pouziti reverse proxy __RP__ (napr. nginx), ktera:
- nejlepe serviruje staticke soubory __D__
- caching generovanych souboru (ZS, [viz. routes.js](./routes.js))

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES, jsou samovysvětlující:
- PORT: default 3000
- HOST: default 127.0.0.1
- DATA_FOLDER: default ./data - slozka s podslozkami (pojmenovanymi domenami) obsahujicimi data webu (__D__).
Mozno pripojit do adresare weby pomoci submodulu z externich git repositaru (backup, history).
- DOMAIN: (pro debugging, kdyz nebezi za __RP__) override domeny __D__.

[Dockerfile](Dockerfile) umožňuje nasadit jako kontejner,
idealně pomocí orchestrátoru jako např. [kubernetes](https://kubernetes.io/).

## local dev

Pro lokalni devel je uzitecne mit mock auth service.
Pro zapnuti je nutne nastavit SESSION_MOCK a SESSION_SERVICE env vars.
Pak je dobre nechat express servirovat staticke soubory.

Tedy spusteni Napr.:
```
SERVE_STATIC=1 \
SESSION_MOCK=3333 \
SESSION_SERVICE=http://localhost:3333 \
npm run startdbg
```
