export function useBreadcrumbs() {
  const { t } = useI18n();
  const localePath = useLocalePath();

  const breadcrumbItems = computed(() => {
    const route = useRoute();

    const items: Array<{ label: string; to?: string }> = [
      {
        label: t("breadcrumbs.dashboard"),
        to: localePath("/dashboard"),
      },
    ];

    const sectionMap = {
      customers: { label: "breadcrumbs.customers", singular: "breadcrumbs.customer", to: "/dashboard/customers" },
      products: { label: "breadcrumbs.products", singular: "breadcrumbs.product", to: "/dashboard/products" },
      sales: { label: "breadcrumbs.sales", singular: "breadcrumbs.sale", to: "/dashboard/sales" },
      companies: { label: "breadcrumbs.companies", singular: "breadcrumbs.company", to: "/dashboard/companies" },
    } as const;

    const pathSegments = route.path.split("/").filter(Boolean);
    const normalizedSegments = (pathSegments[0] === "es" || pathSegments[0] === "en")
      ? pathSegments.slice(1)
      : pathSegments;

    // Only add section breadcrumb if we are in a subpath of dashboard
    if (normalizedSegments[0] === "dashboard" && normalizedSegments[1]) {
      const sectionKey = normalizedSegments[1] as keyof typeof sectionMap;
      if (sectionMap[sectionKey]) {
        const section = sectionMap[sectionKey];
        items.push({
          label: t(section.label),
          to: localePath(section.to),
        });

        if (route.params.id) {
          items.push({
            label: t(section.singular, { id: route.params.id }),
          });
        }
      }
    }

    return items;
  });

  return {
    breadcrumbItems,
  };
}
