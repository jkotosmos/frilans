import { cache } from "react";
import { db } from "@/lib/db";

// React's `cache()` dedupes this across components rendered within the same
// request (e.g. Navbar + the catalog page both need the category list).
export const getCategories = cache(async () => {
  return db.category.findMany({ orderBy: { order: "asc" } });
});
