import { Router } from "express";
import * as tagsController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", tagsController.getAllTags);
router.get("/active", tagsController.getActiveTags);
router.get("/popular", tagsController.getPopularTags);
router.get("/:tagId", tagsController.getTagById);

router.use(protectedRoute);

// Admin only routes
router.post("/", tagsController.createTag);
router.put("/:tagId", tagsController.updateTag);
router.delete("/:tagId", tagsController.deleteTag);

export default router;
