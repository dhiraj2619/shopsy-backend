import express from 'express';
import UserController from '../controllers/user.controller.js';

const userRouter = express.Router();


userRouter.post('/register',UserController.register);
userRouter.post('/login',UserController.login);
userRouter.post('/logout',UserController.logout);


export default userRouter;