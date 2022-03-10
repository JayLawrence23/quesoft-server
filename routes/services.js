import express from 'express';
import { getService, getServices, 
    createService, updateService, 
    deleteService, countersService,
    getServiceByName } from '../controllers/services.js'
// import auth from '../middleware/auth.js'
const router = express.Router();

//localhost:5000/posts
router.get('/:id', getService);
router.get('/', getServices);
router.post('/', createService);
router.patch('/:id', updateService); //for updating we need to know the id
router.delete('/:id', deleteService);
router.get('/counters', countersService);
router.post('/servicename', getServiceByName);
// router.patch('/:id/likePost', auth, likePost); // for liking the post
// we insert the Auth from middleware, para yung page na yan ay may authentication 
export default router;