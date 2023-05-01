const { Repository } = require('@herbsjs/herbs2knex');
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../../domain/entities/transaction');
const connection = require('../database/connection');

class TransactionRepository extends Repository {
  constructor(injection) {
    super({
      entity: Transaction,
      table: 'transactions',
      knex: connection
    });
  }

  getSaldos(userId) {
    return this.knex('transactions as t')
      .sum('ammount as sum')
      .join('accounts as acc', 'acc.id', '=', 't.acc_id')
      .where({ user_id: userId, status: true })
      .where('date', '<=', new Date())
      .select('acc.id')
      .groupBy('acc.id')
      .orderBy('acc.id');
  }

  getTransactionByIdAndUserId(id, userId) {
    return this.knex('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where('accounts.user_id', '=', userId)
      .andWhere('transactions.id', '=', id)
      .select({
        id: 'transactions.id',
        ammount: 'transactions.ammount',
        description: 'transactions.description',
        account_name: 'accounts.name',
        status: 'transactions.status',
        type: 'transactions.type'
      });
  }

  getAllByUserId(userId) {
    return this.knex('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where('accounts.user_id', '=', userId)
      .select({
        id: 'transactions.id',
        ammount: 'transactions.ammount',
        description: 'transactions.description',
        account_name: 'accounts.name',
        status: 'transactions.status',
        type: 'transactions.type'
      });
  }
}

module.exports = herbarium.repositories
  .add(TransactionRepository, 'TransactionRepository')
  .metadata({ entity: Transaction })
  .repository;
