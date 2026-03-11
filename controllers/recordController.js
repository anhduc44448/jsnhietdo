import mongoose from "mongoose";
import Record from "../models/records.js";
import Definition from "../models/definitions.js";

// Lấy tất cả records
export const getAllRecords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      definitionId,
      startDate,
      endDate,
      key,
    } = req.query;

    let query = {};

    if (definitionId) {
      query.definition_id = definitionId;
    }

    if (startDate || endDate) {
      query.created_date = {};
      if (startDate) query.created_date.$gte = new Date(startDate);
      if (endDate) query.created_date.$lte = new Date(endDate);
    }

    if (key) {
      query["values.key"] = key;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await Record.find(query)
      .populate("definition_id")
      .sort({ created_date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Record.countDocuments(query);

    res.json({
      success: true,
      count: records.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy record theo ID
export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate(
      "definition_id",
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy record",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Tạo record mới
export const createRecord = async (req, res) => {
  try {
    const { definition_id, values, created_date, avg } = req.body;

    // Kiểm tra definition có tồn tại không
    const definition = await Definition.findById(definition_id);
    if (!definition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy definition",
      });
    }

    // Kiểm tra các key có hợp lệ không
    const validKeys = definition.column.map((col) => col.key);
    const invalidKeys = values
      .map((v) => v.key)
      .filter((key) => !validKeys.includes(key));

    if (invalidKeys.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Các key không hợp lệ: ${invalidKeys.join(", ")}`,
      });
    }

    const record = new Record({
      definition_id,
      values,
      created_date: created_date || new Date(),
      avg: avg || 0,
    });

    await record.save();

    res.status(201).json({
      success: true,
      message: "Tạo record thành công",
      data: record,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Tạo nhiều records cùng lúc
export const createBulkRecords = async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu phải là mảng records",
      });
    }

    // Kiểm tra tất cả definition có tồn tại không
    const definitionIds = [...new Set(records.map((r) => r.definition_id))];
    const definitions = await Definition.find({ _id: { $in: definitionIds } });

    if (definitions.length !== definitionIds.length) {
      return res.status(404).json({
        success: false,
        message: "Một số definition không tồn tại",
      });
    }

    const createdRecords = await Record.insertMany(records);

    res.status(201).json({
      success: true,
      message: `Tạo thành công ${createdRecords.length} records`,
      count: createdRecords.length,
      data: createdRecords,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật record
export const updateRecord = async (req, res) => {
  try {
    const { values, created_date, avg } = req.body;

    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy record",
      });
    }

    // Nếu cập nhật values, kiểm tra lại với definition
    if (values) {
      const definition = await Definition.findById(record.definition_id);
      const validKeys = definition.column.map((col) => col.key);
      const invalidKeys = values
        .map((v) => v.key)
        .filter((key) => !validKeys.includes(key));

      if (invalidKeys.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Các key không hợp lệ: ${invalidKeys.join(", ")}`,
        });
      }

      record.values = values;
    }

    if (created_date) record.created_date = created_date;
    if (avg !== undefined) record.avg = avg;

    await record.save();

    res.json({
      success: true,
      message: "Cập nhật record thành công",
      data: record,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa record
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy record",
      });
    }

    res.json({
      success: true,
      message: "Xóa record thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa nhiều records
export const deleteBulkRecords = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "Phải cung cấp mảng ids",
      });
    }

    const result = await Record.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `Đã xóa ${result.deletedCount} records`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Thống kê records
export const getRecordStats = async (req, res) => {
  try {
    const { definitionId, days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let match = {
      created_date: { $gte: startDate },
    };

    if (definitionId) {
      match.definition_id = new mongoose.Types.ObjectId(definitionId);
    }

    const stats = await Record.aggregate([
      { $match: match },
      { $unwind: "$values" },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$created_date" },
            },
            key: "$values.key",
          },
          avgValue: { $avg: "$values.value" },
          minValue: { $min: "$values.value" },
          maxValue: { $max: "$values.value" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1, "_id.key": 1 } },
    ]);

    res.json({
      success: true,
      days: parseInt(days),
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
