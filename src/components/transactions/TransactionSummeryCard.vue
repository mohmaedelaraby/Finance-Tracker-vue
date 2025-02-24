<template>
  <div class="summery-card">
    <div class="summery-card-container">
      <div class="summery-card-container-header">
        <div class="summery-card-container-header-label">{{ label }}</div>
        <div class="summery-card-container-header-icon">
          <component
            class="summery-card-container-header-icon-style"
            :is="icon"
          />
        </div>
      </div>
      <div class="summery-card-container-bottom">
        <div class="summery-card-container-bottom-number" :style="{ color: textColor }">
        {{ number.toLocaleString() }}
      </div>
      </div>

     
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  label: String,
  number: Number,
  textColor: String,
  icon: Object, // Accepts a Vue component
});
</script>

<style scoped>
/* If using lang="ts", remove it unless you're using SCSS or TypeScript inside styles */
@import "@/assets/styles/components/transactions/TransactionSummeryCard.css";
</style>
