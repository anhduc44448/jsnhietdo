import express from "express";
import {
  getAllRecords,
  deleteRecordsByDefId,
  updateRecordById,
} from "../controllers/recordController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/sensors/records/{definition_id}/GetAllRecords:
 *   get:
 *     summary: Lấy tất cả records theo definition_id
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của definition
 *     responses:
 *       200:
 *         description: Danh sách records
 */
router.get("/:definition_id/GetAllRecords", getAllRecords);

/**
 * @swagger
 * /api/sensors/records/{definition_id}/DeleteRecords:
 *   post:
 *     summary: Xóa tất cả records theo definition_id
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Token không hợp lệ
 */
router.post("/:definition_id/DeleteRecords", verifyToken, deleteRecordsByDefId);

/**
 * @swagger
 * /api/sensors/records/{definition_id}/UpdateRecordById/{record_id}:
 *   post:
 *     summary: Cập nhật record theo ID
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: record_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Update thành công
 */
router.post("/:definition_id/UpdateRecordById/:record_id", updateRecordById);

export default router;
