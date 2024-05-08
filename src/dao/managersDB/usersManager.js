import userModel from "../db/models/users.model.js";
import { GetUserDto } from "../dto/users.dto.js";

class UserManager {

    async getUsers() {
        
        try {
          const users = await userModel.find().lean();
          return users
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
          throw { status: "error", msg: "Error al obtener usuarios" };
        }
      }
  
    async createUser(userData) {
        try {
            const user = await userModel.create(userData);
            return user;
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

   
    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId).lean();
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }

    
    async getUserByEmail(email) {
        try {
            const user = await userModel.findOne(email);
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario por correo electrónico: ${error.message}`);
        }
    }

    
    async updateUser(userId, newData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(userId, newData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    }

    async deleteUser(uid) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(uid);
            return deletedUser;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }
//NO USAR
    async deleteUsers(){
        try {
            const result = await userModel.deleteMany({});
            return result;
          } catch (error) {
            throw new Error(`Error al eliminar todos los usuarios: ${error.message}`);
          }
    }

}

export default UserManager;