import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").references(() => user.id),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  stock: integer("stock").notNull(),
  company_id: integer("company_id").references(() => companiesTable.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  company_id: integer("company_id").references(() => companiesTable.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const salesTables = pgTable("sales", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").references(() => customersTable.id),
  product_id: integer("product_id").references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  sale_date: timestamp("sale_date").defaultNow().notNull(),
  company_id: integer("company_id").references(() => companiesTable.id),
});
