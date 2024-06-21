import razorpayInstance from "../utlis/Razorpay.js";
import crypto from 'crypto';
import { razopay_key_secret } from "../utlis/Config.js";

const paymentController = {
    initiatePayment: async (req, res) => {
        const { amount, currency, receipt } = req.body;

        const options = {
            amount: amount * 100,
            currency,
            receipt
        }

        try {
            const response = await razorpayInstance.orders.create(options);

            res.status(200).json({
                id: response.id,
                currency: response.currency, amount: response.amount
            });

        } catch (error) {
            res.status(500).json({ message: 'Error creating Razorpay order', error });
        }
    },
    verifyPayment: async (req, res) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', razopay_key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            const newOrder = new Order({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            })

            try {
                await newOrder.save();
                res.status(200).json({ message: "payment verified successfully" });

            } catch (error) {
                res.status(500).json({ message: 'Error saving order', error });
            }
        }
        else{
            res.status(400).json({ message: 'Invalid signature, payment verification failed' });
        }


    }

}


export default paymentController;