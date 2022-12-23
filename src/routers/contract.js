const { Router } = require('express');
const { getContract, getNotTerminatedContracts } = require('../controllers/contract');

const router = Router();

router.get('/:id', getContract);
router.get('/', getNotTerminatedContracts);

module.exports = router;
