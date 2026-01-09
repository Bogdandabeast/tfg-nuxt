<script setup lang="ts">
const { t } = useI18n();

const breadcrumbItems = [{
  label: t("legal.home"),
  to: "/",
}, {
  label: t("legal.title"),
  to: "/legal", // Assuming a legal page exists
}, {
  label: t("legal.terms_and_conditions"),
  to: "/terms", // Corrected path
}];

const accordionItems = [{
  label: t("terms.accordion.service_usage.label"),
  icon: "i-heroicons-information-circle",
  defaultOpen: true,
  content: t("terms.accordion.service_usage.content"),
}, {
  label: t("terms.accordion.privacy.label"),
  icon: "i-heroicons-shield-check",
  content: t("terms.accordion.privacy.content"),
}, {
  label: t("terms.accordion.limitations.label"),
  icon: "i-heroicons-exclamation-triangle",
  content: t("terms.accordion.limitations.content"),
}];
</script>

<template>
  <UPage>
    <UPageHeader
      :title="t('terms.title')"
      :description="t('terms.description')"
      :links="breadcrumbItems"
    />

    <UPageBody>
      <UContainer>
        <!-- Alert for important notices -->
        <UAlert
          icon="i-heroicons-bell-alert"
          color="secondary"
          variant="subtle"
          :title="t('terms.alert.title')"
          :description="t('terms.alert.description')"
          class="mb-8"
        />

        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-bold">
              {{ t("terms.intro.title") }}
            </h2>
          </template>
          <p class="mb-4">
            {{ t("terms.intro.content") }}
            <UBadge
              color="secondary"
              variant="subtle"
              class="ml-2"
            >
              {{ t("terms.badge.new") }}
            </UBadge>
          </p>

          <UCollapsible :open="false">
            <template #trigger="{ open }">
              <UButton
                color="secondary"
                variant="link"
                icon="i-heroicons-information-circle"
                :label="open ? t('terms.collapsible.hide') : t('terms.collapsible.show')"
              />
            </template>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <p>{{ t("terms.collapsible.content") }}</p>
            </div>
          </UCollapsible>
        </UCard>

        <USeparator class="mb-8" />

        <h2 class="text-2xl font-bold mb-4">
          {{ t("terms.sections.title") }}
        </h2>

        <UAccordion :items="accordionItems" class="mb-8" />

        <USeparator class="mb-8" />

        <UCard>
          <template #header>
            <h2 class="text-xl font-bold">
              {{ t("terms.contact.title") }}
            </h2>
          </template>
          <p>
            {{ t("terms.contact.content") }} <ULink to="mailto:soporte@ejemplo.com" inactive-class="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300">
              soporte@ejemplo.com
            </ULink>.
          </p>
        </UCard>
      </UContainer>
    </UPageBody>

    <!-- Optional: UContentToc could be placed in a side column of UPage if using its layout capabilities -->
    <!-- For simplicity, I'm noting its usage here but not fully implementing a two-column layout without knowing the page structure -->
    <!-- <template #right>
      <UContentToc :links="tocLinks" />
    </template> -->

    <UContentSurround
      :surround="[{
        title: t('terms.surround.privacy.title'),
        description: t('terms.surround.privacy.description'),
        to: '/privacy-policy',
      }, {
        title: t('terms.surround.legal_notice.title'),
        description: t('terms.surround.legal_notice.description'),
        to: '/legal-notice',
      }]"
    />
  </UPage>
</template>
