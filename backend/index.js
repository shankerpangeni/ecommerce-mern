import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb  from './src/utils/connectDb.js'

dotenv.config();

const app = express();



app.use(express.json());

const corsOptions = {
    origin: 'http:localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));

//api Urls

const port = process.env.PORT;
app.listen(port || 3000 , (req, res) => {
    console.log('Backend running successfully in port ', port);
    connectDb();

})