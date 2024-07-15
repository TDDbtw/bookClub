const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const moment = require('moment');
const Order = require('../models/order');  // Adjust the path as necessary

// Function to generate PDF report
async function generatePdfReport(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(16).text('Sales Report', { align: 'center' });
    doc.moveDown();

    data.forEach(item => {
      doc.fontSize(14).text(`Product: ${item.productDetails.name}`, { underline: true });
      doc.moveDown(0.5);

      const tableHeaders = ['Total Sales', 'Total Revenue', 'Total Discount', 'Net Revenue', 'Offers', 'Coupons'];
      const tableRows = [
        [
          item.totalSales,
          `$${item.totalRevenue.toFixed(2)}`,
          `$${item.totalDiscount.toFixed(2)}`,
          `$${item.netRevenue.toFixed(2)}`,
          item.offerDetails.map(offer => `${offer.offerName} (${offer.discountType}: ${offer.discountValue})`).join(', '),
          item.couponDetails.map(coupon => `${coupon.code} (Discount: ${coupon.discount})`).join(', ')
        ]
      ];

      // Table Headers
      doc.fontSize(12).font('Helvetica-Bold');
      tableHeaders.forEach(header => {
        doc.text(header, {
          continued: true,
          width: doc.page.width / tableHeaders.length,
          align: 'left'
        });
      });
      doc.moveDown();

      // Table Rows
      doc.font('Helvetica');
      tableRows.forEach(row => {
        row.forEach(cell => {
          doc.text(cell, {
            continued: true,
            width: doc.page.width / tableHeaders.length,
            align: 'left'
          });
        });
        doc.moveDown();
      });

      doc.moveDown(2);
    });

    doc.end();
  });
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
    { header: 'Offer Details', key: 'offerDetails', width: 30 },
    { header: 'Coupon Details', key: 'couponDetails', width: 30 }
  ];

  data.forEach(item => {
    worksheet.addRow({
      name: item.productDetails.name,
      totalSales: item.totalSales,
      totalRevenue: item.totalRevenue.toFixed(2),
      totalDiscount: item.totalDiscount.toFixed(2),
      netRevenue: item.netRevenue.toFixed(2),
      offerDetails: item.offerDetails.map(offer => `${offer.offerName} - ${offer.discountType}: ${offer.discountValue}`).join(', '),
      couponDetails: item.couponDetails.map(coupon => `${coupon.code} - Discount: ${coupon.discount}`).join(', ')
    });
  });

  return workbook.xlsx.writeBuffer();
}

// Function to generate order invoice
async function generateOrderInvoice(order) {
  // Helper function to format date
  const formatDate = (date) => moment(date).format('MMMM D, YYYY');

  // Calculate subtotal
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Assume tax rate of 10% (adjust as needed)
  const taxRate = 0.10;
  const taxAmount = subtotal * taxRate;

  // Generate invoice HTML
  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .details { display: flex; justify-content: space-between; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .total { margin-top: 20px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <h1>Invoice</h1>
          <p>Order ID: ${order._id}</p>
        </div>
        
        <div class="details">
          <div>
            <h3>Bill To:</h3>
            <p>${order.billing_address.name}<br>
            ${order.billing_address.address}<br>
            ${order.billing_address.city}, ${order.billing_address.state} ${order.billing_address.zipCode}<br>
            ${order.billing_address.country}</p>
          </div>
          <div>
            <h3>Invoice Details:</h3>
            <p>Date: ${formatDate(order.created_at)}<br>
            Payment Method: ${order.payment_method}<br>
            Expected Delivery: ${formatDate(order.deliveryDate)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
          <p>Tax (${(taxRate * 100).toFixed(0)}%): $${taxAmount.toFixed(2)}</p>
          <h3>Total: $${order.totalAmount.toFixed(2)}</h3>
        </div>
      </div>
    </body>
    </html>
  `;

  return invoiceHtml;
}

module.exports = {generateOrderInvoice, generatePdfReport, generateExcelReport, generateOrderInvoice };
