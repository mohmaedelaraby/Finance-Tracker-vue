<template>
  <div class="transactions-list">
    <div class="transactions-list-header">
      <div class="transactions-list-header-title">Transactions</div>
      <div class="transactions-list-actions">
        <div class="filter">
          <button class="icon-btn" @click="openFilter"><Filter /></button>

          <div v-if="isFilter" class="filter-container">
            <div class="filter-container-header">
              <div class="filter-container-header-title">Filters</div>
              <div class="filter-container-header-close">
                <CircleX @click="closeFilter" class="expenses" />
              </div>
            </div>
            <div>
              <div class="filter-item">
                <div class="filter-item-label">Category</div>
                <div class="filter-label-action">
                  <select v-model="selectedCategory">
                    <option value="">All</option>
                    <option
                      v-for="category in store.categories"
                      :key="category"
                      :value="category"
                    >
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="filter-item-date">
                <div class="filter-item-date-picker">
                  <div class="filter-item-label">From</div>
                  <div class="filter-label-action">
                    <input
                      class="primary-input"
                      type="date"
                      v-model="startDate"
                    />
                  </div>
                </div>
                <div class="filter-item-date-picker">
                  <div class="filter-item-label">To</div>
                  <div class="filter-label-action">
                    <input
                      class="primary-input"
                      type="date"
                      v-model="endDate"
                    />
                  </div>
                </div>
              </div>

              <div class="filter-item-action-btns">
                <button @click="resetFilters" class="secondary-btn">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            class="primary-btn"
            :disabled="isAddingTransaction"
            @click="openNewTransactionForm"
          >
            Add Transaction
          </button>
          <button class="primary-btn" @click="exportTransactions">
            Export CSV
          </button>
        </div>
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
        <div class="w-100" v-if="filteredTransactions.length">
          <div
            v-for="transaction in filteredTransactions"
            :key="transaction.id"
            class="transactions-list-body-container-item"
          >
            <TransactionCard :transaction="transaction" />
          </div>
        </div>

        <div v-else-if="!filteredTransactions.length && !isAddingTransaction">
          <div class="transactions-list-body-container-empty">
            <div class="transactions-list-body-container-empty-icon">
              <CircleAlert
                class="transactions-list-body-container-empty-icon-style"
              />
            </div>
            <div class="transactions-list-body-container-empty-title">
              There is no Transactions
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Filter, CircleX, CircleAlert } from "lucide-vue-next";
import { ref, watch, onMounted, computed } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import TransactionCard from "@/components/transactions/TransactionCard.vue";

// Store
const store = useTransactionStore();
const transactions = ref([...store.transactions]);

// Reactive state for adding a new transaction
const isAddingTransaction = ref(false);
const isFilter = ref(false);
const newTransaction = ref(null);

// Filter states
const selectedCategory = ref("");
const startDate = ref("");
const endDate = ref("");

// Computed: Get filtered transactions from store function
const filteredTransactions = computed(() => {
  return store.filterTransactions(selectedCategory.value, {
    start: startDate.value,
    end: endDate.value,
  });
});

// Reset filters
const resetFilters = () => {
  selectedCategory.value = "";
  startDate.value = "";
  endDate.value = "";
  isFilter.value = false;
};

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
  isFilter.value = false;
});

//open/close filter container
const openFilter = () => {
  isFilter.value = true;
};

const closeFilter = () => {
  isFilter.value = false;
};

// Open form for new transaction
const openNewTransactionForm = () => {
  isAddingTransaction.value = true;
  newTransaction.value = {
    income: 0,
    expenseAmount: 0,
    exchangeRateIncome: 0,
    exchangeExpenseAmount: 0,
    baseCurrency: store.baseCurrency,
    baseRate: 1,
    category: "",
    date: new Date().toISOString().split("T")[0],
  };
};

//export csv file
const exportTransactions = () => {
  store.exportToCSV();
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

<style scoped>
@import "@/assets/styles/components/transactions/TransactionsList.css";
</style>
