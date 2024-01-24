const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');
const cloudinaryUploadImg = require('../utils/cloudinary');

const createBlog = asyncHandler(async(req, res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.status(200).json(newBlog);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
    }

});

const updateBlog = asyncHandler(async(req, res)=>{
    validateMongodbId(id);
    const id = req.params.id;
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.status(200).json(updateBlog);
        // res.json(updateBlog);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});

    }

});

const getBlog = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(id, {
            $inc:{numviews: 1},
        },
            {new: true} 
        );
        res.status(200).json(getBlog);
        // res.json(updateBlog);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});

    }

});

const getAllBlogs = asyncHandler(async(req, res)=>{
    try{
        const getBlogs = await Blog.find();
        res.status(200).json(getBlogs);
        // res.json(updateBlog);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});

    }

});

const deleteBlog = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.status(200).json(deletedBlog);
        // res.json(updateBlog);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});

    }

});

const likeBlog = asyncHandler(async(req, res)=>{
    const blogId = req.body.blogId;
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString());
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, {new: true});
        res.json(blog);
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isliked: false
        }, {new: true});
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes: loginUserId},
            isliked: true 
        }, {new: true});
        res.json(blog);
    }

    }
);


const disLikeBlog = asyncHandler(async(req, res)=>{
    const blogId = req.body.blogId;
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isDisLiked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString());
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isLiked: false
        }, {new: true});
        res.json(blog);
    }
    if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, {new: true});
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {dislikes: loginUserId},
            isDisliked: true,
        }, {new: true});
        res.json(blog);
    }

    }
);

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
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file)=>{
                return file;
             }),
            },
             {new: true}
            
        );
        res.status(200).json(findBlog);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went Wrong'});
        
    }

});
module.exports = {
    createBlog, 
    updateBlog, 
    getBlog, 
    getAllBlogs, 
    deleteBlog, 
    likeBlog, 
    disLikeBlog,
    uploadImages
};