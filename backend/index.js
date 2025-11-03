import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb  from './src/utils/connectDb.js';
import userRoutes from './src/routes/user.route.js';

dotenv.config();

const app = express();


app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

const corsOptions = {
    origin: 'http:localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));

//api Urls
//user api
app.use('/api/v1/user' , userRoutes)

const port = process.env.PORT;
app.listen(port || 3000 , (req, res) => {
    console.log('Backend running successfully in port ', port);
    connectDb();

})