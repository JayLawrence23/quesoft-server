import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import Customer from '../models/customer.js'
import Transaction from '../models/transactions.js'

//SMS Notification
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = twilio(accountSid, authToken);

export const signin =  async(req, res) => {
    const { mobile } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);

    try {
        const existingUser = await Customer.findOne({ mobile: mobile });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist. "})

        // const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        // if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials. "})

        await Customer.findByIdAndUpdate(existingUser._id, { otp: code } , { new: true });

        client.messages 
        .create({
        from: '+16075369068',         
        to: contact,
        body: `${ticketNo} - OTP: ${code}`,
        messagingServiceSid: messagingServiceSid,
        }) 
        .then(() => console.log('Message sent!')) 
        .catch((err) => console.log(err));

        // const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: "1h" })

        // res.status(200).json({ result: existingUser, token});
        res.status(200).json(existingUser);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const otpauth =  async(req, res) => {
    const { otp, mobile } = req.body;

    try {
        const existingUser = await Customer.findOne({ mobile: mobile });
       
        if(existingUser.otp !== otp) return res.status(404).json({ message: "Invalid OTP. "});

        const result = await Customer.findByIdAndUpdate(existingUser._id, { otp: "none" } , { new: true });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const monitorTicket =  async(req, res) => {
    const { value } = req.params;

    try {
        const existingUser = await Transaction.findOne({ code: value });

        if(!existingUser) return res.status(404).json({ message: "Ticket doesn't exist. "})

        await Transaction.findByIdAndUpdate(existingUser._id, { monitor: true } , { new: true });

        res.status(200).json(existingUser);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const monitorTicketByCode =  async(req, res) => {
    const { code, dname } = req.body;

    try {
        const existingTrans = await Transaction.findOne({ code: code });

        if(!existingTrans) return res.status(404).json({ message: "Ticket doesn't exist. "})

        await Transaction.findByIdAndUpdate(existingTrans._id, { monitor: true, dname: dname } , { new: true });

        res.status(200).json(existingTrans);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const signTicket =  async(req, res) => {
    const { code, mobile } = req.body;

    try {
        const existingUser = await Customer.findOne({ mobile: mobile});

        const existingTrans = await Transaction.findOne({ code: code });

        if(!existingTrans) return res.status(404).json({ message: "Ticket doesn't exist. "});

        await Transaction.findByIdAndUpdate(existingTrans._id, { monitor: true, dname: existingUser.fname, userId: existingUser._id } , { new: true });

        await Customer.findByIdAndUpdate(existingUser._id, { currTicket: code } , { new: true });

        res.status(200).json(existingTrans);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}


export const signup = async (req, res) => {
    const { fname, lname, mobile } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);

    try {
        const existingUser = await Customer.findOne({ mobile: mobile });

        if(existingUser) return res.status(400).json({ message: "User already exist. "})

        const result = await Customer.create({ fname: fname, lname: lname, mobile: mobile, otp: code })

        // const token = jwt.sign({ email: result.email, id: result._id}, 'test', { expiresIn: "12h" })

        client.messages 
        .create({
        from: '+16075369068',         
        to: contact,
        body: `${ticketNo} - OTP: ${code}`,
        messagingServiceSid: messagingServiceSid,
        }) 
        .then(() => console.log('Message sent!')) 
        .catch((err) => console.log(err));
        
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const getTransactions =  async(req, res) => {
    const { id } = req.body;

    try {
        const existingUser = await Customer.findById({ _id: id });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist. "})
        
        const transactions = await Transaction.find({ userId: existingUser._id });
       
        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const updateCustomer = async (req, res) => {
    const { id: _id } = req.params;
    const { email, fname, lname, mobile } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send('No account with that id');
      
    const updatedCustomer = await Customer.findByIdAndUpdate(
      _id,
      { fname: fname.trim(), lname: lname.trim(), email: email.trim(), mobile: mobile.trim() },
      { new: true }
    );
  
    res.json(updatedCustomer);
  };