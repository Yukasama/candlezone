import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import 'server-only';
import axios from 'xior';

export const fmpClient = axios.create({
  baseURL: appConfig.fmp.url,
});

fmpClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    apikey: env.FMP_API_KEY,
  };
  return config;
});
