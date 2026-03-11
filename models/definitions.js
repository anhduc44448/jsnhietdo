import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "date", "object", "array"],
      required: true,
    },
    required: { type: Boolean, default: false },
    min: { type: Number },
    max: { type: Number },
    description: { type: String },
    enum: { type: Array, default: [] },
  },
  { _id: false },
);

const DefinitionSchema = new mongoose.Schema(
  {
    version_id: { type: Number, required: true, unique: true }, // unique đã tạo index
    active: { type: Boolean, default: true },
    column: { type: [ColumnSchema], required: true },
    thresholds: {
      type: Map,
      of: {
        min: Number,
        max: Number,
        optimalMin: Number,
        optimalMax: Number,
      },
      default: {},
    },
    description: { type: String },
  },
  {
    timestamps: true,
    collection: "definitions",
  },
);

const Definition = mongoose.model("Definition", DefinitionSchema);

export default Definition;
