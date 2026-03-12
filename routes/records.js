import express from "express";
import {
  getAllRecords,
  deleteRecords,
  updateRecordById,
} from "../controllers/recordController.js";

const router = express.Router();

router.get("/:definition_id/GetAllRecords", getAllRecords);
router.post("/:definitions_id/DeleteRecords", deleteRecords);
router.post("/:definitions_id/UpdateRecordById/:record_id", updateRecordById);
export default router;
