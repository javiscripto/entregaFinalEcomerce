import { logger } from "../../logger/logger.js";
import ProductsMOngo from "../DAO/classes/productsClass.js";
import productModel from "../DAO/models/product.model.js";

import { createMulterMiddleware } from "../middlewares/multerMiddleware.js";

const productService = new ProductsMOngo();

export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    if (process.env.NODE_ENV !== "test") {
      const options = { page, limit };
      const result = await productModel.paginate({}, options);

      const hasPreviousPage = page > 1;
      const hasNextPage = page < result.totalPages;
      const previousPage = hasPreviousPage ? page - 1 : page;
      const nextPage = hasNextPage ? page + 1 : page;

      const dbProducts = result.docs.map((product) => product.toObject()); // Convertir a objetos JSON

      const user = req.session.user;
      const adminRole = user.role === "admin" || user.role === "premium"; // Corregir la condición de roles

      res.status(200).render("products", {
        dbProducts,
        hasPreviousPage,
        hasNextPage,
        previousPage,
        nextPage,
        currentPage: page,
        limit,
        user,
        adminRole,
      });
    } else {
      const products = await productService.getAll();
      res.json(products);
    }
  } catch (error) {
    console.error("Ha ocurrido un error en el controlador getAll:", error);
    res.status(500).json({ result: "error", message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const cart = req.session.user.cart;
    const pid = req.params.pid;
    const product = await productService.getById(pid);
    res.render("detail", { product, pid, cart });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
};





export const createProduct = async (req, res) => {
  try {
    
      const product = req.body;
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.cat
      ) {
        res.status(400).send("faltan datos");
      }
      let ownerId;
      if(process.env.NODE_ENV!=="test"){
        ownerId= req.session.user._id;
      }else{
        ownerId="idDelOwner"
      };

      
      //imagen cargada 
      console.log(req.file)

      const newProduct = { ...product, owner: ownerId  };
      const createdProduct = await productService.createProduct(newProduct);
      res.status(200).json(createdProduct);
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
    logger.error("error interno: ", error)
  }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const data = req.body;

    const updatedProduct = await productService.updateProduct(pid, data);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    let owner;
    if(process.env.NODE_ENV !== "test"){
       owner=req.session.user;
    }else{
        owner={_id:"idDelOwner",role:"admin"}
    }

    const result = await productService.deleteProduct(pid, owner);
    if (!result) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ status: "success", message: "producto eliminado" });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
};
