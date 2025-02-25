import { mount } from "@vue/test-utils";
import { describe, it, expect } from "@jest/globals";
import TransactionSummeryCard from "../../components/transactions/TransactionSummeryCard.vue";


describe("TransactionSummeryCard.vue", () => {
  it("renders the correct label", () => {
    const wrapper = mount(TransactionSummeryCard, {
      props: {
        label: "Total Income",
        number: 1000,
        textColor: "#2A5F4A",
        isCurrency: true,
      },
    });

    //test number formating
    const numberElement = wrapper.find('.summery-card-container-bottom-number');
    expect(numberElement.text()).toBe('$1,000.00');
  });
});
