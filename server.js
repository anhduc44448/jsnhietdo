import express from "express";
import mongoose from "mongoose";

import definitionRoutes from "./routes/definitions.js";
import recordRoutes from "./routes/records.js";
import userRoutes from "./routes/users.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/nhietdo")
  .then(() => console.log("MongoDB connected to nhietdo"))
  .catch((err) => console.log(err));

app.use("/api/sensors/definitions", definitionRoutes);
app.use("/api/sensors/records", recordRoutes);
app.use("/api/sensors/users", userRoutes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sensor API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
