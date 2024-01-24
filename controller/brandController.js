const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

const createBrand = asyncHandler(async(req, res)=>{
    try{
        const newBrand = await Brand.create(req.body);
        res.status(200).json(newBrand);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const updateBrand = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(updatedBrand);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const deleteBrand = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.status(200).json(deletedBrand);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});


const getBrand = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getaBrand = await Brand.findById(id);
        res.status(200).json(getaBrand);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const getAllBrand = asyncHandler(async(req, res)=>{
    try{
        const getallBrand = await Brand.find();
        res.status(200).json(getallBrand);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

module.exports = {createBrand, updateBrand, deleteBrand, getBrand, getAllBrand};