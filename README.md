# BBB-cms-api

Api pro editaci dat a stylu pro [bbb-vue-web](https://github.com/vencax/bbb-vue-web).

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES, jsou samovysvětlující:
- PORT=30011
- HOST=0.0.0.0
- WEB_FOLDER=./web - slozka s vlastnim webem. Mozno pripojit do adresare web pomoci submodulu.

[Dockerfile](Dockerfile) umožňuje nasadit jako kontejner,
idealně pomocí orchestrátoru jako např. [kubernetes](https://kubernetes.io/).

### Debugging v minikube clusteru

Hezká věc je debugging kodu běžícího v podu v rámci lokálního [minikube](https://github.com/kubernetes/minikube).
K tomu je zapotřebí [vydeployovat kod do minikube clusteru](https://medium.com/swlh/how-to-run-locally-built-docker-images-in-kubernetes-b28fbc32cc1d).
Finálním krokem v tomto procesu je build:
```
eval $(minikube -p minikube docker-env)
docker build . -f dev/Dockerfile -t modularniurad/web
kubectl apply -f dev/pod.yaml
```

Pak minikube zařídí běh podu s vybuildovaným image kde, krom vlastního kodu
poslouchá node remote debugger na portu 9229.
Napojit se na něj lze po portforwardu tohoto portu 9229 z podu na host mašinu:
```
kubectl port-forward modularniurad-admin 9229:9229
```
Kde už se na něj napojíte např. z VSCode.
