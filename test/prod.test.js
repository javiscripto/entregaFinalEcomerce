import { expect } from "chai";

import supertest from "supertest";
import app from "../src/app.js";

import productModel from "../src/DAO/models/product.model.js";

process.env.NODE_ENV = "test";

const requester = supertest(app);

describe("test /api/products routes", () => {
    
    
    let mockProduct = {
        title: "productoPrueba",
        description: "este es un producto de prueba",
        code: "a123",
        price: 1000,
        status: true,
        owner:"idDelOwner",
        stock: 1,
        cat: "producto",
      };

      after(async()=>{
        await productModel.findOneAndDelete({title:"productoPrueba"})
      })
 
    it("deberia devolver una lista con todos los productos", async () => {
      return new Promise(async (resolve, reject) => {
        try {
        
      
  
          const productDB = await productModel.create(mockProduct);
  
          const response = await requester.get("/api/products");
  
          expect(response.body).to.be.an("array");
          
  
          resolve(); 
        } catch (error) {
          console.error("Ha ocurrido un error al ejecutar la prueba: ", error);
          reject(error); // Marcar la promesa como rechazada si hay un error
        }
      });
    });
  
  it("debería poder obtener un producto por su id", async()=>{
    try {
      

        const productDB = await productModel.create(mockProduct);
        const response = await requester.get(`/api/products/${productDB._id}`);
        expect(response.body).to.be.an("object");
        
    } catch (error) {
        console.error("Ha ocurrido un error al ejecutar la prueba: ", error);

    }
  })

  it("deberia poder eliminar un producto por su id", async()=>{
    try {
        const productDB = await productModel.create(mockProduct);
        const response= await requester.delete(`/api/products/${productDB._id}`);

        expect(response.status).equal(200);

    } catch (error) {
        console.error("Ha ocurrido un error al ejecutar la prueba: ", error);

    }
  })

  it("debería poder crear un producto en la base de datos", async()=>{
    try {
        let mockProductPost = {
            title: "productoPrueba",
            description: "este es un producto de prueba",
            code: "a123",
            price: 1000,
            status: true,
            stock: 1,
            cat: "producto",
          };

        const response= await requester.post("/api/products")
        .send(mockProductPost)
        .set("Content-Type", "application/json");

        expect(response.status).equal(200);
        expect(response.body).to.be.an("object");


    } catch (error) {
        console.error("ha ocurrido un error al ejecutar la prueba:", error)
    }
  })




});
