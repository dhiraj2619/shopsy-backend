import express from 'express';
import paymentController from '../controllers/payment.controller.js';
const paymentRouter = express.Router();

paymentRouter.post('/initiate',paymentController.initiatePayment);
paymentRouter.post('/verify',paymentController.verifyPayment);

export default paymentRouter;