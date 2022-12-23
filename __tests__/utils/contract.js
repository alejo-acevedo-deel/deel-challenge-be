const { faker } = require('@faker-js/faker');

const generateContract = (overrides = {}) => ({
  terms: faker.lorem.lines(),
  status: faker.helpers.arrayElement(['new', 'in_progress', 'completed']),
  ...overrides,
});

module.exports = { generateContract };
