<template>
  <div class="p-4 md:p-16">
    <h1 class="mb-2 text-xl font-bold text-primary md:text-4xl">{{ title }}</h1>

    <p v-if="subtitle" class="mb-6 text-lg text-gray-500">{{ subtitle }}</p>

    <q-card class="rounded-2xl bg-white p-2 shadow-xl md:p-8">
      <q-card-section>
        <slot />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
