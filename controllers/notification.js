import { io } from '../index.js';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

// For send grid transport
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
      api_key:"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"
    }
}))

io.on('thirdIndex', message => {

    console.log('hell')
    // try {
    //     // sendMailCounterStaff(email, username, "1234", "http://localhost:3000/queuing-system/counterstaff/auth", "Login Now")

    //     transporter.sendMail({
    //         to: message,
    //         from:"quesoftqueuing@gmail.com",
    //         subject:"Queuing Notification",
    //         html:
    //         `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
    //         <h2 style="text-align: center; text-transform: uppercase;color: orange;">You're 3rd in line, make sure you're at the vicinity. </h2>
    //         <h5>
    //         </h5>
    //         <p>Stay Safe, people!</p>
        
    //         <div></div>
    //         </div>`
        
    //     }, function(err, info){
    //         if (err ){
    //           console.log(err);
    //         }
    //         else {
    //           console.log('Message sent: ' + info.res);
    //         }});

    // } catch (error) {
    //     res.status(500).json( {message: "Something went wrong. "});
    // }
})



io.on('secondIndex', message => {

    console.log('pangalawa')
    try {
        // sendMailCounterStaff(email, username, "1234", "http://localhost:3000/queuing-system/counterstaff/auth", "Login Now")


        transporter.sendMail({
            to: message,
            from:"quesoftqueuing@gmail.com",
            subject:"Queuing Notification - You're Next!",
            html:
            `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: orange;">You're next! Please get ready. </h2>
            <h5>
            </h5>
            <p>Stay Safe, people!</p>
        
            <div></div>
            </div>`
        
        }, function(err, info){
            if (err ){
              console.log(error);
            }
            else {
              console.log('Message sent: ' + info.res);
            }});

        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
})



io.on('firstIndex', message => {

    try {
        // sendMailCounterStaff(email, username, "1234", "http://localhost:3000/queuing-system/counterstaff/auth", "Login Now")

        transporter.sendMail({
            to: message,
            from:"quesoftqueuing@gmail.com",
            subject:"Queuing Notification - It's your turn!",
            html:
            `<div style="max-width: 700px; margin:auto; border: 4px solid #F7F7F7; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: orange;">It's your turn! Please proceed to the counter </h2>
            <h5>
            </h5>
            <p>Stay Safe, people!</p>
        
            <div></div>
            </div>`
        
        }, function(err, info){
            if (err ){
              console.log(error);
            }
            else {
              console.log('Message sent: ' + info.res);
            }});

        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json( {message: "Something went wrong. "});
    }
})
    