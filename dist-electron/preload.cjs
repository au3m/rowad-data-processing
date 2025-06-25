"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    processText: async (text) => {
        return await electron_1.ipcRenderer.invoke("processText", text);
    },
});
