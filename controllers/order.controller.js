import Order from "../models/Order.js";
import User from "../models/user.js";

const createOrder =async(req,res)=>{
  try {
     const {userId,items,totalAmount} = req.body;

     const user = await User.findById(userId);

     if(!user){
        return res.status(404).json({message:"user not found"});
     }     

     const order = new Order({
        userId:user,
        items,
        totalAmount
     })

     const savedOrder = await order.save();
     user.orders.push(savedOrder._id);
     await user.save();

     res.status(201).json(savedOrder);
  } catch (error) {
   res.status(500).json({ message: error.message })
  }
}

export default {createOrder}