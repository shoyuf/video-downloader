<template>
  <div class="init">
    <img src="@/assets/logo.png" alt="logo" class="logo" />
    <a-progress
      :percent="percentage"
      :status="percentage === 100 ? 'success' : 'active'"
    />
    <p class="status">
      <span>{{ cur }} / {{ count }}</span>
      <span>{{ speed }}</span>
    </p>
    <log-viewer :log="log" :height="300"></log-viewer>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import request from "request";
import fs from "fs";
import path from "path";
import tar from "tar";
import progressStream from "progress-stream";

import { getAnnieAssets } from "@/scripts/annie";
import { getYoutubeAssets } from "@/scripts/youtube-dl";
import speedUnit from "@/utils/speed-unit";

const userDataPath = ipcRenderer.sendSync("get-path", "userData");
const binFolderPath = path.join(userDataPath, "bin");

export default {
  data() {
    return {
      loading: false,
      percentage: 0,
      speed: 0,
      cur: 0,
      count: 2,
      log: "项目初始化.......\n"
    };
  },
  methods: {
    stepFinished() {
      this.cur++;
      this.percentage = 100;
      if (this.cur !== this.count) {
        this.speed = "";
      } else {
        this.updateLog("初始化完成.");
        let timer;
        timer = setTimeout(() => {
          this.$router.replace("/flow");
          clearTimeout(timer);
        }, 3000);
      }
    },
    updateLog(msg) {
      this.log += `${msg}\n`;
    },
    async downloadAnnie() {
      this.updateLog("下载 annie");
      const {
        browser_download_url: url
        // name,
        // tag_name
      } = await getAnnieAssets();
      this.updateLog("annie 下载中...");
      return new Promise(r => {
        request({ uri: url, proxy: "http://127.0.0.1:6153" })
          .pipe(
            progressStream(
              {
                time: 500,
                // detail with progress can't get percentage
                // see PR https://github.com/freeall/progress-stream/pull/18
                length: " "
              },
              ({ speed, percentage }) => {
                this.speed = `${speedUnit(speed)} /s`;
                this.percentage = Math.floor(percentage);
              }
            )
          )
          .pipe(
            new tar.Unpack({
              cwd: binFolderPath,
              fmode: 0o755
            })
          )
          .on("finish", () => {
            this.updateLog("annie 下载完成");
            this.stepFinished();
            r();
          });
      });
    },
    async downloadYoutubeDl() {
      this.updateLog("下载 youtube-dl");
      const {
        browser_download_url: url,
        name
        // tag_name
      } = await getYoutubeAssets();
      this.updateLog("youtube-dl 下载中...");
      return new Promise(r => {
        request({ uri: url, proxy: "http://127.0.0.1:6153" })
          .pipe(
            progressStream(
              {
                time: 500,
                // detail with progress can't get percentage
                // see PR https://github.com/freeall/progress-stream/pull/18
                length: " "
              },
              ({ speed, percentage }) => {
                this.speed = `${speedUnit(speed)} /s`;
                this.percentage = Math.floor(percentage);
              }
            )
          )
          .pipe(
            fs.createWriteStream(binFolderPath + "/" + name, {
              mode: 0o755
            })
          )
          .on("finish", () => {
            this.updateLog("youtube-dl 下载完成");
            this.stepFinished();
            r();
          });
      });
    },
    async download() {
      try {
        this.updateLog("检测文件下载依赖");
        const binFolderExist = fs.existsSync(binFolderPath);
        if (binFolderExist) {
          this.updateLog("存在 bin 目录");
          if (fs.readdirSync(binFolderPath).some(e => e.includes("annie"))) {
            this.updateLog("annie 已存在");
            this.stepFinished();
          } else {
            await this.downloadAnnie();
          }
          if (fs.readdirSync(binFolderPath).some(e => e.includes("youtube"))) {
            this.updateLog("youtube-dl 已存在");
            this.stepFinished();
          } else {
            await this.downloadYoutubeDl();
          }
        } else {
          this.updateLog("bin 目录不存在！");
          fs.mkdirSync(binFolderPath);
          await this.downloadAnnie();
          await this.downloadYoutubeDl();
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
  mounted() {
    this.download();
  }
};
</script>

<style scoped>
.init {
  padding: 30px;
}
.logo {
  display: block;
  margin: 0 auto;
  width: 200px;
  margin-bottom: 30px;
}
.init >>> .log-viewer {
  background-color: rgb(48, 50, 52);
}
.status {
  display: flex;
  justify-content: space-between;
}
</style>
