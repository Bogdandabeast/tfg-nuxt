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
</script>

<template>
  <div>
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
          :title="t('pricing.plans.basic.title')"
          :description="t('pricing.plans.basic.description')"
          :icon="ENTITY_ICONS.customer"
          :price="`${isYearly === '1' ? 290 : 29}`"
          :billing-cycle="isYearly === '1' ? t('pricing.plans.yearly_cycle') : t('pricing.plans.monthly_cycle')"
          :features="[
            t('pricing.plans.basic.features.contacts'),
            t('pricing.plans.basic.features.users'),
            t('pricing.plans.basic.features.companies'),
            t('pricing.plans.basic.features.email_integration'),
            t('pricing.plans.basic.features.basic_reporting'),
            t('pricing.plans.basic.features.contact_management'),
            t('pricing.plans.basic.features.notes_tasks'),
            t('pricing.plans.basic.features.basic_support'),
            t('pricing.plans.basic.features.mobile_app'),
            t('pricing.plans.basic.features.data_import'),
            t('pricing.plans.basic.features.email_notifications'),
            t('pricing.plans.basic.features.activity_timeline'),
          ]"
          :button-text="t('pricing.plans.basic.button')"
          button-color="primary"
          orientation="vertical"
        />
        <UPricingPlan
          :title="t('pricing.plans.pro.title')"
          :description="t('pricing.plans.pro.description')"
          :icon="ENTITY_ICONS.companies"
          :price="`${isYearly === '1' ? 990 : 99}`"
          :billing-cycle="isYearly === '1' ? t('pricing.plans.yearly_cycle') : t('pricing.plans.monthly_cycle')"
          :features="[
            t('pricing.plans.pro.features.contacts'),
            t('pricing.plans.pro.features.users'),
            t('pricing.plans.pro.features.companies'),
            t('pricing.plans.pro.features.email_campaigns'),
            t('pricing.plans.pro.features.automation_workflows'),
            t('pricing.plans.pro.features.advanced_analytics'),
            t('pricing.plans.pro.features.custom_fields'),
            t('pricing.plans.pro.features.api_access'),
            t('pricing.plans.pro.features.priority_support'),
            t('pricing.plans.pro.features.integrations'),
            t('pricing.plans.pro.features.role_based_access'),
            t('pricing.plans.pro.features.audit_logs'),
            t('pricing.plans.pro.features.bulk_operations'),
            t('pricing.plans.pro.features.advanced_filters'),
            t('pricing.plans.pro.features.sales_pipeline'),
            t('pricing.plans.pro.features.deal_tracking'),
            t('pricing.plans.pro.features.lead_scoring'),
            t('pricing.plans.pro.features.document_management'),
            t('pricing.plans.pro.features.calendar_sync'),
            t('pricing.plans.pro.features.meeting_scheduling'),
          ]"
          :button-text="t('pricing.plans.pro.button')"
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
