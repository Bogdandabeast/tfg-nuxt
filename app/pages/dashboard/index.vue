<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "dashboard",
});

const toast = useToast();
const error = ref("");
const { isCreateCompanyLoading, createCompany, deleteCompany } = useCompaniesApi();
const { isCreateCustomerLoading, createCustomer, isDeleteCustomerLoading, deleteCustomer } = useCustomersApi();
const { isCreateProductLoading, createProduct, isDeleteProductLoading, deleteProduct } = useProductsApi();
const { isCreateSaleLoading, createSale, deleteSale } = useSalesApi();
const { isDeleting: isDeletingSale, deleteById: deleteSaleById } = useDeletingById();

// Stores
const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const salesStore = useSalesStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
customersStore.refreshCustomers();
productsStore.refreshProducts();
salesStore.refreshSales();

// State from stores
const { companies, currentCompany } = storeToRefs(companiesStore);
const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);
const { sales } = storeToRefs(salesStore);

// Modals state
const isCompanyModalOpen = ref(false);
const isCustomerModalOpen = ref(false);
const isProductModalOpen = ref(false);
const isSaleModalOpen = ref(false);

// Deletion states
const deletingCompanyId = ref<number | null>(null);

// Form models
const newCompanyName = ref("");
const newCustomer = ref({ name: "", email: "" });
const newProduct = ref({ name: "", description: "", price: 0, stock: 0 });
const newSale = ref({ customer_id: 0, product_id: 0, quantity: 1 });

// Actions
async function handleAddCompany() {
  if (!newCompanyName.value) {
    error.value = "Company name is required.";
    return;
  }
  const result = await createCompany({ name: newCompanyName.value });
  if (result) {
    companiesStore.refreshCompanies();
    toast.add({ title: "Success", description: "Company created." });
    newCompanyName.value = "";
    isCompanyModalOpen.value = false;
    error.value = "";
  }
}

async function handleDeleteCompany(id: number) {
  deletingCompanyId.value = id;
  try {
    const result = await deleteCompany(id);
    if (result === true) {
      companiesStore.refreshCompanies();
      if (companiesStore.currentCompany?.id === id) {
        const firstCompany = companiesStore.companies?.[0] ?? null;
        companiesStore.setCurrentCompany(firstCompany);
      }
      toast.add({ title: "Success", description: "Company deleted." });
      error.value = "";
    }
    else if (typeof result === "string") {
      error.value = result;
    }
  }
  finally {
    deletingCompanyId.value = null;
  }
}

async function handleAddCustomer() {
  if (!currentCompany.value) {
    error.value = "Please select a company first.";
    return;
  }

  // Client-side validation
  const name = newCustomer.value.name.trim();
  const email = newCustomer.value.email.trim();

  if (!name) {
    error.value = "Customer name is required.";
    return;
  }

  if (!email) {
    error.value = "Customer email is required.";
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/u;
  if (!emailRegex.test(email)) {
    error.value = "Please enter a valid email address.";
    return;
  }

  const customerData = { name, email, company_id: currentCompany.value.id };
  const result = await createCustomer(customerData);
  if (result) {
    customersStore.refreshCustomers();
    toast.add({ title: "Success", description: "Customer created." });
    newCustomer.value = { name: "", email: "" };
    isCustomerModalOpen.value = false;
    error.value = "";
  }
}

async function handleDeleteCustomer(id: number) {
  const success = await deleteCustomer(id);
  if (success) {
    customersStore.refreshCustomers();
    toast.add({ title: "Success", description: "Customer deleted." });
    error.value = "";
  }
}

async function handleAddProduct() {
  if (!currentCompany.value) {
    error.value = "Please select a company first.";
    return;
  }
  const productData = {
    ...newProduct.value,
    company_id: currentCompany.value.id,
  };
  const result = await createProduct(productData);
  if (result) {
    productsStore.refreshProducts();
    toast.add({ title: "Success", description: "Product created." });
    newProduct.value = { name: "", description: "", price: 0, stock: 0 };
    isProductModalOpen.value = false;
    error.value = "";
  }
}

async function handleDeleteProduct(id: number) {
  const success = await deleteProduct(id);
  if (success) {
    productsStore.refreshProducts();
    toast.add({ title: "Success", description: "Product deleted." });
    error.value = "";
  }
}

async function handleAddSale() {
  if (!currentCompany.value) {
    error.value = "Please select a company first.";
    return;
  }
  const saleData = { ...newSale.value, company_id: currentCompany.value.id };
  const result = await createSale(saleData);
  if (result) {
    salesStore.refreshSales();
    toast.add({ title: "Success", description: "Sale created." });
    newSale.value = { customer_id: 0, product_id: 0, quantity: 1 };
    isSaleModalOpen.value = false;
    error.value = "";
  }
}

async function handleDeleteSale(id: number) {
  const result = await deleteSaleById(id, () => deleteSale(id));
  if (result === true) {
    salesStore.refreshSales();
    toast.add({ title: "Success", description: "Sale deleted." });
    error.value = "";
  }
  else if (typeof result === "string") {
    error.value = result;
  }
}

// Fetch initial data
</script>

<template>
  <UDashboardPanel id="dashboard-index">
    <template #header>
      <UDashboardNavbar title="Dashboard Overview" />
    </template>

    <div class="space-y-8">
      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>
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
              variant="soft"
              :loading="deletingCompanyId === company.id"
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

      <div v-if="currentCompany" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
          <ul v-if="customers && customers.length > 0" class="space-y-2">
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
                color="primary"
                variant="soft"
                :loading="isDeleteCustomerLoading"
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
                color="primary"
                variant="soft"
                :loading="isDeleteProductLoading"
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

        <!-- Sales Section -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="font-bold text-lg">
                Sales of {{ currentCompany.name }}
              </h2>
              <UButton @click="isSaleModalOpen = true">
                Add Sale
              </UButton>
            </div>
          </template>
          <ul v-if="sales && sales.length" class="space-y-2">
            <li
              v-for="sale in sales"
              :key="sale.id"
              class="flex justify-between items-center p-2 border rounded-md"
            >
              <div>
                <p>Sale #{{ sale.id }}</p>
                <p class="text-sm text-gray-500">
                  Quantity: {{ sale.quantity }}
                </p>
              </div>
              <UButton
                color="primary"
                variant="soft"
                :loading="isDeletingSale(sale.id)"
                @click="handleDeleteSale(sale.id)"
              >
                Delete
              </UButton>
            </li>
          </ul>
          <p v-else>
            No sales found for this company.
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
          label="Company Name"
          name="companyName"
          class="mb-4"
        >
          <UInput v-model="newCompanyName" />
        </UFormField>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton @click="isCompanyModalOpen = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="isCreateCompanyLoading"
              @click="handleAddCompany"
            >
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
            <UButton @click="isCustomerModalOpen = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="isCreateCustomerLoading"
              @click="handleAddCustomer"
            >
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
            <UButton @click="isProductModalOpen = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="isCreateProductLoading"
              @click="handleAddProduct"
            >
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="isSaleModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            Add New Sale
          </h2>
        </template>
        <div class="space-y-4">
          <UFormField name="customer_id" label="Customer ID">
            <UInput v-model.number="newSale.customer_id" type="number" />
          </UFormField>
          <UFormField name="product_id" label="Product ID">
            <UInput v-model.number="newSale.product_id" type="number" />
          </UFormField>
          <UFormField name="quantity" label="Quantity">
            <UInput v-model.number="newSale.quantity" type="number" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton @click="isSaleModalOpen = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="isCreateSaleLoading"
              @click="handleAddSale"
            >
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPanel>
</template>
