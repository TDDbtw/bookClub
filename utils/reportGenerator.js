const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

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
      doc.text(`Name: ${item.productDetails.name}`);
      doc.text(`Total Sales: ${item.totalSales}`);
      doc.text(`Total Revenue: $${item.totalRevenue.toFixed(2)}`);
      doc.text(`Total Discount: $${item.totalDiscount.toFixed(2)}`);
      doc.text(`Net Revenue: $${item.netRevenue.toFixed(2)}`);
      doc.text(`Offer Details: ${item.offerDetails.map(offer => `${offer.offerName} - ${offer.discountType}: ${offer.discountValue}`).join(', ')}`);
      doc.text(`Coupon Details: ${item.couponDetails.map(coupon => `${coupon.code} - Discount: ${coupon.discount}`).join(', ')}`);
      doc.moveDown();
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
console.log(`${data[0]}`.red)
  data.forEach(item => {
    worksheet.addRow({
      _id: item._id,
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

module.exports = { generatePdfReport, generateExcelReport };

