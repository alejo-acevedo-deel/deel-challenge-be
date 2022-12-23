const { Router } = require('express');
const { deposit } = require('../controllers/balance');

const router = Router();

router.post('/deposit/:userId', deposit);

module.exports = router;
