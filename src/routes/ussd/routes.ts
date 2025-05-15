import express from "express";
import { ussdRequest } from "./controller";

const router = express.Router();

router.post("/", ussdRequest);

export default router;
