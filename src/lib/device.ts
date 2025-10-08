import { Store } from "@tauri-apps/plugin-store";

let deviceStore: Store | null = null;

async function getDeviceStore(): Promise<Store> {
  if (!deviceStore) {
    deviceStore = await Store.load(".device-store.dat"); // creates device.dat
  }
  return deviceStore;
}

export async function setDeviceId(deviceId: string): Promise<void> {
  const store = await getDeviceStore();
  await store.set("deviceId", deviceId);
  await store.save();
  
}

export async function getDeviceId(): Promise<string | undefined> {
  const store = await getDeviceStore();
  return await store.get<string>("deviceId");
}

export async function clearDeviceId(): Promise<void> {
  const store = await getDeviceStore();
  await store.delete("deviceId");
  await store.save();
}

export async function setDeviceInfo(info: {
  hostName: string;
  osName: string;
  osVersion: string;
  workstationId?: string;
}): Promise<void> {
  const store = await getDeviceStore();
  await store.set("deviceInfo", info);
  await store.save();
}

export async function getDeviceInfo(): Promise<{
  hostName: string;
  osName: string;
  osVersion: string;
  workstationId?: string;
} | undefined> {
  const store = await getDeviceStore();
  return await store.get("deviceInfo");
}

export async function clearDeviceInfo(): Promise<void> {
  const store = await getDeviceStore();
  await store.delete("deviceInfo");
  await store.save();
}
