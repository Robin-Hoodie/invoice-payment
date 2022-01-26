import axios, { AxiosAdapter } from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";

export const httpClient = axios.create({
  headers: {
    "Cache-Control": "no-cache",
  },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter),
});

httpClient.interceptors.response.use((response) => response.data);
