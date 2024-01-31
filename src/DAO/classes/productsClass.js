import productModel from "../models/product.model.js";
import { logger } from "../../../logger/logger.js";
import userModel from "../models/users.model.js";

class ProductsMOngo {
  constructor() {}

  checkStockAndUpdate = async (products) => {
    try {
      let toPurchase = [];
      let noComprados = [];
  
      for (const prod of products) {
        const prodDb = await productModel.findById(prod.item._id).lean();
  
        if (prodDb.stock >= prod.quantity) {
          toPurchase.push(prod);
  
          const newStock = prodDb.stock - prod.quantity;
          
          await this.updateProduct(prodDb._id, { stock: newStock })
        } else {
          noComprados.push(prod.item._id);
        }
      }
  
      
      return [toPurchase, noComprados];
    } catch (error) {
      logger.error(`error: `, error);
    }
  };
  

  //routes methods
  getAll = async () => {
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      logger.error(`error al obtener productos:`, error);
    }
  };

  getById = async (productId) => {
    try {
      const product = await productModel.findById(productId).lean();
      if (!product) return `producto ${productId} no encontrado`;
      return product;
    } catch (error) {
      logger.error(`error:`, error);
    }
  };

  createProduct = async (productData) => {
    try {
      const newProduct = await productModel.create(productData);
      return newProduct;
    } catch (error) {
      logger.error(`error:`, error);
    }
  };

  updateProduct = async (productId, updatedProductData) => {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        updatedProductData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      logger.error(`error :`, error);
    }
  };

  deleteProduct = async (productId,currentUser) => {
    try {
      const product = await productModel.findById(productId).lean();
      if(!product){
        console.log("producto no encontrado")
        return null
      }
      const ownerid= product.owner 
      const owner= await userModel.findById(ownerid)
      

      //valido antes de eliminar el producto
      if(currentUser.role=="admin" || (currentUser.role=="premium" && currentUser._id==owner._id)){
        await productModel.findByIdAndDelete(productId);
        owner.save()
        return {owner:{email:owner.email, name:`${owner.first_name} ${owner.last_name}`},product:product}
      }else{
        logger.warn("el usuario actual no puede eliminar el producto")
        return null
      };
      
    } catch (error) {
      logger.error("error", error);
    }
  };
}

export default ProductsMOngo;
