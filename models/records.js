import mongoose from "mongoose";

const ValueKVSchema = new mongoose.Schema(
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
    values: { type: [ValueKVSchema], default: [] },
    created_date: { type: Date, default: Date.now, index: true },
    avg: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    collection: "records",
  },
);

// Index cho việc query thường xuyên
RecordSchema.index({ definition_id: 1, created_date: -1 });
RecordSchema.index({ "values.key": 1 });

const Record = mongoose.model("Record", RecordSchema);

export default Record;
