const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/health", (req, res) => {
  db.get("SELECT 1 AS ok", (err) => {
    if (err) {
      return res.status(500).json({ status: "error", db: "disconnected" });
    }
    res.json({ status: "ok", db: "connected" });
  });
});

module.exports = router;