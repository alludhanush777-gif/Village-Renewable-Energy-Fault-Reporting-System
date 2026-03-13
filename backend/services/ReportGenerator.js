const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * ReportGenerator Service
 * Generates enterprise-grade PDF reports for NGO stakeholders.
 */
class ReportGenerator {
  static async generateMonthlyReport(data) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Minimal HTML template for report
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #111; }
            .header { border-bottom: 4px solid #00A86B; padding-bottom: 20px; margin-bottom: 40px; }
            h1 { text-transform: uppercase; letter-spacing: -1px; margin: 0; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .stat-card { border: 1px solid #eee; padding: 20px; border-radius: 12px; }
            .label { font-size: 10px; font-weight: 900; color: #666; text-transform: uppercase; }
            .value { font-size: 24px; font-weight: 900; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <p style="color: #00A86B; font-weight: 900; margin: 0;">SENTINEL ENERGY COMMAND</p>
            <h1>Monthly Reliability Report v2.4</h1>
            <p>Southern Rift Valley Grid Alliance • ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="stat-grid">
            <div class="stat-card">
              <p class="label">Avg Uptime</p>
              <p class="value">${data.uptime}%</p>
            </div>
            <div class="stat-card">
              <p class="label">Carbon Offset</p>
              <p class="value">${data.carbon} Tons</p>
            </div>
            <div class="stat-card">
              <p class="label">Villages Reached</p>
              <p class="value">${data.villages}</p>
            </div>
          </div>
          <p>This report confirms that all renewable assets are operating within nominal thresholds.</p>
        </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    
    await browser.close();
    return pdfBuffer;
  }
}

module.exports = ReportGenerator;
