const express = require('express');
const dbConnect = require('./config/dbConnect');
const {notFound, errorHandler} = require('./middlewares/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const BlogRouter = require('./routes/blogCategoryRoutes');
const CategoryRouter = require('./routes/prodcategoryRoutes');
const BrandRouter = require('./routes/brandRoutes');
const CouponRouter = require('./routes/couponRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
dbConnect();
// app.use('/', (req, res)=>{
//     res.send('Hello from Server Side');

// });
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/category', CategoryRouter);
app.use('/api/blogcategory', BlogRouter);
app.use('/api/brand', BrandRouter);
app.use('/api/coupon', CouponRouter);

app.use(notFound, notFound);  //middlewares
app.use(errorHandler, errorHandler);



app.listen(PORT, (req, res)=>{
    console.log(`Server is Running at Port: ${PORT}`);

});
