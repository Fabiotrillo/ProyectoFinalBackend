import { GetUserDto } from "../dao/dto/users.dto.js";
import { UserService } from "../repository/index.js";
import userModel from "../dao/db/models/users.model.js";
import { userErrorDictionary, customizeError } from "../utils/errors.js";


class UserController {
  static getUsers = async (req, res) => {
    try {
      const users = await UserService.getUsers();
      const usersDTO = users.map((user) => new GetUserDto(user))
      req.logger.info("Obteniendo usuarios con éxito");
      res.status(200).send({ status: "success", payload: usersDTO })
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
      res.status(200).send({
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
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    try {
      const result = await UserService.createUser({
        first_name,
        last_name,
        email,
        password,
        age,
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
    const uid = req.body.uid;

    if (!uid) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const newRole = req.body.role

    try {
      const user = await UserService.getUserById(uid)
      if (newRole === user.role) {
        return res.status(404).send({ error: 'Ya posee el usuario este rol' });
      }
      user.role = newRole

      const result = await UserService.updateUser(uid, user);
      req.logger.info(`Usuario actualizado con éxito, ID: ${uid}`);
      return res.status(200).send({ message: 'Usuario actualizado', result });
    } catch (error) {
      const formattedError = customizeError('UPDATE_USER', error.message, userErrorDictionary);
      req.logger.error(`Error al actualizar usuario: ${formattedError}`);
      res.status(404).json({
        status: "error",
        msg: error
      });
    }
  };



  static uploadProfileImage = async (req, res) => {
    if (req.session && req.session.user) {
        const userId = req.session.user.id; // Obtener el ID del usuario en sesión
        const profileImage = req.files; // Ruta de la imagen de perfil subida

        try {
            // Buscar el usuario por su ID
            const user = await UserService.getUserById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            if (!profileImage || profileImage.length === 0) {
                return res.status(400).json({ error: 'No se han subido archivos' });
            }

            // Actualizar el campo 'profileImage' del usuario con la nueva ruta
            user.profileImage = profileImage;

            // Guardar los cambios en la base de datos
            await UserService.updateUser(userId, user);

            return res.status(200).json({ message: 'Imagen de perfil actualizada correctamente', user });
        } catch (error) {
            console.error('Error al subir la imagen de perfil:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};


  /* static roleUser = async (req, res) => {
     const userId = req.params.userId;
 
    
     try {
 
       const user = await UserService.getUserById(userId);
       if (user.role !== "admin") {
         switch (user.role) {
           case "user":
             user.role = "premium"
             break;
           case "premium":
             user.role = "user"
             break;
           default:
             user.role = "user";
             break;
         }
       }
 
      const result = await UserService.updateUser(userId, user);
       return res.status(200).json({ status: "success", msg: `Rol de usuario actualizado con ID: ${userId}`, user: user });
     } catch (error) {
       console.log(error)
     }
   }*/

 static uploadDocuments = async (req, res) => {
    if (req.session && req.session.user) {
        const userId = req.session.user.id; // Obtener el ID del usuario en sesión
        const uploadedFiles = req.files; // Archivos subidos mediante Multer

        try {
            // Verificar si el usuario existe
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            if (!uploadedFiles || uploadedFiles.length === 0) {
                return res.status(400).json({ error: 'No se han subido archivos' });
            }

            // Actualizar el estado del usuario para indicar que ha subido documentos
            user.hasUploadedDocuments = true;

            // Asociar los archivos subidos con el usuario y guardar las referencias en la base de datos
            uploadedFiles.forEach(file => {
                user.documents.push({ name: file.originalname, reference: file.path });
            });
            await UserService.updateUser(userId, user);

            return res.status(200).json({ status: 'success', message: 'Documentos subidos correctamente', files: uploadedFiles });
        } catch (error) {
            console.error('Error al subir documentos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        // Si no hay un usuario en sesión, devolver un error de no autenticado
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
};


  static updateUserToPremium = async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await UserService.getUserById(userId);

      // Verificar si el usuario es administrador
      if (user.role === "admin") {
        return res.status(403).json({ error: "El usuario es un administrador y no puede ser actualizado a premium" });
      }

      // Verificar si el usuario ya es premium
      if (user.role === "premium") {
        return res.status(400).json({ error: "El usuario ya tiene un rol de premium" });
      }

      // Verificar si el usuario ha cargado los documentos requeridos
      const hasAllRequiredDocuments = UserController.hasAllRequiredDocuments(user.documents);
      if (!hasAllRequiredDocuments) {
        return res.status(400).json({ error: "El usuario no ha cargado todos los documentos requeridos" });
      }

      // Actualizar el rol del usuario a premium
      user.role = "premium";
      await UserService.updateUser(userId, user);

      return res.status(200).json({ status: "success", msg: `Usuario actualizado a premium con ID: ${userId}`, user: user });
    } catch (error) {
      console.error("Error al actualizar usuario a premium:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Método para verificar si el usuario ha cargado todos los documentos requeridos
  static hasAllRequiredDocuments = (documents) => {
    return documents.some(doc => doc.name === 'identification') &&
           documents.some(doc => doc.name === 'proofOfAddress') &&
           documents.some(doc => doc.name === 'AccountState');
};



  static deleteUser = async (req, res) => {
    const uid = req.body.uid;

    try {
      const user = await UserService.getUserById(uid);

      if (!user) {
        return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
      }
      const result = await UserService.deleteUser(user);
      req.logger.info(`Usuario eliminado con éxito, ID: ${user}`);
      res.status(200).send({ status: "success", payload: result })
    } catch (error) {
      const formattedError = customizeError('DELETE_USER', error.message, userErrorDictionary);
      req.logger.error(`Error al eliminar usuario: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static deleteInactiveUsers = async (req, res) => {
    try {
      // const users = await userService.getUsers()

      // Obtener la fecha actual menos 10 minutos
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
      console.log(tenMinutesAgo)
      // Consultar usuarios que no se han conectado en los últimos 10 minutos
      const inactiveUsers = await userModel.find({ last_connection: { $lt: tenMinutesAgo } });
      console.log(inactiveUsers)
      if(inactiveUsers.length == 0){
          throw { message: "No hay usuarios inactivos para borrar." };
      }

      // Eliminar los usuarios encontrados
       await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

     

      res.status(200).json({ status: "success", message: "Usuarios Eliminados con exito" });

    } catch (error) {
      res.status(500).send({ status: "error", error: "error eliminando usuarios" })

    }
  }

  
}

export default UserController;