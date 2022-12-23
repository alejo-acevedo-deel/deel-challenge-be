const { Router } = require('express');
const AdminRouter = require('./admin');
const BalanceRouter = require('./balance');
const ContractRouter = require('./contract');
const JobRouter = require('./job');
const { getProfile } = require('../middlewares/getProfile');

const router = Router();

router.use('/admin', AdminRouter);
router.use('/balances', getProfile, BalanceRouter);
router.use('/contracts', getProfile, ContractRouter);
router.use('/jobs', getProfile, JobRouter);

module.exports = router