import express from 'express';
import UserController from '../controllers/user.controller.js';

const userRouter = express.Router();


userRouter.post('/register',UserController.register);
userRouter.post('/login',UserController.login);
userRouter.post('/logout',UserController.logout);
userRouter.get('/cart',UserController.getCart);
userRouter.post('/cart/add',UserController.addToCart);
userRouter.post('/cart/remove',UserController.removeFromCart);
userRouter.post('/cart/update',UserController.updateCartQuantity);


export default userRouter;