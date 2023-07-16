# Projeto Barriga-Herbs

O Barriga-Herbs é um projeto de gerenciamento de transações financeiras. Ele oferece recursos de entrada e saída de dinheiro, além de funcionalidades de cadastro e login. Esse projeto utiliza a autenticação Bearer JWT e é compatível com Node 18.x.
## Pré-requisitos

- Node.js 18.x

## Rodando o Projeto

Você pode iniciar o projeto rodando o seguinte comando:

```
npm run start
```

Após o início do servidor, você pode acessar a documentação dos casos de uso em http://localhost:3000/.

## Métodos da API

### Autenticação e Usuários

- `POST /signin` - Autenticação de usuário
- `POST /signup` - Cadastro de usuário
- `GET /v1/users` - Obter todos os usuários
- `POST /v1/users` - Criar um novo usuário

### Contas

- `GET /v1/accounts` - Obter todas as contas
- `POST /v1/accounts` - Criar uma nova conta
- `GET /v1/accounts/:id` - Obter detalhes de uma conta
- `PUT /v1/accounts/:id` - Atualizar uma conta
- `DELETE /v1/accounts/:id` - Excluir uma conta

### Transações

- `GET /v1/transactions` - Obter todas as transações
- `POST /v1/transactions` - Criar uma nova transação
- `GET /v1/transactions/:id` - Obter detalhes de uma transação
- `PUT /v1/transactions/:id` - Atualizar uma transação
- `DELETE /v1/transactions/:id` - Excluir uma transação

### Saldo

- `GET /v1/balance` - Obter o saldo do usuário

## Sobre o Herbs.js

Este projeto foi construído utilizando a biblioteca Herbs.js, que é uma biblioteca de código aberto para aplicações backend, que permite a construção mais rápida e à prova do futuro dos seus microsserviços em Node.js. Para saber mais sobre o Herbs.js, confira a documentação oficial [aqui](https://herbsjs.org/).
