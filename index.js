import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io'

import serviceRoutes from './routes/services.js'
import customerRoutes from './routes/customers.js'
import counterStaffRoutes from './routes/counterStaff.js'
import adminRoutes from './routes/admin.js'
import counterRoutes from './routes/counter.js'
import transactionRoutes from './routes/transaction.js'
import func from './socket.js'

import { spawn } from 'child_process'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import cron from 'node-cron'

const __dirname = dirname(fileURLToPath(import.meta.url));

// mongodump

const DB_NAME = 'queuing_system'
const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`)

// backup database every 24 hrs

// cron.schedule('*/5 * * * * *', () => backupMongoDB()) 

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// const server1 = server.listen(PORT, () => {
//     console.log(`📈 Running on ${PORT}.`)
// });

const io = new Server(server, {
    cors: {
            origin: `https://quesoft-jaylawrence23.vercel.app`,
            methods: ["GET", "POST"],
            credentials: true,
            transports: ['websocket', 'polling'],
    },
    allowEIO3: true
});

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/services', serviceRoutes);
app.use('/customers', customerRoutes);
app.use('/counterstaff', counterStaffRoutes);
app.use('/admin', adminRoutes);
app.use('/counter', counterRoutes);
app.use('/transaction', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Hello to Queuing System API');
});

func(io);
export {io};
// function backupMongoDB() {
//     const child = spawn('mongodump', [
//         `--db=${DB_NAME}`,
//         `--archive=${ARCHIVE_PATH}`,
//         '--gzip'
//     ])    

//     child.stdout.on('data', (data) => {
//         console.log('stdout:\n', data)
//     })
//     child.stderr.on('data', (data) => {
//         console.log('stderr:\n', Buffer.from(data).toString())
//     })
//     child.on('error', (error) => {
//         console.log('error:\n', error)
//     })
//     child.on('exit', (code, signal) => {
//         if(code) console.log('Process exit with code: ', code)
//         else if (signal) console.log('Process killed with signal: ', signal)
//         else console.log('Backup is successful')
//     })
// }

// function backup2MongoDB() {
//     const child = spawn('mongodump', [
//         `--db=${DB_NAME}`,
//         `--uri=${CONNECTION_STRING}`,
//         `--password=${DB_PASSWORD}`
        
//     ])    

//     child.stdout.on('data', (data) => {
//         console.log('stdout:\n', data)
//     })
//     child.stderr.on('data', (data) => {
//         console.log('stderr:\n', Buffer.from(data).toString())
//     })
//     child.on('error', (error) => {
//         console.log('error:\n', error)
//     })
//     child.on('exit', (code, signal) => {
//         if(code) console.log('Process exit with code: ', code)
//         else if (signal) console.log('Process killed with signal: ', signal)
//         else console.log('Backup is successful')
//     })
// }


mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => server.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
// .then(server1)
.catch((error) => console.log(error));

mongoose.set('useFindAndModify', false);

// https://www.mongodb.com/cloud/atlas