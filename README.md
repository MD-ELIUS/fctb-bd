# fctb-bd

Offline **Food Composition Table for Bangladesh (FCTB)** dataset packaged as a zero-runtime-dependency TypeScript/JavaScript library for **npm** and **JSR**, with direct access to TypeScript helpers, JSON, CSV, and SQLite.

## Installation

### npm

```bash
npm install fctb-bd
```

### JSR (Deno / Node / Bun)

```bash
npx jsr add @fctb/bd
# or with Deno:
deno add jsr:@fctb/bd
```

## Usage

### Helper Functions

```ts
import {
  getAllFoods,
  getFoodByCode,
  searchFoods,
  getCategories,
  getFoodsByCategory,
  getCookingMethods,
  getRetentionFactors,
  getRetentionFactor,
  calculateNutrition,
} from "fctb-bd";

// Search in English or Bangla
const riceResults = searchFoods("rice");
const banglaResults = searchFoods("যব");

// Look up by FCTB code
const barley = getFoodByCode("01_0001");

// Browse categories
const categories = getCategories();
const cereals = getFoodsByCategory(1);

// Calculate nutrition for 150g of raw barley when boiled
const nutrition = calculateNutrition("01_0001", 150, "Boiled");
console.log(nutrition?.nutrients.enerc_kcal);
console.log(nutrition?.nutrients.thia_mg); // retention factor applied
```

### Direct JSON Imports

```ts
import foods from "fctb-bd/json/foods" with { type: "json" };
import categories from "fctb-bd/json/categories" with { type: "json" };
import cookingMethods from "fctb-bd/json/cooking-methods" with { type: "json" };
import retentionFactors from "fctb-bd/json/retention-factors" with { type: "json" };
import categoryRfMap from "fctb-bd/json/category-rf-map" with { type: "json" };
```

### CSV Access (Node / Deno)

```ts
import { getCsvPath, getCsvContent } from "fctb-bd/csv";

const csvPath = getCsvPath("foods");
const csvContent = getCsvContent("cooking-methods");
```

### SQLite Database

The raw SQLite database is exported at `fctb-bd/sqlite`:

```ts
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const dbPath = require.resolve("fctb-bd/sqlite");
```

## CDN Usage (jsDelivr)

You can fetch the raw JSON, CSV, or SQLite files directly from jsDelivr without installing the package (useful for Python, Flutter, Kotlin, or static websites):

### JSON
| Table | CDN URL |
| :--- | :--- |
| **Foods (381)** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/json/foods.json` |
| **Categories (15)** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/json/categories.json` |
| **Cooking Methods (6)** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/json/cooking-methods.json` |
| **Retention Factors (19)** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/json/retention-factors.json` |
| **Category RF Map (20)** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/json/category-rf-map.json` |

### CSV
| Table | CDN URL |
| :--- | :--- |
| **Foods** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/csv/foods.csv` |
| **Categories** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/csv/categories.csv` |
| **Cooking Methods** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/csv/cooking-methods.csv` |
| **Retention Factors** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/csv/retention-factors.csv` |
| **Category RF Map** | `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/csv/category-rf-map.csv` |

### SQLite Database
- **Full Database (`fctb.db`):** `https://cdn.jsdelivr.net/npm/fctb-bd@1/data/fctb.db`

> **Tip:** Replace `@1` with a specific version (e.g., `@1.0.0`) to pin the exact dataset version in production.

## Attribution

Data sourced from the **Food Composition Table for Bangladesh (FCTB)**, published by the **Institute of Nutrition and Food Science (INFS), University of Dhaka**, in collaboration with **FAO/INFOODS**.

## License

MIT
