import mongoose from "mongoose";

const ValueVSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const RecordSchema = new mongoose.Schema(
  {
    definition_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Definition",
      required: true,
      index: true,
    },
    values: { type: [ValueVSchema], default: [] },
    created_date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

export const Record = mongoose.model("Record", RecordSchema);
