const { faker } = require('@faker-js/faker');

const generateProfile = (overrides = {}) => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  profession: faker.company.name(),
  balance: faker.datatype.number({ min: 1, max: 1000 }),
  type: faker.datatype.boolean() ? 'client' : 'contractor',
  ...overrides
});

module.exports = { generateProfile };