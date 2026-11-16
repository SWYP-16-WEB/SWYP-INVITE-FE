import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.baseURL?.trim()) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL을 설정해주세요.");
  }

  return config;
});
