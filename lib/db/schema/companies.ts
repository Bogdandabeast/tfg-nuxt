import { sql } from "drizzle-orm";

import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const companiesTable = pgTable("companies", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: text().references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  description: text(),
  name: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, table => [
  index().on(table.id),
]);

export const productsTable = pgTable("products", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  price: numeric().notNull(),
  stock: integer().notNull(),
  company_id: uuid().references(() => companiesTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, table => [
  index().on(table.id),
  unique().on(table.company_id, table.name),
  check("pricecheck", sql`${table.price} >= 0`),
  check("stockcheck", sql`${table.stock} >= 0`),
]);
export const customersTable = pgTable("customers", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  address: text(),
  description: text(),
  company_id: uuid().references(() => companiesTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, table => [
  index().on(table.id),
  unique().on(table.company_id, table.email),
]);

export const salesTable = pgTable("sales", {
  id: uuid().defaultRandom().primaryKey(),
  customer_id: uuid().references(() => customersTable.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  product_id: uuid().references(() => productsTable.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  company_id: uuid().references(() => companiesTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  description: text(),
  quantity: integer().notNull(),
  sale_date: timestamp().defaultNow().notNull(),
  product_name: text().notNull(),
  product_description: text(),
  unit_price: numeric().notNull(),
  customer_name: text().notNull(),
  discount: numeric().notNull().default("0"),
  tax_rate: numeric().notNull().default("0"),
  currency: text().default("EUR"),
  total: numeric().generatedAlwaysAs(
    () =>
      sql`((("unit_price" - "discount") * "quantity") * (1 + "tax_rate"))`,
  ),
}, table => [
  index().on(table.id),
  check("quantitycheck", sql`${table.quantity} > 0`),
]);
