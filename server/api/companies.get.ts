import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const companies = await getCompaniesByUserId(event.context.user.id);
  return companies.map((company) => {
    return {
      ...company,
      icon: "lucide:briefcase-business",
    };
  });
});
