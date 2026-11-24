import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dbPath = path.join(rootDir, "data", "fctb.db");
const jsonDir = path.join(rootDir, "data", "json");
const csvDir = path.join(rootDir, "data", "csv");

const TABLES = [
  { table: "foods", file: "foods" },
  { table: "categories", file: "categories" },
  { table: "cooking_methods", file: "cooking-methods" },
  { table: "retention_factors", file: "retention-factors" },
  { table: "category_rf_map", file: "category-rf-map" },
];

/**
 * Escape a single value according to RFC 4180 CSV rules.
 * Wraps in double quotes if the value contains commas, quotes, or newlines.
 */
function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert an array of row objects into a UTF-8 CSV string.
 */
function toCsv(rows, columns) {
  const header = columns.map(escapeCsvValue).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsvValue(row[col])).join(",")
  );
  return [header, ...lines].join("\n") + "\n";
}

function main() {
  fs.mkdirSync(jsonDir, { recursive: true });
  fs.mkdirSync(csvDir, { recursive: true });

  const db = new Database(dbPath, { readonly: true });

  try {
    for (const { table, file } of TABLES) {
      const rows = db.prepare(`SELECT * FROM "${table}"`).all();
      const columns = db
        .prepare(`PRAGMA table_info("${table}")`)
        .all()
        .map((col) => col.name);

      const jsonPath = path.join(jsonDir, `${file}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2) + "\n", "utf8");

      const csvPath = path.join(csvDir, `${file}.csv`);
      fs.writeFileSync(csvPath, toCsv(rows, columns), "utf8");

      console.log(`Exported ${table}: ${rows.length} rows -> ${file}.json, ${file}.csv`);
    }
  } finally {
    db.close();
  }
}

main();
