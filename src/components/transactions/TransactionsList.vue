<template>
  <div class="transactions-list">
    <div class="transactions-list-actions">
      <div>
        <button class="icon-btn"><Filter /></button>
      </div>
      <div>
        <button
          class="primary-btn"
          :disabled="isAddingTransaction"
          @click="openNewTransactionForm"
        >
          Add Transaction
        </button>
        <button
          class="primary-btn"
          :disabled="isAddingTransaction"
          @click="exportTransactions"
        >
          Export CSV
        </button>
      </div>
    </div>

    <div class="transactions-list-body">
      <div class="transactions-list-body-container">
        <!-- Show form when adding a new transaction -->
        <div
          v-if="isAddingTransaction"
          class="transactions-list-body-container-item"
        >
          <TransactionCard
            :transaction="newTransaction"
            :is-new="true"
            @cancel="cancelNewTransaction"
            @save="saveNewTransaction"
          />
        </div>

        <!-- Existing transactions -->
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="transactions-list-body-container-item"
        >
          <TransactionCard :transaction="transaction" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Filter } from "lucide-vue-next";
import { ref, watch, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import TransactionCard from "@/components/transactions/TransactionCard.vue";
import "@/assets/styles/components/transactions/TransactionsList.css";

// Store
const store = useTransactionStore();
const transactions = ref([...store.transactions]);

// Reactive state for adding a new transaction
const isAddingTransaction = ref(false);
const newTransaction = ref(null);

// Watch for transaction changes
watch(
  () => store.transactions,
  (newTransactions) => {
    transactions.value = [...newTransactions];
  },
  { deep: true }
);

// Ensure it's false on mount
onMounted(() => {
  isAddingTransaction.value = false;
});

// Open form for new transaction
const openNewTransactionForm = () => {
  isAddingTransaction.value = true;
  newTransaction.value = {
    income: 0,
    expenseAmount: 0,
    category: "General",
    date: new Date().toISOString().split("T")[0],
  };
};

//export csv file
const exportTransactions = () => {
  store.exportToCSV()
};


// Cancel new transaction form
const cancelNewTransaction = () => {
  isAddingTransaction.value = false;
  newTransaction.value = null;
};

// Save new transaction
const saveNewTransaction = (transaction) => {
  store.addTransaction(transaction);
  isAddingTransaction.value = false;
  newTransaction.value = null;
};


</script>
