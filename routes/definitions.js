import express from "express";
import {
  getDefinitions,
  getActiveDefinition,
} from "../controllers/definitionController.js";

const router = express.Router();

router.get("/definitions", getDefinitions);

router.get("/definitions/active", getActiveDefinition);

export default router;
