<script setup lang="ts">
const { t } = useI18n();
const consent = useCookie("cookie-consent", {
  maxAge: 60 * 60 * 24 * 365, // 1 year
});

const isVisible = ref(false);

// We use onMounted to avoid hydration mismatch if the cookie exists
onMounted(() => {
  console.log('CookieBanner mounted, consent value:', consent.value);
  if (!consent.value) {
    isVisible.value = true;
  }
});

function acceptCookies() {
  consent.value = "accepted";
  isVisible.value = false;
}

function rejectCookies() {
  consent.value = "rejected";
  isVisible.value = false;
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-0 left-0 z-50 w-full p-4"
    >
      <UCard class="mx-auto max-w-4xl shadow-xl border-primary-500/20">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <p>
              {{ t('cookieConsent.message') }}
            </p>
          </div>
          <div class="flex flex-shrink-0 gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              @click="rejectCookies"
            >
              {{ t('cookieConsent.optOut') }}
            </UButton>
            <UButton
              color="primary"
              variant="solid"
              size="sm"
              @click="acceptCookies"
            >
              {{ t('cookieConsent.accept') }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </Transition>
</template>