<template>
  <PageWrapper :title="pageTitle">
    <div class="q-mb-md">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <div v-if="!selectedCategory">
            <h6 class="q-ma-none text-grey-7">
              {{ categoriesStore.totalCategories }} categorias disponíveis
            </h6>
          </div>
          <div v-else class="row q-gutter-sm items-center">
            <q-btn
              flat
              round
              icon="arrow_back"
              color="primary"
              @click="goBackToCategories"
              class="q-mr-sm"
            />
            <div>
              <h6 class="q-ma-none">{{ selectedCategory.name }}</h6>
              <p class="q-ma-none text-grey-7 text-caption">
                {{ categoriesStore.categoryGifs.length }} GIFs encontrados
              </p>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" outline icon="refresh" :loading="isLoading" @click="handleRefresh">
            <q-tooltip>Atualizar</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <div v-if="selectedCategory && categoriesStore.categoryGifs.length > 0" class="q-mb-md">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <q-btn-toggle v-model="viewMode" :options="viewModeOptions" color="primary" outline />
        </div>
        <div class="col-auto">
          <q-select
            v-model="itemsPerPage"
            :options="itemsPerPageOptions"
            outlined
            dense
            style="min-width: 120px"
            label="Por página"
          />
        </div>
      </div>
    </div>

    <div v-if="!selectedCategory">
      <CategoriesGrid
        :categories="categoriesStore.categories"
        :loading="categoriesStore.loading"
        :items-per-page="itemsPerPage"
        :show-pagination="true"
        :current-page="currentCategoriesPage"
        :total-pages="totalCategoriesPages"
        @select-category="handleSelectCategory"
        @page-change="handleCategoriesPageChange"
      >
        <template #empty-state-actions>
          <q-btn color="primary" @click="handleRefresh" label="Tentar novamente" />
        </template>
      </CategoriesGrid>
    </div>

    <div v-else>
      <GifGrid
        :gifs="categoriesStore.categoryGifs"
        :loading="categoriesStore.loadingGifs"
        :items-per-page="itemsPerPage"
        :view-mode="viewMode"
        :is-search-mode="true"
        :favorites="gifsStore.favoriteIds"
        :show-pagination="true"
        :total-items="categoriesStore.categoryGifs.length"
        :current-page="currentCategoryGifsPage"
        :total-pages="totalCategoryGifsPages"
        @toggle-favorite="gifsStore.toggleFavorite"
        @page-change="handleCategoryGifsPageChange"
      >
        <template #empty-state-actions>
          <q-btn color="primary" @click="goBackToCategories" label="Voltar às categorias" />
        </template>
      </GifGrid>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import PageWrapper from 'src/components/PageWrapper.vue';
import CategoriesGrid from 'src/components/CategoriesGrid.vue';
import GifGrid from 'src/components/GifGrid.vue';
import { useCategoriesStore } from 'src/stores/categories';
import { useGifsStore } from 'src/stores/gifs';
import { GiphyCategory } from 'src/types/giphy';

const categoriesStore = useCategoriesStore();
const gifsStore = useGifsStore();

const itemsPerPage = ref(24);
const viewMode = ref<'grid' | 'masonry'>('grid');

const itemsPerPageOptions = [12, 24, 48, 96];
const viewModeOptions = [
  { label: 'Grade', value: 'grid', icon: 'grid_view' },
  { label: 'Masonry', value: 'masonry', icon: 'view_quilt' },
];

const selectedCategory = computed(() => categoriesStore.selectedCategory);
const pageTitle = computed(() =>
  selectedCategory.value ? `Categoria: ${selectedCategory.value.name}` : 'Categorias'
);

const isLoading = computed(() => categoriesStore.loading || categoriesStore.loadingGifs);

const currentCategoriesPage = computed(() => categoriesStore.getCurrentPage('categories'));
const totalCategoriesPages = computed(() =>
  categoriesStore.totalCategoriesPages(itemsPerPage.value)
);

const currentCategoryGifsPage = computed(() => categoriesStore.getCurrentPage('categoryGifs'));
const totalCategoryGifsPages = computed(() =>
  categoriesStore.totalCategoryGifsPages(itemsPerPage.value)
);

const handleSelectCategory = async (category: GiphyCategory) => {
  await categoriesStore.searchByCategory(category);
};

const goBackToCategories = () => {
  categoriesStore.clearCategoryGifs();
};

const handleRefresh = async () => {
  if (selectedCategory.value) {
    await categoriesStore.refreshCategoryGifs();
  } else {
    await categoriesStore.refreshCategories();
  }
};

const handleCategoriesPageChange = (page: number) => {
  categoriesStore.setCurrentPage('categories', page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleCategoryGifsPageChange = async (page: number) => {
  categoriesStore.setCurrentPage('categoryGifs', page);
  await categoriesStore.ensureDataForPage(page, itemsPerPage.value);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
  gifsStore.loadFavoritesFromStorage();

  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories();
  }
});
</script>
