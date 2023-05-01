const Transaction = require('../../entities/transaction')
const findTransaction = require('./findTransaction')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findTransactionSpec = spec({

    usecase: findTransaction,
  
    'Find a transaction when it exists': scenario({
      'Given an existing transaction': given({
        request: {
            id: 'a text'
        },
        user: { hasAccess: true },
        injection: {
            TransactionRepository: class TransactionRepository {
              async findByID(id) { 
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

      'Must return a valid transaction': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
      })

    }),

    'Do not find a transaction when it does not exist': scenario({
        'Given an empty transaction repository': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection:{
              TransactionRepository: class TransactionRepository {
                async findByID(id) { return [] }
              }
            },
          }),
    
          // when: default when for use case
    
          'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isNotFoundError)  
          }),
    }),
  })
  
module.exports =
  herbarium.specs
    .add(findTransactionSpec, 'FindTransactionSpec')
    .metadata({ usecase: 'FindTransaction' })
    .spec