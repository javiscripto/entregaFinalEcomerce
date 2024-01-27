

import { logger } from "../../logger/logger.js";
import { createHash , transporter, generateResetToken} from "../../utils.js";
import jwt from "jsonwebtoken";
import UserMongo from "../DAO/classes/userClass.js";
import env from "../env_config/env_config.js";
import userModel from "../DAO/models/users.model.js";
import UserDTO from "../DAO/DTO/userDto.js";

const userService = new UserMongo();

// register
export const getRegister = (req, res) => {
  res.render("register");
};

export const postRegister = (req, res) => {
  res.status(200).send({ status: "success", message: "usuario registrado" });
};

export const failRegister = (req, res) => {
  logger.error("error al regisrar usuario")
  res.send({ error: "fallo el registro" });
};

//login
export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .send({ status: "error", error: "credencial invalida" });

  const sessionUser= new UserDTO(req.user)
  req.session.user =sessionUser;
  res.status(302).redirect("/api/products");
};

export const failLogin = (req, res) => {
  logger.debug("falló el login")
  res.status(401).send("credenciales incorrectas");
};

//login with github
export const githubLogin = (req, res) => {};

export const gitHubCallback = (req, res) => {
  req.session.user = req.user;
  res.redirect("/api/products");
};
/////////////////////////////////////

//update to premim/user role
///////////////////////////////////////////


export const updateRole = async(req, res) => {
  try {
    const { role, email } = req.body;
    const data = await req.files;

    
    const result= await userService.updateRole(role, email,data);
    
    req.session.user=result;
    res.status(200).send("rol actualizado correctamente");//?
  } catch (error) {
    res.status(500).send("ha ocurrido un error interno en el servidor");
  }
};

//////////////////////////////

export const logOut = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // Actualizar la propiedad last_Connection al cerrar sesión
      const user= await userModel.findById(req.user._id)
      user.last_Conection=new Date();
      await user.save()
    }

    req.session.destroy((err) => {
      if (!err) res.redirect("/api/sessions/login");
      else res.send({ status: `logout error`, body: err });
    });
  } catch (error) {
    res.status(500).send({ status: 'logout error', body: error.message });
  }
};

////////////////////////////////////////////////////////restablecer la contraseña
export const forgotPassword = (req, res) => {
  res.render("forgotPasword");
};
//-----------------------
export const postForgotPassword = (req, res) => {
  const { email } = req.body;

  //aqui genero el token para restablecer la contraseña
  const resetToken = generateResetToken(email);

  const mailOPtion = {
    from: "javiermanque.fotos@gmail.com",
    to: email,
    subject: "reestablecer la contraseña",
    text: `pincha el siguiente enlace para reestablecer la contraseña : \n http://localhost:8080/api/sessions/reset-password?token=${resetToken}`,
  };

  transporter.sendMail(mailOPtion, (error, info) => {
    if (error) {
      logger.error(" ha ocurrido un error : ", error);
    } else {
      logger.info("mensaje enviado correctamente: ", info);
    }
  });

  res.send(`hemos enviado un correo a ${email} para restablecer la contraseña`);
};

export const resetPassword = (req, res) => {
  const { token } = req.query;

  // Verifico el token
  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.debug("token expirado o inválido");
      return res.redirect("/api/sessions/ForgotPassword");
    }

    logger.debug("token validado");
    // redirijo
    res.redirect(`/api/sessions/reset-password-form?email=${decoded.email}`);
  });
};

export const resetPasswordForm = (req, res) => {
  const { email } = req.query;
  res.render("resetPassword", { email });
};

export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.updatePassword(
      createHash(password),
      email
    );

    res.status(200).send("ok");
  } catch (error) {
    res.status(500).send("ha ocurrido un error interno en el servidor");
  }
};
