import mongoose from 'mongoose';
import Counter from '../models/counter.js';
import Service from '../models/service.js';
import Admin from '../models/admin.js';

export const getCounters =  async(req, res) => {
    try {
        const admin = await Admin.findOne({ username: "admin" });
        const counters = await Counter.find({ business: admin.business });

        res.status(200).json(counters);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getCounter =  async(req, res) => {
    const { id } = req.params;

    try {
        const counter = await Counter.findById(id);

        res.status(200).json(counter);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const createCounter = async (req, res) => {
    const counter = req.body;

    const service = await Service.findById(counter.service);
    const admin = await Admin.findOne({ username: "admin" });

    try {
        const newCounter = await Counter.create({ cName: counter.cName, service: service.servName, business: admin.business });
        await Service.findByIdAndUpdate(counter.service, {$push: { counters: counter.cName }} );

        res.status(200).json(newCounter);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const updateCounter = async (req, res) => {
    const { id: _id } = req.params;
    const counter = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No counter with that id');

    await Service.findOneAndUpdate({ servName: counter.service }, {$addToSet: { counters: counter.cName }} );

    const updatedCounter = await Counter.findByIdAndUpdate(_id, { cName: counter.cName, service: counter.service }, { new: true });

    res.json(updatedCounter);
 
}

export const deleteCounter = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No counter with that id');

    await Counter.findByIdAndRemove(id);

    res.json({ message: 'Counter deleted successfully' });
 
}

export const getCounterByService = async (req, res) => {
    const data = req.body;

   
    try {
        const serviceObj = await Counter.find( { service: { $all : data.service}} );
        
        res.status(200).json(serviceObj);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const countCounterByService = async (req, res) => {
    const { service } = req.body;
   
    try {
        const result = await Counter.countDocuments( { service: service, status: true } );
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

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

