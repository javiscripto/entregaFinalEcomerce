import { faker } from "@faker-js/faker";
import nodemailer from "nodemailer";
import env from "./src/env_config/env_config.js";

faker.location = "es";

export const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    code: faker.number.int({ min: 100, max: 999 }),
    price: faker.commerce.price({ min: 1000, max: 200000, dec: 0 }),
    stock: faker.number.int({ min: 1, max: 10 }),
    cat: faker.commerce.department(),
  };
};

///hash bcrypt
import bcrypt from "bcrypt";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

///////////////////////////
export const isValidPass = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
//middleware que valida una sesion activa
export const activeSession = (req, res, next) => {

  if (process.env.NODE_ENV !== "test"){
    if (!req.isAuthenticated()) {
      return res.redirect("/api/sessions/login");
    }

    next();
  }else{
    next();
  }
};
//nodemailer transport

export const transporter = nodemailer.createTransport({
  service: "Gmail",

  auth: {
    user: "javiermanque.fotos@gmail.com",
    pass: env.MAILER_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

