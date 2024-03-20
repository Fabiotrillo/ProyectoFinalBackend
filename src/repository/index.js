import UserRepository from "./users.repository.js";
import UserManager from "../dao/managersDB/usersManager.js";
import { connectDB } from "../config/connectDB.js";
import CartManager from "../dao/managersDB/CartManager.js";
import ProductManager from "../dao/managersDB/ProductManager.js";
import CartRepository from "./carts.repository.js";
import ProductRepository from "./products.repository.js";


export const userDao = new UserManager();
export const cartDao = new CartManager();
export const productDao = new ProductManager();

connectDB()

export const UserService = new UserRepository(userDao);
export const CartService = new CartRepository(cartDao, productDao);
export const ProductService = new ProductRepository(productDao);


