// Purpose: To store all the environment variables and configurations in one place.
import dotenv from "dotenv";
import path from "path";

// Load plain .env file first
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Load environment specific .env file
const envFile = `.env.${process.env.NODE_ENV || "local"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile), override: true });

// Application configurations
export const APP_NAME = process.env.APP_NAME || "Express API";
export const APP_VERSION = process.env.APP_VERSION || "1.0.0";
export const APP_DESCRIPTION = process.env.APP_DESCRIPTION || "REST API";
export const APP_AUTHOR = process.env.APP_AUTHOR || "Author";
export const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:3000";

// Server and database configurations
export const PORT = process.env.PORT || 5000;
export const BASE_URL = process.env.BASE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
export const NODE_ENV = process.env.NODE_ENV || "production";
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const SECRET_KEY = process.env.SECRET_KEY || "";
export const TICKET_SECRET = process.env.TICKET_SECRET || "";

// Authentication-related values
export const HASH_SALT = parseInt(process.env.HASH_SALT || "10", 10);

// AI configurations
export const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
export const MISTRAL_URL = process.env.MISTRAL_URL || "";

// Africa's Talking configurations
export const AFRICAS_TALKING_API_KEY = process.env.AFRICAS_TALKING_API_KEY || "";
export const AFRICAS_TALKING_USERNAME = process.env.AFRICAS_TALKING_USERNAME || "";
