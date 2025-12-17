<script setup lang="ts">
useSeoMeta({
  title: "Changelog",
  ogTitle: "Changelog",
  description: "Stay up to date with the latest changes and improvements.",
  ogDescription: "Stay up to date with the latest changes and improvements.",
});
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Changelog"
      description="Stay up to date with the latest changes and improvements to our app."
      class="py-[50px]"
    />

    <UPageBody>
      <UChangelogVersions>
        <UChangelogVersion
          title="Version 1.1.0"
          date="2023-12-15"
          :links="[{ label: 'View on GitHub', to: '#', target: '_blank' }]"
        >
          <template #body>
            <div>
              <p>This version introduces a host of new features and improvements.</p>
              <ul>
                <li>- New Feature A</li>
                <li>- Improvement B</li>
                <li>- Bug Fix C</li>
              </ul>
            </div>
          </template>
        </UChangelogVersion>
        <UChangelogVersion
          title="Version 1.0.0"
          date="2023-12-01"
        >
          <template #body>
            <div>
              <p>Initial public release. Welcome to the app!</p>
            </div>
          </template>
        </UChangelogVersion>
      </UChangelogVersions>
    </UPageBody>
  </UContainer>
</template>
