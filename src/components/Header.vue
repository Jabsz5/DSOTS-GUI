<template>
  <header class="header">
    <button class="home-button" @click="goHome">
      Home
    </button>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import "../css/Header.css";

const router = useRouter();

function goHome() {
  router.push("/");
}
</script>

