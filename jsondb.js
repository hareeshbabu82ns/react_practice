/**
 * Created by hareesh on 11-04-2017.
 *
 * This file is to generate JSON DB using FAKER and LODASH
 * $ yarn add faker lodash
 *
 * This will be used as input for JSON-SERVER
 * $ npm install -g json-server
 * $ npm run json-server --port 3680 jsondb.js
 *
 * File Data
 * Todos
 * {
 *
 * }
 */

module.exports = function () {
    var faker = require('faker');
    var _ = require('lodash');

    return {
        users: _.times(5, function (n) {
            return {
                id: n + 1,
                title: faker.name.findName(),
                avatar: faker.internet.avatar(),
            }
        }),
        todos: _.times(10, function (n) {
            return {
                id: n + 1,
                title: faker.lorem.sentence(),
                due: (faker.random.number() % n == 0) ? faker.date.past() : faker.date.future(),
                completed: faker.random.boolean()
            }
        }),
        stocks: _.times(10, function (n) {
            return {
                id: n + 1,
                category: faker.commerce.department(),
                price: faker.commerce.price(),
                stocked: faker.random.boolean(),
                name: faker.commerce.productName()
            }
        })
    }
};