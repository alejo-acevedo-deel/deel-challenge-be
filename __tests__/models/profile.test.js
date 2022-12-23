const { Job, Contract, Profile } = require('../../src/db');
const { generateJob } = require('../utils/job');
const { generateProfile } = require('../utils/profile');
const { generateContract } = require('../utils/contract');

describe('Profile model', () => {
  beforeAll(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });
  });

  describe('getBestClients', () => {
    let contractor;
    let harryPotterClient;
    let pepeBotellaClient;
    let srBurnsClient;
    let harryPotterContract;
    let pepeBotellaContract;
    let srBurnsContract;
    let harryPotterPaidJob;
    let pepeBotellaPaidJob;
    let srBurnsPaidJob;
    let harryPotterUnpaidJob;
    let pepeBotellaUnpaidJob;
    let srBurnsUnpaidJob;
    let harryPotterPaidJob2;
    let pepeBotellaPaidJob2;
    let sumHarryPotterPaidJob;
    let sumPepeBotellaPaidJob;
    let sumSrBurnsPaidJob;

    const OneMonth = 1000 * 60 * 60 * 24 * 30;
    const TwoMonth = 1000 * 60 * 60 * 24 * 60;
    const OneDay = 1000 * 60 * 60 * 24;
    const onDate = new Date();
    const beforeDate = new Date(onDate.getTime() - OneMonth);
    const outOfDate = new Date(onDate.getTime() - TwoMonth);
    const tomorrow = new Date(onDate.getTime() + OneDay);

    beforeAll(async () => {
      contractor = await Profile.create(generateProfile({ type: 'contractor' }));
      harryPotterClient = await Profile.create(generateProfile({ type: 'client', firstName: 'Harry', lastName: 'Potter' }));
      pepeBotellaClient = await Profile.create(generateProfile({ type: 'client', firstName: 'Pepe', lastName: 'Botella' }));
      srBurnsClient = await Profile.create(generateProfile({ type: 'client', firstName: 'Sr', lastName: 'Burns' }));
      harryPotterContract = await Contract.create(generateContract({ ClientId: harryPotterClient.id, ContractorId: contractor.id }));
      pepeBotellaContract = await Contract.create(generateContract({ ClientId: pepeBotellaClient.id, ContractorId: contractor.id }));
      srBurnsContract = await Contract.create(generateContract({ ClientId: srBurnsClient.id, ContractorId: contractor.id }));
      harryPotterPaidJob = await Job.create(generateJob(harryPotterContract.id, { paid: true, price: 5, paymentDate: onDate }));
      pepeBotellaPaidJob = await Job.create(generateJob(pepeBotellaContract.id, { paid: true, price: 10, paymentDate: onDate }));
      srBurnsPaidJob = await Job.create(generateJob(srBurnsContract.id, { paid: true, price: 1, paymentDate: onDate }));
      harryPotterUnpaidJob = await Job.create(generateJob(harryPotterContract.id, { paid: false, price: 5, paymentDate: onDate }));
      pepeBotellaUnpaidJob = await Job.create(generateJob(pepeBotellaContract.id, { paid: false, price: 10, paymentDate: onDate }));
      srBurnsUnpaidJob = await Job.create(generateJob(srBurnsContract.id, { paid: false, price: 10000000, paymentDate: onDate }));
      harryPotterPaidJob2 = await Job.create(generateJob(harryPotterContract.id, { paid: true, price: 5100, paymentDate: onDate }));
      pepeBotellaPaidJob2 = await Job.create(generateJob(pepeBotellaContract.id, { paid: true, price: 1000, paymentDate: outOfDate }));
      sumHarryPotterPaidJob = harryPotterPaidJob.price + harryPotterPaidJob2.price;
      sumPepeBotellaPaidJob = pepeBotellaPaidJob.price
      sumSrBurnsPaidJob = srBurnsPaidJob.price;
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

    it('by default return all clients', async () => {
      const result = await Profile.getBestClients(beforeDate, tomorrow);
      expect(result.length).toEqual(3);
    });

    it('with limit return limit', async () => {
      const result = await Profile.getBestClients(beforeDate, tomorrow, 2);
      expect(result.length).toEqual(2);
    });

    it('first is harry potter', async () => {
      const result = await Profile.getBestClients(beforeDate, tomorrow);
      expect(result[0].toJSON().fullName).toEqual(`${harryPotterClient.firstName} ${harryPotterClient.lastName}`);
    });

    it('first is correct sum of harry potter', async () => {
      const result = await Profile.getBestClients(beforeDate, tomorrow);
      expect(result[0].toJSON().paid).toEqual(sumHarryPotterPaidJob);
    });

    it('second is pepe botella', async () => {
      const result = await Profile.getBestClients(beforeDate, tomorrow);
      expect(result[1].toJSON().fullName).toEqual(`${pepeBotellaClient.firstName} ${pepeBotellaClient.lastName}`);
    });

    it('second is correct sum of pepe botella', async () => {
      const result = await Profile.getBestClients(beforeDate, tomorrow);
      expect(result[1].toJSON().paid).toEqual(sumPepeBotellaPaidJob);
    });
  });

  describe('getBestProfession', () => {

    let client;
    let musician;
    let firstProgrammer;
    let secondProgrammer;
    let contractFirstProgrammer;
    let contractSecondProgrammer;
    let contractMusician;
    let firstProgrammerPaidJob;
    let firstProgrammerAnotherPaidJob;
    let secondProgrammerPaidJob;
    let musicianPaidJob;
    let firstProgrammerUnpaidJob;
    let musicianUnpaidJob;
    let programmerJobsSum;
    let musicianOutOfDateJob;
    const OneMonth = 1000 * 60 * 60 * 24 * 30;
    const TwoMonth = 1000 * 60 * 60 * 24 * 60;
    const OneDay = 1000 * 60 * 60 * 24;
    const onDate = new Date();
    const beforeDate = new Date(onDate.getTime() - OneMonth);
    const outOfDate = new Date(onDate.getTime() - TwoMonth);
    const tomorrow = new Date(onDate.getTime() + OneDay);



    beforeAll(async () => {
      client = await Profile.create(generateProfile({ type: 'client' }));
      musician = await Profile.create(generateProfile({ type: 'contractor', profession: 'musician' }));
      firstProgrammer = await Profile.create(generateProfile({ type: 'contractor', profession: 'programmer' }));
      secondProgrammer = await Profile.create(generateProfile({ type: 'contractor', profession: 'programmer' }));
      contractFirstProgrammer = await Contract.create(generateContract({ ClientId: client.id, ContractorId: firstProgrammer.id }));
      contractSecondProgrammer = await Contract.create(generateContract({ ClientId: client.id, ContractorId: secondProgrammer.id }));
      contractMusician = await Contract.create(generateContract({ ClientId: client.id, ContractorId: musician.id }));
      firstProgrammerPaidJob = await Job.create(generateJob(contractFirstProgrammer.id, { paid: true, price: 5, paymentDate: onDate }));
      firstProgrammerAnotherPaidJob = await Job.create(generateJob(contractFirstProgrammer.id, { paid: true, price: 5, paymentDate: onDate }));
      secondProgrammerPaidJob = await Job.create(generateJob(contractSecondProgrammer.id, { paid: true, price: 5, paymentDate: onDate }));
      musicianPaidJob = await Job.create(generateJob(contractMusician.id, { paid: true, price: 7, paymentDate: onDate }));
      firstProgrammerUnpaidJob = await Job.create(generateJob(contractFirstProgrammer.id, { paid: false, paymentDate: onDate }));
      musicianUnpaidJob = await Job.create(generateJob(contractMusician.id, { paid: false, price: 1000000000, paymentDate: onDate }));
      musicianOutOfDateJob = await Job.create(generateJob(contractMusician.id, { paid: true, price: 1000000000, paymentDate: outOfDate }));
      programmerJobsSum = firstProgrammerPaidJob.price + firstProgrammerAnotherPaidJob.price + secondProgrammerPaidJob.price;
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


    it('should get the sum of paid programmers job', async () => {
      const result = await Profile.getBestProfession(beforeDate, tomorrow);
      expect(result[0].toJSON().total).toEqual(programmerJobsSum);
    });

    it('should get programmer profession', async () => {
      const result = await Profile.getBestProfession(beforeDate, tomorrow);
      expect(result[0].profession).toEqual('programmer');
    });
  });
});
