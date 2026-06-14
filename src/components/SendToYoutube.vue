<template>
  <section class="send-youtube-card">
    <h2>Send to YouTube</h2>

    <label class="field">
      <span>Video Title</span>
      <input v-model="title" placeholder="Enter video title" />
    </label>

    <label class="field">
      <span>Description</span>
      <textarea v-model="description" placeholder="Enter video description"></textarea>
    </label>

    <label class="field">
      <span>Privacy</span>
      <select v-model="privacyStatus">
        <option value="private">Private</option>
        <option value="unlisted">Unlisted</option>
        <option value="public">Public</option>
      </select>
    </label>

    <label class="field">
      <span>Thumbnail Image</span>
      <input
        type="file"
        accept="image/png,image/jpeg"
        @change="handleThumbnailSelect"
      />
    </label>

    <div v-if="thumbnailUrl" class="thumbnail-preview-wrap">
      <p>Selected thumbnail: {{ thumbnailName }}</p>
      <img
        class="thumbnail-preview"
        :src="thumbnailUrl"
        alt="Selected thumbnail preview"
      />
    </div>

    <button
      class="button"
      :disabled="!videoFile || !accessToken || isUploading"
      @click="uploadToYouTube"
    >
      {{ isUploading ? "Uploading..." : "Upload to YouTube" }}
    </button>

    <p v-if="!videoFile">No video selected yet.</p>
    <p v-if="!accessToken">Connect YouTube before uploading.</p>

    <div class="status-box" v-if="videoStatus || thumbnailStatus || uploadMessage">
        <p v-if="videoStatus"><strong>Video:</strong> {{ videoStatus }}</p>
        <p v-if="thumbnailStatus"><strong>Thumbnail:</strong> {{ thumbnailStatus }}</p>
        <p v-if="uploadMessage"><strong>Status:</strong> {{ uploadMessage }}</p>
    </div>

    <a
      v-if="uploadedVideoId"
      :href="`https://www.youtube.com/watch?v=${uploadedVideoId}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      View uploaded video
    </a>
  </section>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import "../css/SendToYoutube.css";

const props = defineProps({
  videoFile: {
    type: File,
    default: null
  },
  accessToken: {
    type: String,
    default: ""
  }
});

const title = ref("My Uploaded Video");
const description = ref("Uploaded from DSOTS-GUI");
const privacyStatus = ref("private");

const thumbnailFile = ref(null);
const thumbnailUrl = ref("");
const thumbnailName = ref("");

const isUploading = ref(false);
const uploadMessage = ref("");
const videoStatus = ref("");
const thumbnailStatus = ref("");
const uploadedVideoId = ref("");

function handleThumbnailSelect(event) {
  const file = event.target.files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    alert("Please upload a .jpg, .jpeg, or .png thumbnail.");
    event.target.value = "";
    return;
  }

  const maxSizeBytes = 2 * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    alert("Thumbnail must be 2 MB or smaller.");
    event.target.value = "";
    return;
  }

  if (thumbnailUrl.value) {
    URL.revokeObjectURL(thumbnailUrl.value);
  }

  thumbnailFile.value = file;
  thumbnailName.value = file.name;
  thumbnailUrl.value = URL.createObjectURL(file);
}

async function uploadToYouTube() {
  if (!props.videoFile) {
    alert("Please select an .mp4 file first.");
    return;
  }

  if (!props.accessToken) {
    alert("Please connect YouTube first.");
    return;
  }

  isUploading.value = true;
  uploadMessage.value = "";
  videoStatus.value = "Uploading video file to YouTube...";
  thumbnailStatus.value = thumbnailFile.value
    ? "Thumbnail selected. Waiting for video upload to finish..."
    : "No thumbnail selected.";
  uploadedVideoId.value = "";

  try {
    const metadata = {
      snippet: {
        title: title.value,
        description: description.value,
        categoryId: "20"
      },
      status: {
        privacyStatus: privacyStatus.value
      }
    };

    const formData = new FormData();

    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], {
        type: "application/json"
      })
    );

    formData.append("video", props.videoFile);

    const response = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${props.accessToken}`
        },
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube upload failed:", data);
      throw new Error(data.error?.message || "YouTube upload failed.");
    }

    uploadedVideoId.value = data.id;

    videoStatus.value =
      "Video file upload complete. YouTube processing may continue in the background.";

    console.log("Uploaded video:", data);

    if (thumbnailFile.value) {
      thumbnailStatus.value = "Uploading thumbnail to YouTube...";
      await setYouTubeThumbnail(data.id);
      thumbnailStatus.value = "Thumbnail upload complete.";
    }

    uploadMessage.value = "Done. Video and selected thumbnail were sent to YouTube.";
  } catch (error) {
    console.error(error);
    uploadMessage.value = error.message;
  } finally {
    isUploading.value = false;
  }
}

async function setYouTubeThumbnail(videoId) {
  const response = await fetch(
    `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
        "Content-Type": thumbnailFile.value.type
      },
      body: thumbnailFile.value
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Thumbnail upload failed:", data);
    throw new Error(data.error?.message || "Thumbnail upload failed.");
  }

  console.log("Thumbnail set:", data);
}

onUnmounted(() => {
  if (thumbnailUrl.value) {
    URL.revokeObjectURL(thumbnailUrl.value);
  }
});
</script>
