[Preview disponível](https://sgbr-sistemas-case.onrender.com)

# 🎬 Giphy Explorer - Quasar + Tailwind + Vue 3

Este projeto é um explorador de GIFs utilizando a API do Giphy, desenvolvido com **Quasar Framework**, **Vue 3**, **TailwindCSS** e **Pinia** para gerenciamento de estado.

Nele você pode:

- 🔍 Pesquisar GIFs através da API do Giphy.
- 🚀 Visualizar GIFs em alta qualidade.
- ⭐ Adicionar GIFs aos seus favoritos (armazenados localmente).
- 🏆 Explorar GIFs em alta nas tendências (Trending).

---

## 🚀 Tecnologias utilizadas

- [Quasar Framework](https://quasar.dev/)
- [Vue 3](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)

---

## 🔧 Como rodar o projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_GIPHY_API_URL=https://api.giphy.com/v1/gifs
VITE_GIPHY_API_KEY=3w5lOK1CQIpLkFeKEzudyT5YbwXHmjyf
```

> 🔑 Estas são credenciais temporárias para testes. Recomenda-se criar sua própria API Key diretamente em [Giphy Developers](https://developers.giphy.com/).

4. **Execute o projeto em desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

5. **Acesse no navegador:**

```
http://localhost:9000/
```

---

## 📦 Build para produção

```bash
npm run build
# ou
yarn build
```

Os arquivos otimizados estarão na pasta `/dist/spa`.

---

## 📜 Sobre este projeto

Este site foi desenvolvido com o intuito de demonstrar o uso da API do Giphy, integrando Vue 3, Quasar e TailwindCSS. A aplicação permite explorar GIFs populares, realizar buscas, visualizar detalhes e salvar favoritos localmente.

