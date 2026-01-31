<script setup lang="ts">
import { FEATURE_ICONS, SOCIAL_ICONS, UI_ICONS } from "~/lib/icons";

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
    <LazyLandingStarsBg />
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
    />

    <UPageSection
      :title="t('homepage.features.title')"
      :description="t('homepage.features.description')"
    >
      <UPageGrid>
        <UPageCard
          :title="t('homepage.features.one.title')"
          :description="t('homepage.features.one.description')"
          :icon="SOCIAL_ICONS.website"
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
      :title="t('homepage.testimonials_title')"
      :description="t('homepage.testimonials_description')"
    >
      <LandingTestimonials />
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
      />
    </upagesection>
  </div>
</template>
