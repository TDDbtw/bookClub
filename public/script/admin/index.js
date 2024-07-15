let adminData = {};

$(function() {
  "use strict";

  const dataSelect = document.getElementById('dataSelect');
  const bestSelling = document.getElementById('bestSelling');

  axios.get('/admin/all')
    .then(function(response) {
      adminData = response.data;
      myChart1.config.data.datasets[0].data = adminData.yearlyOrderCounts;
      myChart1.config.data.labels = ["2020", "2021", "2022", "2023", "2024"];
      myChart1.update()



      myChart2.config.data.datasets[0].data = adminData.salesPerCategory.map((item) => {
        return item.totalRevenue;
      });
      myChart2.config.data.labels = adminData.salesPerCategory.map((item) => {
        return item.category;
      });
      let aa=document.querySelector('option[value=Category]').setAttribute('selected', true);
      console.log(`${aa}`)
      createItems(adminData.salesPerCategory);
      myChart2.update();
      window.toast.success('load');
      document.getElementById('totalOrders').innerText= adminData.totalOrders
      document.getElementById('monthlyEarning').innerText= `$${adminData.monthlyEarnings}`
      document.getElementById('monthlyEarning').innerText= `$${adminData.monthlyEarnings}`

    })
    .catch(function(error) {
      console.error('Error fetching data:', error);
    });
  const changeT=document.getElementById('changeType')
  changeT.addEventListener('change',()=>{
    myChart1.config.type=myChart1.config.type=='bar'?'line':'bar'
    myChart1.update()
  })

  dataSelect.addEventListener('change', () => {
    console.log(dataSelect.value);
    switch (dataSelect.value) {
      case 'Yearly':
        myChart1.config.data.datasets[0].data = adminData.yearlyOrderCounts;
        myChart1.config.data.labels = ["2020", "2021", "2022", "2023", "2024"];
        break;
      case 'Monthly':
        myChart1.config.data.datasets[0].data = adminData.monthlyOrderCounts;
        myChart1.config.data.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        break;
      case 'Weekly':
        myChart1.config.data.datasets[0].data = adminData.weeklyOrderCounts;
        myChart1.config.data.labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        break;
    }
    myChart1.update();
  });

  bestSelling.addEventListener('change', () => {
    console.log(bestSelling.value);
    if (bestSelling.value == 'Products') {
      let a = adminData.bestSellingProducts.map((item) => {
        return item.totalSales
      })
      myChart2.config.data.datasets[0].data = a;
      myChart2.config.data.labels = adminData.bestSellingProducts.map((item) => {
        createItems(adminData.bestSellingProducts)
        return item.product;
      });
      myChart2.update();
    }
    if (bestSelling.value == 'Category') {
      myChart2.config.data.datasets[0].data = adminData.salesPerCategory.map((item) => {
        return item.totalQuantity ;
      });
      myChart2.config.data.labels = adminData.salesPerCategory.map((item) => {
        return item.category;
      });
      createItems(adminData.salesPerCategory);
      myChart2.update();
    }

    if (bestSelling.value == 'Subcategory') {
      console.log(`console subcategory`)
      myChart2.config.data.datasets[0].data = adminData.bestSellingSubcategories.map((item) => {
        return item.totalQuantity;
      })
      myChart2.config.data.labels = adminData.bestSellingSubcategories.map((item) => {
        return item.totalRevenuesubcategory;
      })
      createItems(adminData.bestSellingSubcategories)
      myChart2.update();
    }
  });

  var ctx = document.getElementById('chart1').getContext('2d');

  var myChart1 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: 'No of Sales',
        data: [2,2,3,4,5,6,8,17,15,23],
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

  var ctx = document.getElementById("chart2").getContext('2d');
  var myChart2 = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Direct", "Affiliate", "E-mail", "Other"],
      datasets: [{
        backgroundColor:
[
  '#b7e4c7',
  '#95d5b2',
  '#74c69d',
  '#52b788',
  '#40916c',
  '#2d6a4f',
  '#1b4332',
  '#d8f3dc',
  '#e9f5db',
  '#f1faee'
]
   ,
        data: [5856, 2602, 1802, 1105],
        borderWidth: [0, 0, 0, 0]
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        position: "bottom",
        display: false,
        labels: {
          fontColor: '#ddd',
          boxWidth: 15
        }
      },
      tooltips: {
        displayColors: true
      }
    }
  });

  document.getElementById('changeType').addEventListener('change',()=>{
    console.log(`type of chart ${myChart1}`)
  })
});


function createItems(bestSellingSubcategories) {
  const tbody = document.getElementById('bestSellingSubcategories');
  tbody.innerHTML = '';

  bestSellingSubcategories.slice(0, 3).forEach((subcategory, index) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    const icon = document.createElement('i');

    icon.className = index == 0 ? 'fa fa-circle text-white mr-2' : `fa fa-circle text-light-${index} mr-2`;
    tdName.appendChild(icon);
    tdName.appendChild(document.createTextNode(` ${subcategory.subcategory || subcategory.product ||subcategory.category}`));
if(subcategory.product){
tdName.style.fontSize='13px';
}
    tdName.style.width='100px';
    const tdSales = document.createElement('td');
    tdSales.textContent = `${subcategory.totalSales||subcategory.totalQuantity} sales`;

    const tdRevenue = document.createElement('td');
    // Assuming you have a percentage increase data; replace 'percentage' with actual data field
    tdRevenue.textContent = `$${  subcategory.totalRevenue} `;
    tr.appendChild(tdName);
    tr.appendChild(tdSales);
    tr.appendChild(tdRevenue);

    tbody.appendChild(tr);
  });

}

function createChart2item(item){


}
