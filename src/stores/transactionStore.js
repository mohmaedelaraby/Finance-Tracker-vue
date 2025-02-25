//import { fetchExchangeRatesAPI } from "@/services/exchangeRates";
import { defineStore } from "pinia";
import { ref, watch, onMounted, computed } from "vue";

export const useTransactionStore = defineStore("transactionStore", () => {
  const transactions = ref(JSON.parse(localStorage.getItem("transactions") || "[]"));
  const baseCurrency = ref("USD");
  const exchangeRates = ref({});
  
  const categories = ["Food", "Transportation", "Bills", "General"];

  watch(transactions, () => {
    localStorage.setItem("transactions", JSON.stringify(transactions.value));
  }, { deep: true });

  const totalIncome = computed(() =>
    transactions.value.reduce((sum, t) => sum + (t.income || 0), 0)
  );

  const totalExpense = computed(() =>
    transactions.value.reduce((sum, t) => sum + (t.expenseAmount || 0), 0)
  );

  const netBalance = computed(() => totalIncome.value - totalExpense.value);

  const totalTransactions = computed(() => transactions.value.length);
 /*  const fetchExchangeRates = async () => {
    exchangeRates.value = await fetchExchangeRatesAPI(baseCurrency.value);
  }; */

  const addTransaction = (transaction) => {
    transactions.value.push({
      id: Date.now(),
      income: transaction.income || 0,
      expenseAmount: transaction.expenseAmount || 0,
      category: transaction.category || "",
      date: transaction.date || new Date().toISOString()
    });
  };

  const editTransaction = (id, updatedTransaction) => {
    const index = transactions.value.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...updatedTransaction };
    }
  };

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id);
  };

  const filterTransactions = (category, dateRange) => {
    return transactions.value.filter(t => 
      (!category || t.category === category) &&
      (!dateRange || (t.date >= dateRange.start && t.date <= dateRange.end))
    );
  };

  const convertToBaseCurrency = (amount, currency) => {
    if (currency === baseCurrency.value) return amount;
    return amount / (exchangeRates.value[currency] || 1);
  };

  const exportToCSV = () => {
    const headers = "Type,Amount,Currency,Category,Date\n";
    const rows = transactions.value.map(t => 
      `Transaction,${t.income - t.expenseAmount},${baseCurrency.value},${t.category},${t.date}`
    ).join("\n");
    
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
    //fetchExchangeRates();
  });

  return { 
    transactions, baseCurrency, exchangeRates, categories,
    totalExpense,totalIncome,netBalance, totalTransactions,
    addTransaction, editTransaction, deleteTransaction, 
    filterTransactions, convertToBaseCurrency, exportToCSV
  };
});
