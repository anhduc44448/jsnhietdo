import express from "express";
import mongoose from "mongoose";

import definitionRoutes from "./routes/definitions.js";
import recordRoutes from "./routes/records.js";

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/nhietdo")
  .then(() => console.log("MongoDB connected to nhietdo"))
  .catch((err) => console.log(err));

app.use("/api/Sensors", definitionRoutes);
app.use("/api/Sensors", recordRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
