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
      customers: { label: "breadcrumbs.customers", singular: "breadcrumbs.customer" },
      products: { label: "breadcrumbs.products", singular: "breadcrumbs.product" },
      sales: { label: "breadcrumbs.sales", singular: "breadcrumbs.sale" },
      companies: { label: "breadcrumbs.companies", singular: "breadcrumbs.company" },
    };

    const pathSegments = route.path.split("/").filter(Boolean);

    if (pathSegments.includes("customers")) {
      items.push({
        label: t(sectionMap.customers.label),
        to: localePath("/dashboard/customers"),
      });
    }
    else if (pathSegments.includes("products")) {
      items.push({
        label: t(sectionMap.products.label),
        to: localePath("/dashboard/products"),
      });
    }
    else if (pathSegments.includes("sales")) {
      items.push({
        label: t(sectionMap.sales.label),
        to: localePath("/dashboard/sales"),
      });
    }
    else if (pathSegments.includes("companies")) {
      items.push({
        label: t(sectionMap.companies.label),
        to: localePath("/dashboard/companies"),
      });
    }

    if (route.params.id) {
      const currentSection = pathSegments[1] as keyof typeof sectionMap;
      if (currentSection && sectionMap[currentSection]) {
        items.push({
          label: t(sectionMap[currentSection].singular, { id: route.params.id }),
        });
      }
    }

    return items;
  });

  return {
    breadcrumbItems,
  };
}
