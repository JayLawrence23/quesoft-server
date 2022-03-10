import express from 'express';
import auth from '../middleware/customerAuth.js'

import { signin, signup, 
    getCounterStaff, deleteCounterStaff, 
    updateCounterStaff, getOneCounterStaff, 
    activateCounterStaff, signout, 
    updateCounterStaffUser } from '../controllers/counterStaff.js'

const router = express.Router();

router.get('/', getCounterStaff);
router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/:id', updateCounterStaff);
router.post('/update', updateCounterStaffUser);
router.delete('/:id', deleteCounterStaff);
router.get('/:id', getOneCounterStaff)
router.patch('/:id/activation', activateCounterStaff);
router.post('/signout', signout);

export default router;