let adminData = {};
let currentPage = 1;
const itemsPerPage = 10;
let myChart1, myChart2;
let startDate, endDate;

document.addEventListener('DOMContentLoaded', function() {
  "use strict";

  const dataSelect = document.getElementById('dataSelect');
  const bestSelling = document.getElementById('bestSelling');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const dateRangeGroup = document.getElementById('date-range-group');
  const applyDateRangeBtn = document.getElementById('applyDateRange');

  // Initialize charts
  myChart1 = initializeChart1();
  myChart2 = initializeChart2();

  // Initial data load
  loadInitialData();

  // Event listeners
  dataSelect.addEventListener('change', handleDataSelectChange);
  applyDateRangeBtn.addEventListener('click', handleCustomDateRange);
  bestSelling.addEventListener('change', handleBestSellingChange);
  loadMoreBtn.addEventListener('click', loadMoreOrders);
  document.getElementById('changeType').addEventListener('change', toggleChartType);

  // Functions
  function loadInitialData() {
    axios.get('/admin/all')
      .then(function(response) {
        adminData = response.data;
        updateDashboardStats();
        updateChart1('Yearly');
        updateChart2('Category');
        loadRecentOrders();
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
        window.toast.error('Failed to load data');
      });
  }

  function updateDashboardStats() {
    document.getElementById('totalOrders').innerText = adminData.totalOrders;
    document.getElementById('monthlyEarning').innerText = `$${adminData.monthlyEarnings}`;
    // Add more stats as needed
  }

  function handleDataSelectChange() {
    if (dataSelect.value === 'Custom Date Range') {
      dateRangeGroup.style.display = 'block';
    } else {
      dateRangeGroup.style.display = 'none';
      updateChart1(dataSelect.value);
    }
  }

  function handleCustomDateRange() {
    startDate = document.getElementById('startDate').value;
    endDate = document.getElementById('endDate').value;
    if (startDate && endDate) {
      updateChart1('custom');
    } else {
      window.toast.error('Please select both start and end dates');
    }
  }

  function updateChart1(dataType) {
    let url = `/admin/sales-data?groupBy=${dataType.toLowerCase()}`;
    if (dataType === 'custom') {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    axios.get(url)
      .then(function(response) {
        const salesData = response.data;
        myChart1.data.labels = salesData.labels;
        myChart1.data.datasets[0].data = salesData.data;
        myChart1.update();
      })
      .catch(function(error) {
        console.error('Error fetching sales data:', error);
      });
  }

  function handleBestSellingChange() {
    updateChart2(bestSelling.value);
  }

  function loadRecentOrders() {
    axios.get(`/admin/orderItems?page=${currentPage}&limit=${itemsPerPage}`)
      .then(function(response) {
        const orders = response.data.orders;
        appendOrdersToTable(orders);
        if (currentPage >= response.data.totalPages) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = 'block';
        }
      })
      .catch(function(error) {
        console.error('Error fetching orders:', error);
      });
  }

  function appendOrdersToTable(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.user.name}</td>
        <td>${order.totalAmount}</td>
        <td>${order.status}</td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
      `;
      // tbody.appendChild(tr);
    });
  }

  function loadMoreOrders() {
    currentPage++;
    loadRecentOrders();
  }

  function toggleChartType() {
    myChart1.config.type = myChart1.config.type === 'bar' ? 'line' : 'bar';
    myChart1.update();
  }


  const transactionTable = document.querySelector('#recentOrdersTable');
  function attachPaginationListeners() {
    const paginationLinks = document.querySelectorAll('.pagination-link');
    paginationLinks.forEach(link => {
      link.addEventListener('click', handlePaginationClick);
    });
  }

  function handlePaginationClick(e) {
    e.preventDefault();
    const url = this.getAttribute('href');
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTransactions = doc.querySelector('#recentOrdersTable');
        const newPagination = doc.querySelector('.pagination');
        
        if (newTransactions) {
          transactionTable.innerHTML = newTransactions.innerHTML;
        } else {
          transactionTable.innerHTML = '<tr><td colspan="4">No transactions on this page.</td></tr>';
        }
        const paginationContainer = document.querySelector('.pagination');
        if (paginationContainer && newPagination) {
          paginationContainer.outerHTML = newPagination.outerHTML;
        } else if (newPagination) {
          transactionTable.parentNode.insertAdjacentHTML('beforeend', newPagination.outerHTML);
        }
        history.pushState(null, '', url);
        attachPaginationListeners();
      });
  }
  attachPaginationListeners();


// chart pagin


});

function updateChart2(dataType) {
  axios.get(`/admin/best-selling?type=${dataType.toLowerCase()}`)
    .then(function(response) {
      const pagination =response.data.pagination;
      const bestSellingData = response.data.bestSellingData;

      myChart2.data.labels = bestSellingData.map(item => item.product || item.category || item.subcategory);
      myChart2.data.datasets[0].data = bestSellingData.map(item => item.quantitySold);
      myChart2.update();
      createItems(bestSellingData);createChartPagination
      createChartPagination(pagination.currentChart,pagination.totalChart);

    })
    .catch(function(error) {
      console.log('Error fetching best selling data:', error);
      window.toast.error('Failed to load best selling data');
    });
}




function initializeChart1() {
  var ctx = document.getElementById('chart1').getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'No of Sales',
        data: [],
        backgroundColor: '#fff',
        borderColor: "transparent",
        pointRadius: "0",
        borderWidth: 3
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
        labels: {
          fontColor: '#ddd',
          boxWidth: 40
        }
      },
      tooltips: {
        displayColors: false
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#ddd'
          },
          gridLines: {
            display: true,
            color: "rgba(221, 221, 221, 0.08)"
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#ddd'
          },
          gridLines: {
            display: true,
            color: "rgba(221, 221, 221, 0.08)"
          },
        }]
      }
    }
  });
}
function initializeChart2() {
  var ctx = document.getElementById("chart2").getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        backgroundColor: [
          '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#40916c',
          '#2d6a4f', '#1b4332', '#d8f3dc', '#e9f5db', '#f1faee'
        ],
        data: [],
        borderWidth: [0, 0, 0, 0]
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
        labels: {
          fontColor: '#ddd',
          boxWidth: 40
        }
      },
      tooltips: {
        displayColors: false
      }
    }
  });
}
function createItems(items) {
  console.log(`${items}`);
  const tbody = document.getElementById('bestSellingSubcategories');
  tbody.innerHTML = '';

  items.forEach((item, index) => {
    const tr = document.createElement('tr');
    const itemName = item.product || item.category || item.subcategory;

console.log(`${JSON.stringify(typeof item.revenue)}`)
    tr.innerHTML = `
      <td><div class="product-name" title="${itemName}">${itemName}</div></td>
      <td>${item.numberOfOrders}</td>
      <td>${item.quantitySold}</td>
      <td>$${item.revenue.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}
// table
function createChartPagination(currentChart, totalChart) {
  const paginationContainer = document.querySelector('.paginationChart');
  if (!paginationContainer) return; // Exit if container not found

  let paginationHTML = '';

  if (currentChart > 1) {
    paginationHTML += `
      <a class="pagination-chart-link bi bi-arrow-left" href="/admin?Chart2=${currentChart - 1}">aa</a>
    `;
  }

  paginationHTML += `
    <span>Page ${currentChart} of ${totalChart}</span>
  `;

  if (currentChart < totalChart) {
    paginationHTML += `
      <a class="pagination-chart-link bi bi-arrow-right" href="/admin?chart2=${currentChart + 1}">bb</a>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;
}
