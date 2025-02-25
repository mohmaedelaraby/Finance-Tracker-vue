import { mount, shallowMount } from "@vue/test-utils";
import TransactionForm from "@/components/transactions/TransactionForm.vue";
import { describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("@/stores/transactionStore", () => ({
  useTransactionStore: jest.fn(() => ({
    baseCurrency: "USD",
    exchangeRates: { USD: 1, EUR: 0.85, GBP: 0.75 },
  })),
}));

describe("TransactionForm.vue", () => {
  let wrapper;
  const mockTransaction = {
    income: 100,
    expenseAmount: 0,
    baseCurrency: "USD",
    exchangeRateIncome: 100,
    exchangeExpenseAmount: 0,
    category: "Food",
    date: "2024-02-25",
  };

  beforeEach(() => {
    wrapper = mount(TransactionForm, {
      props: {
        editableTransaction: mockTransaction,
        categories: ["Food", "Transport", "Bills"],
        activeTab: "Income",
      },
    });
  });

  it("does not show category field when activeTab is 'Income'", async () => {

    const wrapper = shallowMount(TransactionForm);
  
    await wrapper.setProps({ activeTab: "Expense" });

    expect(wrapper.find("#category").text()).toContain("Category");
  });

  it("calculates exchange rate correctly for Income", async () => {
    await wrapper.setProps({
      editableTransaction: {
        ...mockTransaction,
        income: 200,
        baseCurrency: "EUR",
      },
    });

    expect(wrapper.vm.localTransaction.exchangeRateIncome).toBeCloseTo(
      200 / 0.85,
      2
    );
  });

  it("calculates exchange rate correctly for Expense", async () => {
    await wrapper.setProps({
      editableTransaction: {
        ...mockTransaction,
        expenseAmount: 150,
        baseCurrency: "GBP",
      },
    });

    expect(wrapper.vm.localTransaction.exchangeExpenseAmount).toBeCloseTo(
      150 / 0.75,
      2
    );
  });
});
