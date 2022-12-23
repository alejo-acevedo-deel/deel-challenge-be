const Contract = require("../db/model/contract")


const getContractOfProfileById = async (id, profile) => {
  const contract = await Contract.findById(id);

  if (!contract) return { status: 404, response: { error: 'Contract not found' } };

  if (!contract.isContractor(profile) && !contract.isClient(profile)) return { status: 401, response: { error: 'Unauthorized' } };

  return { status: 200, response: { result: contract } };
}

const getNotTerminatedByProfile = async (profile) => {
  const clientContract = Contract.getNotTerminatedWithFilter({ where: { ClientId: profile.id } });
  const contractorContract = Contract.getNotTerminatedWithFilter({ where: { ContractorId: profile.id } });

  const contracts = await Promise.all([clientContract, contractorContract]);

  return { status: 200, response: { result: contracts.flat() } };
}

module.exports = { getContractOfProfileById, getNotTerminatedByProfile };
