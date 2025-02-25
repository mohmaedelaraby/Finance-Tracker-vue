
<template>
  
  <form @submit.prevent="save">
    <div v-if="activeTab === 'Income'" class="form-group">
      <div class="form-group-item">
        <div class="form-group-item-label">Amount:</div>
        <div class="form-group-item-exchange">
          <div class="form-group-item-input currency-input">
            <input class="primary-input" type="number" v-model="localTransaction.income" />
            <span class="currency-select">
              <select class="currency-select-style" v-model="localTransaction.baseCurrency">
                <option disabled value="">Select Currency</option>
                <!--   eslint-disable-next-line --> 
                <option v-for="[currency, rate] in Object.entries(rates)" :key="currency" :value="currency">
                  {{ currency }}
                </option>
              </select>
            </span>
          </div>

          <div>
            <ArrowLeftRight />
          </div>

          <div class="form-group-item-input currency-input">
            <input disabled class="primary-input" type="number" v-model="localTransaction.exchangeRateIncome" readonly />
            <span class="currency-label">{{ baseCurrency }}</span>
          </div>
        </div>
      </div>

      <div class="form-group-item">
        <div class="form-group-item-label">Date:</div>
        <div class="form-group-item-input">
          <input class="primary-input" type="date" v-model="localTransaction.date" />
        </div>
      </div>
    </div>

    <div v-else>
      <div class="form-group">
        <div class="form-group-item">
          <div class="form-group-item-label">Amount:</div>
          <div class="form-group-item-exchange">
            <div class="form-group-item-input currency-input">
              <input class="primary-input" type="number" v-model="localTransaction.expenseAmount" />
              <span class="currency-select">
                <select class="currency-select-style" v-model="localTransaction.baseCurrency">
                  <option disabled value="">Select Currency</option>
                                  <!--   eslint-disable-next-line --> 
                  <option v-for="[currency, rate] in Object.entries(rates)" :key="currency" :value="currency">
                    {{ currency }}
                  </option>
                </select>
              </span>
            </div>

            <div>
              <ArrowLeftRight />
            </div>

            <div class="form-group-item-input currency-input">
              <input disabled class="primary-input" type="number" v-model="localTransaction.exchangeExpenseAmount" readonly />
              <span class="currency-label">{{ baseCurrency }}</span>
            </div>
          </div>
        </div>

        <div class="form-group-item">
          <div class="form-group-item-label">Category:</div>
          <div class="form-group-item-input">
            <select v-model="localTransaction.category">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group-item">
          <div class="form-group-item-label">Date:</div>
          <div class="form-group-item-input">
            <input class="primary-input" type="date" v-model="localTransaction.date" />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group-actions">
      <button class="secondary-btn form-group-actions-btn" type="button" @click="cancel">Cancel</button>
      <button class="primary-btn form-group-actions-btn" @click="save">Save</button>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { ArrowLeftRight } from "lucide-vue-next";

const props = defineProps({
  editableTransaction: Object,
  categories: Array,
  activeTab: String,
});

const emit = defineEmits(["save", "cancel"]);

const localTransaction = ref({ ...props.editableTransaction });
const store = useTransactionStore();
const baseCurrency = computed(() => store.baseCurrency);
const rates = computed(() => store.exchangeRates);

watch(
  () => props.editableTransaction,
  (newTransaction) => {
    localTransaction.value = { ...newTransaction };
  },
  { deep: true, immediate: true }
);

watch(
  () => rates.value,
  (newRates) => {
    if (newRates && Object.keys(newRates).length > 0) {
      localTransaction.value.baseCurrency = 
        localTransaction.value.baseCurrency || "USD";
    }
  },
  { immediate: true }
);

watch(
  () => [localTransaction.value.income, localTransaction.value.baseCurrency],
  ([newIncome, newCurrency]) => {
    if (newIncome && newCurrency) {
      localTransaction.value.exchangeRateIncome = newIncome / rates.value[newCurrency] || 1;
    }
  },
  { deep: true }
);

watch(
  () => [localTransaction.value.expenseAmount, localTransaction.value.baseCurrency],
  ([newExpense, newCurrency]) => {
    if (newExpense && newCurrency) {
      localTransaction.value.exchangeExpenseAmount = newExpense / rates.value[newCurrency] || 1;
    }
  },
  { deep: true }
);

const save = () => {
  emit("save", localTransaction.value);
};

const cancel = () => {
  emit("cancel");
};
</script>

<style scoped>
@import "@/assets/styles/components/transactions/TransactionForm.css";
</style>
