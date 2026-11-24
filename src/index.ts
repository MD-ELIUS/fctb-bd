import foodsData from "../data/json/foods.json" with { type: "json" };
import categoriesData from "../data/json/categories.json" with { type: "json" };
import cookingMethodsData from "../data/json/cooking-methods.json" with { type: "json" };
import retentionFactorsData from "../data/json/retention-factors.json" with { type: "json" };
import categoryRfMapData from "../data/json/category-rf-map.json" with { type: "json" };

import type {
  Category,
  CategoryRfMap,
  CookingMethod,
  CookingMethodInput,
  Food,
  FoodNutrients,
  NutritionResult,
  RetentionFactor,
} from "./types.ts";

export type {
  Category,
  CategoryRfMap,
  CookingMethod,
  CookingMethodInput,
  CsvTableName,
  Food,
  FoodNutrients,
  NutritionResult,
  RetentionFactor,
} from "./types.ts";

const foods = foodsData as Food[];
const categories = categoriesData as Category[];
const cookingMethods = cookingMethodsData as CookingMethod[];
const retentionFactors = retentionFactorsData as RetentionFactor[];
const categoryRfMap = categoryRfMapData as CategoryRfMap[];

const NUTRIENT_RF_MAP: Record<keyof FoodNutrients, keyof RetentionFactor | null> = {
  enerc_kcal: null,
  enerc_kj: null,
  water_g: null,
  prot_g: null,
  fatce_g: null,
  choavldf_g: null,
  fibtg_g: null,
  ash_g: null,
  ca_mg: "ca",
  fe_mg: "fe",
  mg_mg: "mg",
  p_mg: "p",
  k_mg: "k",
  na_mg: "na",
  zn_mg: "zn",
  cu_mg: "cu",
  vita_rae_mcg: "vita_rae",
  retol_mcg: "vita_rae",
  cartbeq_mcg: "vita_rae",
  carta_mcg: "vita_rae",
  cartb_mcg: "vita_rae",
  crypx_mcg: "vita_rae",
  vitd_mcg: "vitd",
  vite_mg: "vite",
  thia_mg: "thia",
  ribf_mg: "ribf",
  niaeq_mg: "niaeq",
  nia_mg: "niaeq",
  niatrp_mg: "niaeq",
  vitb6a_mg: "vitb6a",
  fol_mcg: "fol",
  ascl_mg: "ascl",
};

/**
 * Returns all food items in the FCTB dataset.
 */
export function getAllFoods(): Food[] {
  return foods;
}

/**
 * Finds a food item by its unique FCTB code (e.g., `"01_0001"`).
 */
export function getFoodByCode(code: string): Food | undefined {
  return foods.find((food) => food.code === code);
}

/**
 * Case-insensitive search across English, transliterated Bangla, and Bangla script food names.
 */
export function searchFoods(query: string): Food[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }

  return foods.filter((food) => {
    const en = food.foodname_en.toLowerCase();
    const bn = food.foodname_bn?.toLowerCase() ?? "";
    const bangla = food.foodname_bangla?.toLowerCase() ?? "";
    return en.includes(q) || bn.includes(q) || bangla.includes(q);
  });
}

/**
 * Returns all 15 food categories.
 */
export function getCategories(): Category[] {
  return categories;
}

/**
 * Returns all foods belonging to a given category ID (or category code).
 */
export function getFoodsByCategory(categoryId: number | string): Food[] {
  if (typeof categoryId === "number") {
    return foods.filter((food) => food.category_id === categoryId);
  }
  const cat = categories.find(
    (c) => c.code === categoryId || String(c.id) === categoryId
  );
  if (!cat) {
    return [];
  }
  return foods.filter((food) => food.category_id === cat.id);
}

/**
 * Returns all cooking methods.
 */
export function getCookingMethods(): CookingMethod[] {
  return cookingMethods;
}

/**
 * Returns all nutrient retention factor rules.
 */
export function getRetentionFactors(): RetentionFactor[] {
  return retentionFactors;
}

function resolveCookingMethod(input: CookingMethodInput): CookingMethod | undefined {
  if (typeof input === "number") {
    return cookingMethods.find((cm) => cm.id === input);
  }
  const normalized = input.trim().toLowerCase();
  return cookingMethods.find(
    (cm) =>
      cm.code === input.trim() ||
      cm.name_en.toLowerCase() === normalized ||
      cm.name_bn === input.trim()
  );
}

/**
 * Looks up the nutrient retention factor for a food item and cooking method.
 *
 * If the food is already cooked (`is_cooked === 1`) or no matching retention factor
 * exists for the food's category and cooking method, returns `1`.
 */
export function getRetentionFactor(
  foodCode: string,
  cookingMethod: CookingMethodInput
): RetentionFactor | 1 {
  const food = getFoodByCode(foodCode);
  if (!food || food.is_cooked === 1) {
    return 1;
  }

  const method = resolveCookingMethod(cookingMethod);
  if (!method) {
    return 1;
  }

  const category = categories.find((c) => c.id === food.category_id);
  if (!category) {
    return 1;
  }

  const mapping = categoryRfMap.find(
    (m) => m.category_code === category.code && m.cooking_method_id === method.id
  );
  if (!mapping) {
    return 1;
  }

  const rf = retentionFactors.find((r) => r.id === mapping.rf_id);
  return rf ?? 1;
}

/**
 * Calculates nutrient values for a given food code and weight in grams.
 * When `cookingMethod` is provided, applies the corresponding retention factor
 * to applicable vitamins and minerals.
 *
 * Returns `undefined` if the food code is not found.
 */
export function calculateNutrition(
  foodCode: string,
  grams: number,
  cookingMethod?: CookingMethodInput
): NutritionResult | undefined {
  const food = getFoodByCode(foodCode);
  if (!food) {
    return undefined;
  }

  const retentionFactor: RetentionFactor | 1 =
    cookingMethod !== undefined ? getRetentionFactor(foodCode, cookingMethod) : 1;

  const weightFactor = grams / 100;
  const nutrients = {} as FoodNutrients;

  for (const key of Object.keys(NUTRIENT_RF_MAP) as Array<keyof FoodNutrients>) {
    const baseValue = food[key];
    if (baseValue === null) {
      nutrients[key] = null;
      continue;
    }

    const rfKey = NUTRIENT_RF_MAP[key];
    const rfMultiplier =
      retentionFactor !== 1 && rfKey !== null
        ? (retentionFactor[rfKey] as number)
        : 1;

    nutrients[key] = baseValue * weightFactor * rfMultiplier;
  }

  return {
    food,
    grams,
    cookingMethod,
    retentionFactor,
    nutrients,
  };
}
