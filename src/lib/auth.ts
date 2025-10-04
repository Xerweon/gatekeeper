import { Store } from '@tauri-apps/plugin-store';

let store: Store | null = null;

export async function getStore(): Promise<Store> {
  if (!store) {
    store = await Store.load('.auth-store.dat');
  }
  return store;
}

export async function getAuthToken(): Promise<string | undefined> {
  const s = await getStore();
  return await s.get<string>("accessToken");
}

export async function setAuthToken(token: string, user: string) {
  const s = await getStore();
  await s.set("accessToken", token);
  await s.set("user", user);
  await s.save();
}

export async function getUser(): Promise<any | undefined> {
  const s = await getStore();
  const raw = await s.get<string>("user");
  return raw ? JSON.parse(raw) : undefined;
}

export async function clearAuth() {
  const s = await getStore();
  await s.delete("accessToken");
  await s.delete("user");
  await s.save();
}
