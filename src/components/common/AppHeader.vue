<template>
  <div class="header">
    <div class="header-logo">
      <div class="logo" @click="goToHome">
        <BadgeDollarSign  class="logo-icon"/>
      </div>
      <p class="title">Finance Tracker</p>
    </div>
</div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { BadgeDollarSign } from "lucide-vue-next";
const router = useRouter();

const goToHome = () => {
  router.push("/transactions");
};
</script>
<style lang="ts">
import "@/assets/styles/components/common/Header.css"
</style>
