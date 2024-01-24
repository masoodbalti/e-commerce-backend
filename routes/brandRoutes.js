const express = require('express');
const router = express.Router();
// const controller = require('../controller/brandController');
const {createBrand, updateBrand,deleteBrand, getBrand, getAllBrand} = require('../controller/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authmiddleware');

// router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/:id', getBrand);
// router.get('/', getAllBrand);
router.route('/').get(getAllBrand).post(authMiddleware, isAdmin, createBrand)


module.exports = router