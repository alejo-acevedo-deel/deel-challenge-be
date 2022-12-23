const { getContractOfProfileById, getNotTerminatedByProfile } = require("../services/contract");

const getContract = async (req, res) => {
  const profile = req.app.get("profile");
  const contractId = Number(req.params.id);

  const { status, response } = await getContractOfProfileById(contractId, profile);

  res.status(status).json(response);
};

const getNotTerminatedContracts = async (req, res) => {
  const profile = req.app.get("profile");

  const { status, response } = await getNotTerminatedByProfile(profile);

  res.status(status).json(response);
};

module.exports = { getContract, getNotTerminatedContracts };
