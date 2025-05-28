<template>
  <div v-if="loading" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    <q-card v-for="i in itemsPerPage" :key="i" class="overflow-hidden rounded-xl">
      <q-skeleton height="200px" />
      <q-card-section>
        <q-skeleton type="text" width="80%" />
        <q-skeleton type="text" width="60%" class="mt-1" />
      </q-card-section>
    </q-card>
  </div>

  <div v-else-if="gifs.length > 0" :class="gridClasses">
    <GifCard
      v-for="gif in paginatedGifs"
      :key="gif.id"
      :gif="gif"
      :view-mode="viewMode"
      :is-favorite="favorites.includes(gif.id)"
      @toggle-favorite="$emit('toggle-favorite', gif)"
    />
  </div>

  <div v-else-if="!loading" class="py-12 text-center">
    <q-icon name="gif_box" size="4rem" color="grey-5" class="mb-4" />
    <div class="text-h6 text-grey-7 mb-2">
      {{ isSearchMode ? 'Nenhum GIF encontrado para sua busca' : 'Nenhum GIF encontrado' }}
    </div>
    <div class="text-body2 text-grey-5 mb-4">
      {{
        isSearchMode
          ? 'Tente usar outros termos de busca'
          : 'Tente atualizar a página ou verificar sua conexão'
      }}
    </div>
    <slot name="empty-state-actions"></slot>
  </div>

  <div v-if="showPagination && computedTotalPages > 1" class="mt-8 flex justify-center">
    <q-pagination
      :model-value="currentPage"
      :max="computedTotalPages"
      :max-pages="7"
      boundary-numbers
      direction-links
      color="primary"
      @update:model-value="onPageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import GifCard from './GifCard.vue';
import { GiphyItem } from 'src/types/giphy';

const props = defineProps({
  gifs: {
    type: Array as () => GiphyItem[],
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  itemsPerPage: {
    type: Number,
    default: 24,
  },
  viewMode: {
    type: String,
    default: 'grid',
    validator: (value: string) => ['grid', 'masonry'].includes(value),
  },
  isSearchMode: {
    type: Boolean,
    default: false,
  },
  favorites: {
    type: Array as () => string[],
    default: () => [],
  },

  showPagination: {
    type: Boolean,
    default: false,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['toggle-favorite', 'page-change']);

const computedTotalPages = computed(() => {
  if (props.totalPages > 0) {
    return props.totalPages;
  }
  return Math.ceil((props.totalItems || props.gifs.length) / props.itemsPerPage);
});

const paginatedGifs = computed(() => {
  if (props.showPagination) {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.gifs.slice(start, end);
  }

  return props.gifs;
});

const gridClasses = computed(() => {
  const baseClasses = 'gap-4 transition-all duration-300';

  if (props.viewMode === 'masonry') {
    return `${baseClasses} columns-2 md:columns-3 lg:columns-4 space-y-4`;
  }

  return `${baseClasses} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
});

const onPageChange = (page: number) => {
  emit('page-change', page);
};
</script>

<style scoped>
.columns-2 > div,
.columns-3 > div,
.columns-4 > div {
  break-inside: avoid;
  margin-bottom: 1rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.q-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
