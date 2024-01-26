import { Router } from "express";
import { generateProducts } from "../../utils.js";

const router= Router()

router.get("/", (req, res)=>{
    let result= [];
    for(let i=0;i<50;i++){
        result.push(generateProducts())
    };
    
    res.send({status:"success", payload:result})
  });


export default router;
