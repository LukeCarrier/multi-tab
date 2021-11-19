const os = require("os");
const process = require("process");
const { spawn } = require("child_process");

const { findBinary } = require("./utils");

const binary = findBinary(os.platform(), {
  darwin: {
    appBundle: "Google Chrome",
    binary: "Google Chrome",
  },
  win32: {
    global: "${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe",
  },
  binary: "google-chrome-stable",
});
const chrome = spawn(binary, [
  `--load-extension=${process.cwd()}`,
]);

chrome.stdout.on("data", data => {
  console.log(data.toString());
});

chrome.stderr.on("data", data => {
  console.error(data.toString());
});

chrome.on("close", code => {
  process.exit(code);
});
