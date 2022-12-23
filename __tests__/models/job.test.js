const { Job, Contract, Profile } = require('../../src/db');
const { generateJob } = require('../utils/job');
const { generateProfile } = require('../utils/profile');
const { generateContract } = require('../utils/contract');

describe('Job model', () => {
  let client;
  let contractor;
  let clientAttr;
  let contractorAttr;
  let contract;
  let contractAttr;

  beforeAll(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });
  });

  describe('unpaidWithFilter', () => {

    describe('when there is no unpaid', () => {
      let unpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        paidJob = await Job.create(generateJob(contract.id, { paid: true }));
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should get no one', async () => {
        const jobs = await Job.unpaidWithFilter();
        expect(jobs).toHaveLength(0);
      });
    });

    describe('when there is one unpaid', () => {
      let unpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        unpaidJob = await Job.create(generateJob(contract.id, { paid: false }));
        paidJob = await Job.create(generateJob(contract.id, { paid: true }));
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should get only one', async () => {
        const jobs = await Job.unpaidWithFilter();
        expect(jobs).toHaveLength(1);
      });

      it('should match attributes', async () => {
        const jobs = await Job.unpaidWithFilter();
        expect(jobs[0]).toMatchObject(unpaidJob.toJSON());
      });
    });

    describe('when there is called with filters', () => {
      let unpaidJob;
      let anotherUnpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        unpaidJob = await Job.create(generateJob(contract.id, { paid: false, description: 'unpaid' }));
        anotherUnpaidJob = await Job.create(generateJob(contract.id, { paid: false }));
        paidJob = await Job.create(generateJob(contract.id, { paid: true }));
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should get only one', async () => {
        const jobs = await Job.unpaidWithFilter({ where: { description: 'unpaid' } });
        expect(jobs).toHaveLength(1);
      });

      it('should match attributes', async () => {
        const jobs = await Job.unpaidWithFilter({ where: { description: 'unpaid' } });
        expect(jobs[0]).toMatchObject(unpaidJob.toJSON());
      });
    });
  });

  describe('getClientDebt', () => {

    describe('when there is no unpaid', () => {
      let unpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        paidJob = await Job.create(generateJob(contract.id, { paid: true }));
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should get null', async () => {
        const debt = await Job.getClientDebt(client.id);
        expect(debt).toEqual(null);
      });
    });

    describe('when there is one unpaid', () => {
      let unpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        unpaidJob = await Job.create(generateJob(contract.id, { paid: false }));
        paidJob = await Job.create(generateJob(contract.id, { paid: true }));
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should get the price as debt', async () => {
        const debt = await Job.getClientDebt(client.id);
        expect(debt).toEqual(unpaidJob.price);
      });
    });

    describe('when there is many unpaid', () => {
      let unpaidJob;
      let anotherUnpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        unpaidJob = await Job.create(generateJob(contract.id, { paid: false, description: 'unpaid' }));
        anotherUnpaidJob = await Job.create(generateJob(contract.id, { paid: false }));
        paidJob = await Job.create(generateJob(contract.id, { paid: true }));
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should get the sum of prices as debt', async () => {
        const debt = await Job.getClientDebt(client.id);
        expect(debt).toEqual(unpaidJob.price + anotherUnpaidJob.price);
      });
    });
  });
  describe('pay', () => {

    describe('when there is unpaid', () => {
      let unpaidJob;
      let paidJob;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        contractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id });
        contract = await Contract.create(contractAttr);
        unpaidJob = await Job.create(generateJob(contract.id, { paid: false, paymentDate: null }));
        await unpaidJob.pay({});
        await unpaidJob.reload();
      });

      afterAll(async () => {
        await Profile.destroy({
          where: {}, truncate: true
        });
        await Contract.destroy({
          where: {}, truncate: true
        });
        await Job.destroy({
          where: {}, truncate: true
        });
      });


      it('should paid set tu true', async () => {
        expect(unpaidJob.paid).toEqual(true);
      });

      it('should paynmentDate setted', async () => {
        expect(unpaidJob.paymentDate).not.toEqual(null);
      });
    });
  });
});
