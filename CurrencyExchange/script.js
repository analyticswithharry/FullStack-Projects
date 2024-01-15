// Mock exchange rates (replace with real values)
const exchangeRates = {
  USD: { ALL: 108.93, EUR: 0.85, GBP: 0.74 },
  EUR: { ALL: 127.33, USD: 1.17, GBP: 0.87 },
  GBP: { ALL: 146.39, USD: 1.36, EUR: 1.15 },
  ALL: { USD: 0.0092, EUR: 0.0079, GBP: 0.0068 },
};

function convertCurrency() {
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (isNaN(amount)) {
      alert('Please enter a valid amount.');
      return;
  }

  if (!(fromCurrency in exchangeRates) || !(toCurrency in exchangeRates[fromCurrency])) {
      alert('Invalid currency selection.');
      return;
  }

  const rate = exchangeRates[fromCurrency][toCurrency];
  const result = (amount * rate).toFixed(2);

  document.getElementById('result').textContent = result;
}
