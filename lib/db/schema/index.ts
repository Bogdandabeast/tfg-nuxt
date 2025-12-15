import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const companiesTable = pgTable("companies_table", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id),
  name: text("name").notNull(),
});

export const productsTable = pgTable("products_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  stock: integer("stock").notNull(),
  company_id: integer("company_id").references(() => companiesTable.id),
});

export const customersTable = pgTable("customers_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  company_id: integer("company_id").references(() => companiesTable.id),
});

export const salesTables = pgTable("sales_tables", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").references(() => customersTable.id),
  product_id: integer("product_id").references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  sale_date: timestamp("sale_date").defaultNow().notNull(),
  company_id: integer("company_id").references(() => companiesTable.id),
});
