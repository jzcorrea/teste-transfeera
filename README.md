# Teste Transfeera
Teste para vaga de Full Stack Developer.

## Tecnologias
- Front-End: Ember JS;
- Back-End: Express JS;
- Database: MongoDB;
- Tests: Jest

## Requisitos
- Node v12.18.3 ou superior;
- nodemon 4.4 ou superior;
- ember-cli 3.16.2 (global);
- MongoDB 4.4.0.

## Configurações iniciais:
Dentro da pasta do projeto:
1. `node api/scripts/populate.js` para gerar os 30 registros iniciais;
2. `cd api && npm i`;
3. `cd web && npm i`.

## Para inicializar a aplicação:
1. `cd api && npm start`;
2. `cd web && npm start`;
3. Acessar `localhost:4200/`.

## Para executar os testes unitários:
1. `cd api && npm test`.

## Para executar os testes de integração:
1. `cd api && npm run e2e`.

Muito obrigado!
