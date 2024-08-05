const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const moment = require('moment');
const pug = require('pug');
const fs = require('fs').promises;
const path = require('path')

// Function to generate PDF report
async function generatePdfReport(data) {

let a =path.join(__dirname, '../views/partials/sales-report.pug')
    try {
        const html = await fs.readFile(a, 'utf-8');
        // Render the template with the order and user data
        const reportTemplate = pug.compile(html);
        const renderedReport = reportTemplate({salesData:data });
        return renderedReport; // Return the rendered HTML
    } catch (error) {
        console.error('Error generating sales report:', error);
        throw new Error('Could not generate sales report');
    }
}



// Function to generate Excel report
async function generateExcelReport(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  worksheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Total Sales', key: 'totalSales', width: 15 },
    { header: 'Total Revenue', key: 'totalRevenue', width: 15 },
    { header: 'Total Discount', key: 'totalDiscount', width: 15 },
    { header: 'Net Revenue', key: 'netRevenue', width: 15 },
    { header: 'Offer Details', key: 'offerDetails', width: 30 }
  ];

  data.forEach(item => {
console.log(`${item}`.red)
    worksheet.addRow({
      name: item.productDetails.name,
      totalSales: item.totalSales,
      totalRevenue: item.totalRevenue.toFixed(2),
      totalDiscount: item.totalDiscount.toFixed(2),
      netRevenue: item.netRevenue.toFixed(2),
      offerDetails: `${item.offerDetails.name} - Discount: ${item.offerDetails.discountPercentage}%`
    });
  });

  return workbook.xlsx.writeBuffer();
}

async function generateOrderInvoice(order, user) {
    const filePath = path.join(__dirname, '../views/partials/invoice.pug');
    try {
        const html = await fs.readFile(filePath, 'utf-8');
        // Render the template with the order and user data
        const invoiceTemplate = pug.compile(html);
        const renderedInvoice = invoiceTemplate({ order, user, moment });
        return renderedInvoice; // Return the rendered HTML
    } catch (error) {
        console.error('Error generating invoice:', error);
        throw new Error('Could not generate invoice');
    }
}
module.exports = { generateOrderInvoice, generatePdfReport, generateExcelReport };
