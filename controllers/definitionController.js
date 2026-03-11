import Definition from "../models/definitions.js";
// Lấy tất cả definitions
export const getAllDefinitions = async (req, res) => {
  try {
    const { active, version } = req.query;
    let query = {};

    if (active !== undefined) {
      query.active = active === "true";
    }
    if (version) {
      query.version_id = parseInt(version);
    }

    const definitions = await Definition.find(query).sort({ version_id: -1 });

    res.json({
      success: true,
      count: definitions.length,
      data: definitions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy definition theo ID
export const getDefinitionById = async (req, res) => {
  try {
    const definition = await Definition.findById(req.params.id);

    if (!definition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy definition",
      });
    }

    res.json({
      success: true,
      data: definition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Tạo definition mới
export const createDefinition = async (req, res) => {
  try {
    const { version_id, active, column, thresholds, description } = req.body;

    // Kiểm tra version_id đã tồn tại chưa
    const existing = await Definition.findOne({ version_id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Version ${version_id} đã tồn tại`,
      });
    }

    // Kiểm tra column có ít nhất 1 phần tử
    if (!column || column.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Phải có ít nhất 1 column",
      });
    }

    const definition = new Definition({
      version_id,
      active: active !== undefined ? active : true,
      column,
      thresholds: thresholds || {},
      description,
    });

    await definition.save();

    res.status(201).json({
      success: true,
      message: "Tạo definition thành công",
      data: definition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật definition
export const updateDefinition = async (req, res) => {
  try {
    const { version_id, active, column, thresholds, description } = req.body;

    // Kiểm tra nếu đổi version_id thì không được trùng
    if (version_id) {
      const existing = await Definition.findOne({
        version_id,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Version ${version_id} đã tồn tại`,
        });
      }
    }

    const definition = await Definition.findByIdAndUpdate(
      req.params.id,
      {
        version_id,
        active,
        column,
        thresholds,
        description,
      },
      { new: true, runValidators: true },
    );

    if (!definition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy definition",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật definition thành công",
      data: definition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa definition
export const deleteDefinition = async (req, res) => {
  try {
    // Kiểm tra xem có records nào đang dùng definition này không
    const Record = (await import("../models/records.js")).default;
    const recordCount = await Record.countDocuments({
      definition_id: req.params.id,
    });

    if (recordCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa vì có ${recordCount} records đang tham chiếu đến definition này`,
      });
    }

    const definition = await Definition.findByIdAndDelete(req.params.id);

    if (!definition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy definition",
      });
    }

    res.json({
      success: true,
      message: "Xóa definition thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Kích hoạt/vô hiệu hóa definition
export const toggleActive = async (req, res) => {
  try {
    const definition = await Definition.findById(req.params.id);

    if (!definition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy definition",
      });
    }

    definition.active = !definition.active;
    await definition.save();

    res.json({
      success: true,
      message: `Definition ${definition.active ? "đã kích hoạt" : "đã vô hiệu hóa"}`,
      data: definition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
