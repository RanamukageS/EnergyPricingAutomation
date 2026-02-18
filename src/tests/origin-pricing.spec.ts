import { test, expect } from '@playwright/test';
import { PricingPage } from '../pages/PricingPage';
import { PlanDetailsPage } from '../pages/PlanDetailsPage';
import { PdfUtils } from '../utils/PdfUtils';
import { TestConfig } from '../support/TestConfig';
import { TestData } from '../support/TestData';

test.describe('Origin Energy - Pricing page end-to-end flow', () => {
  let pricingPage: PricingPage;

  test.beforeEach(async ({ page }) => {
    pricingPage = new PricingPage(page);
    await pricingPage.goto();
  });

  test('Search address → filter → click plan link → download and verify Gas PDF', async () => {

    await expect(pricingPage.addressInput).toBeVisible();

    await test.step('Type address and select suggestion from dropdown', async () => {
      await pricingPage.searchAddress(TestData.searchAddress);
      await pricingPage.selectFirstSuggestion();
    });

    await test.step('Verify plan results table is displayed', async () => {
      await pricingPage.waitForPlansToLoad();
      const rowCount = await pricingPage.getDesktopPlanRowCount();
      expect(rowCount, 'Expected at least one plan row').toBeGreaterThan(0);
    });

    await test.step('Uncheck the Electricity filter', async () => {
      await pricingPage.uncheckElectricity();
      await expect(pricingPage.electricityCheckbox).not.toBeChecked();
    });

    await test.step('Verify gas plans are still displayed after removing Electricity filter', async () => {
      await pricingPage.waitForRowsAfterFilter();
      const rowCountAfterFilter = await pricingPage.getDesktopPlanRowCount();
      expect(rowCountAfterFilter, 'Expected gas plans to remain visible').toBeGreaterThan(0);
    });

    let planDetailsPage: PlanDetailsPage;
    await test.step('Click first gas plan link and verify new tab opens with PDF', async () => {
      const { newPage, pdfUrl } = await pricingPage.clickFirstGasPlanLink();
      planDetailsPage = new PlanDetailsPage(newPage, pdfUrl);
      await planDetailsPage.waitForPageLoad();
      
      expect(planDetailsPage.isPdfTab(), 'Expected the link href to point to a PDF').toBe(true);
      console.log('Plan PDF URL:', planDetailsPage.getPdfUrl());
    });

    let pdfFilePath: string;
    await test.step('Download plan PDF to local file system', async () => {
      try {
        pdfFilePath = await planDetailsPage.downloadPdf(TestConfig.downloadDir);
      } catch (error) {
        throw new Error(`Failed to download PDF from ${planDetailsPage.getPdfUrl()}: ${error}`);
      }

      expect(PdfUtils.isValidFile(pdfFilePath), 'Downloaded file must exist and be non-empty').toBe(true);
      const sizeBytes = PdfUtils.getFileSizeBytes(pdfFilePath);
      expect(sizeBytes, 'PDF file size must be greater than 0').toBeGreaterThan(0);
      console.log(`PDF saved: ${pdfFilePath} (${sizeBytes} bytes)`);
    });

    await test.step('Assert PDF content confirms this is a Gas plan', async () => {
      await PdfUtils.assertContains(pdfFilePath, TestData.gasPdfKeywords);
    });
  });
});
