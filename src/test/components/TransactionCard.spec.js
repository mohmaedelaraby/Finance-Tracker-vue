import { mount, shallowMount } from "@vue/test-utils";
import TransactionCard from "@/components/transactions/TransactionCard.vue";
import { useTransactionStore } from "../../stores/transactionStore";
import { describe, it, expect, beforeEach } from "@jest/globals";

// Move mocks INSIDE the factory function
jest.mock("../../stores/transactionStore", () => {
  return {
    useTransactionStore: jest.fn(() => ({
      categories: ["Food", "Bills", "Transport"],
      editTransaction: jest.fn(),  // Define mocks here
    })),
  };
});

describe("TransactionCard.vue", () => {
  let wrapper;
  let storeMock; 

  const mockTransaction = {
    id: 1,
    income: 100,
    expenseAmount: 0,
    category: "Food",
    date: "2024-02-25",
    exchangeRateIncome: 100,
    exchangeExpenseAmount: 0,
  };

  beforeEach(() => {
    storeMock = useTransactionStore(); 

    wrapper = mount(TransactionCard, {
      props: {
        transaction: mockTransaction,
        isNew: false,
      },
    });

    jest.clearAllMocks(); 
  });

  it("enters edit mode when edit button is clicked", async () => {
     const wrapper = shallowMount(TransactionCard);
    expect(wrapper.find(".card-form").exists()).toBe(false);

    expect(wrapper.find(".card-preview").exists()).toBe(true)
    expect(wrapper.find(".card-preview-action").exists()).toBe(true)
    expect(wrapper.find("#editBtn").exists()).toBe(true)
    await wrapper.find("#editBtn").trigger("click");



    expect(wrapper.find(".card-form").exists()).toBe(true); 
  });

  
  

  it("shows the category only if it exists", async () => {
    expect(wrapper.find(".card-preview-details-category").exists()).toBe(true);
    expect(wrapper.find(".card-preview-details-category-number").text()).toBe("Food");

    await wrapper.setProps({
      transaction: { ...mockTransaction, category: "" },
    });

    expect(wrapper.find(".card-preview-details-category").exists()).toBe(false);
  });
});
