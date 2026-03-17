import { Record } from "../models/records.js";

export const getAllRecords = async (req, res) => {
  try {
    const { definition_id } = req.params;

    const records = await Record.find({
      definition_id: definition_id,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRecordsByDefId = async (req, res) => {
  try {
    const { definitions_id } = req.params;

    const result = await Record.deleteMany({
      definition_id: definitions_id,
    });

    res.json({
      message: "Deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRecordById = async (req, res) => {
  try {
    const { record_id } = req.params;

    const updatedRecord = await Record.findByIdAndUpdate(record_id, req.body, {
      new: true,
    });

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
