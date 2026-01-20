<script setup lang="ts">
import { SOCIAL_ICONS, TECH_ICONS } from "~/lib/icons";

const columns = [
  {
    label: "Resources",
    children: [
      {
        label: "Help center",
      },
      {
        label: "Docs",
      },
      {
        label: "Roadmap",
      },
      {
        label: "Changelog",
      },
    ],
  },
  {
    label: "Features",
    children: [
      {
        label: "Affiliates",
      },
      {
        label: "Portal",
      },
      {
        label: "Jobs",
      },
      {
        label: "Sponsors",
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        label: "About",
      },
      {
        label: "Pricing",
      },
      {
        label: "Careers",
      },
    ],
  },
];

const toast = useToast();

const email = ref("");
const loading = ref(false);

function onSubmit() {
  loading.value = true;

  toast.add({
    title: "Subscribed!",
    description: "You've been subscribed to our newsletter.",
  });
}
</script>

<template>
  <USeparator :icon="TECH_ICONS.nuxt" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer class="py-8 overflow-y-auto">
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                :label="$t('footer.newsletter.label')"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  :placeholder="$t('footer.newsletter.placeholder')"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      :label="$t('footer.newsletter.subscribe')"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        Built with Nuxt UI • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        to="https://go.nuxt.com/discord"
        target="_blank"
        :icon="SOCIAL_ICONS.discord"
        aria-label="Nuxt on Discord"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://go.nuxt.com/x"
        target="_blank"
        :icon="SOCIAL_ICONS.twitter"
        aria-label="Nuxt on X"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://github.com/nuxt-ui-templates/saas"
        target="_blank"
        :icon="SOCIAL_ICONS.github"
        aria-label="Nuxt UI on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
