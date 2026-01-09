<script setup lang="ts">
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

    <UContainer>
      <UPricingPlans scale>
        <UPricingPlan
          :title="t('pricing.plans.basic.title')"
          :description="t('pricing.plans.basic.description')"
          icon="i-heroicons-user"
          :price="`${isYearly === '1' ? 100 : 10}`"
          :billing-cycle="isYearly === '1' ? t('pricing.plans.yearly_cycle') : t('pricing.plans.monthly_cycle')"
          :features="[
            t('pricing.plans.basic.features.projects'),
            t('pricing.plans.basic.features.storage'),
            t('pricing.plans.basic.features.support'),
            t('pricing.plans.basic.features.custom_domain'),
            t('pricing.plans.basic.features.ssl_certificate'),
            t('pricing.plans.basic.features.email_notifications'),
            t('pricing.plans.basic.features.analytics_dashboard'),
            t('pricing.plans.basic.features.community_access'),
            t('pricing.plans.basic.features.api_access'),
            t('pricing.plans.basic.features.daily_backups'),
            t('pricing.plans.basic.features.priority_queue'),
            t('pricing.plans.basic.features.multi_device_sync'),
            t('pricing.plans.basic.features.basic_integrations'),
          ]"
          :button-text="t('pricing.plans.basic.button')"
          button-color="primary"
          orientation="vertical"
        />
        <UPricingPlan
          :title="t('pricing.plans.pro.title')"
          :description="t('pricing.plans.pro.description')"
          icon="i-heroicons-users"
          :price="`${isYearly === '1' ? 200 : 20}`"
          :billing-cycle="isYearly === '1' ? t('pricing.plans.yearly_cycle') : t('pricing.plans.monthly_cycle')"
          :features="[
            t('pricing.plans.pro.features.projects'),
            t('pricing.plans.pro.features.storage'),
            t('pricing.plans.pro.features.support'),
            t('pricing.plans.pro.features.dedicated_account_manager'),
            t('pricing.plans.pro.features.custom_domain'),
            t('pricing.plans.pro.features.ssl_certificates'),
            t('pricing.plans.pro.features.analytics_reporting'),
            t('pricing.plans.pro.features.team_collaboration_tools'),
            t('pricing.plans.pro.features.role_based_access_control'),
            t('pricing.plans.pro.features.sso'),
            t('pricing.plans.pro.features.audit_logs'),
            t('pricing.plans.pro.features.api_rate_limits'),
            t('pricing.plans.pro.features.backups'),
            t('pricing.plans.pro.features.deployment_queue'),
            t('pricing.plans.pro.features.multi_device_sync_offline'),
            t('pricing.plans.pro.features.advanced_integrations'),
            t('pricing.plans.pro.features.ai_recommendations'),
            t('pricing.plans.pro.features.custom_branding'),
            t('pricing.plans.pro.features.beta_access'),
            t('pricing.plans.pro.features.uptime_sla'),
            t('pricing.plans.pro.features.geo_redundant_infrastructure'),
            t('pricing.plans.pro.features.advanced_security'),
            t('pricing.plans.pro.features.vip_community_access'),
            t('pricing.plans.pro.features.strategy_review'),
          ]"
          :button-text="t('pricing.plans.pro.button')"
          button-color="accent"
          orientation="vertical"
          highlight
        />
      </UPricingPlans>
    </UContainer>

    <UPageSection>
      <UPageLogos>
        <UIcon
          name="i-simple-icons-nuxtdotjs"
          class="w-12 h-12 flex-shrink-0 text-muted"
        />
        <UIcon
          name="i-simple-icons-tailwindcss"
          class="w-12 h-12 flex-shrink-0 text-muted"
        />
        <UIcon
          name="i-simple-icons-vuedotjs"
          class="w-12 h-12 flex-shrink-0 text-muted"
        />
        <UIcon
          name="i-simple-icons-github"
          class="w-12 h-12 flex-shrink-0 text-muted"
        />
      </UPageLogos>
    </UPageSection>

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
