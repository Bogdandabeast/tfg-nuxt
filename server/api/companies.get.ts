import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const { user } = event.context;
  const companies = await getCompaniesByUserId(user.id);
  return companies.map((company) => {
    return {
      ...company,
      icon: "lucide:briefcase-business",
    };
  });
});
