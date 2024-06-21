import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { secret_key } from '../utlis/config.js';


const UserController = {

  register: async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            orders:[]
        });

        const savedUser = await user.save();
        res.status(201).json({ message: "Registration successful", user: savedUser });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
},
    login:async(req,res)=>{
        try {
            const {email,password} = req.body;

            const user = await User.findOne({email});

            if(!user){
               return res.status(400).json({message:'User not found with this email id'});
            }
            else{
                const storedPassword = user.password;

                const isPasswordMatch = await bcrypt.compare(password,storedPassword);
                if(isPasswordMatch){
                    const token = jwt.sign({userId:user.id},secret_key);
                    res.header({"x-auth-token":token});
                    res.send({message:'Login success',token:token,user:user});
                }
                else{
                    res.send({message:'Invalid Credentials'});
                }
            }
        } catch (error) {
            console.error("Error signing In");
      res.status(500).json({ message: "Internal Server Error" });
        }
    },
    logout: async (req, res) => {
        try {
          res.header("x-auth-token", ""); 
          res.status(200).json({ message: "Logout successful" });
        } catch (error) {
          console.error("Error logging out:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
}

export default UserController;