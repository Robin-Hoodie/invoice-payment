import axios from "axios";

export const httpClient = axios.create();

httpClient.interceptors.response.use((response) => response.data);
