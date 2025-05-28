<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex max-w-md flex-1">
      <q-input
        v-model="internalSearchTerm"
        placeholder="Buscar GIFs..."
        outlined
        dense
        class="flex-1"
        @keyup.enter="handleSearch"
        clearable
        @clear="handleClear"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-btn flat round dense icon="search" @click="handleSearch" :loading="loading" />
        </template>
      </q-input>
    </div>

    <div class="flex items-center gap-2">
      <q-btn-dropdown
        auto-close
        color="primary"
        :label="`Mostrar ${itemsPerPage}`"
        outline
        class="text-sm"
      >
        <q-list>
          <q-item
            v-for="option in [12, 24, 36, 48]"
            :key="option"
            clickable
            @click="$emit('update:itemsPerPage', option)"
          >
            <q-item-section>{{ option }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn
        :icon="viewMode === 'masonry' ? 'grid_view' : 'view_comfy'"
        :label="viewMode === 'masonry' ? 'Grade' : 'Masonry'"
        outline
        @click="$emit('update:viewMode', viewMode === 'grid' ? 'masonry' : 'grid')"
        class="text-sm"
      />

      <q-btn
        icon="refresh"
        label="Atualizar"
        color="primary"
        outline
        @click="$emit('refresh')"
        :loading="loading"
        class="text-sm"
      />
    </div>
  </div>
  <div v-if="isSearchMode" class="mb-4 flex items-center gap-2">
    <q-chip removable @remove="handleClear" color="primary" text-color="white">
      Buscando por: "{{ internalSearchTerm }}"
    </q-chip>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
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
  searchTerm: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([
  'search',
  'clear-search',
  'update:itemsPerPage',
  'update:viewMode',
  'refresh',
  'update:searchTerm',
]);

const internalSearchTerm = ref(props.searchTerm);

watch(
  () => props.searchTerm,
  (newVal) => {
    internalSearchTerm.value = newVal;
  }
);

const handleSearch = () => {
  emit('search', internalSearchTerm.value);
  emit('update:searchTerm', internalSearchTerm.value);
};

const handleClear = () => {
  internalSearchTerm.value = '';
  emit('clear-search');
  emit('update:searchTerm', '');
};
</script>
