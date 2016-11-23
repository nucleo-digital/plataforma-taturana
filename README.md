# taturana-filmes

## Rodando o site com o container docker

As versões em produção são muito velhas, então, para rodar com as mesmas versões:

```
$ cd <plataforma-taturana>/docker
$ ./docker_build
$ ./docker_run
$ docker exec -ti taturana bash
```

Agora você deve estar logado dentro do container, instale o meteor & cia:

```
$ cd ~/plataforma-taturana
$ curl https://install.meteor.com/ | sh
$ npm install mup@0.11.3
$ meteor  # vai instalar as deps
```
O container pode ser logado via `docker exec -ti taturana bash` a qualquer momento depois do docker run.
Você deve ser capaz de rodar o site com `meteor` de dentro do container e acessar em `http://localhost:3050`


## Para importar os filme de exemplo
```mongoimport -h localhost:3001 --db meteor --collection films --type json --file taturana-films.json```

## Para restaurar o banco de prod localmente

```
prod ~ $ mongodump --db taturanamobi --out taturana-$(date +%Y%m%d).json
prod ~ $ ls -1 |grep tatuarna-
prod ~ $ exit
local ~/plataforma-taturana $ scp -r prod:~/taturana-<data>.json .
local ~/plataforma-taturana $ mongorestore -h localhost:3001 -d meteor taturana-<data>.json/taturanamobi --drop