import productModel from "../models/product.model.js";
import { logger } from "../../../utils/logger.js";

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

  deleteProduct = async (productId,owner) => {
    try {
      const product = await productModel.findById(productId);
      if(owner.role=="admin" || product.owner==owner._Id && owner.role=="premium"){
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        return deletedProduct;
        
      };
      return null;
      
    } catch (error) {
      logger.error("error", error);
    }
  };
}

export default ProductsMOngo;
