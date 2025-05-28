<template>
  <PageWrapper title="Favoritos">
    <div class="q-mb-md">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <h6 class="q-ma-none text-grey-7">
            {{ gifsStore.favoritesCount }}
            {{ gifsStore.favoritesCount === 1 ? 'favorito' : 'favoritos' }}
          </h6>
        </div>
      </div>
    </div>

    <div class="q-mb-md" v-if="gifsStore.favoritesCount > 0">
      <div class="row q-gutter-md justify-between">
        <div class="col-auto">
          <q-btn-toggle v-model="viewMode" :options="viewModeOptions" color="primary" outline />
        </div>
        <div class="col-auto">
          <q-btn
            v-if="gifsStore.favoritesCount > 0"
            color="negative"
            outline
            icon="delete_sweep"
            label="Limpar todos"
            @click="confirmClearAll"
          />
        </div>
      </div>
    </div>

    <div v-if="gifsStore.favoritesCount > 0">
      <GifGrid
        :gifs="gifsStore.favorites"
        :loading="false"
        :items-per-page="itemsPerPage"
        :view-mode="viewMode"
        :is-search-mode="false"
        :favorites="gifsStore.favoriteIds"
        :show-pagination="true"
        :total-items="gifsStore.favoritesCount"
        :current-page="currentPage"
        :total-pages="totalPages"
        @toggle-favorite="handleRemoveFavorite"
        @page-change="handlePageChange"
      />
    </div>

    <div v-else class="q-pa-xl text-center">
      <q-icon name="favorite_border" size="4rem" color="grey-5" />
      <h5 class="q-mt-md q-mb-sm text-grey-6">Nenhum favorito ainda</h5>
      <p class="text-grey-5 q-mb-lg">
        Adicione GIFs aos seus favoritos na página principal para vê-los aqui.
      </p>
      <q-btn color="primary" label="Explorar GIFs" icon="explore" @click="$router.push('/')" />
    </div>

    <q-dialog v-model="showClearDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm"> Tem certeza que deseja remover todos os favoritos? </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Confirmar" color="negative" @click="clearAllFavorites" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';

import PageWrapper from 'src/components/PageWrapper.vue';
import GifGrid from 'src/components/GifGrid.vue';
import { useGifsStore } from 'src/stores/gifs';
import { GiphyItem } from 'src/types/giphy';

const gifsStore = useGifsStore();

const itemsPerPage = ref(24);
const viewMode = ref<'grid' | 'masonry'>('grid');
const showClearDialog = ref(false);

const viewModeOptions = [
  { label: 'Grade', value: 'grid', icon: 'grid_view' },
  { label: 'Masonry', value: 'masonry', icon: 'view_quilt' },
];

const currentPage = computed(() => gifsStore.getCurrentPage('favorites'));

const totalPages = computed(() => gifsStore.totalFavoritesPages(itemsPerPage.value));

const handleRemoveFavorite = (gif: GiphyItem) => {
  gifsStore.removeFromFavorites(gif.id);

  const newTotalPages = gifsStore.totalFavoritesPages(itemsPerPage.value);
  if (currentPage.value > newTotalPages && newTotalPages > 0) {
    gifsStore.setCurrentPage('favorites', newTotalPages);
  }
};

const handlePageChange = (page: number) => {
  gifsStore.setCurrentPage('favorites', page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const confirmClearAll = () => {
  showClearDialog.value = true;
};

const clearAllFavorites = () => {
  gifsStore.clearAllFavorites();
};

watch(
  () => gifsStore.favoritesCount,
  (newCount) => {
    if (newCount === 0) {
      gifsStore.resetPage('favorites');
    } else {
      const newTotalPages = gifsStore.totalFavoritesPages(itemsPerPage.value);
      if (currentPage.value > newTotalPages) {
        gifsStore.setCurrentPage('favorites', Math.max(1, newTotalPages));
      }
    }
  }
);

watch(itemsPerPage, () => {
  const newTotalPages = gifsStore.totalFavoritesPages(itemsPerPage.value);
  if (currentPage.value > newTotalPages && newTotalPages > 0) {
    gifsStore.setCurrentPage('favorites', newTotalPages);
  }
});

onMounted(() => {
  gifsStore.loadFavoritesFromStorage();
});
</script>
