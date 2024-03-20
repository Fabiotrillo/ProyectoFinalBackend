import { generateProductsList } from "../utils/faker.js";
import productModel from "../dao/db/models/products.model.js";

export const generateMockingProducts = async (req, res) => {
  try {
    const productosFicticios = generateProductsList();
    const products = await productModel.insertMany(productosFicticios);
    return res.status(201).send({
      status: "success",
      products: products,
    });
  } catch (error) {
    console.log("Error en lectura de archivos:", error);
    res.status(400).json({ error: "Error en lectura de archivos" });
  }
};



export const borrarProductosMock = async (req, res) => {
  try {
    
    const resultado = await productModel.deleteMany({});

    console.log(`${resultado.deletedCount} productos ficticios borrados exitosamente.`);

    res.status(200).json({
      status: "success",
      message: `${resultado.deletedCount} productos ficticios borrados exitosamente.`,
    });
  } catch (error) {
    console.error('Error al borrar productos ficticios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};