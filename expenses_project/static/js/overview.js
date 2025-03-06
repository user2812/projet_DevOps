const overviewChartItem = document.getElementById("overview-chart")

const renderStackedChart = (labels, expense, income, netWorth) => {

    const data = {
        labels: labels,
        datasets: [{
          type: 'bar',
          label: 'Expenses',
          data: expense,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }, {
          type: 'bar',
          label: 'Income',
          data: income,
          borderColor: 'rgb(127, 186, 0)',
          backgroundColor: 'rgba(127, 186, 0, 0.5)'
        }, {
          type: 'line',
          label: 'Net Worth',
          data: netWorth,
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      };
    
      const config = {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          title: {
            display: true,
            text: 'Overview for the last 12 months'
          }
        },
      };
    

    new Chart(overviewChartItem, config);
    
}

function getStackedChart() {
    fetch('/expenses/overview-chart')
    .then(response => response.json())
    .then(result => {
        console.log(result);
        renderStackedChart(result['months'], result['expense_list'], result['income_list'], result['net_worth_list']);
    })
}

document.onload = getStackedChart();





