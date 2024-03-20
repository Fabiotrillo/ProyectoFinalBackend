import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";


const router = Router();

// Obtener todos los carritos
router.get("/", CartsController.getCarts);

// Obtener carrito por ID
router.get('/:cid', CartsController.getCartByID);

// Crear un nuevo carrito
router.post("/", CartsController.createCarts);

//purchase
router.post('/:cid/purchase', CartsController.finalizePurchase);

// Agregar producto a un carrito
router.post('/:cid/products/:pid',CartsController.addProductToCart);

router.delete('/:cid/products/:pid', CartsController.removeProductFromCart)

router.delete('/:cid' , CartsController.removeCart)



export { router as CartRouter };