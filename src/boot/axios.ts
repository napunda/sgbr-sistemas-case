import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_GIPHY_API_URL,
  params: {
    api_key: import.meta.env.VITE_GIPHY_API_KEY,
  },
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
