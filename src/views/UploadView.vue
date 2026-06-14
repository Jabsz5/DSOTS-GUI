<template>
  <Header />
  <main class="upload-video-page">
    <h2 class="page-title">Upload Video</h2>
    <p>Upload your video here.</p>

    <UploadVideo @video-selected="setSelectedVideo" />
    <OAuth @youtube-connected="setYoutubeAuth"/>

    <p v-if="selectedVideo">
      Selected file: {{ selectedVideo.name }}
    </p>

    <!-- Later this will receive the mp4 -->
    <SendToYoutube 
    :video-file="selectedVideo"
    :access-token="youtubeAccessToken" 
    />
  </main>
</template>

<script setup>
import { ref } from "vue";
import Header from "../components/Header.vue";
import UploadVideo from "../components/UploadVideo.vue";
import OAuth from "../components/OAuth.vue";
import SendToYoutube from "../components/SendToYoutube.vue";

const selectedVideo = ref(null);

function setSelectedVideo(file) {
  selectedVideo.value = file;
  console.log("Selected video file:", selectedVideo.value);
}

const youtubeAccessToken = ref("");
const youtubeClientId = ref("");

function setYoutubeAuth(auth) {
  youtubeAccessToken.value = auth.accessToken;
  youtubeClientId.value = auth.clientId;
}
</script>

<style scoped>
.upload-video-page {
  min-height: 100vh;
  padding: 2rem;
}
</style>