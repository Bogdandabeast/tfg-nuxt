<script setup lang="ts">
import { FEATURE_ICONS, UI_ICONS } from "~/lib/icons";

const LazyAppColumns = defineAsyncComponent(() => import("~/components/landing/AppColumns.vue"));

const { t } = useI18n();
const localePath = useLocalePath();
useSeoMeta({
  titleTemplate: "",
  title: t("homepage.title"),
  ogTitle: t("homepage.title"),
  description: t("homepage.description"),
  ogDescription: t("homepage.description"),
});
</script>

<template>
  <div>
    <UPageHero
      :title="t('homepage.title')"
      :description="t('homepage.description')"
      :links="[
        {
          label: t('homepage.get_started_button'),
          to: localePath('/signup'),
          icon: UI_ICONS.success,
        },
      ]"
    >
      <template #top>
        <LandingHeroBackground />
      </template>
    </UPageHero>

    <UPageSection
      :title="t('homepage.features.title')"
      :description="t('homepage.features.description')"
    >
      <UPageGrid>
        <UPageCard
          :title="t('homepage.features.one.title')"
          :description="t('homepage.features.one.description')"
          :icon="(UI_ICONS as any).globe"
          spotlight
        />
        <UPageCard
          :title="t('homepage.features.two.title')"
          :description="t('homepage.features.two.description')"
          :icon="FEATURE_ICONS.analytics"
          spotlight
        />
        <UPageCard
          :title="t('homepage.features.three.title')"
          :description="t('homepage.features.three.description')"
          :icon="UI_ICONS.settings"
          spotlight
        />
      </UPageGrid>
    </UPageSection>
    <UPageSection
      :title="t('homepage.testimonials.title')"
      :description="t('homepage.testimonials.description')"
    >
      <LazyAppColumns />
    </UPageSection>

    <USeparator />

    <UPageCTA
      :title="t('homepage.cta.title')"
      :description="t('homepage.cta.description')"
      align="center"
      orientation="horizontal"
      :links="[
        {
          label: t('homepage.cta.signup_button'),
          to: localePath('/signup'),
          color: 'primary',
        },
      ]"
      variant="naked"
      class="overflow-hidden"
    >
      <LazyLandingStarsBg />
    </UPageCTA>
  </div>
</template>
