# BBB-cms-api

Api pro editaci dat (__D__) a stylu pro [bbb-vue-web](https://github.com/vencax/bbb-vue-web) a generovani zakladnich souboru webu (ZS):
- index.html
- style.css
- vendor.js
- routes.json

## Predpoklady

Predpoklada se pouziti reverse proxy (napr. nginx), ktera:
- nejlepe serviruje staticke soubory __D__
- caching generovanych souboru (ZS, [viz. routes.js](./routes.js))

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES, jsou samovysvětlující:
- PORT: default 3000
- HOST: default 127.0.0.1
- DATA_FOLDER: default ./data - slozka s podslozkami (pojmenovanymi domenami) obsahujicimi data webu (__D__). 
Mozno pripojit do adresare weby pomoci submodulu z externich git repositaru (backup, history).

[Dockerfile](Dockerfile) umožňuje nasadit jako kontejner,
idealně pomocí orchestrátoru jako např. [kubernetes](https://kubernetes.io/).