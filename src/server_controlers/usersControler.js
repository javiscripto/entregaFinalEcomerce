import { logger } from "../../utils/logger.js";
import UserMongo from "../DAO/classes/userClass.js";
const userService= new UserMongo()

//get ALL users (admin)
export const getAllUsers = async(req, res)=>{
    try {
        const result = await userService.getAllUsers();
        res.json({payload:result})

    } catch (error) {
        res.status(500).send({message:"error interno del servidor"})
        logger.error("error interno del servidor: ", error)
    }
}

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

        if(result){
           //updateRole devuelve al usuario actualizado una vez realizada la validacion. 
        //registro del usuario actualizado en la sesion
        req.session.user=result;
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
        console.error("error en la solicitud: ", error)
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
        console.error("error en la solicitud: ", error)
    }
}
