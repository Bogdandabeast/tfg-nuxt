import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { companiesTable, customersTable, productsTable, salesTables, user } from "~~/lib/db/schema";

// Tipos para Companies
export type Company = InferSelectModel<typeof companiesTable>;
export type NewCompany = InferInsertModel<typeof companiesTable>;

// Tipos para Products
export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;

// Tipos para Customers
export type Customer = InferSelectModel<typeof customersTable>;
export type NewCustomer = InferInsertModel<typeof customersTable>;

// Tipos para Sales
export type Sale = InferSelectModel<typeof salesTables>;
export type NewSale = InferInsertModel<typeof salesTables>;

// Tipos para User/Members
export type User = InferSelectModel<typeof user>;
export type Member = User; // Alias for members

// Tipos adicionales para respuestas de API
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
