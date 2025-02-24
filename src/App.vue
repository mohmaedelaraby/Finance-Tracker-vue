<template>
  <AppHeader/>
  <router-view />
  <AppFooter/>
</template>

<script setup>
import AppFooter from "@/components/common/AppFooter.vue"; 
import AppHeader from "@/components/common/AppHeader.vue"; 
</script>

<style lang="ts">

import "@/assets/styles/main.css";
import "@/assets/styles/design-system.css";
</style>
