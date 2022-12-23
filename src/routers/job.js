const { Router } = require('express');
const { payJob, getUnpaidJobs } = require('../controllers/job');

const router = Router();

router.get('/unpaid', getUnpaidJobs);
router.post('/:job_id/pay', payJob);

module.exports = router;
