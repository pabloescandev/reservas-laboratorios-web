require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.error("Error al crear las tablas:", err.message);
    process.exitCode = 1;
    db.close();
    return;
  }

  db.all(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'LAB_%' ORDER BY name",
    (listErr, rows) => {
      if (listErr) {
        console.error("Error al listar las tablas:", listErr.message);
        process.exitCode = 1;
      } else {
        console.log(`Tablas creadas (${rows.length}):`);
        rows.forEach((row) => console.log(" -", row.name));
      }
      db.close();
    }
  );
});