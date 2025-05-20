import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/db.config";
import { bootstrap } from "./utils/api.bootstrap";
import { PORT } from "./config/env.config";
import path from "path";

/**
 * Initializes an Express application.
 *
 * This instance of the Express application will be used to define the
 * middleware, routes, and other configurations necessary for the backend
 * server. The application can be started by calling the `listen` method
 * on this instance.
 *
 * Example usage:
 * ```typescript
 * const app = express();
 * app.use(someMiddleware);
 * app.get('/route', someHandler);
 * app.listen(port, () => {
 *   console.log(`Server is running on port ${port}`);
 * });
 * ```
 *
 * @see {@link https://expressjs.com/} for more information about Express.
 */
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true
}));

// Get the src directory path
const srcDirectory = path.join(__dirname);

// Initialize routes
bootstrap(app, srcDirectory);

// Start server function
async function startServer() {
  try {
    // Connect to database first
    await dbConnection();
    
    // Only start server after successful database connection
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
