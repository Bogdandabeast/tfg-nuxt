<script setup lang="ts">
useSeoMeta({
    titleTemplate: "",
    title: "Welcome to Our Awesome App",
    ogTitle: "Welcome to Our Awesome App",
    description:
        "This is a hardcoded description for your landing page. We are excited to have you here!",
    ogDescription:
        "This is a hardcoded description for your landing page. We are excited to have you here!",
});
</script>

<template>
    <div>
        <UPageHero
            title="Welcome to Our Awesome App"
            description="This is a hardcoded description for your landing page. We are excited to have you here!"
            :links="[
                {
                    label: 'Get Started',
                    to: '/signup',
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
            title="Our Amazing Features"
            description="Discover what makes our app stand out from the crowd."
        >
            <UPageGrid>
                <UPageCard
                    title="Feature One"
                    description="This is the description for feature one."
                    icon="i-heroicons-globe-alt"
                    spotlight
                />
                <UPageCard
                    title="Feature Two"
                    description="This is the description for feature two."
                    icon="i-heroicons-chart-bar"
                    spotlight
                />
                <UPageCard
                    title="Feature Three"
                    description="This is the description for feature three."
                    icon="i-heroicons-cog-6-tooth"
                    spotlight
                />
            </UPageGrid>
        </UPageSection>

        <USeparator />

        <UPageCTA
            title="Ready to get started?"
            description="Join us today and unlock a world of possibilities!"
            align="center"
            orientation="horizontal"
            :links="[{ label: 'Sign Up Now', to: '/signup', color: 'primary' }]"
            variant="naked"
            class="overflow-hidden"
        >
            <LazyLandingStarsBg />
        </UPageCTA>
    </div>
</template>
