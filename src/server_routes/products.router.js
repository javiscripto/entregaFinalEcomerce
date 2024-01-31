import { Router } from "express";
import{getAll, getById, createProduct,updateProduct,deleteProduct} from "../server_controlers/products.controler.js"
import{activeSession} from "../middlewares/activeSessionMiddleware.js"
import authorize from "../middlewares/authorizeMiddleware.js";
import passport from "passport";
import initializePassport from "../config/passport.config.js";
import userModel from "../DAO/models/users.model.js";
import { createMulterMiddleware } from "../middlewares/multerMiddleware.js";





initializePassport();
passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    let user= await userModel.findById(id);
    done(null, user)
})


const router= Router();
const adminAuthorization = authorize(['admin',"premium"]);


//get all 
router.get("/", activeSession, getAll);

//get by id 
router.get("/:pid",activeSession, getById);





//////////////////////////// admin////////////////////////
//create product
//utiliza la ruta raiz para agregar productos.
const uploadImg= createMulterMiddleware("products");

router.post("/",adminAuthorization, uploadImg.single("image") ,createProduct );

//update Porduct
router.put("/:pid",adminAuthorization, updateProduct);

//delete Poduct
router.delete("/:pid" , adminAuthorization, deleteProduct)



export default router; 