export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  TERMS: "/terms",
  SIGNOUT: "/dashboard/signout",
  DASHBOARD: "/dashboard",
  PRICING: "/pricing",
  COMPANIES: "/dashboard/companies",
  COMPANIES_CREATE: "/dashboard/companies/create",
  COMPANIES_MANAGE: "/dashboard/companies/manage",
  PRODUCTS: "/dashboard/products",
  CUSTOMERS: "/dashboard/customers",
  SALES: "/dashboard/sales",

} as const;

export const getProductPath = (id: string | number) => `${ROUTES.PRODUCTS}/${id}`;
export const getCustomerPath = (id: string | number) => `${ROUTES.CUSTOMERS}/${id}`;
export const getSalePath = (id: string | number) => `${ROUTES.SALES}/${id}`;
export const getCompanyPath = (id: string | number) => `${ROUTES.COMPANIES}/${id}`;
export function getCompaniesWithRedirect(redirect?: string) {
  return redirect ? `${ROUTES.COMPANIES}?redirect=${encodeURIComponent(redirect)}` : ROUTES.COMPANIES;
}
