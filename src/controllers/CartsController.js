
import { CartService, ProductService } from "../repository/index.js";
import  {ticketsModel}  from "../dao/db/models/tickets.model.js";
import { v4 as uuidv4 } from 'uuid';
import { cartErrorDictionary, customizeError } from "../utils/errors.js";
import {io} from "../app.js";
import { sendPurchaseConfirmation } from "../services/mailingService.js";


class CartsController {
  static getCarts = async (req, res) => {
    try {
      const carts = await CartService.getCarts();
      req.logger.info("Obteniendo carritos con éxito");
      res.status(200).send({
        status: "success",
        carts: carts,
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_CARTS', error.message, cartErrorDictionary);
      req.logger.error(`Error interno del servidor: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getCartByID = async (req, res) => {
    const cid = req.params.cid;
    if (!cid) {
      return res.status(400).json({ error: "Debe ingresar Id. Cart" });
    }

    try {
      const cart = await CartService.getCartByID(cid);
      req.logger.info("Carrito encontrado con éxito");
      res.status(200).json({
        status: "success",
        msg: "Cart encontrado",
        cart: cart,
      });
    } catch (error) {
      const formattedError = customizeError('CART_NOT_FOUND_BY_ID', error.message, cartErrorDictionary);
      req.logger.error(`Error interno del servidor: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static createCarts = async (req, res) => {
    try {
      const cart = await CartService.createCarts({});
      req.logger.info("Carrito creado con éxito");
      res.status(201).json({
        status: "success",
        msg: "Carrito creado",
        cart: cart,
      });
    } catch (error) {
      const formattedError = customizeError('CREATE_CART', error.message, cartErrorDictionary);
      req.logger.error(`Error interno del servidor: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static addProductToCart = async (req, res) => {
    const cid = req.user ? req.user.cart : null;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
 
    if (!cid || !pid || !quantity) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
        const result = await CartService.addProductToCart(cid, pid, quantity);

        
        req.logger.info("Producto agregado al carrito con éxito");
        res.status(200).json({
            status: result.status,
            msg: result
        });
    } catch (error) {
        const formattedError = customizeError('ADD_PRODUCT_TO_CART', error.message, cartErrorDictionary);
        req.logger.error(`Error interno del servidor: ${formattedError}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

static finalizePurchase = async (req, res) => {
  try {
          const userEmail = req.user.email
          const cartId = req.user.cart;
          const cart = await CartService.getCartByID(cartId);

          // Si no hay un carro
          if (!cart) {
              throw new Error('No se encontró el carro de compras');
          }

          if (!cart.products.length) {
              req.logger.warning("Es necesario agregar productos antes de realizar la compra");
              return res.send("Es necesario agregar productos antes de realizar la compra");
          }

          const ticketProducts = [];
          const rejectedProducts = [];

          for (let i = 0; i < cart.products.length; i++) {
              const cartProduct = cart.products[i];
              const productDB = await ProductService.getProductByID(cartProduct.product._id);

              if (!productDB) {
                  const notFoundProductError = customizeError('PRODUCT_NOT_FOUND', 'No se encontró el producto', cartErrorDictionary);
                  req.logger.error(notFoundProductError);
                  return res.status(404).json({
                      message: 'No se encontró el producto',
                  });
              }

              if (cartProduct.quantity <= productDB.stock) {
                  ticketProducts.push(cartProduct);
              } else {
                  rejectedProducts.push(cartProduct);
              }
          }

          const newTicket = {
              code: uuidv4(),
              purchase_datetime: new Date(),
              amount: 500,
              purchaser: userEmail,
          };

          await sendPurchaseConfirmation(userEmail, newTicket);

        const updatedCart = await CartService.updateCart(cartId, { products: [] });
       

          const ticketCreated = await ticketsModel.create(newTicket);

          req.logger.info("Compra finalizada con éxito");
          res.send(ticketCreated);
  } catch (error) {
      console.log(error)
  }
};

  static removeProductFromCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    if (!cid || !pid) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
      const response = await CartService.removeProductFromCart(cid, pid);
      req.logger.info("Producto eliminado del carrito con éxito");
      io.emit('productRemoved', {cid,pid });
      res.status(200).json(response);
    } catch (error) {
      const formattedError = customizeError('REMOVE_PRODUCT_FROM_CART', error.message, cartErrorDictionary);
      req.logger.error(`Error interno del servidor: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static removeCart = async (req, res) => {
    const cid = req.params.cid;

    if (!cid) {
      return res.status(400).json({ error: "Debe ingresar Id. Cart" });
    }

    try {
      const response = await CartService.removeCart(cid);
      res.status(200).json(response);
    } catch (error) {
      const formattedError = customizeError('DELETE_CART', error.message, cartErrorDictionary);
      req.logger.warning(formattedError);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

}

export {CartsController};