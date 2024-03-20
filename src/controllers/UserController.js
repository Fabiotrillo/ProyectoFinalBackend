import { UserService } from "../repository/index.js";
import { userErrorDictionary, customizeError } from "../utils/errors.js";

class UserController {
  static getUsers = async (req, res) => {
    try {
      const users = await UserService.getUsers();
      req.logger.info("Obteniendo usuarios con éxito");
      res.status(200).json({
        status: "success",
        users: users,
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_USERS', error.message, userErrorDictionary);
      req.logger.error(`Error al obtener usuarios: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
    }

    try {
      const result = await UserService.getUserById(userId);
      req.logger.info("Usuario encontrado con éxito");
      res.status(200).json({
        status: "success",
        msg: "Usuario encontrado",
        user: result,
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_USER_BY_ID', error.message, userErrorDictionary);
      req.logger.error(`Error al obtener usuario: ${formattedError}`);
      res.status(404).json({
        status: "error",
        msg: error.message,
      });
    }
  };

  static createUser = async (req, res) => {
    const { first_name, last_name, email, password, age, role } = req.body;

    if (!first_name || !last_name || !email || !password || !age || !role) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
      const result = await UserService.createUser({
        first_name,
        last_name,
        email,
        password,
        age,
        role,
      });
      req.logger.info("Usuario creado con éxito");
      res.status(201).json({
        status: "success",
        msg: "Usuario creado",
        user: result,
      });
    } catch (error) {
      const formattedError = customizeError('CREATE_USER', error.message, userErrorDictionary);
      req.logger.error(`Error al crear el usuario: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
    }

    const updatedUserData = req.body;

    try {
      const result = await UserService.updateUser(userId, updatedUserData);
      req.logger.info(`Usuario actualizado con éxito, ID: ${userId}`);
      res.status(200).json({
        status: "success",
        msg: `Usuario actualizado con ID: ${userId}`,
        user: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('UPDATE_USER', error.message, userErrorDictionary);
      req.logger.error(`Error al actualizar usuario: ${formattedError}`);
      res.status(404).json({
        status: "error",
        msg: error
      });
    }
  };

  static deleteUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
    }

    try {
      const result = await UserService.deleteUser(userId);
      req.logger.info(`Usuario eliminado con éxito, ID: ${userId}`);
      res.status(200).json({
        status: "success",
        msg: `Usuario eliminado con ID: ${userId}`,
        user: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('DELETE_USER', error.message, userErrorDictionary);
      req.logger.error(`Error al eliminar usuario: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}

export default UserController;