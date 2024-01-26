import CartsMongo from "../DAO/classes/cartsClass.js";
import userModel from "../DAO/models/users.model.js";
import { TicketMongo } from "../DAO/classes/ticketClass.js";
import ProductsMOngo from "../DAO/classes/productsClass.js";
import { logger } from "../../utils/logger.js";

const cartService = new CartsMongo();
const productService= new ProductsMOngo();

const ticketService= new TicketMongo();

const createCart=async(req, res)=>{
    const uid = req.params.uid
    
    const newCart= await cartService.createCart(uid);
    res.json({result:"success", payload:newCart})
}


const getAll=async(req,res)=>{
    const carts= await cartService.getAll();
    res.json(carts)
}

const getUserCart= async(req, res)=>{
    const userId= req.params.uid
    const carts= await cartService.userCarts(userId);
    
    res.send({payload:carts})
}

const getById=async(req, res)=>{
    //const cid = req.params.cid
    const {cartId}= req.query
    const cart = await cartService.getById(cartId);
    
    const products= cart.products
    //
    
   
    res.render("cart",{products,cid})
}

const addProduct= async(req, res)=>{
    const cid= req.params.cid;
    const pid= req.params.pid;
    const quantity= Number(req.body.quantity)
    const result= await cartService.addProduct(cid,pid,quantity);
    
    res.json(result)
}

const deleteProduct= async (req, res)=>{
    const cid= req.params.cid;
    const pid= req.params.pid;

    const result= cartService.deleteProduct(cid,pid);
    res.json(result)
}

const purchase= async(req, res)=>{
    const cid=req.params.cid;
    const cart= await cartService.getById(cid);
    const products= cart.products;
    const validatedProducts=await productService.checkStockAndUpdate(products)
    //el método checkStock devuelve un arreglo con 2 posiciones
    //[0]productos comprados, [1]productos sin stock no agregados 



  
    let amount=0;
    validatedProducts[0].forEach(prod=>{
        amount+=prod.item.price*prod.quantity
    });


    const user= await userModel.findOne({cart:cid}).lean();
    const data={
        code:`${cid}`,
        amount:amount,
        purchaser:user.email
    }
    const result=await ticketService.createTicket(data)
    res.status(201).json({comprados:result, NoComprados:validatedProducts[1]})
    
}

export default{createCart,getAll,getById, getUserCart,addProduct,deleteProduct, purchase}