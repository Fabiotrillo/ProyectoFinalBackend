import express from 'express';
import {ProductController} from '../controllers/ProductsController.js';
import { checkRole } from '../midlewares/auth.js';
import { upload } from '../utils.js';


const router = express.Router();



router.get('/', ProductController.getProducts);


router.get('/:pid', ProductController.getProductByID);


router.post('/', checkRole(["admin", "premium"]),upload.single("image"),ProductController.createProduct);

router.delete('/:pid', checkRole(['admin', 'premium']),ProductController.deleteProductByID);


router.put('/:pid', checkRole(['admin']), ProductController.updateProduct);

export default router;



export { router as ProductRouter }