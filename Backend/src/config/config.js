import dotenv from "dotenv";

dotenv.config();


if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined")
}
const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;