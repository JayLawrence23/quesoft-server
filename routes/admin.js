import express from 'express';

import { signin, signup, getAdminData, 
    updateAdminUser, getAdvertisement,
    createAdvertisement, updateAdvertisement,
    getAdmin, updateBusiness } from '../controllers/admin.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/admindata', getAdminData);
router.post('/admin', getAdmin);
router.post('/update', updateAdminUser);
router.get('/advertise', getAdvertisement);
router.post('/createads', createAdvertisement);
router.patch('/updateads/:id', updateAdvertisement)
router.patch('/updatebusiness/:id', updateBusiness)


export default router;