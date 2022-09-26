import express from 'express';
import { 
    getTransaction, 
    getTransactions, 
    createTransaction, 
    recreateTransactionByCounter,
    deleteTransaction, 
    getTicket, 
    leaveQueuing,
    callCustomer,
    getCallingCustomers,
    ticketOnCounterStaff,
    arrivedCustomer,
    queuingComplete,
    missedCustomer,
    emailNotif,
    smsNotif,
    countWaitingByService,
    countServedByService,
    countMissedByService,
    countWaiting,
    countServed,
    countMissed,
    countServedByAllService,
    showMissedByService,
    searchMissedByService,
    serveMissedTicket,
    completeMissedTicket,
    averageServiceTime,
    fetchTransactionsByCounter,
    customerHistory,
    servedByAllServiceReports,
    averageServiceTimeReports,
    volumeRateReports,
    totalServedReports
} from '../controllers/transaction.js'
// import auth from '../middleware/auth.js'
const router = express.Router();

//localhost:5000/
router.get('/:id', getTransaction);
router.get('/', getTransactions);
router.post('/getransactionbycounter', fetchTransactionsByCounter);
router.post('/', createTransaction);
router.post('/createticketbycounter', recreateTransactionByCounter);
// router.patch('/:id', updateTransaction); //for updating we need to know the id
router.delete('/:id', deleteTransaction);
router.post('/ticket/', getTicket);
router.patch('/leave/:id', leaveQueuing)
router.patch('/call', callCustomer)
router.get('/nowserve', getCallingCustomers)
router.patch('/counterticket/', ticketOnCounterStaff);
router.patch('/arrived/', arrivedCustomer);
router.patch('/missed/', missedCustomer);
router.patch('/queuingdone/', queuingComplete);
router.patch('/emailnotif/', emailNotif);
router.patch('/smsNotif/', smsNotif);

//Count
router.post('/countwait', countWaitingByService);
router.post('/countserved', countServedByService);
router.post('/countmissed', countMissedByService);

router.post('/countwaitall', countWaiting);
router.post('/countservedall', countServed);
router.post('/countmissedall', countMissed);

router.post('/countservedallservice', countServedByAllService);
router.post('/averageservicetime', averageServiceTime);


//Missed Queue Transaction
router.post('/showmissed', showMissedByService);
router.post('/searchmissed', searchMissedByService);
router.post('/servemissed', serveMissedTicket);
router.post('/completemissed', completeMissedTicket);
// router.patch('/:id/likePost', auth, likePost); // for liking the post

// Customer history
router.post('/customerhistory', customerHistory);

//Reports
router.post('/servedallreports', servedByAllServiceReports);
router.post('/aveservicetimereports', averageServiceTimeReports);
router.post('/customerslastmonthreports', volumeRateReports);
router.post('/totalservedreports', totalServedReports);

export default router;