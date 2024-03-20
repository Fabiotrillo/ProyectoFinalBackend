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
          const userDTO= new CreateUsersDto(user);
          const userDtoFront= new GetUserDto(userDTO);
          return userDtoFront;

      } catch (error) {
          throw new Error(`Error al obtener el usuario: ${error.message}`);
      }
  }



}

export default UserRepository;