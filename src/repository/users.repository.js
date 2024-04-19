import { CreateUsersDto, GetUserDto } from "../dao/dto/users.dto.js";


class UserRepository {
    constructor(dao){
      this.dao = dao
    }

    async getUsers() {
        const users =  await this.dao.getUsers();
        return users;
    }

    async getUserById(userId) {
      try {
           
          const user = await this.dao.getUserById(userId)
          return user;

      } catch (error) {
          throw new Error(`Error al obtener el usuario: ${error.message}`);
      }
  }
  async createUser(userData) {
    try {
      return await this.dao.createUser(userData);
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async updateUser(userId, updatedUserData) {
    try {
      return await this.dao.updateUser(userId, updatedUserData);
    } catch (error) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      return await this.dao.deleteUser(userId);
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }
}

export default UserRepository;