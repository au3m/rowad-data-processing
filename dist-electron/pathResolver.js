import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";
export function getPreloadPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/dist-electron/preload.cjs");
}
export function getUIPath() {
    return path.join(app.getAppPath(), "/dist-react/index.html");
}
export function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}
export function getPythonPath() {
    return isDev()
        ? path.join(app.getAppPath(), "./src/python/text.py")
        : path.join(app.getAppPath(), "../resources/src/python/text.py");
}
