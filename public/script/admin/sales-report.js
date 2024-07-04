// public/javascripts/sales-report.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('filterForm');
  const filterType = document.getElementById('filterType');
  const dateRangeGroup = document.getElementById('date-range-group');
  const reportContainer = document.querySelector('.report-container');
  const downloadPdfButton = document.getElementById('downloadPdf');
  const downloadExcelButton = document.getElementById('downloadExcel');

  filterType.addEventListener('change', () => {
    if (filterType.value === 'custom') {
      dateRangeGroup.classList.remove('hidden');
    } else {
      dateRangeGroup.classList.add('hidden');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const filter = filterType.value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
      const response = await fetch(`/admin/sales-report/list?filter=${filter}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (data.length) {
        renderReport(data);
      } else {
        reportContainer.innerHTML = '<p>No sales data available for the selected period.</p>';
      }
    } catch (error) {
      console.error('Error fetching sales report:', error);
      reportContainer.innerHTML = '<p>Error fetching sales report. Please try again later.</p>';
    }
  });

  downloadPdfButton.addEventListener('click', () => {
    window.location.href = `/admin/sales-report/download/pdf?filter=${filterType.value}&startDate=${startDate}&endDate=${endDate}`;
  });

  downloadExcelButton.addEventListener('click', () => {
    window.location.href = `/admin/sales-report/download/excel?filter=${filterType.value}&startDate=${startDate}&endDate=${endDate}`;
  });

  function renderReport(data) {
    const table = document.createElement('table');
    table.className = 'sales-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Product ID</th>
        <th>Name</th>
        <th>Total Sales</th>
        <th>Total Revenue</th>
        <th>Total Discount</th>
        <th>Net Revenue</th>
        <th>Offer Details</th>
        <th>Coupon Details</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(item => {
      const tr = document.createElement('tr');

      const offerDetails = item.offerDetails.map(offer => `${offer.offerName} - ${offer.discountType}: ${offer.discountValue}`).join('<br>');
      const couponDetails = item.couponDetails.map(coupon => `${coupon.code} - Discount: ${coupon.discount}`).join('<br>');

      tr.innerHTML = `
        <td>${item._id}</td>
        <td>${item.productDetails.name}</td>
        <td>${item.totalSales}</td>
        <td>$${item.totalRevenue.toFixed(2)}</td>
        <td>$${item.totalDiscount.toFixed(2)}</td>
        <td>$${item.netRevenue.toFixed(2)}</td>
        <td>${offerDetails}</td>
        <td>${couponDetails}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    reportContainer.innerHTML = '';
    reportContainer.appendChild(table);
  }
});
