<template>
  <div class="card" >
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

    <div v-else class="card-preview" :class="transaction?.income > 0 ? 'income_bg': 'expenses_bg' ">
      <div class="card-preview-action">
        <button class="icon-btn edit-color" @click="toggleEdit">
          <Edit />
        </button>
        <button
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
            {{ transaction?.income || transaction?.expenseAmount }}
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
import "@/assets/styles/components/transactions/TransactionCard.css";

const store = useTransactionStore();
const emit = defineEmits(["cancel", "save"]);

const props = defineProps({
  transaction: Object,
  isNew: Boolean,
});

const categories = store.categories;
const isEditing = ref(props.isNew);

const editableTransaction = ref(
  props.transaction
    ? { ...props.transaction }
    : {
        income: 0,
        expenseAmount: 0,
        category: "General",
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
