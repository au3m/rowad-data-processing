import { spawn } from "child_process";
export function processTextWithPython(text) {
    return new Promise((resolve, reject) => {
        const python = spawn("python", ["text.py"], {
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
