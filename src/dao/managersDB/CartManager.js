import cartModel from "../db/models/carts.model.js"
import productModel from "../db/models/products.model.js";




class CartManager {
    getCarts = async () => {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error("Error fetching carts:", error);
        }
    };


    async getCartByID(cid) {
        const cart = await cartModel.findById(cid);
        return cart;
    }

    async createCarts(products, quantity ) {
        try {

            const result = await cartModel.create({products, quantity})
            return result;
        } catch (error) {
            console.error('Error al intentar crear el carrito:', error.message);
            throw new Error('Error al intentar crear el carrito');
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid).populate('products.product');

            if (!cart) {
                throw new Error(`El carrito con el id ${cid} no existe`);
            }

            const product = await productModel.findById(pid);

            if (!product) {
                throw new Error(`El producto con el id ${pid} no existe`);
            }

            const productInCart = cart.products.find(item => item.product._id.equals(pid));

            if (!productInCart) {
                cart.products.push({
                    product: product,
                    quantity: quantity
                });
            } else {
                productInCart.quantity += quantity;
            }


            cart.total = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);

            await cart.save();

            return {
                status: "Success",
                msg: "Producto agregado correctamente al carrito"
            };
        } catch (error) {
            console.error('Error al intentar agregar producto al carrito:', error.message);
            throw new Error('Error al intentar agregar producto al carrito');
        }
    }
    async removeProductFromCart(cid, productId) {
        try {
            const cart = await cartModel.findById(cid).populate('products.product');

            if (!cart) {
                throw new Error(`El carrito con el id ${cid} no existe`);
            }

            const productIndex = cart.products.findIndex(item => item.product._id.equals(productId));

            if (productIndex === -1) {
                throw new Error(`El producto con el id ${productId} no está en el carrito`);
            }

            // Eliminar el producto del carrito
            cart.products.splice(productIndex, 1);

            // Recalcular el total del carrito
            cart.total = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);

            await cart.save();

            return {
                status: "Success",
                msg: "Producto eliminado correctamente del carrito"
            };
        } catch (error) {
            console.error('Error al intentar eliminar producto del carrito:', error.message);
            throw new Error('Error al intentar eliminar producto del carrito');
        }
    }



    async removeCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error(`El carrito con el id ${cartId} no existe`);
            }

        
            await cartModel.findByIdAndDelete(cartId);

            return {
                status: "Success",
                msg: "Carrito eliminado correctamente"
            };
        } catch (error) {
            console.error('Error al intentar eliminar el carrito:', error.message);
            throw new Error('Error al intentar eliminar el carrito');
        }
    }

}

export default CartManager;