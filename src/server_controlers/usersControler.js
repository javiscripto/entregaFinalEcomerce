import { logger } from "../../logger/logger.js";
import UserMongo from "../DAO/classes/userClass.js";
import { transporter } from "../../utils.js";
const userService= new UserMongo()

//get ALL users (admin)
export const getAllUsers = async(req, res)=>{
    try {
        const users = await userService.getAllUsers();
        
        res.status(200).render("adminView", {users})

    } catch (error) {
        res.status(500).send({message:"error interno del servidor"})
        logger.error("error interno del servidor: ", error)
    }
};

export const deleteUserById=async(req, res)=>{
    try {
        const userId= req.params.uid;
        const result = await userService.deleteUserById(userId);
        if(!result)return res.status(400).send("ha ocurrido un problema al eliminar al usuario");
        res.status(200).send({status:"success"})
    } catch (error) {
        res.status(500).send({message:"error interno del servidor"})
        logger.error("error interno del servidor: ", error)
    }
}

export const deleteUsers= async(req, res)=>{
    try {
        const inactiveUsers= await userService.deleteUser();
        inactiveUsers.forEach(user=>{
            const mailOPtion = {
                from: "javiermanque.fotos@gmail.com",
                to: user.email,
                subject: "eliminacion de la cuenta",
                text: `estimado ${user.fullname} \n Hemos eliminado tu cuenta por inactividad. `,
              };
              transporter.sendMail(mailOPtion, (error, info) => {
                if (error) {
                  logger.error(" ha ocurrido un error : ", error);
                } else {
                  logger.info("mensaje enviado correctamente: ", info);
                }
              });
        })
        res.json(inactiveUsers)
        

    } catch (error) {
        res.status(500).send({message:"error interno del servidor"})
        logger.error("error interno del servidor: ", error)
    }
}




/////////////////////////////////////////////
//get user info
export const getUserInfo = async(req, res) => {
    try {
    const user = req.session.user;
    const userId= req.params.uid;
    
 
    res.render("userinfo", { user });
    } catch (error) {
        res.status(500).send({message:"error interno del servidor", error:error})
        logger.error("error interno del servidor: ", error)
    }
 
  };

export const PUTuserRole = async(req, res)=>{
    try {
        const uid= req.params.uid;
        const newUserRole= req.body.role;
        
        const result= await userService.updateRole(uid,newUserRole)
        //updateRole devuelve al usuario actualizado una vez realizada la validacion. 
        if(result){
             if(req.session.user.role!=="admin"){ //valido si quien realizó la solicitud fue el administrador
            req.session.user=result;//actualizo req.session 
        };
        logger.info(req.session.user)
        return res.status(200).send("el rol del usuario ha sido actualizado");
        };
        
        res.status(400).send("faltan documentos para actualizar el rol")
       
    } catch (error) {
        res.status(500).send({message:"error interno del servidor"})
    }
};



export const getForm=async(req, res)=>{
    try {
        const uid= req.params.uid;

        res.render("uploadDocuments",{uid})

    } catch (error) {
        res.status(500).send({message:"error interno del servidor"})
    }
}

export const uploadDocuments = async (req, res) => {
    try {
        const uid = req.params.uid;
        const data = req.files

        const result= await userService.uploadDocuments(uid,data)
        res.send("Archivos cargados");
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor" });
        logger.error("error en la solicitud: ", error)
    }
};
export const uploadPhoto = async(req, res)=>{
    try {
        const uid= req.params.uid;
        const data = req.file

        const result = await userService.uploadPhotoPath(uid,data.path)
     
        res.status(200).json({message:"foto de perfil actualizada", payload: result})
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor" });
        logger.error("error en la solicitud: ", error)
    }
}
