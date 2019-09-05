<template>
  <div class="init" style="padding:15px;">
    <a-progress :percent="percentage" status="active" />
    <p style="display:flex;justify-content:space-between;">
      <span>{{ cur }} / {{ count }}</span>
      <span>{{ speed }}</span>
    </p>
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
      count: 2
    };
  },
  methods: {
    stepFinished() {
      this.cur !== this.count && this.cur++;
      this.percentage = 0;
      this.speed = "";
    },
    async downloadAnnie() {
      const {
        browser_download_url: url
        // name,
        // tag_name
      } = await getAnnieAssets();
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
          this.stepFinished();
        });
    },
    async downloadYoutubeDl() {
      const {
        browser_download_url: url,
        name
        // tag_name
      } = await getYoutubeAssets();
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
          this.stepFinished();
        });
    },
    async download() {
      try {
        const binFolderExist = fs.existsSync(binFolderPath);
        if (binFolderExist) {
          if (fs.readdirSync(binFolderPath).some(e => e.includes("annie"))) {
            this.stepFinished();
          } else {
            await this.downloadAnnie();
          }
          if (fs.readdirSync(binFolderPath).some(e => e.includes("youtube"))) {
            this.stepFinished();
          } else {
            await this.downloadYoutubeDl();
          }
        } else {
          fs.mkdirSync(binFolderPath);
          this.downloadAnnie();
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

<style scoped></style>
