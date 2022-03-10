import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Fs from 'fs';
import Path from 'path'
import Axios from 'axios'

import Admin from '../models/admin.js';
import Advertisement from '../models/advertisement.js';

import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = twilio(accountSid, authToken);

export const signin =  async(req, res) => {
    const { username, password } = req.body;
   
    try {
        const existingUser = await Admin.findOne({ username });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist. "})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials. "})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: "12h" })

        
        // client.messages 
        // .create({         
        // to: '+639774539951',
        // body: "You're Next on your Queue! Be ready! Be alert!",
        // messagingServiceSid: messagingServiceSid,
        // }) 
        // .then(() => console.log('Message sent!')) 
        // .catch((err) => console.log(err));

        res.status(200).json({ result: existingUser, token});

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const signup = async (req, res) => {
    const { email, fname, contact, secemail } = req.body;

    
    try {
        const existingUser = await Admin.findOne({ email });

        if(existingUser) return res.status(400).json({ message: "User already exist. "})

        const hashedPassword = await bcrypt.hash("1234", 12);

        const username = "admin";

        const result = await Admin.create({ name: fname, username: username, email: email, secemail: secemail, contact: contact, password: hashedPassword})

        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const updateAdminUser = async (req, res) => {
    const { email, name, username, secemail, contact } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No account with that id');

    const updatedAdmin = await Admin.findByIdAndUpdate(id, { name: name, username: username, secemail: secemail, contact: contact, email: email }, { new: true });

    res.json(updatedAdmin);
 
}


export const getAdminData =  async(req, res) => {
    const { id } = req.body;

    try {
        const admin = await Admin.findOne({ _id: id });
        
        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getAdmin =  async(req, res) => {

    try {
        const admin = await Admin.findOne({ username: "admin" });
        
        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getAdvertisement =  async(req, res) => {


    try {
        const admin = await Admin.findOne({ username: "admin" });
        const advertise = await Advertisement.findOne({ business: admin.business }, {}, { sort: { 'createdAt' : -1 } });
        
        res.status(200).json(advertise);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const createAdvertisement = async (req, res) => {
    const { title, desc, ads } = req.body;

    try {
        const newAdvertisement = await Advertisement.create({ adsTitle: title, adsDesc: desc  });

        res.status(200).json(newAdvertisement);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const updateAdvertisement = async (req, res) => {
    const { id } = req.params;
    const { title, desc, } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No ads with that id');

    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(id, { adsTitle: title, adsDesc: desc }, { new: true });

    res.json(updatedAdvertisement);
 
}

export const updateBusiness = async (req, res) => {
    const { id } = req.params;
    const { business, } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No admin with that id');

    const updatedAdvertisement = await Admin.findByIdAndUpdate(id, { business: business }, { new: true });
 
    res.json(updatedAdvertisement);
 
}


// export const downloadBackup = async (req, res) => {
//     const __dirname = dirname(fileURLToPath(import.meta.url));

//     // mongodump
    
//     const url = '';
//     const path = Path.resolve(__dirname, 'public', 'queuing_system.gzip');

//     const response = Axios({
//         method: 'GET',
//         url: url,
//         responseType: 'stream'
//     })

//     response.data.pipe(Fs.createWriteStream(path));

    
// }