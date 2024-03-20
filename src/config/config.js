import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const MAILING_USER= process.env.MAILING_USER; 
const MAILING_PASSWORD=process.env.MAILING_PASSWORD;
const MAILING_SERVICE=process.env.MAILING_SERVICE;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET

export const config = {
    server:{
        port:PORT,
    
    },
    mongo:{
        url:MONGO_URL,
    },
    mailing:{
        user: MAILING_USER,
        password: MAILING_PASSWORD,
        service: MAILING_SERVICE,
        secret:RESET_PASSWORD_SECRET
    }
};
