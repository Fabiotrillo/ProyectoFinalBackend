import {Router} from  'express';
import { generateMockingProducts, borrarProductosMock} from '../controllers/MockingController.js';

const router = Router()


router.post('/mockingproducts', generateMockingProducts);
router.delete('/mockingproducts', borrarProductosMock)

export {router as  mockingRoutes};