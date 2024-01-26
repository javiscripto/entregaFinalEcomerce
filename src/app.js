import express, { json } from "express";
import mongoose from "mongoose";
import session from "express-session";
import config from "./env_config/env_config.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import { addLoggerMiddleware , logger} from "../utils/logger.js";
import errorHandler from "./middlewares/index.js"
import initializePassport from "./config/passport.config.js";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
initializePassport()


//seteo trabajo con rutas
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = config.PORT;

//set session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL,
      ttl: 60 * 60 * 10, //
    }),
    secret: "clave",
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "cookiename",
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 20,
    },
  })
);

//set swagger
const specs = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación basica del ecomerce",
      description: "incluye la informacion sobre los modelos de la base de datos, los códigos de respuesta del servidor y los params necesarios para realizar las busquedas",
    },
  },
  apis: [
    path.join(__dirname, "docs", "productsDoc", "products.yaml"),
    path.join(__dirname, "docs", "cartsDoc", "carts.yaml"),
  ],
});

//middlewares
app.use(`/apidocs`, swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(addLoggerMiddleware);
app.use(errorHandler);


//set public folder
app.use(express.static(path.join(__dirname, "public")));

//import routes
import productRoute from "./server_routes/products.router.js";
import cartRoute from "./server_routes/carts.router.js";
import usersRouter from "./server_routes/usersRouter.js";

import mockRouter from "../src/routes/mocking.js";
import productsRouter from "./routes/products.js";
import ticketRouter from "../src/server_routes/ticket.router.js"
import loggerRouter from "./routes/logger.js";//para realizar los test


//import messagesRoute from "./routes/messages.route.js";
import sessionRoute from "./server_routes/session.router.js";

app.use("/", sessionRoute);
app.use("/api/users", usersRouter)
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/tickets",ticketRouter)
app.use("/api/mockingProducts",mockRouter);
app.use("/api/products", productsRouter);
app.use("/loggerTest",loggerRouter)




//app.use("/", messagesRoute)

//handlebars

import { engine } from "express-handlebars";
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + `/views`);



////////////////// Middleware de autorización para ciertos endpoints

import authorize from "./config/authorizeMiddleware.js";




passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    let user= await userModel.findById(id);
    done(null, user)
})




///////////////////////////////////  set mongoose conection

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info("conectado a la base de datos");
  })
  .catch((error) => {
    logger.error("error al conectar ");
  });




app.listen(port, () => {
  logger.info(`server running on port ${port}`);
});
export default app