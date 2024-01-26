import { Router } from "express";
import cartControler from "../server_controlers/cart.controler.js";
import userModel from "../DAO/models/users.model.js";
import authorize from "../config/authorizeMiddleware.js";
import passport from "passport";




const router= Router();

import pkg from 'passport';
const { initialize } = pkg;


passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    let user= await userModel.findById(id);
    done(null, user)
})




const userAuthorization = authorize(['user']);

//create Cart
router.post("/:uid",cartControler.createCart);

//////////////////////////////
//crear una ruta de prueba que obtenga los carritos de un usuario
router.get("/:uid", cartControler.getUserCart)
//////////////////

//get All
router.get("/",cartControler.getAll);

//get BY id (el id del carrito se recibe por req.query )
router.get("/",cartControler.getById);

//add Product 
router.post("/:cid/products/:pid",userAuthorization,cartControler.addProduct);

//delete Product
router.delete("/:cid/products/:pid", userAuthorization,cartControler.deleteProduct);

//purchase cart
router.post("/:cid/purchase",cartControler.purchase);


export default router; 