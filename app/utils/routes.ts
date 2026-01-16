// Route constants for the application
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  PRICING: "/pricing",
  TERMS: "/terms",
  COMPANIES: "/dashboard/companies",
  PRODUCTS: "/dashboard/products",
  CUSTOMERS: "/dashboard/customers",
  SALES: "/dashboard/sales",
} as const;

// Helper functions for dynamic routes
export const getProductPath = (id: string | number) => `${ROUTES.PRODUCTS}/${id}`;
export const getCustomerPath = (id: string | number) => `${ROUTES.CUSTOMERS}/${id}`;
export const getSalePath = (id: string | number) => `${ROUTES.SALES}/${id}`;
export function getCompaniesWithRedirect(redirect?: string) {
  return redirect ? `${ROUTES.COMPANIES}?redirect=${encodeURIComponent(redirect)}` : ROUTES.COMPANIES;
}
