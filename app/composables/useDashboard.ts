import { createSharedComposable } from "@vueuse/core";

// Define a simple type for the company
type Company = {
  id: number;
  name: string;
  // Add other company properties as needed
};

function _useDashboard() {
  const route = useRoute();
  const router = useRouter();
  const isNotificationsSlideoverOpen = ref(false);
  const selectedCompany = ref<Company | null>(null);

  defineShortcuts({
    "g-h": () => router.push("/dashboard"),
    "g-i": () => router.push("/dashboard/inbox"),
    "g-c": () => router.push("/dashboard/customers"),
    "g-s": () => router.push("/dashboard/settings"),
    "n": () =>
      (isNotificationsSlideoverOpen.value
        = !isNotificationsSlideoverOpen.value),
  });

  watch(
    () => route.fullPath,
    () => {
      isNotificationsSlideoverOpen.value = false;
    },
  );

  function changeCompany(company: Company) {
    selectedCompany.value = company;
  }

  return {
    isNotificationsSlideoverOpen,
    selectedCompany,
    changeCompany,
  };
}

export const useDashboard = createSharedComposable(_useDashboard);
