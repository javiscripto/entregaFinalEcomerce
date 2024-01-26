import userModel from "../models/users.model.js";
import { logger } from "../../../utils/logger.js";
import UserDTO from "../DTO/userDto.js";

export default class UserMongo {
  updatePassword = async (hashedPassword, email) => {
    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        logger.info("usuario no encontrado");
        return null;
      }
      user.password = hashedPassword;
      await user.save();
      logger.debug("contraseña actualizada");
      return user;
    } catch (error) {
      logger.error("error en la base de datos", error);
      throw error;
    }
  };

  uploadDocuments = async (userId, data) => {
    try {
        const user = await userModel.findById(userId);
        
        if (!user) {
            logger.warn(`Usuario no encontrado`);
            return null;
        }

        const nameFields = ["identificacion", "domicilio", "estado-cuenta"];

        for (let i = 0; i < nameFields.length; i++) {
            const fieldName = nameFields[i];
            const path = data[fieldName][0].path;
            
            const existingDocument = user.documents.find(doc => doc.name === fieldName);

            if (existingDocument) {
                logger.warn(`El documento ${fieldName} ya existe.`);
                /////////////************* probar funcionalidad */
            } else {
                const document = { name: fieldName, reference: path };
                user.documents.push(document);
            }
        }

        await user.save();
        logger.debug(`Archivos cargados`);
        return user;
    } catch (error) {
        logger.error("Error en la base de datos", error);
    }
};

updateRole = async (userId, newUserRole) => {
  try {
      const user = await userModel.findById(userId);

      if (user.role === "premium") {
          user.role = newUserRole;
      } else {
          const requiredDocuments = ["identificacion", "domicilio", "estado-cuenta"];

          if (user.documents.length !== 3) {
              logger.warn("el usuario no existe o faltan documentos ")
              return false;  
          }
      }

      user.role = newUserRole;
      user.save();
      logger.info("rol actualizado");
      const clientUser= new UserDTO(user)
      return user;
  } catch (error) {
      logger.error("ha ocurrido un error en la db al realizar la consulta");
      throw error;
  }
};


  uploadPhotoPath= async(userId, path)=>{
    try {
      const user= await userModel.findById(userId);
      
      user.profilePhoto=path;

      logger.info("foto actualizada");
      user.save();
      return user;

    } catch (error) {
      logger.error("ha ocurrido un error en la db al realizar la consulta: ", error);
      throw error;
    }
  }
getUserById= async(userId)=>{
  try {
    const user = await userModel.findById(userId).lean();
    if(!user){
      return null
    }
    const userClient= new UserDTO(user);
    return userClient;
  } catch (error) {
    logger.error("ha ocurrido un error en la db al realizar la consulta: ", error);
      throw error;
  }
}
  /////admin methods

  getAllUsers= async()=>{
    try {
      const users= await userModel.find().lean();
      
      const clientResponse = users.map(user=> new UserDTO(user))
      return clientResponse
    } catch (error) {
      logger.error("ha ocurrido un error al realizar la consulta :", error);
      throw error;
    }
  }

  deleteUser= async(userId)=>{
    try {
      const user = await userModel.findById(userId);

    } catch (error) {
      logger.error("ha ocurrido un error al realizar la consulta :", error);
      throw error;
    }
  }

}

