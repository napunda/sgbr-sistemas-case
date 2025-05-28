import { defineStore } from 'pinia';
import { GiphyResponse, GiphyItem } from 'src/types/giphy';
import { Notify, LocalStorage } from 'quasar';
import { api } from 'src/boot/axios';

interface GifsState {
  gifs: GiphyItem[];
  favorites: GiphyItem[];
  loading: boolean;
  currentPages: Record<string, number>;
  isSearchMode: boolean;
  searchTerm: string;
}

type PageKey = 'trending' | 'search' | 'favorites';

export const useGifsStore = defineStore('gifs', {
  state: (): GifsState => ({
    gifs: [],
    favorites: [],
    loading: false,
    currentPages: {
      trending: 1,
      search: 1,
      favorites: 1,
    },
    isSearchMode: false,
    searchTerm: '',
  }),

  getters: {
    totalGifs: (state) => state.gifs.length,

    favoriteIds: (state) => state.favorites.map((gif) => gif.id),

    isFavorite: (state) => (gifId: string) => state.favorites.some((fav) => fav.id === gifId),

    favoritesCount: (state) => state.favorites.length,

    getCurrentPage: (state) => (pageKey: PageKey) => state.currentPages[pageKey] ?? 1,

    paginatedFavorites: (state) => (itemsPerPage: number) => {
      const page = state.currentPages.favorites ?? 1;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return state.favorites.slice(start, end);
    },

    totalFavoritesPages: (state) => (itemsPerPage: number) =>
      Math.ceil(state.favorites.length / itemsPerPage),

    paginatedTrending: (state) => (itemsPerPage: number) => {
      const page = state.currentPages.trending ?? 1;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return state.gifs.slice(start, end);
    },

    totalTrendingPages: (state) => (itemsPerPage: number) =>
      Math.ceil(state.gifs.length / itemsPerPage),
  },

  actions: {
    setCurrentPage(pageKey: PageKey, page: number) {
      this.currentPages[pageKey] = page;
    },

    resetPage(pageKey: PageKey) {
      this.currentPages[pageKey] = 1;
    },

    loadFavoritesFromStorage() {
      try {
        const storedFavorites = LocalStorage.getItem('gif-favorites');
        if (storedFavorites) {
          this.favorites = storedFavorites as GiphyItem[];
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        this.favorites = [];
      }
    },

    saveFavoritesToStorage() {
      try {
        LocalStorage.set('gif-favorites', this.favorites);
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
      }
    },

    clearAllFavorites() {
      const count = this.favorites.length;
      this.favorites = [];
      this.saveFavoritesToStorage();
      this.resetPage('favorites');

      Notify.create({
        type: 'info',
        message: `${count} ${count === 1 ? 'favorito removido' : 'favoritos removidos'}!`,
        position: 'top',
        timeout: 2000,
      });
    },

    async fetchTrendingGifs(append = false) {
      try {
        this.loading = true;
        const offset = append ? this.gifs.length : 0;

        const response = await api.get<GiphyResponse>('/trending', {
          params: {
            limit: 50,
            offset,
            rating: 'g',
          },
        });

        if (append) {
          this.gifs = [...this.gifs, ...response.data.data];
        } else {
          this.gifs = response.data.data;
          this.resetPage('trending');
        }

        this.isSearchMode = false;
        this.searchTerm = '';
      } catch (error) {
        console.error('Erro ao buscar GIFs trending:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar GIFs. Tente novamente.',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchGifs(query: string, append = false) {
      try {
        this.loading = true;
        const offset = append ? this.gifs.length : 0;

        const response = await api.get<GiphyResponse>('/search', {
          params: {
            q: query,
            limit: 50,
            offset,
            rating: 'g',
          },
        });

        if (append) {
          this.gifs = [...this.gifs, ...response.data.data];
        } else {
          this.gifs = response.data.data;
          this.resetPage('search');
        }

        this.isSearchMode = true;
        this.searchTerm = query;
      } catch (error) {
        console.error('Erro ao buscar GIFs:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao buscar GIFs. Tente novamente.',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async performSearch(query: string) {
      if (query.trim()) {
        await this.searchGifs(query);
      } else {
        await this.fetchTrendingGifs();
      }
    },

    async clearSearch() {
      this.searchTerm = '';
      await this.fetchTrendingGifs();
    },

    async refreshGifs() {
      if (this.isSearchMode && this.searchTerm.trim()) {
        await this.searchGifs(this.searchTerm);
      } else {
        await this.fetchTrendingGifs();
      }
    },

    addToFavorites(gif: GiphyItem) {
      if (!this.isFavorite(gif.id)) {
        this.favorites.push(gif);
        this.saveFavoritesToStorage();
        Notify.create({
          type: 'positive',
          message: 'GIF adicionado aos favoritos!',
          position: 'top',
          timeout: 1000,
        });
      }
    },

    removeFromFavorites(gifId: string) {
      const index = this.favorites.findIndex((fav) => fav.id === gifId);
      if (index > -1) {
        this.favorites.splice(index, 1);
        this.saveFavoritesToStorage();
        Notify.create({
          type: 'info',
          message: 'GIF removido dos favoritos!',
          position: 'top',
          timeout: 1000,
        });
      }
    },

    toggleFavorite(gif: GiphyItem) {
      if (this.isFavorite(gif.id)) {
        this.removeFromFavorites(gif.id);
      } else {
        this.addToFavorites(gif);
      }
    },

    async loadMoreGifs() {
      if (this.gifs.length > 0) {
        if (this.isSearchMode && this.searchTerm.trim()) {
          await this.searchGifs(this.searchTerm, true);
        } else {
          await this.fetchTrendingGifs(true);
        }
      }
    },
  },
});
