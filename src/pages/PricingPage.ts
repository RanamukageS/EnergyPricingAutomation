import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

// Page object for originenergy.com.au/pricing.html
export class PricingPage extends BasePage {
  static readonly URL = '/pricing.html';

  // Address search
  readonly addressInput: Locator;
  readonly addressSuggestionsListbox: Locator;
  readonly addressSuggestionOptions: Locator;
  readonly firstAddressSuggestion: Locator;

  // Filter checkboxes
  readonly electricityLabel: Locator;
  readonly electricityCheckbox: Locator;
  readonly gasLabel: Locator;
  readonly gasCheckbox: Locator;

  // Plan results
  readonly searchResultsContainer: Locator;
  readonly desktopPlanTable: Locator;
  readonly desktopPlanRows: Locator;
  readonly allPlanLinks: Locator;
  readonly gasPlanLinks: Locator;

  constructor(page: Page) {
    super(page);

    this.addressInput = page.locator('#address-lookup');
    this.addressSuggestionsListbox = page.locator('#address-lookup-listbox');
    this.addressSuggestionOptions = page.getByRole('listbox', { name: /address/i }).locator('[role="option"]');
    this.firstAddressSuggestion = page.locator('#address-lookup-option-0');

    this.electricityLabel = page.locator('[data-id="elc-checkbox-label"]').first();
    this.electricityCheckbox = page.locator('input[name="elc-checkbox"]').first();
    this.gasLabel = page.locator('[data-id="gas-checkbox-label"]').first();
    this.gasCheckbox = page.locator('input[name="gas-checkbox"]').first();

    this.searchResultsContainer = page.locator('[data-id="searchResultsContainer"]');
    this.desktopPlanTable = page.locator('[data-id="plan-info-table-desktop"]');
    this.desktopPlanRows = this.desktopPlanTable.locator('tr[data-id^="row-"]');
    this.allPlanLinks = this.searchResultsContainer.locator('a[data-id^="energy-fact-sheet-"]');
    this.gasPlanLinks = this.desktopPlanTable.locator('a[data-id$="-gas"]');
  }

  async goto(): Promise<void> {
    await this.navigate(PricingPage.URL);
    await expect(this.addressInput).toBeVisible();
  }

  async searchAddress(address: string): Promise<void> {
    await this.addressInput.click();
    await this.addressInput.fill(address);
    await expect(this.addressSuggestionsListbox).toBeVisible();
  }

  async selectFirstSuggestion(): Promise<void> {
    await this.firstAddressSuggestion.click();
  }

  async waitForPlansToLoad(): Promise<void> {
    await expect(this.searchResultsContainer).toBeVisible();
    await expect(this.desktopPlanRows.first()).toBeVisible();
  }

  async waitForRowsAfterFilter(): Promise<void> {
    await expect(this.desktopPlanRows.first()).toBeVisible();
  }

  async getDesktopPlanRowCount(): Promise<number> {
    return this.desktopPlanRows.count();
  }

  async uncheckElectricity(): Promise<void> {
    const isChecked = await this.electricityCheckbox.isChecked();
    if (isChecked) {
      await this.electricityLabel.click();
      await this.electricityCheckbox.waitFor({ state: 'attached' });
      await expect(this.electricityCheckbox).not.toBeChecked();
    }
  }

  async clickFirstGasPlanLink(): Promise<{ newPage: Page; pdfUrl: string }> {
    const link = this.gasPlanLinks.first();
    const pdfUrl = await link.getAttribute('href');
    if (!pdfUrl) throw new Error('Gas plan link missing href');

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click(),
    ]);

    return { newPage, pdfUrl };
  }
}
