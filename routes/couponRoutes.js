const express = require('express');
const { creatCoupon, updateCoupon, deleteCoupon, getaCoupon, getAllCoupon } = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authmiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, creatCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);
router.get('/:id', authMiddleware, isAdmin, getaCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupon);


module.exports = router;