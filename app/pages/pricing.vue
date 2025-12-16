<script setup lang="ts">
useSeoMeta({
    title: "Our Pricing Plans",
    ogTitle: "Our Pricing Plans",
    description: "Choose the perfect plan that fits your needs and budget.",
    ogDescription: "Choose the perfect plan that fits your needs and budget.",
});

const isYearly = ref("0");

const items = ref([
    {
        label: "Monthly",
        value: "0",
    },
    {
        label: "Yearly",
        value: "1",
    },
]);
</script>

<template>
    <div>
        <UPageHero
            title="Our Flexible Pricing Plans"
            description="Choose the perfect plan that fits your needs and budget. No hidden fees, no surprises."
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
                    title="Basic"
                    description="Perfect for individual users."
                    icon="i-heroicons-user"
                    :price="`${isYearly === '1' ? 100 : 10}`"
                    :billing-cycle="isYearly === '1' ? '/year' : '/month'"
                    :features="[
                        '5 Projects',
                        '10 GB Storage',
                        'Basic Support',
                        'Custom Domain',
                        'SSL Certificate',
                        'Email Notifications',
                        'Analytics Dashboard',
                        'Community Access',
                        'API Access',
                        'Daily Backups',
                        'Priority Queue',
                        'Multi-device Sync',
                        'Basic Integrations',
                    ]"
                    button-text="Choose Basic"
                    button-color="primary"
                    orientation="vertical"
                />
                <UPricingPlan
                    title="Pro"
                    description="For growing teams with more needs."
                    icon="i-heroicons-users"
                    :price="`${isYearly === '1' ? 200 : 20}`"
                    :billing-cycle="isYearly === '1' ? '/year' : '/month'"
                    :features="[
                        'Unlimited Projects',
                        '1 TB Secure Cloud Storage',
                        '24/7 Premium Support',
                        'Dedicated Account Manager',
                        'Custom Domain + Advanced DNS',
                        'Enterprise-grade SSL Certificates',
                        'Advanced Analytics & Reporting',
                        'Team Collaboration Tools',
                        'Role-based Access Control',
                        'Single Sign-On (SSO)',
                        'Audit Logs & Compliance Reports',
                        'API Rate Limits x10',
                        'Daily + On-demand Backups',
                        'Priority Deployment Queue',
                        'Multi-device Sync & Offline Mode',
                        'Advanced Integrations (Slack, Jira, Zapier)',
                        'AI-powered Recommendations',
                        'Custom Branding & White-label',
                        'Beta Features Early Access',
                        '99.99% Uptime SLA',
                        'Geo-redundant Infrastructure',
                        'Advanced Security (2FA, Encryption at Rest)',
                        'VIP Community Access',
                        'Quarterly Strategy Review',
                    ]"
                    button-text="Choose Pro"
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
            title="Frequently Asked Questions"
            description="Answers to the most common questions about our pricing."
        >
            <UAccordion
                :items="[
                    {
                        label: 'What is your refund policy?',
                        content:
                            'We offer a 30-day money-back guarantee for all our plans.',
                    },
                    {
                        label: 'Can I change my plan later?',
                        content:
                            'Yes, you can upgrade or downgrade your plan at any time.',
                    },
                    {
                        label: 'Do you offer custom plans?',
                        content:
                            'Please contact our sales team for custom enterprise solutions.',
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
