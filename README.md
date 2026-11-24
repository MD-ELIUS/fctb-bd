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

## Attribution

Data sourced from the **Food Composition Table for Bangladesh (FCTB)**, published by the **Institute of Nutrition and Food Science (INFS), University of Dhaka**, in collaboration with **FAO/INFOODS**.

## License

MIT
