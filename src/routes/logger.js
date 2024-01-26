import { logger } from "../../utils/logger.js";
import { Router } from "express";

const router= Router();


//realizar pruebas de los logs 
router.get("/", (req, res)=>{
    logger.info("info")
    logger.error("error")
    logger.warn("warning")
    logger.debug("debug")
    logger.silly("message")
    
    res.send("test  logger")
})






export default router;
