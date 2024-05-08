
class CartRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async getCarts() {
        const carts = await this.dao.getCarts({});
        return carts;
    }
  
    async getCartByID(cartId) {
      try {
        const cart = await this.dao.getCartByID(cartId);
        return cart;
      } catch (error) {
        throw new Error;
      }
    }
  
    async createCarts({ products, quantity }) {
      try {
        const cart = await this.dao.createCarts({ products, quantity });
        return cart;
      } catch (error) {
        throw new Error;
      }
    }

  
    async addProductToCart(cid, pid, quantity) {
        try {
            const result = await this.dao.addProductToCart(cid, pid, quantity);
            return result;
          } catch (error) {
            throw error;
          }
        
      
    }
  
    async removeCart(cartId) {
      try {
        const deletedCart = await CartModel.findByIdAndDelete(cartId);
        return deletedCart;
      } catch (error) {
        throw new Error;
      }
    }
  
    async removeProductFromCart(cartId, productId) {
        try {
            const result = await this.dao.removeProductFromCart(cartId, productId);
            return result;
          } catch (error) {
            // Manejo de errores, si es necesario
            throw error;
          }
    }



    async removeCart(cartId) {
        try {
          const result = await this.dao.removeCart(cartId);
          return result;
        } catch (error) {
          throw new Error;
        }
      }

      async updateCart(cartId, updatedFields) {
        try {
            const updatedCart = await this.dao.updateCart(cartId, updatedFields, { new: true });
            return updatedCart;
        } catch (error) {
            console.error('Error al intentar actualizar el carrito:', error.message);
            throw new Error('Error al intentar actualizar el carrito');
        }
    }
  }
  
  export default CartRepository;