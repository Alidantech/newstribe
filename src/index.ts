import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/db.config";
import { bootstrap } from "./utils/api.bootstrap";
import { PORT } from "./config/env.config";

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
const port = PORT;
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(cookieParser());

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Middleware to parse incoming requests with URL-encoded payloads
bootstrap(app, __dirname);

// Middleware to log incoming requests to the console
app.use(morgan("dev"));

// Connect to the database
dbConnection();

// Start the server
app.listen(port, () => {
  console.log(`Server listening on  http://localhost:${port}`);
});
