const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

const creatCoupon = asyncHandler(async(req, res)=>{
    try{
        const createCoupon = await Coupon.create(req.body);
        res.status(200).json(createCoupon);
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const updateCoupon = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(updateCoupon);

    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const deleteCoupon = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deleteCoupon = await Coupon.findOneAndDelete(id);
        res.status(200).json(deleteCoupon);
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const getaCoupon = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getCoupon = await Coupon.findById(id);
        res.status(200).json(getCoupon);
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const getAllCoupon = asyncHandler(async(req, res)=>{
    try{
        const getCoupons = await Coupon.find();
        res.status(200).json(getCoupons);
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

module.exports = {creatCoupon, updateCoupon, deleteCoupon, getaCoupon, getAllCoupon}