import { sql } from "drizzle-orm";
import {
  check,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { companiesTable } from "./companies";

export const expensesTable = pgTable("expenses", {
  id: serial("id").primaryKey(),
  company_id: integer("company_id").references(() => companiesTable.id, {
    onDelete: "cascade",
  }),
  amount: numeric("amount").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  expenses_date: timestamp("expenses_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, table => [check("amountcheck", sql`${table.amount} >= 0`)]);
