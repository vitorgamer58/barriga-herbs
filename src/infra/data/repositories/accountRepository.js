const { Repository } = require('@herbsjs/herbs2knex');
const { herbarium } = require('@herbsjs/herbarium');
const Account = require('../../../domain/entities/account');
const connection = require('../database/connection');

class AccountRepository extends Repository {
  constructor(injection) {
    super({
      entity: Account,
      table: 'accounts',
      knex: connection
    });
  }
}

module.exports = herbarium.repositories
  .add(AccountRepository, 'AccountRepository')
  .metadata({ entity: Account }).repository;
