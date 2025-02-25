import { fetchExchangeRatesAPI } from "@/services/exchangeRates";
import { defineStore } from "pinia";
import { ref, watch, onMounted, computed } from "vue";

export const useTransactionStore = defineStore("transactionStore", () => {
  const transactions = ref(JSON.parse(localStorage.getItem("transactions") || "[]"));
  const baseCurrency = ref("USD");
  const baseRate = ref(1);
  const exchangeRates = ref({});

  const categories = ["Food", "Transportation", "Bills", "General"];

  // Filter states
  const selectedCategory = ref("");
  const startDate = ref("");
  const endDate = ref("");

  // Persist transactions to localStorage
  watch(
    transactions,
    () => {
      localStorage.setItem("transactions", JSON.stringify(transactions.value));
    },
    { deep: true }
  );

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      const rates = await fetchExchangeRatesAPI(baseCurrency.value);
      if (rates) {
        exchangeRates.value = { ...rates };
      }
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
    }
  };

  // Computed values
  const totalIncome = computed(() =>
    transactions.value.reduce((sum, t) => sum + (t.exchangeRateIncome || t.income || 0), 0)
  );

  const totalExpense = computed(() =>
    transactions.value.reduce((sum, t) => sum + (t.exchangeExpenseAmount || t.expenseAmount || 0), 0)
  );

  const netBalance = computed(() => totalIncome.value - totalExpense.value);

  const totalTransactions = computed(() => transactions.value.length);

  const categoryCounts = computed(() =>
    categories.reduce((acc, category) => {
      acc[category] = transactions.value.filter((t) => t.category === category).length;
      return acc;
    }, {})
  );

  const filteredTransactions = computed(() => {
    return transactions.value.filter((t) => {
      const matchesCategory = !selectedCategory.value || t.category === selectedCategory.value;
      const matchesDate =
        (!startDate.value || new Date(t.date) >= new Date(startDate.value)) &&
        (!endDate.value || new Date(t.date) <= new Date(endDate.value));

      return matchesCategory && matchesDate;
    });
  });

  const resetFilters = () => {
    selectedCategory.value = "";
    startDate.value = "";
    endDate.value = "";
  };

  // Transaction Actions
  const addTransaction = (transaction) => {
    transactions.value.push({
      id: Date.now(),
      income: transaction.income || 0,
      exchangeRateIncome: transaction.exchangeRateIncome || 0,
      baseCurrency: transaction.baseCurrency || baseCurrency.value, // Ensure it's storing currency code
      baseRate: transaction.baseRate || baseRate.value,
      rate: transaction.rate || 1,
      expenseAmount: transaction.expenseAmount || 0,
      exchangeExpenseAmount: transaction.exchangeExpenseAmount || 0,
      category: transaction.category || "",
      date: transaction.date || new Date().toISOString(),
    });
  };

  const editTransaction = (id, updatedTransaction) => {
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...updatedTransaction,
      };
    }
  };

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter((t) => t.id !== id);
  };

  const filterTransactions = (category, dateRange) => {
    if (!category && (!dateRange || (!dateRange.start && !dateRange.end))) {
      return transactions.value;
    }

    return transactions.value.filter(
      (t) =>
        (!category || t.category === category) &&
        (!dateRange || ((!dateRange.start || t.date >= dateRange.start) && (!dateRange.end || t.date <= dateRange.end)))
    );
  };

  const convertToBaseCurrency = (amount, currency) => {
    const rate = exchangeRates.value[currency] || 1;
    return amount / rate;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = "Type,Amount,Currency,Category,Date\n";
    const rows = transactions.value
      .map((t) => {
        const type = t.income ? "Income" : "Expense";
        const amount = t.income ? t.income : -t.expenseAmount; // Correctly handle negative values for expenses
        return `${type},${amount},${t.baseCurrency},${t.category},${t.date}`;
      })
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  onMounted(() => {
    fetchExchangeRates();
  });

  return {
    transactions,
    baseCurrency,
    baseRate,
    exchangeRates,
    categories,
    totalExpense,
    totalIncome,
    netBalance,
    totalTransactions,
    categoryCounts,
    selectedCategory,
    startDate,
    endDate,
    filteredTransactions,
    resetFilters,
    addTransaction,
    editTransaction,
    deleteTransaction,
    filterTransactions,
    convertToBaseCurrency,
    exportToCSV,
  };
});
