import express from 'express';
import productController from '../controllers/product.controller.js';
const productRouter = express.Router();


productRouter.post('/addproduct',productController.addProduct);
productRouter.get('/allproducts',productController.getAllproducts);

export default productRouter;