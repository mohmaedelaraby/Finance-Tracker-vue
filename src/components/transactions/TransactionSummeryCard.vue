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
        
        <div
          v-if="isCurrency"
          class="summery-card-container-bottom-number"
          :style="{ color: textColor }"
        >
          ${{
            number.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </div>

        <div
          v-else
          class="summery-card-container-bottom-number"
          :style="{ color: textColor }"
        >
          {{ number }}
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
  icon: Object,
  isCurrency: Boolean,
});
</script>

<style scoped>
/* If using lang="ts", remove it unless you're using SCSS or TypeScript inside styles */
@import "@/assets/styles/components/transactions/TransactionSummeryCard.css";
</style>
