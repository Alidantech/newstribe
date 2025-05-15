import { Router } from "express";
import * as gamesController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", gamesController.getAllGames);
router.get("/active", gamesController.getActiveGames);
router.get("/type/:type", gamesController.getGamesByType);
router.get("/:gameId", gamesController.getGameById);

router.use(protectedRoute);

// Admin only routes
router.post("/", protectedRoute, gamesController.createGame);
router.put("/:gameId", protectedRoute, gamesController.updateGame);
router.delete("/:gameId", protectedRoute, gamesController.deleteGame);
router.patch("/:gameId/status", protectedRoute, gamesController.updateGameStatus);

export default router;
