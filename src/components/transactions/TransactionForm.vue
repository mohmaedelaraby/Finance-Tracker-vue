<template>
  <form @submit.prevent="save">
    <div v-if="activeTab === 'Income'" class="form-group">
      <div class="form-group-item">
        <div class="form-group-item-label">Amount:</div>
        <div class="form-group-item-input">
          <input type="number" v-model="localTransaction.income" />
        </div>
      </div>

      <div class="form-group-item">
        <div class="form-group-item-label">Date:</div>
        <div class="form-group-item-input">
          <input type="date" v-model="localTransaction.date" />
        </div>
      </div>
    </div>

    <div v-else>
      <div class="form-group">
        <div class="form-group-item">
          <div class="form-group-item-label">Amount:</div>
          <div class="form-group-item-input">
            <input type="number" v-model="localTransaction.expenseAmount" />
          </div>
        </div>

        <div class="form-group-item">
          <div class="form-group-item-label">Category:</div>
          <div class="form-group-item-input">
            <select v-model="localTransaction.category">
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group-item">
          <div class="form-group-item-label">Date:</div>
          <div class="form-group-item-input">
            <input type="date" v-model="localTransaction.date" />
          </div>
        </div>
      </div>
    </div>

    <button class="primary-btn"  @click="save">Save</button>
    <button class="secondary-btn" type="button" @click="cancel">Cancel</button>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import "@/assets/styles/components/transactions/TransactionForm.css";

const props = defineProps({
  editableTransaction: Object,
  categories: Array,
  activeTab: String,
});

const emit = defineEmits(["save", "cancel"]);

// Create a local copy of the transaction
const localTransaction = ref({ ...props.editableTransaction });

// Watch for changes in the prop and update the local copy
watch(
  () => props.editableTransaction,
  (newTransaction) => {
    localTransaction.value = { ...newTransaction };
  },
  { deep: true, immediate: true }
);

// Emit save event with updated local data
const save = () => {
  emit("save", localTransaction.value);
};

// Emit cancel event
const cancel = () => {
  emit("cancel");
};
</script>
