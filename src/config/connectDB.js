import mongoose from "mongoose";
import { config } from "../config/config.js";


export const connectDB = async ()=>{
    try {
        await  mongoose.connect(config.mongo.url);
    } catch (error) {
        console.log(`Error al conectar con la Base de Datos${error}`)
    }
}