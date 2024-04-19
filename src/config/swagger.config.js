import __dirname from "../utils.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";


const swaggerOptions = {
    definition:{
        openapi:"3.0.1", 
        info: {
            title: 'Documentacion  API Ecommerce',
            version:'1.0.0',
            description:'Definicion de Endpoints del ecommerce',
        }
    },
    apis:[`${path.join(__dirname,"./docs/**/*.yaml")}`], // <- guardamos los archivos aqui 
}

export const swaggerSpecs = swaggerJSDoc(swaggerOptions)