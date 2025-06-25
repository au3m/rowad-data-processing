import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  processText: async (text: string) => {
    return await ipcRenderer.invoke("processText", text);
  },
});
