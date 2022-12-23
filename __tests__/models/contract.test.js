const { Job, Contract, Profile } = require('../../src/db');
const { generateJob } = require('../utils/job');
const { generateProfile } = require('../utils/profile');
const { generateContract } = require('../utils/contract');
const { ContractStatus } = require('../../src/constants/contract');

describe('Contract model', () => {
  let client;
  let contractor;
  let clientAttr;
  let contractorAttr;


  beforeAll(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });
  });

  describe('getNotTerminatedWithFilter', () => {
    let terminatedContract;
    let terminatedContractAttr;

    describe('when there are all terminated', () => {

      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        terminatedContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.TERMINATED });
        terminatedContract = await Contract.create(terminatedContractAttr);
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
        const contracts = await Contract.getNotTerminatedWithFilter();
        expect(contracts).toHaveLength(0);
      });
    });

    describe('when there is one new', () => {
      let newContract;
      let newContractAttr;
      let terminatedContract;
      let terminatedContractAttr;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        terminatedContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.TERMINATED });
        terminatedContract = await Contract.create(terminatedContractAttr);
        newContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.NEW });
        newContract = await Contract.create(newContractAttr);
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
        const contracts = await Contract.getNotTerminatedWithFilter();
        expect(contracts).toHaveLength(1);
      });

      it('should match attributes', async () => {
        const contracts = await Contract.getNotTerminatedWithFilter();
        expect(contracts[0]).toMatchObject(newContractAttr);
      });
    });

    describe('when there is one inprogress', () => {
      let inprogressContract;
      let inprogressContractAttr;
      let terminatedContract;
      let terminatedContractAttr;


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        terminatedContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.TERMINATED });
        terminatedContract = await Contract.create(terminatedContractAttr);
        inprogressContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.IN_PROGRESS });
        inprogressContract = await Contract.create(inprogressContractAttr);
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
        const contracts = await Contract.getNotTerminatedWithFilter();
        expect(contracts).toHaveLength(1);
      });

      it('should match attributes', async () => {
        const contracts = await Contract.getNotTerminatedWithFilter();
        expect(contracts[0]).toMatchObject(inprogressContractAttr);
      });
    });

    describe('when there is called with filters', () => {
      let newContract;
      let newContractAttr;
      let inprogressContract;
      let inprogressContractAttr;
      let terminatedContract;
      let terminatedContractAttr;
      const terms = 'test';


      beforeAll(async () => {
        clientAttr = generateProfile({ type: 'client' });
        client = await Profile.create(clientAttr);
        contractorAttr = generateProfile({ type: 'contractor' });
        contractor = await Profile.create(contractorAttr);
        terminatedContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.TERMINATED });
        terminatedContract = await Contract.create(terminatedContractAttr);
        inprogressContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.IN_PROGRESS });
        inprogressContract = await Contract.create(inprogressContractAttr);
        newContractAttr = generateContract({ ClientId: client.id, ContractorId: contractor.id, status: ContractStatus.NEW, terms });
        newContract = await Contract.create(newContractAttr);
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
        const contracts = await Contract.getNotTerminatedWithFilter({ where: { terms } });
        expect(contracts).toHaveLength(1);
      });

      it('should match attributes', async () => {
        const contracts = await Contract.getNotTerminatedWithFilter({ where: { terms } });
        expect(contracts[0]).toMatchObject(newContract.toJSON());
      });
    });
  });
});
