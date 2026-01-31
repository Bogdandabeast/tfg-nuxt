import { getCompaniesByUserId } from "~~/lib/db/queries/company";

export async function assertUserHasCompanyAccess(userId: string, companyId: string) {
  const userCompanies = await getCompaniesByUserId(userId);
  const userCompanyIds = new Set(userCompanies.map(c => c.id));
  if (!userCompanyIds.has(companyId)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }
}
