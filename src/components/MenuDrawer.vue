<template>
  <q-drawer
    :model-value="drawer"
    @update:model-value="(val) => (drawer = val)"
    show-if-above
    :width="360"
    :breakpoint="500"
    :class="` bg-primary  ${
      $q.screen.lt.md ? 'rounded-none px-3 pt-4' : 'rounded-tr-2xl px-6 pt-8'
    }`"
  >
    <q-scroll-area class="fit">
      <q-toolbar v-if="$q.screen.lt.md" class="bg-primary text-white">
        <q-toolbar-title class="text-lg font-bold">Menu</q-toolbar-title>
        <q-btn flat round dense icon="mdi-close" @click="drawer = false" class="q-ml-auto" />
      </q-toolbar>
      <q-list padding class="menu-list q-gutter-y-md text-white">
        <q-item
          v-for="(menuItem, index) in menuItems"
          :key="index"
          clickable
          v-ripple
          :active="isActiveItem(menuItem.link)"
          class="q-pa-md rounded-lg py-0 text-lg text-gray-400"
          active-class="bg-secondary text-white"
          @click="navigateTo(menuItem.link)"
        >
          <q-item-section avatar class="min-w-[40px]">
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section>{{ menuItem.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
});
const emit = defineEmits(['update:modelValue']);

const drawer = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    drawer.value = val;
  }
);

watch(drawer, (val) => {
  emit('update:modelValue', val);
});

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

interface MenuItem {
  name: string;
  icon: string;
  link: string;
}

const menuItems = ref<MenuItem[]>([
  { name: 'Home', icon: 'mdi-view-dashboard', link: '/' },
  { name: 'Favoritos', icon: 'mdi-account-multiple', link: '/favoritos' },
  { name: 'Categorias', icon: 'mdi-package-variant-closed', link: '/categorias' },
  { name: 'Sobre', icon: 'mdi-account-hard-hat', link: '/sobre' },
]);

const activeRoute = computed(() => route.path);

const isActiveItem = (itemLink: string) => activeRoute.value === itemLink;

const navigateTo = (link: string) => {
  router.push(link);
  if ($q.screen.lt.md) {
    drawer.value = false;
  }
};
</script>
