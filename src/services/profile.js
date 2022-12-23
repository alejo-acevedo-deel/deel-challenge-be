const Profile = require("../db/model/profile")

const queryBestProfession = async (since, to) => {
  try {
    const queryResult = await Profile.getBestProfession(since, to);

    if (!queryResult || queryResult.length === 0) {
      return {
        status: 404,
        response: {
          message: "No results found",
        },
      };
    }

    return { status: 200, response: queryResult[0] };
  } catch (error) {
    return { status: 500, response: { message: error.message || "Internal server error" } };
  }
}

const queryBestClients = async (since, to, limit = 2) => {
  try {
    const queryResult = await Profile.getBestClients(since, to, limit);

    if (!queryResult || queryResult.length === 0) {
      return {
        status: 404,
        response: {
          message: "No results found",
        },
      };
    }

    return { status: 200, response: queryResult };
  } catch (error) {
    return { status: 500, response: { message: error.message || "Internal server error" } };
  }
}

const executeTransfer = async (fromId, toId, amount, transactionOption) => {
  const from = await Profile.getById(fromId, transactionOption);
  const to = await Profile.getById(toId, transactionOption);

  if (!from || !to) {
    throw new Error('Profile not found');
  }

  if (from.balance < amount) {
    throw new Error('Insufficient funds');
  }

  await from.sendPayment(amount, transactionOption);
  await to.receivePayment(amount, transactionOption);
}

module.exports = { queryBestProfession, queryBestClients, executeTransfer };
