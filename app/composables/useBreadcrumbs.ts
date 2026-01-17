export function useBreadcrumbs() {
  const breadcrumbItems = computed(() => {
    const route = useRoute()

    const items: Array<{ label: string; to?: string }> = [
      {
        label: 'Dashboard',
        to: '/dashboard'
      }
    ]

    // Add current section
    const pathSegments = route.path.split('/').filter(Boolean)

    if (pathSegments.includes('customers')) {
      items.push({
        label: 'Customers',
        to: '/dashboard/customers'
      })
    } else if (pathSegments.includes('products')) {
      items.push({
        label: 'Products',
        to: '/dashboard/products'
      })
    } else if (pathSegments.includes('sales')) {
      items.push({
        label: 'Sales',
        to: '/dashboard/sales'
      })
    } else if (pathSegments.includes('companies')) {
      items.push({
        label: 'Companies',
        to: '/dashboard/companies'
      })
    }

    // Add ID if it's a detail page (without 'to' for current page)
    if (route.params.id) {
      const currentSection = pathSegments[1] // customers, products, sales, companies
      if (currentSection) {
        const sectionLabel = currentSection.charAt(0).toUpperCase() + currentSection.slice(1, -1) // Customer, Product, Sale, Compan(y)
        items.push({
          label: `${sectionLabel} ${route.params.id}`
          // No 'to' for current page
        })
      }
    }

    return items
  })

  return {
    breadcrumbItems
  }
}