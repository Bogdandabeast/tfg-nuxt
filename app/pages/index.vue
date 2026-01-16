<script setup lang="ts">
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
          icon: 'i-heroicons-rocket-launch',
        },
      ]"
    >
      <template #top>
        <LandingHeroBackground />
      </template>

      <LandingPromotionalVideo />
    </UPageHero>

    <UPageSection
      :title="t('homepage.features.title')"
      :description="t('homepage.features.description')"
    >
      <UPageGrid>
        <UPageCard
          :title="t('homepage.features.one.title')"
          :description="t('homepage.features.one.description')"
          icon="i-heroicons-globe-alt"
          spotlight
        />
        <UPageCard
          :title="t('homepage.features.two.title')"
          :description="t('homepage.features.two.description')"
          icon="i-heroicons-chart-bar"
          spotlight
        />
        <UPageCard
          :title="t('homepage.features.three.title')"
          :description="t('homepage.features.three.description')"
          icon="i-heroicons-cog-6-tooth"
          spotlight
        />
      </UPageGrid>
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
