import { Page, request as playwrightRequest } from '@playwright/test';
import { BasePage } from './BasePage';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// New tab handler for plan PDF links; PDF URL pre-captured from href
export class PlanDetailsPage extends BasePage {
  constructor(
    page: Page,
    private readonly pdfUrl: string
  ) {
    super(page);
  }

  async waitForPageLoad(): Promise<void> {
    if (this.page.isClosed()) return;
    try {
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      if (!this.page.isClosed()) throw error;
    }
  }

  isPdfTab(): boolean {
    return this.pdfUrl.toLowerCase().endsWith('.pdf');
  }

  getPdfUrl(): string {
    return this.pdfUrl;
  }

  async downloadPdf(downloadDir: string): Promise<string> {
    if (!this.isPdfTab()) throw new Error(`URL does not point to a PDF: ${this.pdfUrl}`);
    await fs.promises.mkdir(downloadDir, { recursive: true });

    const baseName = (this.pdfUrl.split('/').pop() ?? 'plan').replace(/\.pdf$/i, '');
    const filePath = path.join(downloadDir, `${baseName}-${randomUUID()}.pdf`);

    const apiContext = await playwrightRequest.newContext({
      extraHTTPHeaders: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.originenergy.com.au/pricing.html',
        'Accept-Language': 'en-AU,en;q=0.9',
      },
    });

    try {
      const response = await apiContext.get(this.pdfUrl);
      if (!response.ok()) {
        throw new Error(`Failed to download PDF — HTTP ${response.status()} from ${this.pdfUrl}`);
      }
      await fs.promises.writeFile(filePath, await response.body());
    } finally {
      await apiContext.dispose();
    }

    return filePath;
  }
}
