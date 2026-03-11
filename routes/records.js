import express from "express";
import {
  getAllRecords,
  getRecordById,
  createRecord,
  createBulkRecords,
  updateRecord,
  deleteRecord,
  deleteBulkRecords,
  getRecordStats,
} from "../controllers/recordController.js";

const router = express.Router();

// GET: /records - Lấy tất cả records
router.get("/", getAllRecords);

// GET: /records/stats - Thống kê records
router.get("/stats", getRecordStats);

// GET: /records/:id - Lấy record theo ID
router.get("/:id", getRecordById);

// POST: /records - Tạo record mới
router.post("/", createRecord);

// POST: /records/bulk - Tạo nhiều records
router.post("/bulk", createBulkRecords);

// PUT: /records/:id - Cập nhật record
router.put("/:id", updateRecord);

// DELETE: /records/:id - Xóa record
router.delete("/:id", deleteRecord);

// DELETE: /records/bulk/delete - Xóa nhiều records
router.delete("/bulk/delete", deleteBulkRecords);

export default router;
