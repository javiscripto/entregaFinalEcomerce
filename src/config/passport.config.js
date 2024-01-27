import passport from "passport";
import  { Strategy } from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPass } from "../../utils.js";
import userModel from "../DAO/models/users.model.js";
import {cartModel} from "../DAO/models/carts.model.js";
import config from "../env_config/env_config.js";
import { logger } from "../../logger/logger.js";


 
const localStrategy = Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
           logger.info("usuario ya registrado");
            return done(null, false);
          } else {
            const cartUser= await cartModel.create({porducts:[]});
           
            const newUser = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              age: req.body.age,
              carts: cartUser._id
            };
            
            let saveUser;
            
            if (newUser.email == config.ADMIN_NAME && password == config.ADMIN_PASS) {
              saveUser = { ...newUser, role: "admin" };
            } else {
              saveUser = { ...newUser, role: "user" };
            }
            
            // Asigna la contraseña después de la asignación del rol
            saveUser = { ...saveUser, password: createHash(password) };
            
            let result = await userModel.create(saveUser);
            logger.info("usuario registrado con exito",saveUser);
            return done(null, result);
          }
        } catch (error) {
          logger.error("error al obtener usuario en bd", error);
          return done("error al obtener usuario", error);
        }
      }
    )
  );

  ////////////////////////// login
  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            logger.warn(`el usuario no existe`);
          }
          if (!isValidPass(user, password)) {
            logger.warn("contraseña incorrecta")
            return done(null, false);
          }
          user.last_Conection = new Date()
          //logger.debug(user)
          await user.save();
         
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  ///github strategy
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GIT_HUB_ID,
        clientSecret: config.GIT_HUB_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refrechToken, profile, done) => {
        try {
          
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {

            const cartUser= await cartModel.create({porducts:[]});
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 0,
              email: profile._json.email,
              password: "",
              carts:[cartUser._id],
              role:"user"
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );





  //current 
    passport.use("current", new localStrategy( { usernameField: "email" },
     async (username, done)=>{
        try {
          const user = await userModel.findOne({ email: username });
          console.log(user)
          if (!user) {

            return done(null, false);//credenciales invalidas
         
           }
         
           return done(null, user);



        } catch (error) {
          logger.error("error en la estrategia")
          return done(error);
        }
      }
    ))



};

export default initializePassport;
