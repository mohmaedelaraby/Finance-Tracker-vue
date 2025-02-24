<template>
  <div class="not-found">
    <h1 class="not-found-header">404 - Page Not Found</h1>
    <p class="not-found-desc">
      Oops! The page you are looking for does not exist.
    </p>
    <button  class="primary-btn" @click="goHome">Go to Transactions</button>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/transactions");
};
</script>
<style lang="ts">
import "@/assets/styles/views/NotFoundPage.css"
</style>
