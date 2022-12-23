const { DEBT_RATIO } = require("../constants/job");
const Job = require("../db/model/job");
const sequelize = require('../db/config');
const { executeTransfer } = require("./profile");
const { ProfileType } = require("../constants/profile");
const { SelfDepositError, AmountBiggerThanRatioError } = require("../errors/balance");


const makeDeposit = async (profile, toId, amount) => {
  const t = await sequelize.transaction();
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE };

    if (profile.type === ProfileType.CLIENT) {
      const debt = await Job.getClientDebt(profile.id, transactionOption);
      if (debt * DEBT_RATIO < amount) throw new AmountBiggerThanRatioError('Amount is bigger than debt ratio');
    }
    if (profile.id === toId) throw new SelfDepositError('Cannot deposit to yourself');

    await executeTransfer(profile.id, toId, amount, transactionOption);
    await t.commit();

    const result = await profile.reload();

    return { status: 201, response: { result } };
  } catch (error) {
    t.rollback();
    return { status: error.status || 500, response: { error: error.message || 'Internal server error' } };
  }
};

module.exports = { makeDeposit };
