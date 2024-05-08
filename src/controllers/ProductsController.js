import { ProductService } from "../repository/index.js";
import { productErrorDictionary, customizeError } from "../utils/errors.js";
import { UserService } from "../repository/index.js";
import { sendProductDeletedNotification } from "../services/mailingService.js";

class ProductController {
  static getProducts = async (req, res) => {
    try {
        const result = await ProductService.getProducts(req.query);
        req.logger.info("Obteniendo productos con éxito");
        res.status(200).json({
            products: result,
        });
    } catch (error) {
        const formattedError = customizeError('FETCHING_PRODUCTS', error.message, productErrorDictionary);
        req.logger.error(`Error en lectura de archivos: ${formattedError}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

  static getProductByID = async (req, res) => {
    const pid = req.params.pid;
    if (!pid) {
      return res.status(400).json({ error: "Debe ingresar Id. Product" });
    }

    try {
      const result = await ProductService.getProductByID(pid);
      console.log(result)
      if (!result) { // Manejar el caso en que no se encuentre ningún producto
          return res.status(404).json({ status: "error", message: "Producto no encontrado" });
      }
      req.logger.info("Producto encontrado con éxito");
      res.status(200).json({
          status: "success",
          msg: result 
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_PRODUCTS', error.message, productErrorDictionary);
      req.logger.error(`Error en lectura de archivos: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static createProduct  = async (req, res) => {

    const owner = req.user && req.user.email ? req.user.email : "admin";
   
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      image,
    } = req.body; //json con el producto

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !stock ||
      !category
    ) {
      return res.status(400).send("datos incompletos")
      };

      const filename = req.file.filename;

    if (!filename) {
        return res.status(400).send("No se pudo cargar la imagen");
    }

    // Construye la URL completa para la imagen
    const thumbnail = `http://localhost:8080/uploads/products/${filename}`;

    const product = {
      title,
      description,
      code,
      price,
      stock,
      category,
      image:thumbnail,
      owner
    };
    try {
      const result = await ProductService.createProduct(product);
      
      res.send({
        status: "succes",
        msg: "Producto Creado con exito",
        result,
      });
    } catch {
      const formattedError = customizeError('CREATE_PRODUCT', error.message, productErrorDictionary);
      req.logger.error(`Error en lectura de archivos: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateProduct = async (req, res) => {
    const pid = req.params.pid;

    if (!pid) {
      return res.status(400).json({ error: "Debe ingresar Id. Product" });
    }

    const updatedProductData = req.body;

    try {
      const result = await ProductService.upgradeProduct({
        id: pid,
        ...updatedProductData,
      });

      req.logger.info("Producto actualizado con éxito");
      res.status(200).json({
        status: "success",
        msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
        product: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('UPDATE_PRODUCT', error.message, productErrorDictionary);
      req.logger.error(`Error al actualizar archivo: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static deleteProductByID = async (req, res) => {
    const pid = req.params.pid;

    if (!pid) {
      return res.status(400).json({ error: "Debe ingresar Id. Product" });
    }

    try {
      const product = await ProductService.getProductByID(pid);
      
      if (!product) {
        return res.status(404).json({ status: "error", message: "Producto no encontrado" });
      } 
    const ownerEmail = product.owner;
    
    const ownerId = await UserService.getUserByEmail({email:ownerEmail})
    
    
    if (ownerId.role === "premium") {
      // Envío de correo electrónico al propietario del producto
      await sendProductDeletedNotification(ownerId.email, product.title, product._id);
    }

    await ProductService.deleteProductByID(product);
   
    res.status(200).send({
      status: "success",
      msg: `Producto Eliminado con el id: ${pid}`
    })

    } catch (error) {
      console.log(error)
    }
};
}

export { ProductController };