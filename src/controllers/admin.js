const { queryBestClients, queryBestProfession } = require("../services/profile");

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  const since = new Date(Number(start));
  const to = new Date(Number(end));

  const { status, response } = await queryBestProfession(since, to)
  res.status(status).json(response);
};

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query;

  const since = new Date(Number(start));
  const to = new Date(Number(end));

  const { status, response } = await queryBestClients(since, to, limit)
  res.status(status).json(response);
};

module.exports = { getBestClients, getBestProfession };