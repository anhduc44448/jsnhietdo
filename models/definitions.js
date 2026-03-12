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
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    enum: { type: [mongoose.Schema.Types.Mixed] },
  },
  { _id: false },
);

const DefinitionSchema = new mongoose.Schema(
  {
    version_id: { type: String, required: true, unique: true, index: true },
    colums: { type: [ColumnSchema], default: [] },
    active: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Definition = mongoose.model("Definition", DefinitionSchema);
