<template>
  <div class="transactions">
    <div class="transactions-container">
      <div class="transactions-container-header">
        <div class="transactions-container-header-item transactions-summery">
          <div
            v-for="(summery, index) in summeryList"
            :key="index"
            class="transactions-summery-card"
          >
            <TransactionSummeryCard
              :label="summery.label"
              :number="summery.number"
              :textColor="summery.textColor"
              :icon="summery.icon"
              :isCurrency="summery.isCurrency"
            />
          </div>
        </div>
        <div class="transactions-container-header-item chart">
          <BarCharts/>
        </div>
      </div>

      <div class="transactions-container-body">
        <TransactionsList />
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/styles/views/TransactionsPage.css";
import { HandCoins, Wallet, BadgeDollarSign ,Handshake } from "lucide-vue-next";

import TransactionSummeryCard from "@/components/transactions/TransactionSummeryCard.vue";
import TransactionsList from "@/components/transactions/TransactionsList.vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { computed } from "vue";
import BarCharts from "@/components/charts/BarCharts.vue";
const store = useTransactionStore();

const summeryList = computed(() => [
  {
    label: "Total income",
    number: store.totalIncome,
    textColor: "#2A5F4A",
    icon: BadgeDollarSign,
    isCurrency:true,
  },
  {
    label: " Total expenses",
    number: store.totalExpense,
    textColor: "#BC3E3E",
    icon: HandCoins,
    isCurrency:true,
  },
  {
    label: "Net Balance",
    number: store.netBalance,
    textColor: store.netBalance > 0 ? "#2A5F4A" :"#BC3E3E",
    icon: Wallet,
    isCurrency:true,
  },
  {
    label: "Total Transactions",
    number: store.totalTransactions,
    textColor: "black",
    icon: Handshake ,
    isCurrency:false,
  },
]);
</script>
