import { Router } from "express";
import * as contentTagsController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", contentTagsController.getAllContentTags);
router.get("/content/:contentId", contentTagsController.getTagsByContent);
router.get("/tag/:tagId", contentTagsController.getContentByTag);
router.get("/:contentTagId", contentTagsController.getContentTagById);

// Protected routes
router.use(protectedRoute);
router.post("/", contentTagsController.createContentTag);
router.delete("/:contentTagId", contentTagsController.deleteContentTag);
router.post("/content/:contentId/multiple", contentTagsController.addMultipleTags);
router.delete("/content/:contentId/multiple", contentTagsController.removeMultipleTags);

export default router; 