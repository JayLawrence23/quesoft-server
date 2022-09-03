import express from 'express';

import { signin, signup, monitorTicket, monitorTicketByCode, otpauth, signTicket } from '../controllers/customer.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/otpauth', otpauth);
router.post('/monitor/:value', monitorTicket);
router.post('/signticket', signTicket);
router.post('/monitorbycode', monitorTicketByCode);

export default router;