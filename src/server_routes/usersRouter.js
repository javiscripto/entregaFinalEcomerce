import { Router } from "express";
import { activeSession } from "../middlewares/activeSessionMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import { createMulterMiddleware } from "../middlewares/multerMiddleware.js";
import { getUserInfo , getForm, uploadDocuments, uploadPhoto, PUTuserRole, getAllUsers, deleteUsers, deleteUserById } from "../server_controlers/usersControler.js";




//middleware multer
const documentsUpload= createMulterMiddleware("documents");
const profileUpload= createMulterMiddleware("profiles");

//middleware authorization
const adminAuthorization= authorize(["admin"])



const router= Router();
//obtener informacion del usuario
router.get("/:uid", activeSession , getUserInfo);

//obtener todos los usuarios
router.get("/", activeSession,adminAuthorization, getAllUsers);

//DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. 
router.delete("/delete", activeSession, adminAuthorization, deleteUsers)

router.delete("/delete/:uid", activeSession, adminAuthorization, deleteUserById)

//actualizar role de usuario en DB
router.put("/premium/:uid",activeSession, PUTuserRole );

//upload documents
router.get("/:uid/documents", activeSession, getForm)//
router.post("/:uid/documents",activeSession , documentsUpload.fields([{name:"identificacion"},{name:"domicilio"},{name:"estado-cuenta"}]), uploadDocuments);

//upload profile photo
router.post("/:uid/profile", activeSession, profileUpload.single("profilePhoto"), uploadPhoto )



export default router;
