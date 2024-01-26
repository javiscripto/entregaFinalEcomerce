import jwt from "jsonwebtoken";
import env from "../env_config/env_config.js";

export const generateResetToken = (email )=> {
  const token = jwt.sign({ email },env.JWT_SECRET, { expiresIn: "1h" }); 
  console.log("el token es:",token)
  return token;
};
