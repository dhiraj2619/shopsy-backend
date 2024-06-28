import upload from "../config/multerConfig.js";
import Product from "../models/product.model.js";

const productController = {
    addProduct: (req, res) => {
        upload.single('imagepath')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const { name, price } = req.body;

            const imagepath = req.file.path;

            try {
                const newProduct = new Product({
                    name,
                    price,
                    imagepath,
                });

                await newProduct.save();
                return res.status(200).json({ message: 'product created successfully', product: newProduct })
            } catch (error) {
                console.error("Error creating product:", error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        })
    },
    getAllproducts: async (req, res) => {
        try {
            const products = await Product.find();
            return res.status(200).json(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default productController;