<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions"  />
  </div>
</template>

<script setup>
import { ref } from "vue";
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
import '@/assets/styles/components/charts/BarChart.css'

// Register Chart.js components globally
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Reactive chart data
const chartData = ref({
  labels: ["Food", "Transport", "Bills", "General"],
  datasets: [
    {
      label: "expenses by category",
      backgroundColor: ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71"],
      data: [500, 300, 700, 400],
    },
  ],
});

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>
