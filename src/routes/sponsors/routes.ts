import { Router } from "express";
import * as sponsorsController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", sponsorsController.getAllSponsors);
router.get("/active", sponsorsController.getActiveSponsors);
router.get("/:sponsorId", sponsorsController.getSponsorById);

router.use(protectedRoute);

// Admin only routes
router.post("/", protectedRoute, sponsorsController.createSponsor);
router.put("/:sponsorId", protectedRoute, sponsorsController.updateSponsor);
router.delete("/:sponsorId", protectedRoute, sponsorsController.deleteSponsor);

export default router; 