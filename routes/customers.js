import express from 'express';

import { signin, signup, monitorTicket, monitorTicketByCode } from '../controllers/customer.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/monitor/:value', monitorTicket);
router.post('/monitorbycode', monitorTicketByCode);

export default router;