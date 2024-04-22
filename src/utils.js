import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { config } from "./config/config.js";
import multer from "multer";


export const createHash = (password)=> bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user)=> bcrypt.compareSync(password,user.password);

export const generateEmailToken = (email,expireTime)=>{
    const token = jwt.sign({email},config.mailing.secret,{expiresIn:expireTime}); //
    return token;
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token,config.mailing.secret);
        console.log(info);
        return info.email;
    } catch (error) {
        console.log(error.message);

    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let destinationFolder = '';
      if (req.baseUrl.includes('products')) {
        destinationFolder = 'products';
      } else if (file.fieldname === 'profileImage') {
        destinationFolder = 'profiles';
      } else {
        destinationFolder = 'documents';
      }
      cb(null,__dirname+ `/uploads/${destinationFolder}`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  export const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default __dirname;