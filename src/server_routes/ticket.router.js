import { Router } from "express";
import authorize from "../config/authorizeMiddleware.js";

import { getAll } from "../server_controlers/ticket.controler.js";


const adminAuthorization = authorize(['admin']);


const router= Router();
//estas rutas solo serán accesibles para el administrador 
router.get("/", adminAuthorization,getAll)

export default router; 