import { ipcMain } from 'electron';
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";
export function isDev() {
    return process.env.NODE_ENV === "development";
}
export function validateEventFrame(frame) {
    if (!frame) {
        throw new Error("Missing sender frame");
    }
    if (isDev() && new URL(frame.url).host === "localhost:5123") {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error("Malicious event");
    }
}
export function ipcMainHandle(key, handler) {
    ipcMain.handle(key, (event, ...args) => {
        validateEventFrame(event.senderFrame);
        return handler(...args);
    });
}
export function ipcMainOn(key, handler) {
    ipcMain.on(key, (event, payload) => {
        validateEventFrame(event.senderFrame);
        return handler(payload);
    });
}
export function ipcWebContentsSend(key, webContents, payload) {
    webContents.send(key, payload);
}
