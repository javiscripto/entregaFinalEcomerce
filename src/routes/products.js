import { Router } from "express";
import CustomError from "../error/customError.js";
import EErrors from "../error/enum.js";
import {  invalidTypeError, nullField } from "../error/info.js";




const router = Router();


//////////////////////products///////////////
/*


{
  "title":"producto de prueba",
  "description":"descripcion de prueba",
  "code":123,
  "price":1990,
  "status":true,
  "stock":10,
  "cat":"cat1"
}

productos requeridos por el cuerpo de la solicitud 
*/
let products=[];


router.get("/", (req, res)=>{
  res.send({status:"success", payload: products})
});


router.post("/", (req, res)=>{
  const {title, description, code, price, status, stock, cat}= req.body;

  if(!title|| !description || !code || !price || !status || !cat){
    CustomError({
      name: "product creation error",
      cause: nullField({title, description, code, price, status, stock, cat}),
      message: `error al crear el producto: datos no definidos`,
      code: EErrors.NULL_UNDEFINED_FIELD_ERROR,
    })
  };
  if(typeof(title)!=="string"||typeof(price)!=="number"){
    CustomError({
      name:"",
      cause: invalidTypeError({title, price}),
      message:"error al crear producto: tipo de datos incorrectos",
      code: EErrors.INVALID_TYPES_ERROR
    })
  };


  const product={title, description, code, price, status, stock, cat};
  products.push(product)

  res.send({status:"success",payload:product})

});



export default router;
