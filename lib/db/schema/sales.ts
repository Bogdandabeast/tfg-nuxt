import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { companiesTable } from "./companies";
import { customersTable } from "./customers";
import { productsTable } from "./products";

export const salesTables = pgTable("sales", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").references(() => customersTable.id, {
    onDelete: "cascade",
  }),
  product_id: integer("product_id").references(() => productsTable.id, {
    onDelete: "cascade",
  }),
  quantity: integer("quantity").notNull(),
  sale_date: timestamp("sale_date").defaultNow().notNull(),
  company_id: integer("company_id").references(() => companiesTable.id, {
    onDelete: "cascade",
  }),
  saledate: timestamp("saledate"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  customer_name: text("customer_name").notNull(),
  customer_email: text("customer_email").notNull(),
  product_name: text("product_name").notNull(),
  product_price: numeric("product_price").notNull(),
});
