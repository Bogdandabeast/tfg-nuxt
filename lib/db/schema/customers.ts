import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { companiesTable } from "./companies";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  company_id: integer("company_id").references(() => companiesTable.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const companiesClientsTable = pgTable("companies_clients", {
  customer_id: integer("customer_id").references(() => customersTable.id),
  company_id: integer("company_id").references(() => companiesTable.id),
  created_at: timestamp("created_at").defaultNow(),

}, table => [primaryKey({ columns: [table.customer_id, table.company_id] })]);
