import winston from "winston";
import dotenv from "dotenv";
import  path from "path";
import __dirname from "../utils.js"


dotenv.config()


const customLevels = {
    levels:{
        debug:0,
        http:1,
        info:2,
        warning :3,
        error:4,
        fatal:5
    },
    colors:{
        debug:"blue",
        http: "green",
        info: "blue",
        warning: "yellow",
        error: "orange",
        fatal: "red"
    }
}


const devLogger = winston.createLogger({
    levels:customLevels.levels,
    transports:[
        new winston.transports.Console({ level: 'debug' }),
    ]
})

const prodLogger = winston.createLogger({
    levels:customLevels.levels,
    transports:[
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({filename: path.join(__dirname,"/logs/errors.log"), level: "info"})
    ]
})

const currentEnv = process.env.NODEE_ENV || "development";


export const addLogger = (req,res,next) =>{
    if(currentEnv === "development"){
        req.logger = devLogger;
    }else{
        req.logger = prodLogger;
    }

    req.logger.http(`${req.url} - method: ${req.method}`)   
    next();
    
    
}