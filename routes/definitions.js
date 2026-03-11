import express from "express";
import {
  getAllDefinitions,
  getDefinitionById,
  createDefinition,
  updateDefinition,
  deleteDefinition,
  toggleActive,
} from "../controllers/definitionController.js";

const router = express.Router();

// QUAN TRỌNG: Đặt các route cụ thể TRƯỚC route động :id
// GET: /definitions/active - Lấy definition đang active
router.get("/active", async (req, res) => {
  try {
    const Definition = (await import("../models/definitions.js")).default;
    const activeDefinition = await Definition.findOne({ active: true });

    if (!activeDefinition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy definition active",
      });
    }

    res.json({
      success: true,
      data: activeDefinition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET: /definitions - Lấy tất cả definitions
router.get("/", getAllDefinitions);

// GET: /definitions/:id - Lấy definition theo ID (đặt SAU các route cụ thể)
router.get("/:id", getDefinitionById);

// POST: /definitions - Tạo definition mới
router.post("/", createDefinition);

// PUT: /definitions/:id - Cập nhật definition
router.put("/:id", updateDefinition);

// DELETE: /definitions/:id - Xóa definition
router.delete("/:id", deleteDefinition);

// PATCH: /definitions/:id/toggle - Kích hoạt/vô hiệu hóa
router.patch("/:id/toggle", toggleActive);

export default router;
