const bgColor = [
    'rgb(255, 241, 0, 0.2)', 'rgb(255, 140, 0, 0.2)', 'rgb(232, 17, 35, 0.2)', 'rgb(236, 0, 140, 0.2)', 
    'rgb(104, 33, 122, 0.2)', 'rgb(0, 24, 143, 0.2)', 'rgb(0, 188, 242, 0.2)', 'rgb(0, 178, 148, 0.2)', 
    'rgb(0, 158, 73, 0.2)', 'rgb(186, 216, 10, 0.2),', 'rgb(0, 0, 0, 0.2)'
  ]
  
  const brColor = [
    'rgb(255, 241, 0)', 'rgb(255, 140, 0)', 'rgb(232, 17, 35)', 'rgb(236, 0, 140)',
    'rgb(104, 33, 122)', 'rgb(0, 24, 143)', 'rgb(0, 188, 242)', 'rgb(0, 178, 148)',
    'rgb(0, 158, 73)', 'rgb(186, 216, 10)', 'rgb(0, 0, 0)'
  ]
  
  const barChartItem = document.getElementById("bar-chart").getContext("2d");
  let globalBarChart = null;
  
  const pieChartItem = document.getElementById("pie-chart").getContext("2d");
  let globalPieChart = null;
  
  let renderBarChart = (labels, dataInfo) => {

    const data = {
      labels: labels,
      datasets: [{
        label: 'Income',
        data: dataInfo,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    
    const config = {
      type: 'line',
      data: data,
    };
  
    if (globalBarChart != null) {
      globalBarChart.data.datasets[0].data = dataInfo;
      globalBarChart.data.labels = labels;
      globalBarChart.update();
      
    } else {
  
      globalBarChart = new Chart(barChartItem, config);
    }
  
  }
  
  let renderPieChart = (labels, dataInfo) => {
  
    const data = {
      labels: labels,
      datasets: [{
        label: 'Category',
        data: dataInfo,
        backgroundColor: brColor,
        hoverOffset: 4
      }]
    };
  
    const config = {
      type: 'pie',
      data: data,
    };
  
    if (globalPieChart != null) {
      globalPieChart.data.datasets[0].data = dataInfo;
      globalPieChart.data.labels = labels;
      globalPieChart.update();
    } else {
      globalPieChart = new Chart(pieChartItem, config);
    }
  
  }
  
  const getBarChart = (mths) => {
    if (mths > 0) {
  
      fetch(`/income/income-amount-summary/${mths}`)
      .then(response => response.json())
      .then(result => {
  
        const keys = Object.keys(result.income_amount_data).reverse();
        const values = Object.values(result.income_amount_data).reverse();
        renderBarChart(keys, values);
      })
    }
  
  }
  
  const getPieChart = (mths) => {
    if (mths > 0) {
  
      fetch(`/income/income-category-summary/${mths}`)
      .then(response => response.json())
      .then(result => {
  
        const keys = Object.keys(result.income_category_data);
        const values = Object.values(result.income_category_data);
        renderPieChart(keys, values);
      })
    }
  
  }
  
  
  
  
document.addEventListener("DOMContentLoaded", () => {
    // default bar chart is 3 months
    getBarChart(3);
    document.querySelector("#bar-chart-btn-3").checked = true;
    // default pie chart is 1 month
    getPieChart(1);
    document.querySelector("#pie-chart-btn-1").checked = true;
})