import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { secret_key } from '../utlis/Config.js';


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
                orders: [],
                cart: []
            });

            const savedUser = await user.save();
            res.status(201).json({ message: "Registration successful", user: savedUser });
        } catch (error) {
            console.error("Error registering user:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User not found with this email id' });
            }
            else {
                const storedPassword = user.password;

                const isPasswordMatch = await bcrypt.compare(password, storedPassword);
                if (isPasswordMatch) {
                    const token = jwt.sign({ userId: user.id }, secret_key);
                    res.header({ "x-auth-token": token });
                    res.status(200).json({ message: 'Login success', token, user });
                }
                else {
                    res.status(400).json({ message: 'Invalid Credentials' });
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
    },
    getCart: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId).populate('cart.productId');

            if (!user) {
                return res.status(404).json({ message: 'User not found'});
            }
            res.status(200).json(user.cart);

        } catch (error) {
            console.error("Error fetching cart:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    addToCart: async (req, res) => {
        try {
            const {productId, quantity } = req.body;
    
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const existingCartItem = user.cart.find(item => item.product.toString() === productId);
            if (existingCartItem) {
                existingCartItem.quantity += quantity;
            } else {
                user.cart.push({ product: productId, quantity });
            }
    
            await user.save();
            await user.populate('cart.product').execPopulate();
            res.status(200).json({ message: "Product added to cart", cart: user.cart });
        } catch (error) {
            console.error("Error adding to cart:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    removeFromCart: async (req, res) => {
        try {
            const { productId } = req.body;
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }
            user.cart = user.cart.filter(item => item.productId.toString() !== productId);
            await user.save();
            res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
        } catch (error) {
            console.error("Error removing from cart:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    updateCartQuantity:async(req,res)=>{
        try {
            const userId = req.userId;
            const { productId, quantity } = req.body;
            const user = await User.findById(userId);
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            const cartItem = user.cart.find(item => item.productId.toString() === productId);
            if (cartItem) {
              cartItem.quantity = quantity;
            } else {
              return res.status(404).json({ message: 'Product not found in cart' });
            }
            await user.save();
            res.status(200).json({ message: 'Cart updated', cart: user.cart });
          } catch (error) {
            console.error("Error updating cart:", error);
            res.status(500).json({ message: "Internal Server Error" });
          }
    }
}

export default UserController;