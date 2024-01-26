import { expect } from "chai";

import supertest from "supertest";
import app from "../src/app.js";
import { cartModel } from "../src/DAO/models/carts.model.js";
import productModel from "../src/DAO/models/product.model.js";
import { describe } from "mocha";

process.env.NODE_ENV = "test";

const requester = supertest(app);

describe("test api/cart/ routes", () => {
  describe("POST methods", async () => {
    it("debe poder agregar un producto al carito", async () => {
      let cart = await cartModel.create({ products: [] });
      let mockProduct = {
        title: "productoPrueba",
        description: "este es un producto de prueba",
        code: "a123",
        price: 1000,
        status: true,
        owner: "admin",
        stock: 1,
        cat: "producto",
      };
      let productDB = await productModel.create(mockProduct);
      ///:cid/products/:pid
      const response = await requester.post(
        `/api/carts/${cart._id}/products/${productDB._id}`
      );
      expect(response.status).to.equal(200);

      //delete created objects
      await cartModel.findByIdAndDelete(cart._id);
      await productModel.findByIdAndDelete(productDB._id);
    });
  });

  describe("GET methods", () => {
    it("debe devolver todos los carritos", async () => {
      let cartsId = [];
      try {
        for (let i = 0; i < 3; i++) {
          const cart = await cartModel.create({ products: [] });
          cartsId.push(cart._id);
        }

        const response = await requester.get("/api/carts");
        expect(response.status).to.equal(200);
        expect(response.body.length).to.be.greaterThan(0);

        //borra los carritos creados finalizada la prueba
        for (let i = 0; i < 3; i++) {
          await cartModel.findByIdAndDelete(cartsId[i]);
        }
      } catch (error) {
        console.error("error en la prueba:", error);
      }
    });

    it("debe devolver un carrito por su id", async () => {
      let cart = await cartModel.create({ products: [] });
      const response = await requester.get(`/api/carts?cartId=${cart._id}`);
      expect(response.status).to.equal(200);
      expect(response.body.length).to.be.greaterThan(0);

      await cartModel.findByIdAndDelete(cart._id);
    });
  });


  describe("DELETE method", ()=>{
    it("deberia poder eliminar un producto por su id", async()=>{
      try {
        let cart = await cartModel.create({ products: [] });
      let mockProduct = {
        title: "productoPrueba",
        description: "este es un producto de prueba",
        code: "a123",
        price: 1000,
        status: true,
        owner: "admin",
        stock: 1,
        cat: "producto",
      };
      let productDB = await productModel.create(mockProduct);

      const response = await requester.delete(
        `/api/carts/${cart._id}/products/${productDB._id}`
      );
      expect(response.status).to.equal(200);

      //delete generated objects
      await cartModel.findByIdAndDelete(cart._id);
      await productModel.findByIdAndDelete(productDB._id);
      } catch (error) {
        console.error("ha ocurrido un error en la prueba: ")
      }
      

    })

  })





});
