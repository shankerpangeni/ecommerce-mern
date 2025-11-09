import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import connectDb  from './src/utils/connectDb.js';
import userRoutes from './src/routes/user.route.js';
import productRoutes from './src/routes/product.route.js'
import shopRoutes from './src/routes/shop.route.js'
import recommendationRoutes from './src/routes/recommendation.route.js'
import cartRoutes from './src/routes/cart.route.js'

dotenv.config();

const app = express();
app.use(express.json());


app.use(cookieParser());


app.use("/api/payment/webhook", express.raw({ type: "application/json" }));



const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));

//api Urls
//user api
app.use('/api/v1/user' , userRoutes)
app.use('/api/v1/product' , productRoutes);
app.use('/api/v1/shop' ,shopRoutes )
app.use('/api/v1/recommendation' ,recommendationRoutes )
app.use('/api/v1/cart' ,cartRoutes )




const port = process.env.PORT;
app.listen(port || 3000 , (req, res) => {
    console.log('Backend running successfully in port ', port);
    connectDb();

})