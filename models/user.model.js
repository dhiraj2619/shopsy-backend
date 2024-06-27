import mongoose from "mongoose"

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
    cart:[{
      productId:{
        type: mongoose.Schema.Types.ObjectId,
      },
      quantity:{
         type:Number,
         default:1
      }
    }]
})

const User = mongoose.model('User',userSchema);

export default User;