import Razorpay from 'razorpay'
import { razopay_key_id, razopay_key_secret } from './Config.js'

const razorpayInstance = new Razorpay({
    key_id:razopay_key_id,
    key_secret:razopay_key_secret
})

export default razorpayInstance;