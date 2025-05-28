<template>
  <PageWrapper title="Trending">
    <GifSearchControls
      v-model:search-term="searchTerm"
      v-model:items-per-page="itemsPerPage"
      v-model:view-mode="viewMode"
      :loading="gifsStore.loading"
      :is-search-mode="gifsStore.isSearchMode"
      @search="handleSearch"
      @clear-search="handleClearSearch"
      @refresh="handleRefresh"
    />

    <GifGrid
      :gifs="gifsStore.gifs"
      :loading="gifsStore.loading"
      :items-per-page="itemsPerPage"
      :view-mode="viewMode"
      :is-search-mode="gifsStore.isSearchMode"
      :favorites="gifsStore.favoriteIds"
      :show-pagination="true"
      :total-items="totalItems"
      :current-page="currentPage"
      :total-pages="totalPages"
      @toggle-favorite="gifsStore.toggleFavorite"
      @page-change="handlePageChange"
    >
      <template v-if="gifsStore.isSearchMode" #empty-state-actions>
        <q-btn color="primary" @click="handleClearSearch" label="Ver trending" />
      </template>
    </GifGrid>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import PageWrapper from 'src/components/PageWrapper.vue';
import GifSearchControls from 'src/components/GifSearchControls.vue';
import GifGrid from 'src/components/GifGrid.vue';
import { useGifsStore } from 'src/stores/gifs';

const gifsStore = useGifsStore();

const itemsPerPage = ref(24);
const viewMode = ref<'grid' | 'masonry'>('grid');
const searchTerm = ref('');

const currentPageKey = computed(() => (gifsStore.isSearchMode ? 'search' : 'trending'));
const currentPage = computed(() => gifsStore.getCurrentPage(currentPageKey.value));
const totalItems = computed(() => gifsStore.gifs.length);
const totalPages = computed(() => {
  if (gifsStore.isSearchMode) {
    return gifsStore.totalTrendingPages(itemsPerPage.value);
  }
  return gifsStore.totalTrendingPages(itemsPerPage.value);
});

const handleSearch = async (query: string) => {
  searchTerm.value = query;
  await gifsStore.performSearch(query);
};

const handleClearSearch = async () => {
  searchTerm.value = '';
  await gifsStore.clearSearch();
};

const handleRefresh = async () => {
  await gifsStore.refreshGifs();
};

const handlePageChange = async (page: number) => {
  const pageKey = gifsStore.isSearchMode ? 'search' : 'trending';
  gifsStore.setCurrentPage(pageKey, page);

  const requiredGifs = page * itemsPerPage.value;
  if (gifsStore.gifs.length < requiredGifs) {
    await gifsStore.loadMoreGifs();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(itemsPerPage, async (newValue) => {
  const requiredGifs = currentPage.value * newValue;
  if (gifsStore.gifs.length < requiredGifs) {
    await gifsStore.loadMoreGifs();
  }
});

watch(
  () => gifsStore.searchTerm,
  (newValue) => {
    searchTerm.value = newValue;
  }
);

watch(
  () => gifsStore.isSearchMode,
  (isSearchMode) => {
    gifsStore.resetPage(isSearchMode ? 'search' : 'trending');
  }
);

onMounted(async () => {
  gifsStore.loadFavoritesFromStorage();

  if (gifsStore.gifs.length === 0) {
    await gifsStore.fetchTrendingGifs();
  }
});
</script>
