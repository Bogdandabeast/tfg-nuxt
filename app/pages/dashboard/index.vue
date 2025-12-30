<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Period, Range } from "~/types";

import { sub } from "date-fns";

import { authClient } from "~~/lib/auth-client";

definePageMeta({
  layout: "dashboard",
});

const { isNotificationsSlideoverOpen } = useDashboard();

const items = [
  [
    {
      label: "New mail",
      icon: "i-lucide-send",
      to: "/inbox",
    },
    {
      label: "New customer",
      icon: "i-lucide-user-plus",
      to: "/dashboard/customers",
    },
  ],
] satisfies DropdownMenuItem[][];

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<Period>("daily");

const { data: session } = await authClient.useSession(useFetch);
</script>

<template>
  <div>
    <h1>la informacion del userid {{ session?.session.userId }}</h1>
  </div>
</template>
