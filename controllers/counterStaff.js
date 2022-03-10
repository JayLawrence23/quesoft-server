import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

import CounterStaff from '../models/counterStaff.js';
import Counter from '../models/counter.js';

// For send grid transport
// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//       api_key:"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"
//     }
// }))

// For send grid transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "trylang721@gmail.com", // generated ethereal user
      pass: "123456A/", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
  });
    
export const signin =  async(req, res) => {
    const { username, password, service, counterno } = req.body;

    try {
        const existingUser = await CounterStaff.findOne({ username });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist. "})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials. "})

        const token = jwt.sign({ username: existingUser.username, id: existingUser._id}, 'test', { expiresIn: "12h" })

        const updatedCounterStaff = await CounterStaff.findByIdAndUpdate(existingUser._id, { curService: service, curCounter: counterno }, { new: true });

        const counterFind = await Counter.findOne({ service: service, cName: counterno });

        await Counter.findByIdAndUpdate(counterFind._id, { status: true, curStaffName: username }, { new: true });
        
        res.status(200).json({ result: existingUser, updatedCounterStaff, token})
        

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const signup = async (req, res) => {
    const { email, fname, lname, } = req.body;
    
    try {
        const existingUser = await CounterStaff.findOne({ email });

        if(existingUser) return res.status(400).json({ message: "User already exist. "})

        let code = Math.random().toString(36).slice(2);

        const hashedPassword = await bcrypt.hash(code, 12);

        const username = fname.charAt(0)+fname.charAt(1)+""+ lname;
        const lowcaseUsername = username.toLowerCase();

        const result = await CounterStaff.create({ fname: fname, lname: lname, username: lowcaseUsername, email: email, password: hashedPassword})

        // sendMailCounterStaff(email, username, "1234", "http://localhost:3000/queuing-system/counterstaff/auth", "Login Now")

        transporter.sendMail({
            to: email,
            from:"noreplybankit21@gmail.com",
            subject:"QueSoft - Account Created",
            html:
            `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: orange;">QueSoft Queuing System</h2>
            <h5>Your account has been created.
            </h5>
            <p>To access your account, here's your credentials: <br/>Email: ${email} <br/> Username: ${lowcaseUsername} <br/> Password: ${code} </p>
            <p>Click the button below to access login page of Quesoft. </>
            <a href=${process.env.CLIENT_URL}counterstaff/auth style="background: #FFA500; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">LOGIN</a>
    
        
            <div></div>
            </div>`
        
        }, function(err, info){
            if (err ){
              console.log(err);
            }
            else {
              console.log('Message sent: ' + info.res);
            }
        });

        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
}

export const getCounterStaff =  async(req, res) => {
    try {
        const counterStaff = await CounterStaff.find();

        res.status(200).json(counterStaff);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getOneCounterStaff =  async(req, res) => {
    const { id } = req.params;

    try {
        const counterStaff = await CounterStaff.findOne({ _id: id });
        
        res.status(200).json(counterStaff);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const updateCounterStaff = async (req, res) => {
    const { id: _id } = req.params;
    const { email, fname, lname } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No account with that id');

    const updatedCounterStaff = await CounterStaff.findByIdAndUpdate(_id, { fname: fname, lname: lname, email: email }, { new: true });

    res.json(updatedCounterStaff);
 
}

export const updateCounterStaffUser = async (req, res) => {
    const { id, email, fname, lname, username } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No account with that id');

    const updatedCounterStaff = await CounterStaff.findByIdAndUpdate(id, { fname: fname, lname: lname, username: username, email: email }, { new: true });

    res.json(updatedCounterStaff);
 
}

export const signout = async (req, res) => {
    // const { id: _id } = req.params;
    const { id, service, counter} = req.body;

    const counterFind = await Counter.findOne({ cName: counter, service: service });

    await CounterStaff.findByIdAndUpdate(id, { curService: 'None', curCounter: 'None' }, { new: true });
    
    await Counter.findByIdAndUpdate(counterFind._id, { status: false, curStaffName: '' }, { new: true });
    // res.json(updatedCounterStaff);
}

export const activateCounterStaff = async (req, res) => {
    const { id: _id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No account with that id');

    const account = await CounterStaff.findById(_id);

    console.log(account.status);

    // const status = false;
    
    // const updatedCounterStaff = await CounterStaff.findByIdAndUpdate(_id, { status: status }, { new: true });

    // res.json(updatedCounterStaff);
 
}

export const deleteCounterStaff = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Account with that id');

    await CounterStaff.findByIdAndRemove(id);

    res.json({ message: 'Counter Staff deleted successfully' });
  
}