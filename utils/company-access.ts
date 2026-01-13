import { getCompaniesByUserId } from "~~/lib/db/queries/company";

export async function assertUserHasCompanyAccess(userId: string, companyId: number) {
  const userCompanies = await getCompaniesByUserId(userId);
  const userCompanyIds = userCompanies.map(c => c.id);
  if (!userCompanyIds.includes(companyId)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }
}
