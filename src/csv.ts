import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { CsvTableName } from "./types.ts";

export type { CsvTableName } from "./types.ts";

const TABLE_FILE_MAP: Record<CsvTableName, string> = {
  foods: "foods.csv",
  categories: "categories.csv",
  "cooking-methods": "cooking-methods.csv",
  cooking_methods: "cooking-methods.csv",
  "retention-factors": "retention-factors.csv",
  retention_factors: "retention-factors.csv",
  "category-rf-map": "category-rf-map.csv",
  category_rf_map: "category-rf-map.csv",
};

/**
 * Resolves the absolute filesystem path to a bundled CSV file.
 */
export function getCsvPath(tableName: CsvTableName): string {
  const filename = TABLE_FILE_MAP[tableName];
  if (!filename) {
    throw new Error(`Unknown CSV table name: "${String(tableName)}"`);
  }
  return fileURLToPath(new URL(`../data/csv/${filename}`, import.meta.url));
}

/**
 * Reads and returns the UTF-8 contents of a bundled CSV file.
 */
export function getCsvContent(tableName: CsvTableName): string {
  return readFileSync(getCsvPath(tableName), "utf8");
}
