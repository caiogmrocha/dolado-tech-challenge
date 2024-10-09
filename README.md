# Como foi a experiência no decorrer de todo o processo de desenvolvimento?

A experiência foi muito boa. O desafio proposto foi interessante e me permitiu aplicar e aprimorar conhecimentos com o framework NestJS, especificamente em relação a testes de integração e a utilização de Docker para auxiliar no desenvolvimento de uma aplicação NestJS.

Além disso, foi possível me atualizar em relação ao TypeORM, à qual não utilizava devido a utilização de outras ferramentas de acesso a banco de dados, como o Knex e Prisma.

Apesar de ter tido dificuldades em relação à criação da action de deploy na AWS, tive a oportunidade de relembrar conceitos de CI/CD com Github Actions, os quais vim utilizar em ambientes de implantação somente no ecossistema da Atlassian, com o BitBucket. Inclusive, pude aprender um pouco mais sobre a AWS EC2.

# Quais foram as principais decisões tomadas?

## 1. Arquitetura da aplicação

A arquitetura da aplicação foi baseada nos princípios do SOLID e da Clean Architecture, pensando em uma aplicação escalável, de fácil manutenção e que idealmente possa ser testada de forma simples e eficaz.

## 2. Modelagem do banco de dados

Inicialmente, a modelagem do banco de dados foi pensada de forma simples, tendo somente uma tabela para armazenar somente as informações das anotações de filmes. No entanto, antes de iniciar a melhoria no endpoint `GET /movie-reviews` para aceitar paginação, filtragem e ordenação, percebi que a modelagem do banco de dados não estava adequada para suportar essas funcionalidades.

Dessa forma, decidi modelar o banco de dados de forma mais conveniente para suportar essas funcionalidades. Onde por fim, temos as tabelas `movies`, `authors`, `movies_authors` e `movie_reviews`.

# Como foi organizado o projeto em termos de estrutura de pastas e arquivos?

A estrutura do projeto foi organizada de forma a seguir os princípios da Clean Architecture, onde temos as seguintes camadas:

- `src/domain`: contém as entidades de domínio da aplicação.
- `src/app`: contém os casos de uso da aplicação e as interfaces que devem ser implementadas pelas camadas de infraestrutura.
  - `src/app/services`: contém os serviços da aplicação. Esses serviços são responsáveis por implementar as regras de negócio da aplicação, i.e., os casos de uso.
  - `src/app/interfaces`: contém as interfaces que devem ser implementadas pelas camadas de infraestrutura.
    - `src/app/interfaces/repositories`: contém as interfaces dos repositórios da aplicação.
    - `src/app/interfaces/api`: contém as interfaces dos serviços de terceiros que a aplicação consome.
- `src/infra`: contém as implementações das interfaces definidas na camada de aplicação.
- `src/presentation`: contém os controladores da aplicação.
  - `src/presentation/http`: contém os controladores HTTP e DTOs da aplicação.
- `src/main`: contém os módulos da aplicação e o arquivo de inicialização da aplicação.

# Instruções de como rodar o projeto.

## Execução da aplicação

Assumindo que o docker e o npm, na versão 20.*, estejam instalados, siga os passos abaixo:

```bash
$ git clone git@github.com:caiogmrocha/dolado-tech-challenge.git

$ cd dolado-tech-challenge

$ npm install

$ cp .env.example .env

$ docker build -f docker/dockerfiles/Dockerfile.api .

$ docker compose up --build -d
```

## Execução dos testes unitários

```bash
$ npm run test
```

## Execução dos testes de integração

Vale ressaltar que os testes de integração dependem da execução do service `dolado-mysql` do `docker-compose.yml`.

```bash
$ npm run test:e2e
```
