import { logger } from "../../logger/logger.js";
import ProductsMOngo from "../DAO/classes/productsClass.js";
import productModel from "../DAO/models/product.model.js";
import { transporter } from "../../utils.js";

import { createMulterMiddleware } from "../middlewares/multerMiddleware.js";
import { createTransport } from "nodemailer";

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

      console.log(user)
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
    const carts = req.session.user.carts;
    const pid = req.params.pid;
    const product = await productService.getById(pid);
    console.log(carts)
    res.render("detail", { product, pid, carts });
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
    if (process.env.NODE_ENV !== "test") {
      ownerId = req.session.user._id;
    } else {
      ownerId = "idDelOwner";
    }

    //imagen cargada
    console.log(req.file);

    const newProduct = { ...product, owner: ownerId };
    const createdProduct = await productService.createProduct(newProduct);
    res.status(200).json(createdProduct);
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
    logger.error("error interno: ", error);
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
    let currentUser;
    if (process.env.NODE_ENV !== "test") {
      currentUser = req.session.user;
    } else {
      currentUser = { _id: "idDelOwner", role: "admin" };
    }

    const result = await productService.deleteProduct(pid, currentUser);
    if (!result) {
      return res.status(401).json({ message: "no tienes los permisos suficionetes para realizar esta accion" });
    }else{
      const mailOPtion = {
        from: "javiermanque.fotos@gmail.com",
        to: result.owner.email,
        subject: "eliminacion de producto",
        text: `estimado ${result.owner.name} \n Hemos eliminado el producto ${result.product.title}`,
      };
      transporter.sendMail(mailOPtion, (error, info) => {
        if (error) {
          logger.error(" ha ocurrido un error : ", error);
        } else {
          logger.info("mensaje enviado correctamente: ", info);
        }
      });
    }

    res.status(200).json({ status: "success", message: "producto eliminado" });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
};
