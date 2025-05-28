<template>
  <div
    class="group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
  >
    <img
      :src="gif.images.fixed_height.url"
      :alt="gif.title"
      class="w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
      :style="imageStyle"
      loading="lazy"
    />

    <div
      class="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <div class="flex items-center justify-between">
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-medium text-white">
            {{ gif.username ? `@${gif.username}` : 'Anônimo' }}
          </div>
        </div>

        <q-btn
          round
          flat
          :icon="!isFavorite ? 'mdi-heart-outline' : 'mdi-heart-off-outline'"
          :color="isFavorite ? 'red' : 'white'"
          size="sm"
          class="ml-2 hover:bg-white/20"
          @click.stop="$emit('toggle-favorite')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  gif: {
    type: Object,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'grid',
    validator: (value: string) => ['grid', 'masonry'].includes(value),
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

const imageStyle = computed(() => {
  if (props.viewMode === 'masonry') {
    return {
      height: 'auto',
      width: '100%',
      display: 'block',
    };
  }

  return {
    height: '300px',
    objectFit: 'cover' as const,
    width: '100%',
  };
});
</script>
