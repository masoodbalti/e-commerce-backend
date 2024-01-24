const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getAProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct, 
    addToWishlist,
    rating,
    uploadImages} = require('../controller/productController');
const {isAdmin, authMiddleware} = require('../middlewares/authmiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');


router.post('/create-product', authMiddleware, isAdmin,  createProduct);
router.put('/upload/:id', authMiddleware, isAdmin, 
uploadPhoto.array('images', 10), 
productImgResize, 
uploadImages);
router.get('/:id', getAProduct);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, rating);

router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.get('/', getAllProducts);

module.exports = router;