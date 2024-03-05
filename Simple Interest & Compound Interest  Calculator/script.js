function calculateSimpleInterest(principal, rate, years) {
  return principal * rate * years / 100;
}

function calculateCompoundInterest(principal, rate, years) {
  return principal * (Math.pow(1 + rate / 100, years) - 1);
}

function calculateAndPlot() {
  var principal = parseFloat(document.getElementById('principal').value);
  var rate = parseFloat(document.getElementById('rate').value);
  var years = parseFloat(document.getElementById('years').value);
  var plotType = document.getElementById('plot-type').value;

  var labels = [];
  var simpleInterestData = [];
  var compoundInterestData = [];

  if (plotType === 'yearly') {
    for (var i = 1; i <= years; i++) {
      labels.push(i);
      simpleInterestData.push(calculateSimpleInterest(principal, rate, i));
      compoundInterestData.push(calculateCompoundInterest(principal, rate, i));
    }
  } else if (plotType === 'monthly') {
    for (var i = 1; i <= years * 12; i++) {
      var currentYear = Math.ceil(i / 12);
      labels.push(`Year ${currentYear}, Month ${i % 12 || 12}`);
      simpleInterestData.push(calculateSimpleInterest(principal, rate / 12, i / 12));
      compoundInterestData.push(calculateCompoundInterest(principal, rate / 12, i / 12));
    }
  }

  var ctx = document.getElementById('chart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar', // Changed chart type to 'bar'
    data: {
      labels: labels,
      datasets: [{
        label: 'Simple Interest',
        data: simpleInterestData,
        backgroundColor: '#007bff', // Bar color for simple interest
        borderWidth: 1
      },
      {
        label: 'Compound Interest',
        data: compoundInterestData,
        backgroundColor: '#28a745', // Bar color for compound interest
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Interest Amount'
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }]
      }
    }
  });
}
