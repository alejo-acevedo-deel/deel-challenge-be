const { Job, Contract, Profile } = require('../../src/db');
const { generateJob } = require('../utils/job');
const { generateProfile } = require('../utils/profile');
const { generateContract } = require('../utils/contract');
const { makePayment } = require('../../src/services/job');
const { makeDeposit } = require('../../src/services/balance');

describe('balance service', () => {
  let clientWithoutDebt;
  let clientWithDebt;
  let clientWithoutFunds;
  let firstContractor;
  let secondContractor;
  let aContract;
  let anotherContract;
  let aJobToPay;
  let aJobInDebt;
  let aPaidJob;

  beforeAll(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    clientWithoutDebt = await Profile.create(generateProfile({ type: 'client', balance: 1000 }));
    clientWithDebt = await Profile.create(generateProfile({ type: 'client', balance: 1000 }));
    clientWithoutFunds = await Profile.create(generateProfile({ type: 'client', balance: 10 }));
    firstContractor = await Profile.create(generateProfile({ type: 'contractor', balance: 1000 }));
    secondContractor = await Profile.create(generateProfile({ type: 'contractor', balance: 1000 }));
    aContract = await Contract.create(generateContract({ ClientId: clientWithDebt.id, ContractorId: firstContractor.id }));
    anotherContract = await Contract.create(generateContract({ ClientId: clientWithoutFunds.id, ContractorId: secondContractor.id }));
    aJobToPay = await Job.create(generateJob(aContract.id, { paid: false, price: 100 }));
    aJobInDebt = await Job.create(generateJob(anotherContract.id, { paid: false, price: 1000 }));
    aPaidJob = await Job.create(generateJob(aContract.id, { paid: true, price: 100 }));
  });

  describe('make deposit', () => {
    describe('when profile have not debt', () => {
      it('return error', async () => {
        const { response } = await makeDeposit(clientWithoutDebt, firstContractor.id, 100);

        expect(response.error).toBe('Amount is bigger than debt ratio');
      });
    })

    describe('when deposit more than debt ratio', () => {
      it('return error', async () => {
        const { response } = await makeDeposit(clientWithDebt, firstContractor.id, 10000);

        expect(response.error).toBe('Amount is bigger than debt ratio');
      });
    })


    describe('when profile have not enough funds', () => {
      it('return error', async () => {
        const { response } = await makeDeposit(firstContractor, secondContractor.id, 100000);

        expect(response.error).toBe('Insufficient funds');
      });

      it('from balance not changed', async () => {
        const { response } = await makeDeposit(firstContractor, secondContractor.id, 100000);

        const client = await Profile.findByPk(firstContractor.id);

        expect(client.balance).toBe(firstContractor.balance);
      });

      it('to balance not changed', async () => {
        const { response } = await makeDeposit(firstContractor, secondContractor.id, 100000);

        const contractor = await Profile.findByPk(secondContractor.id);

        expect(contractor.balance).toBe(secondContractor.balance);
      });
    });

    describe('when client deposit is succesfull', () => {
      const depositAmount = 10;
      it('return status', async () => {
        const { status } = await makeDeposit(clientWithDebt, secondContractor.id, depositAmount);

        expect(status).toBe(201);
      });

      it('from balance changed', async () => {
        const balanceBefore = (await Profile.findByPk(clientWithDebt.id)).balance;
        const { response } = await makeDeposit(clientWithDebt, secondContractor.id, depositAmount);

        const client = await Profile.findByPk(clientWithDebt.id);

        expect(client.balance).toBe(balanceBefore - depositAmount);
      });

      it('to balance changed', async () => {
        const balanceBefore = (await Profile.findByPk(secondContractor.id)).balance;
        const { response } = await makeDeposit(clientWithDebt, secondContractor.id, depositAmount);

        const contractor = await Profile.findByPk(secondContractor.id);

        expect(contractor.balance).toBe(balanceBefore + depositAmount);
      });
    });
  })
});