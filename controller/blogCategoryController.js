const Category = require('../models/blogCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

const createCategory = asyncHandler(async(req, res)=>{
    try{
        const newCategory = await Category.create(req.body);
        res.status(200).json(newCategory);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const updateCategory = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(updatedCategory);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const deleteCategory = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.status(200).json(deletedCategory);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});


const getCategory = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getaCategory = await Category.findById(id);
        res.status(200).json(getaCategory);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const getAllCategory = asyncHandler(async(req, res)=>{
    try{
        const getallCategory = await Category.find();
        res.status(200).json(getallCategory);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

module.exports = {createCategory, updateCategory, deleteCategory, getCategory, getAllCategory};