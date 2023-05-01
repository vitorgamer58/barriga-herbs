const Transaction = require('../../entities/transaction')
const findAllTransaction = require('./findAllTransaction')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllTransactionSpec = spec({

    usecase: findAllTransaction,
  
    'Find all transactions': scenario({
      'Given an existing transaction': given({
        request: { limit: 0, offset: 0 },
        user: { hasAccess: true },
        injection: {
            TransactionRepository: class TransactionRepository {
              async findAll(id) { 
                  const fakeTransaction = {
                    id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
                  }
                  return ([Transaction.fromJSON(fakeTransaction)]) 
              }
            }
          },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a list of transactions': check((ctx) => {
        assert.strictEqual(ctx.response.ok.length, 1)
      })

    }),

  })
  
module.exports =
  herbarium.specs
    .add(findAllTransactionSpec, 'FindAllTransactionSpec')
    .metadata({ usecase: 'FindAllTransaction' })
    .spec