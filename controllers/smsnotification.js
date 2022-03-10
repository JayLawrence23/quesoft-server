import dotenv from 'dotenv';


const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({         
         to: '+639774539951',
         body: "You're Next on your Queue! Be ready! Be alert!",
         messagingServiceSid: messagingServiceSid,
       }) 
      .then(() => console.log('Message sent!')) 
      .done()
      .catch((err) => console.log(err));


      //dito isesend lahat ng mga may sms gagawa nalang ng query para mafetch yung mga naka sms at pending

    //   services.forEach(({ servName}) => {
    //     console.log(servName);
    // })