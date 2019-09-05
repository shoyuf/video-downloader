import os from "os";

const arch = os.arch();
let platform = os.platform();

const PLATFORM_MAP = {
  linux: "Linux",
  darwin: "macOS",
  win32: "Windows"
};

if (!["x32", "x64"].includes(arch)) {
  throw new Error("unsupported arch");
}

if (!PLATFORM_MAP[platform]) {
  throw new Error("unsupported platform");
}

export const system = {
  platform: PLATFORM_MAP[platform],
  arch: arch.replace("x", "")
};
