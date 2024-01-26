import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const productionLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    // new winston.transports.Console({level:"info"}),
    new winston.transports.Console({ level: "http" }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

const devLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({filename:"error.log",level:"error"})],
});





export const logger = process.env.ENV === "production" ? productionLogger : devLogger;
logger.info(`Winston ENV: ${process.env.ENV}`);


export const addLoggerMiddleware = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${req.url}`);

  next();
};
