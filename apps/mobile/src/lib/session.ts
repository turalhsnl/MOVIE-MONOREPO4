import * as SecureStore from "expo-secure-store";
const KEY = "movie_token";
export const setToken = (t: string) => SecureStore.setItemAsync(KEY, t);
export const getToken = () => SecureStore.getItemAsync(KEY);
export const clearToken = () => SecureStore.deleteItemAsync(KEY);
