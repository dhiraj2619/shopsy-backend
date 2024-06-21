
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import orderRouter from './routes/order.route.js';
import { mongo_url, webport } from './utlis/Config.js';
import paymentRouter from './routes/payment.route.js';


const app = express();
const port = webport;

const connect=async()=>{
   try {
      await mongoose.connect(mongo_url);
      console.log('connected to db');
   } catch (error) {
     throw(error)
   }
}


app.use(express.json());
app.use('/api/user',userRouter);
app.use('/api/orders',orderRouter);
app.use('/api/payments',paymentRouter);


app.listen(port,()=>{
    connect();
    console.log(`server is running on http://localhost:${port}`);
})