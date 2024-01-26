import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";


import userModel from "../src/DAO/models/users.model.js";
import { cartModel } from "../src/DAO/models/carts.model.js";


process.env.NODE_ENV = "test";
const requester = supertest(app);

describe("test api/sessions/ routes", () => {

  
  let mockUser = {
    first_name: "juanito",
    last_name: "perez",
    email: "juanito@mail.com",
    age: "21",
    password: "contraseña123",
  };

 

  after(async () => {
    const deleted= await userModel.findOneAndDelete({ first_name: "juanito" }).lean();
   
    await cartModel.findByIdAndDelete(deleted.carts[0])
  });
////-------------------------------------------------
  it("deberia poder registrar un usuario", async () => {
   
    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser)
      .set("Content-Type", "application/json");
    expect(response.status).equal(200);
    expect(response.body).to.be.an("object");
  });
  it("al ingresar un campo invalido debe redireccionar a api/sessions/faillogin y devolver un codigo de redireccion 302", async()=>{
    const invalidCredentials= {email:mockUser.email, password:"contraseñaFalsa"};

    const response= await requester.post("/api/sessions/login")
    .send(invalidCredentials)
    .set("Content-Type","application/json");
    
  expect(response.statusCode).equal(302)
  });

  it("deberia poder logear a un usuario correctamente", async () => {
    const credentials= {email:mockUser.email, password:mockUser.password}
    const response= await requester.post("/api/sessions/login")
        .send(credentials)
        .set("Content-Type","application/json");
      expect(response.statusCode).equal(302); //redireccion a /api/products
  });




});
