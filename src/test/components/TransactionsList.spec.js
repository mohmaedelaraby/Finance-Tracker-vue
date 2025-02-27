import { describe, it, expect, beforeEach } from "@jest/globals";
import TransactionsList from "../../components/transactions/TransactionsList.vue";
import { createPinia, setActivePinia } from "pinia";
import TransactionCard from "../../components/transactions/TransactionCard.vue";
import { shallowMount } from "@vue/test-utils";

// Mock the store
jest.mock("../../stores/transactionStore", () => ({
  useTransactionStore: jest.fn(),
}));

describe("TransactionsList.vue", () => {
  let store;
  let useTransactionStoreMock;

  beforeEach(() => {
    setActivePinia(createPinia());

    store = {
      transactions: [
        {
          id: 1,
          income: 100,
          expenseAmount: 0,
          baseCurrency: "USD",
          category: "Food",
          date: "2025-02-25",
        },
      ],
      categories: ["Food", "Transportation", "Bills"],
      filterTransactions: jest.fn(() => store.transactions),
      addTransaction: jest.fn(),
      exportToCSV: jest.fn(),
      baseCurrency: "USD",
    };

    useTransactionStoreMock = require("../../stores/transactionStore").useTransactionStore;
    useTransactionStoreMock.mockReturnValue(store);
  });

  it("renders transactions correctly", () => {
    const wrapper = shallowMount(TransactionsList);
    expect(wrapper.find(".transactions-list-header-title").text()).toBe("Transactions");
    expect(wrapper.findComponent(TransactionCard).exists()).toBe(true);
  });

  it("calls export function when Export CSV is clicked", async () => {
    const wrapper = shallowMount(TransactionsList);
    await wrapper.find(".primary-btn:last-child").trigger("click");
    expect(store.exportToCSV).toHaveBeenCalled();
  });

  it("opens new transaction form when 'Add Transaction' is clicked", async () => {
    const wrapper = shallowMount(TransactionsList);
    await wrapper.find(".primary-btn:first-child").trigger("click");
    expect(wrapper.findComponent(TransactionCard).exists()).toBe(true);
  });

  it("resets filters when reset button is clicked", async () => {
    const wrapper = shallowMount(TransactionsList);
  
    await wrapper.find(".icon-btn").trigger("click"); 
    await wrapper.vm.$nextTick(); // Wait for the DOM to update
  
    expect(wrapper.find(".filter-container").exists()).toBe(true);
  
    const resetButton = wrapper.find(".secondary-btn");
    expect(resetButton.exists()).toBe(true);
  
    await resetButton.trigger("click");
  
    expect(wrapper.vm.selectedCategory).toBe("");
    expect(wrapper.vm.startDate).toBe("");
    expect(wrapper.vm.endDate).toBe("");
  });
    
});
