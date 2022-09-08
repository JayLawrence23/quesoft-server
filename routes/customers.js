import express from 'express';

import { signin, signup, monitorTicket, monitorTicketByCode, otpauth, signTicket, updateCustomer } from '../controllers/customer.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/otpauth', otpauth);
router.post('/monitor/:value', monitorTicket);
router.post('/signticket', signTicket);
router.post('/monitorbycode', monitorTicketByCode);
router.patch('/:id', updateCustomer);

export default router;