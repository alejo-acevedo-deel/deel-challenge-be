const { getUnpaidJobsByProfile, makePayment } = require('../services/job');

const getUnpaidJobs = async (req, res) => {
  const profile = req.app.get("profile");

  const { status, response } = await getUnpaidJobsByProfile(profile.id);

  res.status(status).json(response);
};

const payJob = async (req, res) => {
  const profile = req.app.get("profile");
  const jobId = Number(req.params.job_id);

  const { status, response } = await makePayment(jobId, profile);

  res.status(status).json(response);
};


module.exports = { getUnpaidJobs, payJob };
