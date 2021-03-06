import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Customer from '../models/customer.js'
import Transaction from '../models/transactions.js'

export const signin =  async(req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await Customer.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist. "})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials. "})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: "1h" })

        res.status(200).json({ result: existingUser, token});

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
    const { code } = req.body;

    try {
        const existingUser = await Transaction.findOne({ code: code });

        if(!existingUser) return res.status(404).json({ message: "Ticket doesn't exist. "})

        await Transaction.findByIdAndUpdate(existingUser._id, { monitor: true } , { new: true });

        res.status(200).json(existingUser);

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}


export const signup = async (req, res) => {
    const { email, password, fname, lname, mobile, accno } = req.body;

    try {
        const existingUser = await Customer.findOne({ email });

        if(existingUser) return res.status(400).json({ message: "User already exist. "})

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await Customer.create({ fname: fname, lname: lname, accno: accno, email: email, mobile: mobile, password: hashedPassword})

        const token = jwt.sign({ email: result.email, id: result._id}, 'test', { expiresIn: "12h" })

        res.status(200).json({ result, token});

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}