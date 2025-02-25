<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { useTransactionStore } from "@/stores/transactionStore";

const store = useTransactionStore();

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = computed(() => ({
  labels: ["Food", "Transportation", "Bills", "General"],
  datasets: [
    {
      label: "Expenses by Category",
      backgroundColor: ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71"],
      data: [
        store.categoryCounts.Food || 0,
        store.categoryCounts.Transportation || 0,
        store.categoryCounts.Bills || 0,
        store.categoryCounts.General || 0,
      ],
    },
  ],
}));

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<style scoped>
@import "@/assets/styles/components/charts/BarChart.css";
</style>
