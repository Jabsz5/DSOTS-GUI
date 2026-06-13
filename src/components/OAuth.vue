<template>
  <section class="oauth-card">
    <button class="button" @click="connectYouTube">
      Connect YouTube
    </button>

    <p v-if="accessToken">
      YouTube connected.
    </p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import "../css/OAuth.css";

const emit = defineEmits(["youtube-connected"]);

const accessToken = ref("");

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function connectYouTube() {
  if (!window.google) {
    alert("Google OAuth script has not loaded yet.");
    return;
  }

  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/youtube.upload",
    callback: (response) => {
      if (response.error) {
        console.error(response);
        return;
      }

      accessToken.value = response.access_token;

      emit("youtube-connected", {
        accessToken: accessToken.value,
        clientId: clientId
      });

      console.log("Access token:", accessToken.value);
    },
  });

  tokenClient.requestAccessToken();
}
</script>

