# Como foi a experiência no decorrer de todo o processo de desenvolvimento?
# Quais foram as principais decisões tomadas?
# Como foi organizado o projeto em termos de estrutura de pastas e arquivos?

# Instruções de como rodar o projeto.

Assumindo que o docker e o npm, na versão 20.*, estejam instalados, siga os passos abaixo:

```bash
$ git clone git@github.com:caiogmrocha/dolado-tech-challenge.git

$ cd dolado-tech-challenge

$ npm install

$ cp .env.example .env

$ docker build -f docker/dockerfiles/Dockerfile.api .

$ docker compose up --build -d
```
