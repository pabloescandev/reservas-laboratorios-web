const express = require("express");
const cors = require("cors");
const healthRoutes = require("./router/health.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", healthRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de Gestión de Reservas de Laboratorios activa",
    healthCheck: "/api/health",
  });
});

module.exports = app;