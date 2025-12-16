<script setup lang="ts">
useSeoMeta({
  title: 'Our Blog',
  ogTitle: 'Our Blog',
  description: 'Read the latest news and articles from our team.',
  ogDescription: 'Read the latest news and articles from our team.'
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Our Blog"
      description="Read the latest news and articles from our team."
      class="py-[50px]"
    />

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          to="/blog/first-post"
          title="Our First Blog Post"
          description="This is a summary of our very first blog post. We are excited to share our thoughts with you."
          image="/placeholder.jpg"
          date="Dec 15, 2023"
          :badge="{ label: 'Announcement' }"
          orientation="horizontal"
          class="col-span-full"
          variant="naked"
          :ui="{
            description: 'line-clamp-2'
          }"
        />
        <UBlogPost
          to="/blog/second-post"
          title="A Guide to Our New Feature"
          description="Learn all about the amazing new feature we just launched."
          image="/placeholder.jpg"
          date="Dec 10, 2023"
          :badge="{ label: 'Guide' }"
          orientation="vertical"
          variant="naked"
          :ui="{
            description: 'line-clamp-2'
          }"
        />
        <UBlogPost
          to="/blog/third-post"
          title="Why We Love Nuxt"
          description="A deep dive into why we chose Nuxt to build our application."
          image="/placeholder.jpg"
          date="Dec 05, 2023"
          :badge="{ label: 'Technology' }"
          orientation="vertical"
          variant="naked"
          :ui="{
            description: 'line-clamp-2'
          }"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
