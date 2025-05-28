import { defineStore } from 'pinia';
import { GiphyResponse, GiphyItem, GiphyCategory, GiphyCategoriesResponse } from 'src/types/giphy';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';

interface CategoriesState {
  categories: GiphyCategory[];
  categoryGifs: GiphyItem[];
  selectedCategory: GiphyCategory | null;
  loading: boolean;
  loadingGifs: boolean;
  currentPages: Record<string, number>;
  totalApiResults: number;
  hasMoreData: boolean;
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    categoryGifs: [],
    selectedCategory: null,
    loading: false,
    loadingGifs: false,
    currentPages: {
      categories: 1,
      categoryGifs: 1,
    },
    totalApiResults: 0,
    hasMoreData: false,
  }),

  getters: {
    totalCategories: (state) => state.categories.length,

    getCurrentPage: (state) => (pageKey: 'categories' | 'categoryGifs') =>
      state.currentPages[pageKey] ?? 1,

    totalCategoriesPages: (state) => (itemsPerPage: number) =>
      Math.ceil(state.categories.length / itemsPerPage),

    totalCategoryGifsPages: (state) => (itemsPerPage: number) =>
      Math.ceil(state.categoryGifs.length / itemsPerPage),

    paginatedCategories: (state) => (itemsPerPage: number) => {
      const page = state.currentPages.categories ?? 1;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return state.categories.slice(start, end);
    },

    paginatedCategoryGifs: (state) => (itemsPerPage: number) => {
      const page = state.currentPages.categoryGifs ?? 1;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return state.categoryGifs.slice(start, end);
    },

    canLoadMoreGifs: (state) => {
      return state.hasMoreData && state.categoryGifs.length < state.totalApiResults;
    },
  },

  actions: {
    setCurrentPage(pageKey: 'categories' | 'categoryGifs', page: number) {
      this.currentPages[pageKey] = page;
    },

    resetPage(pageKey: 'categories' | 'categoryGifs') {
      this.currentPages[pageKey] = 1;
    },

    async fetchCategories() {
      try {
        this.loading = true;

        const response = await api.get<GiphyCategoriesResponse>('/categories', {
          params: {
            limit: 50,
          },
        });

        this.categories = response.data.data;
        this.resetPage('categories');
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar categorias. Tente novamente.',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchByCategory(category: GiphyCategory, append = false) {
      try {
        this.loadingGifs = true;
        const offset = append ? this.categoryGifs.length : 0;

        const response = await api.get<GiphyResponse>('/search', {
          params: {
            q: category.name,
            limit: 50,
            offset,
            rating: 'g',
          },
        });

        if (append) {
          this.categoryGifs = [...this.categoryGifs, ...response.data.data];
        } else {
          this.categoryGifs = response.data.data;
          this.selectedCategory = category;
          this.resetPage('categoryGifs');
        }

        this.totalApiResults = response.data.pagination?.total_count || this.categoryGifs.length;
        this.hasMoreData = this.categoryGifs.length < this.totalApiResults;
      } catch (error) {
        console.error('Erro ao buscar GIFs da categoria:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar GIFs da categoria. Tente novamente.',
          position: 'top',
        });
        throw error;
      } finally {
        this.loadingGifs = false;
      }
    },

    async loadMoreCategoryGifs() {
      if (this.selectedCategory && this.canLoadMoreGifs) {
        await this.searchByCategory(this.selectedCategory, true);
      }
    },

    async ensureDataForPage(page: number, itemsPerPage: number) {
      const requiredItems = page * itemsPerPage;

      if (this.categoryGifs.length < requiredItems && this.canLoadMoreGifs) {
        await this.loadMoreCategoryGifs();
      }
    },

    clearCategoryGifs() {
      this.categoryGifs = [];
      this.selectedCategory = null;
      this.resetPage('categoryGifs');
      this.totalApiResults = 0;
      this.hasMoreData = false;
    },

    async refreshCategories() {
      await this.fetchCategories();
    },

    async refreshCategoryGifs() {
      if (this.selectedCategory) {
        await this.searchByCategory(this.selectedCategory);
      }
    },
  },
});
