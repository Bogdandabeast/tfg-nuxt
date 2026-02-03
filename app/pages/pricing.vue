<script setup lang="ts">
import { ENTITY_ICONS } from "~/lib/icons";

const { t } = useI18n();
useSeoMeta({
  title: t("pricing.seo.title"),
  ogTitle: t("pricing.seo.title"),
  description: t("pricing.seo.description"),
  ogDescription: t("pricing.seo.description"),
});

const isYearly = ref("0");

const items = ref([
  {
    label: t("pricing.tabs.monthly"),
    value: "0",
  },
  {
    label: t("pricing.tabs.yearly"),
    value: "1",
  },
]);

const featuresFree = computed(() => [
  t("pricing.plans.free.features.company_management"),
  t("pricing.plans.free.features.customer_crud"),
  t("pricing.plans.free.features.product_crud"),
  t("pricing.plans.free.features.sales_crud"),
  t("pricing.plans.free.features.crm_access"),
  t("pricing.plans.free.features.basic_metrics"),
]);

const featuresPremium = computed(() => [
  t("pricing.plans.premium.features.company_management"),
  t("pricing.plans.premium.features.customer_crud"),
  t("pricing.plans.premium.features.product_crud"),
  t("pricing.plans.premium.features.sales_crud"),
  t("pricing.plans.premium.features.crm_access"),
  t("pricing.plans.premium.features.basic_metrics"),
  t("pricing.plans.premium.features.image_upload"),
  t("pricing.plans.premium.features.advanced_metrics"),
  t("pricing.plans.premium.features.email_sending"),
  t("pricing.plans.premium.features.employee_management"),
  t("pricing.plans.premium.features.full_api_access"),
  t("pricing.plans.premium.features.ai_features"),
]);
</script>

<template>
  <div>
    <LazyLandingStarsBg />
    <UPageHero
      :title="t('pricing.hero.title')"
      :description="t('pricing.hero.description')"
    >
      <template #links>
        <UTabs
          v-model="isYearly"
          :items="items"
          color="neutral"
          size="xs"
          class="w-48"
          :ui="{
            list: 'ring ring-accented rounded-full',
            indicator: 'rounded-full',
            trigger: 'w-1/2',
          }"
        />
      </template>
    </UPageHero>

    <UContainer class="py-8 overflow-y-auto">
      <UPricingPlans scale>
        <UPricingPlan
          :title="t('pricing.plans.free.title')"
          :description="t('pricing.plans.free.description')"
          :icon="ENTITY_ICONS.user"
          price="0"
          :billing-cycle="isYearly === '1' ? t('pricing.plans.yearly_cycle') : t('pricing.plans.monthly_cycle')"
          :features="featuresFree"
          :button-text="t('pricing.plans.free.button')"
          button-color="primary"
          orientation="vertical"
        />
        <UPricingPlan
          :title="t('pricing.plans.premium.title')"
          :description="t('pricing.plans.premium.description')"
          :icon="ENTITY_ICONS.users"
          :price="isYearly === '1' ? '300' : '30'"
          :billing-cycle="isYearly === '1' ? t('pricing.plans.yearly_cycle') : t('pricing.plans.monthly_cycle')"
          :features="featuresPremium"
          :button-text="t('pricing.plans.premium.button')"
          button-color="accent"
          orientation="vertical"
          highlight
        />
      </UPricingPlans>
    </UContainer>

    <UPageSection
      :title="t('pricing.faq.title')"
      :description="t('pricing.faq.description')"
    >
      <UAccordion
        :items="[
          {
            label: t('pricing.faq.refund.question'),
            content: t('pricing.faq.refund.answer'),
          },
          {
            label: t('pricing.faq.change_plan.question'),
            content: t('pricing.faq.change_plan.answer'),
          },
          {
            label: t('pricing.faq.custom_plans.question'),
            content: t('pricing.faq.custom_plans.answer'),
          },
        ]"
        :unmount-on-hide="false"
        :default-value="['0']"
        type="multiple"
        class="max-w-3xl mx-auto"
        :ui="{
          trigger: 'text-base text-highlighted',
          body: 'text-base text-muted',
        }"
      />
    </UPageSection>
  </div>
</template>
