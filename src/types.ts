/**
 * Nutrient fields in the `foods` table (values are per 100g edible portion).
 */
export interface FoodNutrients {
  enerc_kcal: number | null;
  enerc_kj: number | null;
  water_g: number | null;
  prot_g: number | null;
  fatce_g: number | null;
  choavldf_g: number | null;
  fibtg_g: number | null;
  ash_g: number | null;
  ca_mg: number | null;
  fe_mg: number | null;
  mg_mg: number | null;
  p_mg: number | null;
  k_mg: number | null;
  na_mg: number | null;
  zn_mg: number | null;
  cu_mg: number | null;
  vita_rae_mcg: number | null;
  retol_mcg: number | null;
  cartbeq_mcg: number | null;
  carta_mcg: number | null;
  cartb_mcg: number | null;
  crypx_mcg: number | null;
  vitd_mcg: number | null;
  vite_mg: number | null;
  thia_mg: number | null;
  ribf_mg: number | null;
  niaeq_mg: number | null;
  nia_mg: number | null;
  niatrp_mg: number | null;
  vitb6a_mg: number | null;
  fol_mcg: number | null;
  ascl_mg: number | null;
}

/**
 * A food entry from the `foods` table.
 */
export interface Food extends FoodNutrients {
  id: number;
  category_id: number;
  code: string;
  foodname_en: string;
  foodname_bn: string | null;
  foodname_bangla: string | null;
  scientific_name: string | null;
  source_biblio_id: string | null;
  edible: number | null;
  bracketed_cols: string | null;
  is_cooked: number;
}

/**
 * A food category from the `categories` table.
 */
export interface Category {
  id: number;
  code: string;
  name: string;
  name_bn: string | null;
}

/**
 * A cooking method from the `cooking_methods` table.
 */
export interface CookingMethod {
  id: number;
  code: string;
  name_en: string;
  name_bn: string;
}

/**
 * Nutrient retention factor multipliers from the `retention_factors` table.
 */
export interface RetentionFactor {
  rule_key: string;
  label_en: string;
  vita_rae: number;
  vitd: number;
  vite: number;
  thia: number;
  ribf: number;
  niaeq: number;
  vitb6a: number;
  fol: number;
  ascl: number;
  ca: number;
  fe: number;
  mg: number;
  p: number;
  k: number;
  na: number;
  zn: number;
  cu: number;
  id: number;
  code: string;
}

/**
 * Mapping between food category codes, cooking methods, and retention factors.
 */
export interface CategoryRfMap {
  category_code: string;
  cooking_method_id: number;
  rf_id: number;
}

/**
 * Identifier for a cooking method (numeric id, string code, English name, or Bangla name).
 */
export type CookingMethodInput = number | string;

/**
 * Calculated nutrition result for a given food, weight in grams, and optional cooking method.
 */
export interface NutritionResult {
  food: Food;
  grams: number;
  cookingMethod: CookingMethodInput | undefined;
  retentionFactor: RetentionFactor | 1;
  nutrients: FoodNutrients;
}

/**
 * Supported table names for CSV export helpers.
 */
export type CsvTableName =
  | "foods"
  | "categories"
  | "cooking-methods"
  | "cooking_methods"
  | "retention-factors"
  | "retention_factors"
  | "category-rf-map"
  | "category_rf_map";
