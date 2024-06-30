import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
   
      productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
      },
      quantity:{
         type:Number,
         required:true,
         default:1
      }
    
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
       type:String,
       required:true,
       unique:true
    },
    password:{
       type:String,
       required:true,
       minlength:8
    },
    orders:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Order'
    }],
    cart:[cartSchema]
})

const User = mongoose.model('User',userSchema);

export default User;