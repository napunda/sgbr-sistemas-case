<template>
  <q-card
    class="category-card cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
    @click="$emit('select-category', category)"
  >
    <div class="relative overflow-hidden">
      <div v-if="category.gif" class="bg-grey-2 aspect-video">
        <img
          :src="category.gif.images.fixed_height.url"
          :alt="category.name"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div
        v-else
        class="flex aspect-video items-center justify-center bg-gradient-to-br from-primary to-secondary"
      >
        <q-icon name="category" size="3rem" color="white" />
      </div>

      <div
        class="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent"
      >
        <div class="w-full p-4 text-white">
          <h6 class="m-0 text-lg font-semibold capitalize">{{ category.name }}</h6>
          <p
            v-if="category.subcategories && category.subcategories.length > 0"
            class="m-0 mt-1 text-sm opacity-90"
          >
            {{ category.subcategories.length }} subcategorias
          </p>
        </div>
      </div>
    </div>

    <q-ripple />
  </q-card>
</template>

<script lang="ts" setup>
import { GiphyCategory } from 'src/types/giphy';

defineProps<{
  category: GiphyCategory;
}>();

defineEmits<{
  'select-category': [category: GiphyCategory];
}>();
</script>

<style scoped>
.category-card {
  border-radius: 12px;
  overflow: hidden;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
