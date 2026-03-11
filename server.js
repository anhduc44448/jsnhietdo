import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import definitionsRouter from "./routes/definitions.js";
import recordsRouter from "./routes/records.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
const url = "mongodb://localhost:27017/nhietdo";

mongoose
  .connect(url)
  .then(() => console.log("✅ Connected to MongoDB via Mongoose"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });

// ============ ROUTES CHO TRANG HTML ============
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/definitions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "definitions.html"));
});

// ============ API ROUTES ============
// Sử dụng các router đã import
app.use("/definitions", definitionsRouter);
app.use("/records", recordsRouter);

// API đặc biệt: Lấy tất cả records theo definition_id (hỗ trợ cả "all")
app.get("/definitions/:definition_id/records", async (req, res) => {
  try {
    const { definition_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const Record = (await import("./models/records.js")).default;

    let query = {};

    // Nếu definition_id là "all" thì lấy tất cả records
    if (definition_id === "all") {
      // Không thêm điều kiện lọc
    }
    // Nếu là ObjectId hợp lệ
    else if (mongoose.Types.ObjectId.isValid(definition_id)) {
      query.definition_id = definition_id;
    } else {
      return res.status(400).json({
        success: false,
        message: "Definition ID không hợp lệ",
      });
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
      data: records,
      count: records.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// API: Xóa tất cả records theo definition_id
app.post("/definitions/:definition_id/delete-records", async (req, res) => {
  try {
    const { definition_id } = req.params;

    const Record = (await import("./models/records.js")).default;

    if (!mongoose.Types.ObjectId.isValid(definition_id)) {
      return res.status(400).json({
        success: false,
        message: "Definition ID không hợp lệ",
      });
    }

    const result = await Record.deleteMany({ definition_id });

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
});

// API: Cập nhật record theo ID
app.put("/definitions/:definition_id/records/:record_id", async (req, res) => {
  try {
    const { definition_id, record_id } = req.params;
    const updateData = req.body;

    const Record = (await import("./models/records.js")).default;
    const Definition = (await import("./models/definitions.js")).default;

    // Kiểm tra ID hợp lệ
    if (
      !mongoose.Types.ObjectId.isValid(definition_id) ||
      !mongoose.Types.ObjectId.isValid(record_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    // Kiểm tra record tồn tại và thuộc definition đúng
    const record = await Record.findOne({
      _id: record_id,
      definition_id: definition_id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy record",
      });
    }

    // Nếu cập nhật values, kiểm tra với definition
    if (updateData.values) {
      const definition = await Definition.findById(definition_id);
      if (!definition) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy definition",
        });
      }

      const validKeys = definition.column.map((col) => col.key);
      const invalidKeys = updateData.values
        .map((v) => v.key)
        .filter((key) => !validKeys.includes(key));

      if (invalidKeys.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Các key không hợp lệ: ${invalidKeys.join(", ")}`,
        });
      }
    }

    // Cập nhật record
    Object.assign(record, updateData);
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
});

// API: Lấy definition active (dự phòng, nhưng đã có trong routes/definitions.js)
// Không cần định nghĩa lại ở đây để tránh xung đột

// Xử lý 404 cho các route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API không tồn tại",
  });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Lỗi server: " + err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📊 Trang chủ: http://localhost:${port}`);
  console.log(`📋 Definitions: http://localhost:${port}/definitions`);
  console.log(`📚 API Definitions: http://localhost:${port}/definitions`);
  console.log(`📚 API Records: http://localhost:${port}/records`);
});
