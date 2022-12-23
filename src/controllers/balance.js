const { makeDeposit } = require("../services/balance");

const deposit = async (req, res) => {
  const profile = req.app.get("profile");
  const userId = Number(req.params.userId);
  const amount = Number(req.body.amount);

  const { status, response } = await makeDeposit(profile, userId, amount);

  res.status(status).json(response);
};

module.exports = { deposit };
