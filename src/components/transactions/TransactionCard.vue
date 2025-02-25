<template>
  <div class="card">
    <div class="card-form" v-if="isEditing || isNew">
      <div class="card-title">
        {{ isNew ? "New Transaction" : "Edit Transaction" }}
      </div>

      <div
        v-if="!editableTransaction.income && !editableTransaction.expenseAmount"
        class="tabs"
      >
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'Income' }"
          @click="setActiveTab('Income')"
        >
          Income
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'Expense' }"
          @click="setActiveTab('Expense')"
        >
          Expense
        </button>
      </div>

      <div class="form">
        <TransactionForm
          :categories="categories"
          :editable-transaction="editableTransaction"
          :active-tab="activeTab"
          @update:activeTab="setActiveTab"
          @save="saveTransaction"
          @cancel="cancelEdit"
        />
      </div>
    </div>

    <div
      v-else
      class="card-preview"
      :class="transaction?.income > 0 ? 'income_bg' : 'expenses_bg'"
    >
      <div class="card-preview-action">
        <button id="editBtn" class="icon-btn edit-color" @click="toggleEdit">
          <Edit />
        </button>
        <button
        id="deleteBtn"
          class="icon-btn error-color"
          @click="deleteItem(editableTransaction)"
        >
          <Trash2 />
        </button>
      </div>

      <div class="card-preview-header">
        <div class="card-preview-header-title">
        
          {{ transaction?.income > 0 ? "Income" : "Expense" }}
        </div>
        <div class="card-preview-header-icon">
          <div
            class="card-preview-header-icon-container"
            v-if="transaction?.income > 0"
          >
            <HandCoins
              class="card-preview-header-icon-container-iconstyle income"
            />
          </div>
          <div class="card-preview-header-icon-container" v-else>
            <BadgeDollarSign
              class="card-preview-header-icon-container-iconstyle expenses"
            />
          </div>
        </div>
      </div>
      <div class="card-preview-body">
        <div class="card-preview-amount">
          <div class="card-preview-amount-label">Amount:</div>
          <div class="card-preview-amount-number">
            {{
              transaction?.income > 0
                ? `${transaction?.exchangeRateIncome?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}$ `
                : `${transaction?.exchangeExpenseAmount?.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}$`
            }}
          </div>
        </div>

        <div class="card-preview-details">
          <div
            v-if="transaction?.category"
            class="card-preview-details-category"
          >
            <div class="card-preview-details-category-label">category:</div>
            <div class="card-preview-details-category-number">
              {{ transaction?.category }}
            </div>
          </div>

          <div class="card-preview-details-date">
            <div class="card-preview-date-details-label">date:</div>
            <div class="card-preview-date-details-number">
              {{ transaction?.date }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import TransactionForm from "./TransactionForm.vue";
import { Edit, Trash2, HandCoins, BadgeDollarSign } from "lucide-vue-next";

const store = useTransactionStore();
const emit = defineEmits(["cancel", "save"]);

const props = defineProps({
  transaction: Object,
  isNew: Boolean,
});

const categories = store.categories;
const isEditing = ref(props.isNew);

const editableTransaction = ref(
  props.transaction &&typeof props.transaction === "object"
    ? { ...props.transaction }
    : {
        income: 0,
        expenseAmount: 0,
        exchangeRateIncome: 0,
        exchangeExpenseAmount: 0,
        baseCurrency: store.baseCurrency,
        baseRate: 1,
        category: "",
        date: new Date().toISOString().split("T")[0],
      }
);

const activeTab = ref(props.transaction?.income > 0 ? "Income" : "Expense");

// Watch props to sync state when editing
watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      editableTransaction.value = { ...newTransaction };
      activeTab.value = newTransaction.income > 0 ? "Income" : "Expense";
    }
  },
  { deep: true }
);

// Set active tab
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// Enable edit mode
const toggleEdit = () => {
  isEditing.value = true;
};

const saveTransaction = (transaction) => {
  if (props.isNew) {
    emit("save", transaction);
  } else {
    store.editTransaction(transaction.id, transaction);
  }
  isEditing.value = false;
};

// Cancel edit and return to preview
const cancelEdit = () => {
  isEditing.value = false;
  if (props.isNew) {
    emit("cancel");
  }
};

// delete and return to preview
const deleteItem = (transaction) => {
  if (transaction.id) {
    store.deleteTransaction(transaction.id);
  }
};
</script>

<style scoped>
@import "@/assets/styles/components/transactions/TransactionCard.css";
</style>
