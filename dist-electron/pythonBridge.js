import { spawn } from "child_process";
import { getPythonPath } from "./pathResolver.js";
export function processTextWithPython(text) {
    return new Promise((resolve, reject) => {
        const pythonPath = getPythonPath();
        console.log("python button pressed!");
        const python = spawn("python", [pythonPath], {
            cwd: process.cwd(),
            stdio: ["pipe", "pipe", "pipe"],
        });
        let output = "";
        let error = "";
        python.stdout.on("data", (data) => {
            output += data.toString();
        });
        python.stderr.on("data", (data) => {
            error += data.toString();
        });
        python.on("close", (code) => {
            if (code === 0) {
                resolve(output.trim());
            }
            else {
                reject(error || "Python script failed");
            }
        });
        python.stdin.write(text + "\n");
        python.stdin.end();
    });
}
