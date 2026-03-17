import express from "express";
import {
  getDefinitions,
  getActiveDefinition,
} from "../controllers/definitionController.js";

const router = express.Router();

/**
 * @swagger
 * /api/sensors/definitions:
 *   get:
 *     summary: Lấy tất cả definitions
 *     tags: [Definitions]
 *     responses:
 *       200:
 *         description: Danh sách definitions
 */
router.get("/", getDefinitions);

/**
 * @swagger
 * /api/sensors/definitions/active:
 *   get:
 *     summary: Lấy definition đang active
 *     tags: [Definitions]
 *     responses:
 *       200:
 *         description: Definition active
 */
router.get("/active", getActiveDefinition);

export default router;
