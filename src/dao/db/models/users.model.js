import mongoose from "mongoose";


const collection = "users";

const schema = new mongoose.Schema({
    FullName: {
        type:String,
    },
    
    first_name: {
        type:String,
        required:true
    },
    last_name:{
        type: String, 
        required: true
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    age: Number,
    role: {
        type: String,
        required:true,
        enum:["user","admin","premium"],
        default: 'user',
    },
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },

    hasUploadedDocuments: {
        type: Boolean,
        default: false 
      },

    documents: [
        {
            name: String,
            reference: String
        }
    ],
    profileImage: {
        type:mongoose.Schema.Types.Mixed // Aquí puedes almacenar la ruta de la imagen de perfil
      },
    
})

const userModel =  mongoose.model(collection,schema);

export default userModel;