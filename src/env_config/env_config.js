import dotenv from "dotenv";

dotenv.config();

export default{
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGOSTRING,
    ADMIN_NAME:process.env.ADMIN_NAME,
    ADMIN_PASS:process.env.ADMIN_PASS,
    GIT_HUB_ID: process.env.gitHubId,
    GIT_HUB_SECRET:process.env.gitHubSecret,
    MAILER_PASS:process.env.NODE_MAIL_PASS,
    JWT_SECRET:process.env.JWT_KEY
}