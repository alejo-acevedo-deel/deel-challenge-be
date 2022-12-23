const { faker } = require('@faker-js/faker');

const generateJob = (ContractId, overrides = {}) => ({
  description: faker.lorem.sentence(),
  price: faker.datatype.number({ min: 1, max: 1000 }),
  paid: faker.datatype.boolean(),
  paymentDate: faker.date.recent(),
  ContractId,
  ...overrides,
});

module.exports = { generateJob };