<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const toast = useToast();
const { selectedCompany } = useDashboard();

// companys
const { data: companies, refresh: refreshCompanies } = await useFetch("/api/companies");
const isCompanyModalOpen = ref(false);
const newCompanyName = ref("");

// When companys list changes (e.g. after adding/deleting), we might need to refresh the global list
// The companiesMenu already handles this, but a hard refresh here can ensure consistency.
// We also need to refresh the companys list in the global menu. The easiest way is to let the user
// know that the list of companys has changed. For now we will just refresh the local list.
// A more robust solution might involve a global 'refreshCompanies' flag in the useDashboard composable.

async function handleAddCompany() {
  if (!newCompanyName.value) {
    toast.add({ title: "Error", description: "Company name is required.", color: "secondary" });
    return;
  }
  try {
    await $fetch("/api/companies", {
      method: "POST",
      body: { name: newCompanyName.value },
    });
    toast.add({ title: "Success", description: "Company created." });
    newCompanyName.value = "";
    isCompanyModalOpen.value = false;
    refreshCompanies();
  }
  catch (e: any) {
    toast.add({ title: "Error creating company", description: e.message, color: "secondary" });
  }
}

async function handleDeleteCompany(id: number) {
  try {
    await $fetch(`/api/companies/${id}`, { method: "DELETE" });
    toast.add({ title: "Success", description: "Company deleted." });
    refreshCompanies();
  }
  catch (e: any) {
    toast.add({ title: "Error deleting company", description: e.message, color: "secondary" });
  }
}

// Customers
const { data: customers, refresh: refreshCustomers } = useAsyncData(
  "customers",
  () => selectedCompany.value ? $fetch(`/api/customers?company_id=${selectedCompany.value.id}`) : Promise.resolve([]),
  { watch: [selectedCompany] },
);
const isCustomerModalOpen = ref(false);
const newCustomer = ref({ name: "", email: "" });

async function handleAddCustomer() {
  if (!selectedCompany.value) {
    toast.add({ title: "Error", description: "Please select a company first.", color: "secondary" });
    return;
  }
  try {
    await $fetch("/api/customers", {
      method: "POST",
      body: { ...newCustomer.value, company_id: selectedCompany.value.id },
    });
    toast.add({ title: "Success", description: "Customer created." });
    newCustomer.value = { name: "", email: "" };
    isCustomerModalOpen.value = false;
    refreshCustomers();
  }
  catch (e: any) {
    toast.add({ title: "Error creating customer", description: e.message, color: "secondary" });
  }
}

async function handleDeleteCustomer(id: number) {
  try {
    await $fetch(`/api/customers/${id}`, { method: "DELETE" });
    toast.add({ title: "Success", description: "Customer deleted." });
    refreshCustomers();
  }
  catch (e: any) {
    toast.add({ title: "Error deleting customer", description: e.message, color: "secondary" });
  }
}

// Products
const { data: products, refresh: refreshProducts } = useAsyncData(
  "products",
  () => selectedCompany.value ? $fetch(`/api/products?company_id=${selectedCompany.value.id}`) : Promise.resolve([]),
  { watch: [selectedCompany] },
);
const isProductModalOpen = ref(false);
const newProduct = ref({ name: "", description: "", price: 0, stock: 0 });

async function handleAddProduct() {
  if (!selectedCompany.value) {
    toast.add({ title: "Error", description: "Please select a company first.", color: "secondary" });
    return;
  }
  try {
    await $fetch("/api/products", {
      method: "POST",
      body: { ...newProduct.value, company_id: selectedCompany.value.id },
    });
    toast.add({ title: "Success", description: "Product created." });
    newProduct.value = { name: "", description: "", price: 0, stock: 0 };
    isProductModalOpen.value = false;
    refreshProducts();
  }
  catch (e: any) {
    toast.add({ title: "Error creating product", description: e.message, color: "secondary" });
  }
}

async function handleDeleteProduct(id: number) {
  try {
    await $fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.add({ title: "Success", description: "Product deleted." });
    refreshProducts();
  }
  catch (e: any) {
    toast.add({ title: "Error deleting product", description: e.message, color: "secondary" });
  }
}
</script>

<template>
  <UDashboardPanel id="dashboard-index">
    <template #header>
      <UDashboardNavbar title="Dashboard Overview" />
    </template>

    <div class="space-y-8">
      <!-- Companies Section -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg">
              Manage companies
            </h2>
            <UButton @click="isCompanyModalOpen = true">
              Add Company
            </UButton>
          </div>
        </template>
        <ul v-if="companies && companies.length" class="space-y-2">
          <li
            v-for="company in companies"
            :key="company.id"
            class="flex justify-between items-center p-2 border rounded-md"
          >
            <span>{{ company.name }} (ID: {{ company.id }})</span>
            <UButton
              color="secondary"
              variant="soft"
              @click="handleDeleteCompany(company.id)"
            >
              Delete
            </UButton>
          </li>
        </ul>
        <p v-else>
          No companies found. Use the button above to add one.
        </p>
      </UCard>

      <div v-if="selectedCompany" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Customers Section -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="font-bold text-lg">
                Customers of {{ selectedCompany.name }}
              </h2>
              <UButton @click="isCustomerModalOpen = true">
                Add Customer
              </UButton>
            </div>
          </template>
          <ul v-if="customers && customers.length" class="space-y-2">
            <li
              v-for="customer in customers"
              :key="customer.id"
              class="flex justify-between items-center p-2 border rounded-md"
            >
              <div>
                <p>{{ customer.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ customer.email }}
                </p>
              </div>
              <UButton
                color="secondary"
                variant="soft"
                @click="handleDeleteCustomer(customer.id)"
              >
                Delete
              </UButton>
            </li>
          </ul>
          <p v-else>
            No customers found for this company.
          </p>
        </UCard>

        <!-- Products Section -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="font-bold text-lg">
                Products of {{ selectedCompany.name }}
              </h2>
              <UButton @click="isProductModalOpen = true">
                Add Product
              </UButton>
            </div>
          </template>
          <ul v-if="products && products.length" class="space-y-2">
            <li
              v-for="product in products"
              :key="product.id"
              class="flex justify-between items-center p-2 border rounded-md"
            >
              <div>
                <p>{{ product.name }}</p>
                <p class="text-sm text-gray-500">
                  Price: {{ product.price }} | Stock: {{ product.stock }}
                </p>
              </div>
              <UButton
                color="secondary"
                variant="soft"
                @click="handleDeleteProduct(product.id)"
              >
                Delete
              </UButton>
            </li>
          </ul>
          <p v-else>
            No products found for this company.
          </p>
        </UCard>
      </div>
      <p v-else class="text-center text-gray-500 mt-8">
        Please select a company from the top-left menu to see customers and products.
      </p>
    </div>

    <!-- Modals -->
    <UModal v-model="isCompanyModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            Add New Company
          </h2>
        </template>
        <UFormField
          name="Company Name"
          label="Company Name"
          class="mb-4"
        >
          <UInput v-model="newCompanyName" />
        </UFormField>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="primary" @click="isCompanyModalOpen = false">
              Cancel
            </UButton>
            <UButton @click="handleAddCompany">
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="isCustomerModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            Add New Customer
          </h2>
        </template>
        <div class="space-y-4">
          <UFormField name="name" label="Name">
            <UInput v-model="newCustomer.name" />
          </UFormField>
          <UFormField name="email" label="Email">
            <UInput v-model="newCustomer.email" type="email" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="primary" @click="isCustomerModalOpen = false">
              Cancel
            </UButton>
            <UButton @click="handleAddCustomer">
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="isProductModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            Add New Product
          </h2>
        </template>
        <div class="space-y-4">
          <UFormField name="name" label="Name">
            <UInput v-model="newProduct.name" />
          </UFormField>
          <UFormField name="description" label="Description">
            <UInput v-model="newProduct.description" />
          </UFormField>
          <UFormField name="price" label="Price">
            <UInput v-model.number="newProduct.price" type="number" />
          </UFormField>
          <UFormField name="stock" label="Stock">
            <UInput v-model.number="newProduct.stock" type="number" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="primary" @click="isProductModalOpen = false">
              Cancel
            </UButton>
            <UButton @click="handleAddProduct">
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPanel>
</template>
