<template>
  <PageWrapper title="Sobre">
    <div class="mb-6 flex items-center gap-4">
      <q-avatar size="70px" class="bg-primary text-white">
        <q-icon name="person" />
      </q-avatar>
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Anderson Alves</h2>
        <p class="text-gray-500">Desenvolvedor Web Full Stack</p>
      </div>
    </div>

    <div>
      <h3 class="mb-2 text-xl font-semibold text-gray-700">Sobre o site</h3>
      <p class="leading-relaxed text-gray-600">
        Este site foi desenvolvido como um projeto pessoal com foco em integração de APIs e boas
        práticas de desenvolvimento web. A principal funcionalidade é consumir dados da
        <span class="font-semibold text-primary">API do Giphy</span>, permitindo que os usuários
        possam <span class="font-semibold">buscar, visualizar e favoritar GIFs</span> diretamente
        aqui na plataforma.
      </p>

      <p class="mt-4 leading-relaxed text-gray-600">
        Além disso, utilizei esse projeto para experimentar e aplicar conceitos de
        <span class="font-semibold">frontend moderno</span> como gerenciamento de estado, paginação
        dinâmica, consumo eficiente de APIs REST, roteamento, composição de componentes e
        armazenamento local para os favoritos.
      </p>

      <p class="mt-4 leading-relaxed text-gray-600">
        Este projeto também serve como um laboratório pessoal para estudar e evoluir com tecnologias
        como
        <span class="font-semibold">Vue.js, Pinia, Quasar, TailwindCSS</span> e padrões de
        arquitetura limpa no frontend.
      </p>
    </div>

    <div class="mt-8">
      <q-separator />
      <div class="mt-4">
        <h3 class="mb-2 text-xl font-semibold text-gray-700">Sobre mim</h3>
        <p class="leading-relaxed text-gray-600">
          Olá! Meu nome é <span class="font-semibold text-primary">Anderson Alves</span>, sou
          desenvolvedor web full stack apaixonado por tecnologia e desenvolvimento de sistemas.
          Atualmente trabalho na <span class="font-semibold">Ilumeo</span> desenvolvendo APIs,
          aplicações web e soluções de integração de dados, além de contribuir com design de
          interfaces e arquitetura de sistemas.
        </p>

        <p class="mt-4 leading-relaxed text-gray-600">
          Minha jornada profissional inclui experiências com desenvolvimento full stack, criação de
          APIs, microsserviços, integrações com plataformas como Google, Meta e TikTok Ads, além de
          atuação em projetos frontend e backend utilizando tecnologias como
          <span class="font-semibold"
            >JavaScript, TypeScript, Node.js, Laravel, React, Vue.js, PostgreSQL</span
          >
          e muito mais.
        </p>

        <p class="mt-4 leading-relaxed text-gray-600">
          <span class="font-semibold">Formação:</span> Atualmente curso Ciências da Computação pela
          Faculdade Anhanguera.<br />
          <span class="font-semibold">Experiência:</span> Mais de 5 anos atuando no mercado de
          desenvolvimento de software.<br />
          <span class="font-semibold">Objetivo:</span> Crescer profissionalmente e compartilhar
          conhecimento na comunidade de tecnologia.
        </p>
      </div>
    </div>

    <div class="mt-8">
      <q-separator />
      <h3 class="mb-2 mt-4 text-xl font-semibold text-gray-700">Minhas redes</h3>
      <div class="grid gap-4 md:grid-cols-3">
        <q-btn
          label="LinkedIn"
          icon="mdi-linkedin"
          color="primary"
          outline
          @click="openLink('https://www.linkedin.com/in/alvessdev/')"
        />
        <q-btn
          label="GitHub"
          icon="mdi-github"
          color="primary"
          outline
          @click="openLink('https://github.com/andersondroide14')"
        />
        <q-btn
          label="Email"
          icon="mdi-email"
          color="primary"
          outline
          @click="openLink('mailto:andersondroide14@gmail.com')"
        />
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
import PageWrapper from 'components/PageWrapper.vue';

const openLink = (url: string) => {
  window.open(url, '_blank');
};
</script>
