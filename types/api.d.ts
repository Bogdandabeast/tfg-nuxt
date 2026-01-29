import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { companiesTable, customersTable, productsTable, salesTables, user } from "~/lib/db/schema";

export type Company = InferSelectModel<typeof companiesTable>;
export type NewCompany = InferInsertModel<typeof companiesTable>;

export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;

export type Customer = InferSelectModel<typeof customersTable>;
export type NewCustomer = InferInsertModel<typeof customersTable>;

export type Sale = InferSelectModel<typeof salesTables>;
export type NewSale = InferInsertModel<typeof salesTables>;

export type User = InferSelectModel<typeof user>;
export type Member = User;

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
