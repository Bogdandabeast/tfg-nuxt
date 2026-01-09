<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCompaniesStore } from "~/app/stores/companies";
import { useCustomersStore } from "~/app/stores/customers";
import { useProductsStore } from "~/app/stores/products";

definePageMeta({
  layout: "dashboard",
});

const toast = useToast();

// Stores
const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

// State from stores
const { companies, currentCompany } = storeToRefs(companiesStore);
const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

// Modals state
const isCompanyModalOpen = ref(false);
const isCustomerModalOpen = ref(false);
const isProductModalOpen = ref(false);

// Form models
const newCompanyName = ref("");
const newCustomer = ref({ name: "", email: "" });
const newProduct = ref({ name: "", description: "", price: 0, stock: 0 });

// Actions
async function handleAddCompany() {
  if (!newCompanyName.value) {
    toast.add({ title: "Error", description: "Company name is required.", color: "red" });
    return;
  }
  try {
    await companiesStore.createCompany({ name: newCompanyName.value });
    toast.add({ title: "Success", description: "Company created." });
    newCompanyName.value = "";
    isCompanyModalOpen.value = false;
  }
  catch (e: any) {
    toast.add({ title: "Error creating company", description: e.message, color: "red" });
  }
}

async function handleDeleteCompany(id: number) {
  try {
    await companiesStore.deleteCompany(id);
    toast.add({ title: "Success", description: "Company deleted." });
  }
  catch (e: any) {
    toast.add({ title: "Error deleting company", description: e.message, color: "red" });
  }
}

async function handleAddCustomer() {
  if (!currentCompany.value) {
    toast.add({ title: "Error", description: "Please select a company first.", color: "red" });
    return;
  }
  try {
    await customersStore.createCustomer(newCustomer.value);
    toast.add({ title: "Success", description: "Customer created." });
    newCustomer.value = { name: "", email: "" };
    isCustomerModalOpen.value = false;
  }
  catch (e: any) {
    toast.add({ title: "Error creating customer", description: e.message, color: "red" });
  }
}

async function handleDeleteCustomer(id: number) {
  try {
    await customersStore.deleteCustomer(id);
    toast.add({ title: "Success", description: "Customer deleted." });
  }
  catch (e: any) {
    toast.add({ title: "Error deleting customer", description: e.message, color: "red" });
  }
}

async function handleAddProduct() {
  if (!currentCompany.value) {
    toast.add({ title: "Error", description: "Please select a company first.", color: "red" });
    return;
  }
  try {
    // Ensure price is a string if the API expects it, otherwise keep as number
    await productsStore.createProduct({
      ...newProduct.value,
      price: newProduct.value.price.toString(),
    });
    toast.add({ title: "Success", description: "Product created." });
    newProduct.value = { name: "", description: "", price: 0, stock: 0 };
    isProductModalOpen.value = false;
  }
  catch (e: any) {
    toast.add({ title: "Error creating product", description: e.message, color: "red" });
  }
}

async function handleDeleteProduct(id: number) {
  try {
    await productsStore.deleteProduct(id);
    toast.add({ title: "Success", description: "Product deleted." });
  }
  catch (e: any) {
    toast.add({ title: "Error deleting product", description: e.message, color: "red" });
  }
}

// Fetch initial data
onMounted(() => {
  companiesStore.refreshCompanies();
  customersStore.refreshCustomers();
  productsStore.refreshProducts();
});
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
              color="red"
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

      <div v-if="currentCompany" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Customers Section -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="font-bold text-lg">
                Customers of {{ currentCompany.name }}
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
                color="red"
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
                Products of {{ currentCompany.name }}
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
                color="red"
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
        <UFormGroup
          label="Company Name"
          name="companyName"
          class="mb-4"
        >
          <UInput v-model="newCompanyName" />
        </UFormGroup>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton @click="isCompanyModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="handleAddCompany">
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
          <UFormGroup name="name" label="Name">
            <UInput v-model="newCustomer.name" />
          </UFormGroup>
          <UFormGroup name="email" label="Email">
            <UInput v-model="newCustomer.email" type="email" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton @click="isCustomerModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="handleAddCustomer">
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
          <UFormGroup name="name" label="Name">
            <UInput v-model="newProduct.name" />
          </UFormGroup>
          <UFormGroup name="description" label="Description">
            <UInput v-model="newProduct.description" />
          </UFormGroup>
          <UFormGroup name="price" label="Price">
            <UInput v-model.number="newProduct.price" type="number" />
          </UFormGroup>
          <UFormGroup name="stock" label="Stock">
            <UInput v-model.number="newProduct.stock" type="number" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton @click="isProductModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="handleAddProduct">
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPanel>
</template>
