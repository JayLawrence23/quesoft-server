import express from 'express';
import { getCounter, getCounters, 
    createCounter, updateCounter, 
    deleteCounter, getCounterByService,
    countCounterByService } from '../controllers/counter.js'
// import auth from '../middleware/auth.js'
const router = express.Router();

//localhost:5000/posts
router.get('/:id', getCounter);
router.get('/', getCounters);
router.post('/', createCounter);
router.patch('/:id', updateCounter); //for updating we need to know the id
router.delete('/:id', deleteCounter);
router.post('/list', getCounterByService);
router.post('/count', countCounterByService)
// router.patch('/:id/likePost', auth, likePost); // for liking the post
// we insert the Auth from middleware, para yung page na yan ay may authentication 
export default router;