import mongoose from 'mongoose';
import Service from '../models/service.js';
import Admin from '../models/admin.js';



export const getServices =  async(req, res) => {
    try {
        const admin = await Admin.findOne({ username: "admin" });
        const services = await Service.find({ business: admin.business });
       
        res.status(200).json(services);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getService =  async(req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);

        res.status(200).json(service);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getServiceByName =  async(req, res) => {
    const { service } = req.body;

    try {
        const serv = await Service.findOne({ servName: service });

        res.status(200).json(serv);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const createService = async (req, res) => {
    const service = req.body;

    const admin = await Admin.findOne({ username: "admin" });
    const newService = new Service({ ...service, business: admin.business });

    try {
        await newService.save();

        res.status(201).json(newService);
    } catch (error) {
        res.status(409).json( {message: error.message });
    }
}

export const updateService = async (req, res) => {
    const { id: _id } = req.params;
    const service = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No service with that id');

    const updatedService = await Service.findByIdAndUpdate(_id, { ...service, _id }, { new: true });

    res.json(updatedService);
 
}

export const deleteService = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No service with that id');

    await Service.findByIdAndRemove(id);

    res.json({ message: 'Service deleted successfully' });
 
}

export const countersService = async (req, res) => {
    const { service } = req.body;
    
    try {
        const serviceObj = await Service.findOne({servName: service});

        
        res.status(200).json(serviceObj.counters);
    } catch (error) {
        res.status(404).json( {message: error.message });
    }
 
}

export const getTicketLength = async (req, res) => {
    const { id } = req.params;

    // If the user is not authenticated
    

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