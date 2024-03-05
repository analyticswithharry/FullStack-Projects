async function convert() {
  var amount = parseFloat(document.getElementById('amount').value);
  var fromCurrency = document.getElementById('from').value;
  var toCurrency = document.getElementById('to').value;

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    var conversionRate = data.rates[toCurrency];
    if (!conversionRate) {
      throw new Error("Conversion rate not available for selected currencies.");
    }

    var convertedAmount = amount * conversionRate;

    document.getElementById('result').innerHTML = amount + ' ' + fromCurrency + ' = ' + convertedAmount.toFixed(2) + ' ' + toCurrency;
  } catch (error) {
    document.getElementById('result').innerHTML = 'Error: ' + error.message;
  }
}
