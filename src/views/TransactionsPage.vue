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
            />
          </div>
        </div>
        <div class="transactions-container-header-item chart">chart</div>
      </div>

      <div class="transactions-container-body">
        <TransactionsList />
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/styles/views/TransactionsPage.css";
import { HandCoins, Wallet, BadgeDollarSign } from "lucide-vue-next";

import TransactionSummeryCard from "@/components/transactions/TransactionSummeryCard.vue";
import TransactionsList from "@/components/transactions/TransactionsList.vue";

const summeryList = [
  {
    label: "Total income",
    number: 50015225,
    textColor: "#2A5F4A",
    icon: BadgeDollarSign,
  },
  {
    label: " Total expenses",
    number: 3088660,
    textColor: "#BC3E3E",
    icon: HandCoins,
  },
  {
    label: "Net Balance",
    number: 2000000,
    textColor: "black",
    icon: Wallet,
  },
  {
    label: "Total Transactions",
    number: 1968,
    textColor: "black",
    icon: Wallet,
  },
];
</script>
