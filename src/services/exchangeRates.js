import axios from "axios";

export const fetchExchangeRatesAPI = async (baseCurrency) => {
  try {
    //i found i didn't need apikey
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    return response.data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return {};
  }
};
