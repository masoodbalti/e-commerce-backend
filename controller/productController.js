const User = require('../models/userModel');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongodbId = require('../utils/validateMongodbId');
const cloudinaryUploadImg = require('../utils/cloudinary')

const createProduct = asyncHandler(async(req, res)=>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    }catch(error){
        throw new Error(error);
    }

});

const updateProduct = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(
            id,{
                title: req.body.title,

            }
            

        , {new: true});
        res.json(updateProduct);

    }catch(error){
        throw new Error(error)
    }

});

const deleteProduct = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        // if(req.body.title){
        //     req.body.slug = slugify(req.body.title);
        // }
        const deleteProduct = await Product.findByIdAndDelete(
            id
        , {new: true});
        res.json(deleteProduct);

    }catch(error){
        throw new Error(error)
    }

});




const getAProduct = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);

    }catch(error){
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async(req, res)=>{
    
    // console.log(req.query);
    // const id = req.params.id;
    //product filtering
    try{
        const queryObject = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el)=>delete queryObject[el]);
        console.log(queryObject);
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        // console.log(JSON.parse(queryStr));
        let query = Product.find(JSON.parse(queryStr));
        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);

        }else{
            query = query.sort('-createdAt');

        }
        //limiting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);

        }else{
            query = query.select('-__v');

        }
        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1)*limit;
        // console.log(page, limit, skip);
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error('No More Page Found');

        }

        const product = await query;

        // const queryObject = {...req.query};
        // console.log(queryObject);
        // const getAllProducts = await Product.where('category').equals(
        //     req.query.category
        // );

        res.json(product);

    }catch(error){
        throw new Error(error);
    }
});
const addToWishlist = asyncHandler(async(req, res)=>{
    const _id = req.user._id;       //_id get from req.user
    const prodId = req.body.prodId;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id)=>id.toString()===prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {
                $pull: {
                    wishlist: prodId
                }

            }, {new: true});
            res.json(user);


        }else{
            let user = await User.findByIdAndUpdate(_id, {
                $push: {
                    wishlist: prodId
                }

            }, {new: true});
            res.json(user);

        }
    }catch(error){
            console.log(error);
            res.status(500).json({message: 'Something went Wrong'});
        
    }

});


const rating = asyncHandler(async(req, res)=>{
    const _id = req.user._id;
    const star = req.body.star;
    const prodId = req.body.prodId;
    const comment = req.body.comment;
    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId)=>userId.postedby.toString()===_id.toString());
        if(alreadyRated){
            const updateRating = await Product.updateOne({
                ratings: {
                    $elemMatch: alreadyRated,
                },
                
            },{
            $set: {
                "ratings.$.star": star, "ratings.$.comment": comment
            },
        },
            {
                new: true,
            }
            );
            // res.json(updateRating)
        }else{
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings:{
                        star: star,
                        comment: comment,
                        postedby: _id,
                    },
                },

            }, {new: true});
            
            // res.json(rateProduct);
        }
        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        let ratingSum = getAllRatings.ratings.map((item)=>item.star).reduce((prev, curr)=>prev + curr, 0);
        let actualRating = Math.round(ratingSum/totalRating);
        let finalProduct = await Product.findByIdAndUpdate(prodId,{
            totalratings: actualRating,

        }, {new: true});
        res.json(finalProduct);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const uploadImages = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const uploader = (path)=> cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;
        for (const file of files){
            const path = file.path;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map((file)=>{
                return file;
             }),
            },
             {new: true}
            
        );
        res.status(200).json(findProduct);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
        
    }

});

module.exports = {
    createProduct,
    getAProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
};
