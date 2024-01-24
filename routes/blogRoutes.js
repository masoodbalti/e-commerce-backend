const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog } = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authmiddleware');
const { blogImgResize, uploadPoto } = require('../middlewares/uploadImages');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);

router.put('/upload/:id', authMiddleware, isAdmin, 
uploadPoto.array('images', 2), 
blogImgResize, 
uploadImages);

router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, disLikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlogs);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);




module.exports = router;