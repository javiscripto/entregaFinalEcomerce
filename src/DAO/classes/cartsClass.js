import { cartModel } from "../models/carts.model.js";
import userModel from "../models/users.model.js";
import { logger } from "../../../logger/logger.js";
import productModel from "../models/product.model.js";

class CartsMongo {
  constructor() {}

  createCart = async (userId) => {
    try {
      // Crear un nuevo carrito
      const cart = await cartModel.create({ products: [] });

      // Actualizar el usuario para agregar el nuevo carrito al array 'carts'
      const user = await userModel.findById(userId);
      if (!user) {
        logger.error(`Usuario con id ${userId} no encontrado.`);
        return null;
      }

      user.carts.push(cart._id); // Agregar el nuevo carrito al array 'carts'
      await user.save();

      return cart;
    } catch (error) {
      logger.error("Error al crear carrito", error);
      return null;
    }
  };

  getAll = async () => {
    try {
      const carts = await cartModel.find().populate("products.item");
      return carts;
    } catch (error) {
      logger.error("error al obtener carritos: ", error);
    }
  };

  userCarts= async(uid)=>{
    try {
      const user= await userModel.findById(uid).lean();
      
      return user.carts||null

    } catch (error) {
      logger.error(`error al obtener usuario: `,error)
    }
  };

  getById = async (cartId) => {
    try {
      const cart = await cartModel
        .findById(cartId)
        .populate("products.item")
        .lean();

      return cart;
    } catch (error) {
      logger.error("error al obtener carrito: ", error);
    }
  };

  addProduct = async (cartId, productId, quantity) => {
    try {

      //validacion de owner 
      const user = await userModel.findOne({carts:{ $in: cartId }});
      
      const product= await productModel.findOne({_id:productId});
//revisar validacion de creador de product
      if(user.role!=="admin" && product.owner==user.id){
        logger.debug("service: no puedes agregar este producto a tu carrito");
        return null;
      };
      //fin validacion



      const cart = await cartModel.findById(cartId);
      console.log(cart)
      if (!cart){
        logger.debug(`service: El carrito con id ${cartId} no existe`)
        return null ;
      } 

      const existingProduct = cart.products.find(
        (prod) => prod.item.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
        logger.info(
          `service: Se ha agregado la cantidad de ${quantity} item(s) al producto`
        );
      } else {
        const newProduct = { item: productId, quantity: quantity }; // Corregido aquí, cambiado de product a item
        cart.products.push(newProduct);
        logger.info(`service: Se ha agregado el producto ${productId} al carrito`);
      }

      await cart.save();
      // Poblar la referencia correcta
      const populatedCart = await cartModel
        .findById(cartId)
        .populate("products.item")
        .lean();
        
      
      return populatedCart;
    } catch (error) {
      logger.error("Error:", error);
    }
  };

  deleteProduct = async (cartId, productId) => {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) return `el carrito con id ${cartId} no existe`;

      const productToDeleteIndex = cart.products.findIndex(
        (prod) => prod.item.toString() === productId
      );

      if (productToDeleteIndex === -1) {
        logger.info("Producto no encontrado en el carrito");
      } else {
        // Eliminar el producto del array de productos del carrito
        cart.products.splice(productToDeleteIndex, 1);
        await cart.save();
        return `producto ${productId} eliminado del carrito`;
      }
    } catch (error) {
      logger.error("service error:", error);
    }
  };
}
export default CartsMongo;
