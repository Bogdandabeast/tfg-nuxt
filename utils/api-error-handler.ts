import { getFetchErrorMessage } from "./error-handler";

export function handleApiError(error: unknown, context?: string): void {
  const message = getFetchErrorMessage(error);
  const toast = useToast();
  const { t } = useI18n();

  toast.add({
    title: t("error.title") || "Error",
    description: t(`error.${context}`) || message,
    color: "error",
  });
}
