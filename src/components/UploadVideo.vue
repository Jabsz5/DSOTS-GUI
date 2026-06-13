<template>
  <main class="upload-video-page">
    <section class="upload-card">
      <h1>Select video from PC</h1>

      <label class="upload-box">
        <input
          type="file"
          accept="video/mp4"
          @change="handleVideoUpload"
        />

        <span v-if="!videoUrl">
          Choose an .mp4 file
        </span>

        <span v-else>
          Video uploaded: {{ videoName }}
        </span>
      </label>

      <video
        v-if="videoUrl"
        class="video-preview"
        :src="videoUrl"
        controls
        preload="metadata"
      ></video>
    </section>
  </main>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import "../css/UploadVideo.css";

const emit = defineEmits(["video-selected"]);

const videoUrl = ref("");
const videoName = ref("");

function handleVideoUpload(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (file.type !== "video/mp4") {
    alert("Please upload an .mp4 file.");
    event.target.value = "";
    return;
  }

  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value);
  }

  videoName.value = file.name;
  videoUrl.value = URL.createObjectURL(file);

  // Send the actual .mp4 File object to the parent component
  emit("video-selected", file);
}

onUnmounted(() => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value);
  }
});
</script>
