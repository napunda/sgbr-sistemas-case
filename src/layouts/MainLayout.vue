<template>
  <q-layout view="hHh Lpr lff" container style="height: 100vh" class="Poppins bg-gray-100">
    <q-header elevated class="flex h-[70px] items-center bg-secondary text-white">
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.md" flat @click="drawer = !drawer" round dense icon="mdi-menu" />
        <q-toolbar-title>
          <img
            src="../assets/logo-sgbr.png"
            :class="['w-auto', $q.screen.lt.md ? 'h-8' : 'h-10']"
            alt="SGBR Sistemas Logo"
          />
        </q-toolbar-title>

        <q-btn flat @click="pushRoute('/sobre')">
          <p class="q-mr-md text-bold text-body2 text-white">ANDERSON SOUZA</p>
          <q-avatar size="42px" icon="person" class="bg-white text-primary" />
        </q-btn>
      </q-toolbar>
    </q-header>
    <MenuDrawer v-model="drawer" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MenuDrawer from 'components/MenuDrawer.vue';
import { useQuasar } from 'quasar';
import { usePushRoute } from '../composables/usePushRoute';
const $q = useQuasar();

const { pushRoute } = usePushRoute();

const drawer = ref(false);
</script>
