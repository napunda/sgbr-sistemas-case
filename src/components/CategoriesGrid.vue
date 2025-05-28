<template>
  <div v-if="loading" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    <q-card v-for="i in itemsPerPage" :key="i" class="overflow-hidden rounded-xl">
      <q-skeleton height="160px" />
      <q-card-section>
        <q-skeleton type="text" width="80%" />
        <q-skeleton type="text" width="60%" class="mt-1" />
      </q-card-section>
    </q-card>
  </div>

  <div
    v-else-if="categories.length > 0"
    class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
  >
    <CategoryCard
      v-for="category in paginatedCategories"
      :key="category.name_encoded"
      :category="category"
      @select-category="$emit('select-category', $event)"
    />
  </div>

  <div v-else-if="!loading" class="py-12 text-center">
    <q-icon name="category" size="4rem" color="grey-5" class="mb-4" />
    <div class="text-h6 text-grey-7 mb-2">Nenhuma categoria encontrada</div>
    <div class="text-body2 text-grey-5 mb-4">Tente atualizar a página ou verificar sua conexão</div>
    <slot name="empty-state-actions"></slot>
  </div>

  <div v-if="showPagination && totalPages > 1" class="mt-8 flex justify-center">
    <q-pagination
      :model-value="currentPage"
      :max="totalPages"
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
import CategoryCard from './CategoryCard.vue';
import { GiphyCategory } from 'src/types/giphy';

const props = defineProps<{
  categories: GiphyCategory[];
  loading?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
}>();

const emit = defineEmits<{
  'select-category': [category: GiphyCategory];
  'page-change': [page: number];
}>();

const itemsPerPage = computed(() => props.itemsPerPage ?? 24);
const currentPage = computed(() => props.currentPage ?? 1);
const totalPages = computed(
  () => props.totalPages ?? Math.ceil(props.categories.length / itemsPerPage.value)
);

const paginatedCategories = computed(() => {
  if (props.showPagination) {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return props.categories.slice(start, end);
  }
  return props.categories;
});

const onPageChange = (page: number) => {
  emit('page-change', page);
};
</script>
