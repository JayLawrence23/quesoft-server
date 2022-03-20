import mongoose from 'mongoose';
import moment from'moment'

import Transaction from '../models/transactions.js';
import Service from '../models/service.js';
import Counter from '../models/counter.js'
import { io } from '../index.js';
import Admin from '../models/admin.js';

const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()
const endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()

//SMS Notification
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = twilio(accountSid, authToken);

// Email notification
import nodemailer from 'nodemailer';

import {sgMail} from '../helpers/emailTransportot.js'

export const getTransactions =  async(req, res) => {
    try {
        const admin = await Admin.findOne({ username: "admin" });
        const transaction = await Transaction.find({ business: admin.business}).sort('createdAt');

        res.status(200).json(transaction);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getTransaction =  async(req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findById(id);

        res.status(200).json(transaction);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const createTransaction = async (req, res) => {
    const { service, ticketNo, code, business } = req.body;

    try {

        const getService = await Service.findOne( { servName: service });
        console.log('getService', getService.ticketNo)
         let ticketLength =
           getService.ticketNo && getService.ticketNo.length + 1;
         let currentTicketNo = getService.prefix + '-0' + ticketLength;
         console.log('currentTicketNo', currentTicketNo);

        getService.ticketNo.push(currentTicketNo);
        getService.queuingTic.push(currentTicketNo);
        await getService.save();

        const index = getService.queuingTic.findIndex((ticketno) => ticketno === String(currentTicketNo));

        const newTransaction = await Transaction.create({ code: code, service: service, ticketNo: currentTicketNo, predWait: index, business: business, tags: getService.tags });

        console.log()
        console.log()
        console.log()
        // await Service.findByIdAndUpdate(getService._id, getService, { new: true })

        //Socket IO for real-time
        io.emit('generateticket', newTransaction);
        res.status(200).json({ newTransaction });
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const getTicket = async (req, res) => {
    const { service } = req.body;

    try {
        const transaction = await Transaction.findOne({
            service: service,
            status: 'Waiting'
        }).sort({'createdAt': -1})

        res.status(200).json(transaction);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const leaveQueuing = async (req, res) => {
    const { id } = req.params;

    console.log(id)
    try {
        const leaveQueue = await Transaction.findByIdAndUpdate(id, { status: "Cancelled" })

        const service = await Service.findOne( { servName: leaveQueue.service });

        const ticketNo = leaveQueue.ticketNo;

          //checking the index of the ticketno
        const index = service.queuingTic.findIndex((ticketno) => ticketno === String(ticketNo));

        if(!(index === -1)) {
            service.queuingTic = service.queuingTic.filter((ticketno) => ticketno !== String(ticketNo));
        }

        await Service.findByIdAndUpdate(service._id, service, { new: true })

        io.emit('leave', leaveQueue)

        res.json(leaveQueue);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const callCustomer = async (req, res) => {
    const {counterNo, currentService} = req.body;

    let today = new Date();
    let updatedTransaction;
    const getService = await Service.findOne( { servName: currentService });
    const frontTicketNo = getService.queuingTic[0];
    // const allTransaction = await Transaction.find();

    // console.log(allTransaction.predWait)
 console.log('frontTicketNo', frontTicketNo)
    if(!frontTicketNo){
        updatedTransaction = null;
    } else {
        const ticket = await Transaction.findOne({ status: "Waiting", ticketNo: frontTicketNo })

        if (!ticket) return res.status(400).json(updatedTransaction);

        updatedTransaction = await Transaction.findByIdAndUpdate(ticket._id, { status: "Calling", counterName: counterNo, calledTime: today }, { new: true } )
        getService.queuingTic.shift();

        await Service.findByIdAndUpdate(getService._id, getService, { new: true });
    }

    // Socket IO for real-time
    io.sockets.emit('call', updatedTransaction)
   
    res.status(200).json(updatedTransaction);

    //Socket IO for real-time
    // io.emit('queuing', updatedTransaction)
    

}

export const ticketOnCounterStaff = async (req, res) => {
    const {counterNo, currentService} = req.body;
 
    try {
        const transaction = await Transaction.findOne({
            $or: [
                { status: 'Calling' },
                { status: 'Serving' },
                { status: 'Serving Missed' },
            ],
            counterName: counterNo,
            service: currentService
        })

        res.status(200).json(transaction);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const getCallingCustomers = async (req, res) => {
    try {
        const transaction = await Transaction.find({
            status: 'Calling',

        }).sort({'createdAt': -1})

        res.status(200).json(transaction);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const arrivedCustomer = async (req, res) => {
    const { id, counterName, service, ticketNo } = req.body;
   
    try {
        const getCounter = await Counter.findOne( { cName: counterName, service: service });

        const serving = await Transaction.findByIdAndUpdate(id, { status: "Serving" }, { new: true })

        await Counter.findByIdAndUpdate(getCounter._id, { nowServing: true, currentTicNo: ticketNo }, { new: true })
 
        // Socket IO for real-time
        io.emit('arrived', serving)
        
        res.status(200).json(serving);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }

}

export const missedCustomer = async (req, res) => {
    const { id } = req.body;
   
    try {
        const missed = await Transaction.findByIdAndUpdate(id, { status: "Missed", missed: true }, { new: true })

         // Socket IO for real-time
         io.emit('missed', missed)
        res.status(200).json(missed);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }

}

export const queuingComplete = async (req, res) => {
    const { id, ticketNo, service, counterName } = req.body;
    const currentDate = new Date();

    try{
        const admin = await Admin.findOne({ username: "admin" });
        const getCounter = await Counter.findOne( { cName: counterName, service: service });

        const customer = await Transaction.findById(id);

        let calledTime = customer.calledTime;

        const serviceTime = (currentDate.getMinutes() - calledTime.getMinutes());

        const updatedTransaction = await Transaction.findByIdAndUpdate(id, { status: "Complete", predWait: null, serviceTime: serviceTime }, { new: true });

        const transactionNext = await Transaction.findOne({ service: service, status: "Waiting", predWait: 1 });

        getCounter.servedTicket.push(ticketNo);

        await Counter.findByIdAndUpdate(getCounter._id, getCounter, { new: true })
       
        await Transaction.updateMany({ service: service, status: "Waiting" },  {$inc : { predWait : -1}})
        
        await Transaction.findByIdAndUpdate(transactionNext._id, { predWait : 0 }, { new: true })

        const notificationsForSMS = await Transaction.find({ business: admin.business, service: service, email: null, contact:  { $ne: null } }).sort('createdAt');

        const notificationsForEmail = await Transaction.find({ business: admin.business, service: service, contact: null, email:  { $ne: null } }).sort('createdAt');

        // const updatedPredwait = Transaction.find({ service: service, status: "Waiting" })

        console.log('notificationsForEmail', notificationsForEmail.length)
        notificationsForSMS.forEach(({ predWait, ticketNo, contact, status }) => {
            if(predWait === 1 && status === "Waiting"){
                client.messages 
                .create({
                from: '+16075369068',         
                to: contact,
                body: `${ticketNo} - YOU'RE NEXT! PLEASE BE READY. Be alert!`,
                messagingServiceSid: messagingServiceSid,
                }) 
                .then(() => console.log('Message sent!')) 
                .catch((err) => console.log(err));
                console.log("NEXT KA NA HOY! "+ ticketNo)
            }
            if(predWait === 2 && status === "Waiting"){
                client.messages 
                .create({       
                from: '+16075369068',  
                to: contact,
                body: `${ticketNo} - YOUR LINE IS NEAR, GET READY. MAKE SURE YOU'RE INSIDE OF THE VICINITY.`,
                messagingServiceSid: messagingServiceSid,
                }) 
                .then(() => console.log('Message sent!')) 
                .catch((err) => console.log(err));
                console.log("MAKE SURE MALAPIT KA NA! "+ ticketNo)
            }
            if(predWait === 0){
                client.messages 
                .create({
                from: '+16075369068',         
                to: contact,
                body: `${ticketNo} - IT'S YOUR TURN, PLEASE GO TO THE COUNTER.`,
                messagingServiceSid: messagingServiceSid,
                }) 
                .then(() => console.log('Message sent!')) 
                .catch((err) => console.log(err));
                
                console.log("dalian mo tinatawag ka na! "+ ticketNo)
            }
        })

        notificationsForEmail.forEach(
          ({ predWait, ticketNo, email, status }) => {
              console.log('predWait', predWait)
            if (predWait === 1 && status === 'Waiting') {
              sgMail
                .send({
                  to: email,
                  from: process.env.SENDGRID_Email_From,
                  subject: `${ticketNo} - YOU'RE NEXT! PLEASE BE READY.`,
                  html: `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
                        <h2 style="text-align: center; text-transform: uppercase;color: orange;">BE READY, YOU'RE NEXT!</h2>
                        </div>`,
                })
                .then((res) => {
                  //    console.log('res', res)
                  console.log('email sent');
                })
                .catch((err) => {
                  console.log('err sending email', err);
                });
            }
            if (predWait === 2 && status === 'Waiting') {
              sgMail
                .send({
                  to: email,
                  from: process.env.SENDGRID_Email_From,
                  subject: `${ticketNo} - YOUR LINE IS NEAR, GET READY`,
                  html: `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
                        <h2 style="text-align: center; text-transform: uppercase;color: orange;">STAY ALERT! GET READY</h2>
                        </div>`,
                })
                .then((res) => {
                  //    console.log('res', res)
                  console.log('email sent');
                })
                .catch((err) => {
                  console.log('err sending email', err);
                });
              console.log('MAKE SURE MALAPIT KA NA! ' + ticketNo);
            }
            if (predWait === 0) {
              sgMail
                .send({
                  to: email,
                  from: process.env.SENDGRID_Email_From,
                  subject: `${ticketNo} - IT'S YOUR TURN, PLEASE GO TO THE COUNTER`,
                  html: `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
                        <h2 style="text-align: center; text-transform: uppercase;color: orange;">It's your turn, please go to the counter</h2>
                        <h5>
                        </h5>
                        </div>`,
                })
                .then((res) => {
                  //    console.log('res', res)
                  console.log('email sent');
                })
                .catch((err) => {
                  console.log('err sending email', err);
                });;
              console.log('dalian mo tinatawag ka na! ' + ticketNo);
            }
          }
        );

        // Socket IO for real-time
        io.sockets.emit('complete', updatedTransaction)

        res.status(200).json(updatedTransaction);
    
    } catch (error) {
        res.status(409).json( {message: error.message });
    }

}

export const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No transaction with that id');

    await Transaction.findByIdAndRemove(id);

    res.json({ message: 'Transaction deleted successfully' });
 
}

// ########## Notif ##############

export const emailNotif = async (req, res) => {
    const { code, email } = req.body;
   
    try {
        const ticket = await Transaction.findOne({ code: code });
        const emailnotif = await Transaction.findByIdAndUpdate(ticket.id, { email: email }, { new: true })

        //Socket IO for real-time
        io.emit('notif', emailnotif)
        res.status(200).json(emailnotif);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }

}

export const smsNotif = async (req, res) => {
    const { code, sms } = req.body;
   
    try {
        const ticket = await Transaction.findOne({ code: code });
        const sms2 = sms.substring(1);
        const smsformat = "+63"+sms2;
        const smsnotif = await Transaction.findByIdAndUpdate(ticket.id, { contact: smsformat }, { new: true })

        //Socket IO for real-time
        io.emit('notif', smsnotif)
        res.status(200).json(smsnotif);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }

}

// ############## Count #################

export const countWaiting = async (req, res) => {

    try {
        const admin = await Admin.findOne({ username: "admin" });
        const result = await Transaction.countDocuments( { business: admin.business, status: "Waiting" } );
      
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const countServed = async (req, res) => {
   
    try {
        const admin = await Admin.findOne({ username: "admin" });
        const result = await Transaction.countDocuments( { business: admin.business, status: "Complete"} );
        
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}


export const countMissed = async (req, res) => {
   
    try {
        const admin = await Admin.findOne({ username: "admin" });
        const result = await Transaction.countDocuments( { business: admin.business, status: "Missed" } );
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const countWaitingByService = async (req, res) => {
    const { service } = req.body;
    // , createdAt: { $gte: startOfDay, $lt: endOfDay }
    try {
        const result = await Transaction.countDocuments( { service: service, status: "Waiting" });
      
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const countServedByService = async (req, res) => {
    const { service } = req.body;

    
    try {
        const result = await Transaction.countDocuments( { service: service, status: "Complete", createdAt: { $gte: startOfDay, $lt: endOfDay } });
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const countMissedByService = async (req, res) => {
    const { service } = req.body;

    try {
        const result = await Transaction.countDocuments( { service: service, status: "Missed", createdAt: { $gte: startOfDay, $lt: endOfDay } });
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}



export const countServedByAllService = async (req, res) => {

    let allServed = {
        service: [],
        served: [],
    };
    
    try {

        const admin = await Admin.findOne({ username: "admin" });
        const services = await Service.find({ business: admin.business }).sort({ createdAt: 1 });

        services.map((service) => allServed.service.push(service.servName));

        Promise.all(
            allServed.service.map((ser) => (
                servedByAllService(ser)
                .then((count) => allServed.served.push(count))
                .catch(err => {
                    console.log(err)
                })
            ))
        ).then(() => res.status(200).json(allServed))

        // 

    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

const servedByAllService = async (service) => {
    try {

        const admin = await Admin.findOne({ username: "admin" });

        const result = await Transaction.countDocuments( { business: admin.business, service: service, status: "Complete",  });
        
        // console.log(service+": "+result)
        return result;
    } catch (error) {
        console.log(error);
    }
}


// ######### Missed tickets ################

export const showMissedByService = async (req, res) => {
    const { service } = req.body;
    // createdAt: { $gte: startOfDay, $lt: endOfDay }
    
    try {
        const result = await Transaction.find( { service: service, status: "Missed",  });
      
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}


export const searchMissedByService = async (req, res) => {
    const { ticketNo }  = req.body;
    // createdAt: { $gte: startOfDay, $lt: endOfDay }
    try {
        const result = await Transaction.findOne( { ticketNo: ticketNo, status: "Missed",  });
    
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const serveMissedTicket = async (req, res) => {
    const { _id, counterName, service, ticketNo } = req.body;
   
    try {
        const getCounter = await Counter.findOne( { cName: counterName, service: service });

        const serving = await Transaction.findByIdAndUpdate(_id, { status: "Serving Missed", counterName: counterName }, { new: true })

        await Counter.findByIdAndUpdate(getCounter._id, { nowServing: true, currentTicNo: ticketNo }, { new: true })

        await Transaction.updateMany({ service: service, status: "Waiting" },  {$inc : { predWait : 1}})

        io.emit('missqueue', serving)
        
        res.status(200).json(serving);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const completeMissedTicket = async (req, res) => {
    const { _id, ticketNo, service, counterName } = req.body;

    try{
        const getCounter = await Counter.findOne( { cName: counterName, service: service });

        const updatedTransaction = await Transaction.findByIdAndUpdate(_id, { status: "Complete with Missed Queue", predWait: null }, { new: true });

        getCounter.servedTicket.push(ticketNo);

        await Counter.findByIdAndUpdate(getCounter._id, getCounter, { new: true })
        await Transaction.updateMany({ service: service, status: "Waiting" },  {$inc : { predWait : -1}})

        res.status(200).json(updatedTransaction);
    
    } catch (error) {
        res.status(409).json( {message: error.message });
    }

}

// export const countersService = async (req, res) => {
//     const { service } = req.body;
    
//     console.log(service);
//     try {
//         const serviceObj = await Service.findOne({servName: service});

        
//         res.status(200).json(serviceObj.counters);
//     } catch (error) {
//         res.status(404).json( {message: error.message });
//     }
 
// }

export const likePost = async (req, res) => {
    const { id } = req.params;

    // If the user is not authenticated
    if(!req.userId) return res.json({ message: "Unauthenticated" });

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    // finding the id of the specific post
    const post = await PostMessage.findById(id);
    
    //checking the index of the user
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        //like the post

        post.likes.push(req.userId);
    } else {
        //dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}