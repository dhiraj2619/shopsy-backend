import dotenv from 'dotenv';
dotenv.config();

const webport = process.env.PORT;
const mongo_url = process.env.MONGO_URL;
const secret_key= process.env.SECRET_KEY;
const razopay_key_id = process.env.RAZORPAY_KEY_ID;
const razopay_key_secret = process.env.RAZORPAY_KEY_SECRET;

export {webport,mongo_url,secret_key,razopay_key_id,razopay_key_secret}