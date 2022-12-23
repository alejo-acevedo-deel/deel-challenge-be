const { Job, Contract, Profile } = require('../../src/db');
const { generateJob } = require('../utils/job');
const { generateProfile } = require('../utils/profile');
const { generateContract } = require('../utils/contract');
const { makePayment } = require('../../src/services/job');

describe('job service', () => {
  let clientWithFunds;
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

    clientWithFunds = await Profile.create(generateProfile({ type: 'client', balance: 1000 }));
    clientWithoutFunds = await Profile.create(generateProfile({ type: 'client', balance: 10 }));
    firstContractor = await Profile.create(generateProfile({ type: 'contractor' }));
    secondContractor = await Profile.create(generateProfile({ type: 'contractor' }));
    aContract = await Contract.create(generateContract({ ClientId: clientWithFunds.id, ContractorId: firstContractor.id }));
    anotherContract = await Contract.create(generateContract({ ClientId: clientWithoutFunds.id, ContractorId: secondContractor.id }));
    aJobToPay = await Job.create(generateJob(aContract.id, { paid: false, price: 100 }));
    aJobInDebt = await Job.create(generateJob(anotherContract.id, { paid: false, price: 1000 }));
    aPaidJob = await Job.create(generateJob(aContract.id, { paid: true, price: 100 }));
  });

  describe('make payment', () => {
    describe('when profile is not client', () => {
      it('return error', async () => {
        const { response } = await makePayment(aJobToPay.id, firstContractor);

        expect(response.error).toBe('Profile is not client');
      });
    })

    describe('when profile is not client of the job', () => {
      it('return error', async () => {
        const { response } = await makePayment(aJobToPay.id, clientWithoutFunds);

        expect(response.error).toBe('Profile is not job client');
      });
    })

    describe('when job is paid', () => {
      it('return error', async () => {
        const { response } = await makePayment(aPaidJob.id, clientWithFunds);

        expect(response.error).toBe('Job already paid');
      });
    })

    describe('when client have not enough funds', () => {
      it('return error', async () => {
        const { response } = await makePayment(aJobInDebt.id, clientWithoutFunds);

        expect(response.error).toBe('Insufficient funds');
      });

      it('client balance not changed', async () => {
        await makePayment(aJobInDebt.id, clientWithoutFunds);

        const client = await Profile.findByPk(clientWithoutFunds.id);

        expect(client.balance).toBe(clientWithoutFunds.balance);
      });

      it('contractor balance not changed', async () => {
        await makePayment(aJobInDebt.id, clientWithoutFunds);

        const contractor = await Profile.findByPk(secondContractor.id);

        expect(contractor.balance).toBe(secondContractor.balance);
      });

      it('job not paid', async () => {
        await makePayment(aJobInDebt.id, clientWithoutFunds);

        const job = await Job.findByPk(aJobInDebt.id);

        expect(job.paid).toBe(false);
      });
    });

    describe('when payment is succesfull', () => {

      beforeEach(async () => {
        aJobToPay = await Job.create(generateJob(aContract.id, { paid: false, price: 100 }));
      });

      it('return job', async () => {
        const { status } = await makePayment(aJobToPay.id, clientWithFunds);

        expect(status).toEqual(201);
      });

      it('client balance changed', async () => {
        const balanceBefore = (await Profile.findByPk(clientWithFunds.id)).balance;

        const response = await makePayment(aJobToPay.id, clientWithFunds);

        console.log(response);

        const client = await Profile.findByPk(clientWithFunds.id);

        expect(client.balance).toBe(balanceBefore - aJobToPay.price);
      });

      it('contractor balance changed', async () => {
        const balanceBefore = (await Profile.findByPk(firstContractor.id)).balance;

        await makePayment(aJobToPay.id, clientWithFunds);

        const contractor = await Profile.findByPk(firstContractor.id);

        expect(contractor.balance).toBe(balanceBefore + aJobToPay.price);
      });

      it('job paid', async () => {
        await makePayment(aJobToPay.id, clientWithFunds);

        const job = await Job.findByPk(aJobToPay.id);

        expect(job.paid).toBe(true);
      });
    });
  })
});