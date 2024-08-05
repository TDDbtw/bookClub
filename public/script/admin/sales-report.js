document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('filterForm');
  const filterType = document.getElementById('filterType');
  const startDateGroup = document.getElementById('startDateGroup');
  const endDateGroup = document.getElementById('endDateGroup');
  const reportContainer = document.querySelector('.report-container');
  const downloadPdfButton = document.getElementById('downloadPdf');
  const downloadExcelButton = document.getElementById('downloadExcel');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');

  downloadPdfButton.disabled = true;
  downloadExcelButton.disabled = true;

  filterType.addEventListener('change', () => {
    if (filterType.value === 'custom') {
      startDateGroup.classList.remove('d-none');
      endDateGroup.classList.remove('d-none');
    } else {
      startDateGroup.classList.add('d-none');
      endDateGroup.classList.add('d-none');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const filter = filterType.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Date validation
    if (filter === 'custom') {
      if (!startDate || !endDate) {
        window.toast.errorMessage('Please select both start and end dates for custom date range.');
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        window.toast.errorMessage('Start date must be before or equal to the end date.');
        return;
      }

      if (new Date(endDate) > new Date()) {
        window.toast.errorMessage('End date cannot be in the future.');
        return;
      }
    }

    try {
console.log(`filter is ${filter}`)
console.log(`st date ${startDate}`)
console.log(`end date ${endDate}`)
      const response = await fetch('/admin/sales-report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filterType: filter, startDate, endDate }),
      });
      const result = await response.json();

      if (result.success && result.data.length) {
        renderReport(result.data);
        updateDownloadButtons(filter, startDate, endDate);
      } else {
        reportContainer.innerHTML = '<p class="text-center">No sales data available for the selected period.</p>';
      }
    } catch (error) {
      console.log('Error:', error);
      window.toast.error('Error fetching sales report. Please try again later.');
      reportContainer.innerHTML = '<p class="text-center text-danger">Error fetching sales report. Please try again later.</p>';
    }
  });

  downloadPdfButton.addEventListener('click', () => {
    downloadReport('pdf');
  });

  downloadExcelButton.addEventListener('click', () => {
    downloadReport('excel');
  });

  function updateDownloadButtons(filter, startDate, endDate) {
    downloadPdfButton.disabled = false;
    downloadExcelButton.disabled = false;
    const queryParams = `filterType=${filter}&startDate=${startDate}&endDate=${endDate}`;
    downloadPdfButton.setAttribute('data-params', queryParams);
    downloadExcelButton.setAttribute('data-params', queryParams);
  }

  function downloadReport(format) {
    const params = format === 'pdf' ? downloadPdfButton.getAttribute('data-params') : downloadExcelButton.getAttribute('data-params');
    window.location.href = `/admin/sales-report/download/${format}?${params}`;
  }

  function renderReport(data) {
    const table = document.createElement('table');
    table.className = 'table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Product Name</th>
        <th>Total Sales</th>
        <th>Total Revenue</th>
        <th>Total Discount</th>
        <th>Net Revenue</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let totalSales = 0;
    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalNetRevenue = 0;

    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.productDetails.name}</td>
        <td>${item.totalSales}</td>
        <td>$${item.totalRevenue.toFixed(2)}</td>
        <td>$${item.totalDiscount.toFixed(2)}</td>
        <td>$${item.netRevenue.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);

      totalSales += item.totalSales;
      totalRevenue += item.totalRevenue;
      totalDiscount += item.totalDiscount;
      totalNetRevenue += item.netRevenue;
    });

    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-dark';
    summaryRow.innerHTML = `
      <td><strong>Total</strong></td>
      <td><strong>${totalSales}</strong></td>
      <td><strong>$${totalRevenue.toFixed(2)}</strong></td>
      <td><strong>$${totalDiscount.toFixed(2)}</strong></td>
      <td><strong>$${totalNetRevenue.toFixed(2)}</strong></td>
    `;
    tbody.appendChild(summaryRow);

    table.appendChild(tbody);
    reportContainer.innerHTML = '';
    reportContainer.appendChild(table);
  }
});
