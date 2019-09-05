<template>
  <div
    class="flow-container"
    @dragover="() => false"
    @dragleave="() => false"
    @drop="handleDrop"
  >
    <a-steps :current="current" progressDot labelPlacement="vertical">
      <a-step title="Download" description="Download a video" />
      <a-step title="Editor" description="Edit your video" />
      <a-step title="Saving" description="Save your video on the disk" />
    </a-steps>
    <router-view class="video-container"></router-view>
    <a-button @click="lastStep" :disabled="current === 0">上一步</a-button>
    <a-button @click="nextStep" :disabled="current === VIDEO_PATHS.length - 1"
      >下一步</a-button
    >
  </div>
</template>

<script>
import { videoArr as VIDEO_PATHS } from "@/router";
export default {
  data() {
    return {
      VIDEO_PATHS,
      current: 0
    };
  },
  watch: {
    $route(route) {
      this.current = VIDEO_PATHS.findIndex(({ path }) => path === route.path);
    }
  },
  methods: {
    handleDrop(e) {
      e.preventDefault();
      return false;
    },
    nextStep() {
      this.$router.push(VIDEO_PATHS[this.current + 1]);
    },
    lastStep() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.flow-container {
  padding: 15px;
}
.video-container {
  min-height: 300px;
  border: 1px solid #e5e5e5;
  padding: 24px;
}
</style>
