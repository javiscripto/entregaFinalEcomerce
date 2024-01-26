import { Router } from "express";
import passport from "passport";
import multer from "multer"
import initializePassport from "../config/passport.config.js";
import userModel from "../DAO/models/users.model.js";
import {getRegister,postRegister,failRegister,getLogin,postLogin, failLogin, githubLogin, gitHubCallback, logOut, forgotPassword, postForgotPassword, resetPassword, resetPasswordForm, updatePassword, updateRole} from "../server_controlers/session.controler.js";
import { activeSession } from "../../utils.js";



///set passport
initializePassport();
passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    let user= await userModel.findById(id);
    done(null, user)
})

////////////////////////////// configuracion de multer
const storage= multer.diskStorage({
    destination:(req, file, cb)=>{
      cb(null, `files/documents/`)//en esta carpeta se almacenaran los archivos
    },
    filename:(req, file, cb)=>{
      cb(null, file.fieldname+`-`+file.originalname);
    }
  });
  
  const upload= multer({storage:storage})

/////////////////////////////////////////////


const router = Router();







//register
router.get("/api/sessions/register",getRegister);

router.post("/api/sessions/register",passport.authenticate("register",{failureRedirect:"/failRegister"}), postRegister);

router.get("/failRegister", failRegister)





//login
router.get("/api/sessions/login", getLogin);

router.post("/api/sessions/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), postLogin);

router.get("/api/sessions/faillogin", failLogin)



//login with github--------------------------
router.get("/api/sessions/github",passport.authenticate("github",{scope:["user:email"]}), githubLogin);
///github callback
router.get("/api/sessions/githubcallback",passport.authenticate("github", {failureRedirect:"/register"}) , gitHubCallback);
//------------------------
//este endpoint permite ver la info del usuario y enviará a la vista la opcion para cambiar el role a premium


//------------------------------------------------------
//logout
router.get("/logout", logOut)

//reestablecer la contraseña
router.get("/api/sessions/ForgotPassword"  , forgotPassword);
router.post("/api/sessions/ForgotPassword"  , postForgotPassword);
router.get("/api/sessions/reset-password"  , resetPassword);
router.get("/api/sessions/reset-password-form" , resetPasswordForm)
router.put("/api/sessions/updatePassword", updatePassword);


export default router;
