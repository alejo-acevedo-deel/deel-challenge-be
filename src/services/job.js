const Job = require("../db/model/job");
const Contract = require("../db/model/contract");

const { ContractStatus } = require('../constants/contract');
const { ProfileType } = require("../constants/profile");
const sequelize = require('../db/config');
const { executeTransfer } = require("./profile");
const { JobNotFoundError, ProfileIsNotClientError, ProfileIsNotJobClient, JobAlreadyPaidError } = require("../errors/job");

const getUnpaidJobsByProfile = async (profileId) => {
  const clientJob = Job.unpaidWithFilter({ include: { model: Contract, where: { ClientId: profileId, status: ContractStatus.IN_PROGRESS } } });
  const contractorJob = Job.unpaidWithFilter({ include: { model: Contract, where: { ContractorId: profileId, status: ContractStatus.IN_PROGRESS } } });

  const jobs = await Promise.all([clientJob, contractorJob]);

  console.log(jobs);

  return { status: 200, response: { result: jobs.flat() } };
};

const makePayment = async (jobId, profile) => {
  const t = await sequelize.transaction();
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE };
    const job = await Job.getById(jobId, transactionOption);

    if (!job) throw new JobNotFoundError('Job not found');
    if (profile.type !== ProfileType.CLIENT) throw new ProfileIsNotClientError('Profile is not client');
    if (job.Contract.ClientId !== profile.id) throw new ProfileIsNotJobClient('Profile is not job client');
    if (job.paid) throw new JobAlreadyPaidError('Job already paid');

    await executeTransfer(job.Contract.ClientId, job.Contract.ContractorId, job.price, transactionOption)

    await job.pay(transactionOption);
    await t.commit();

    return { status: 201, response: { result: job } };
  } catch (error) {
    t.rollback();
    return { status: erros.status || 500, response: { error: error.message || 'Internal server error' } };
  }
};



module.exports = { getUnpaidJobsByProfile, makePayment };
