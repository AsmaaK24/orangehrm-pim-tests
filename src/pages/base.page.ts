import { expect, Locator, Page } from '@playwright/test';

/**
 * Shared helpers for all page objects. OrangeHRM renders most forms with the
 * same generic markup (oxd-*), so the label based lookups live here once.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async expectToast(message: string | RegExp): Promise<void> {
    await expect(this.page.locator('.oxd-toast').first()).toContainText(message);
  }

  /** The wrapper that holds a label and its field, found by the visible label text. */
  protected fieldGroup(label: string, scope: Locator | Page = this.page): Locator {
    return scope
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText(label, { exact: true }) });
  }

  protected inputByLabel(label: string, scope: Locator | Page = this.page): Locator {
    return this.fieldGroup(label, scope).locator('input');
  }

  get validationErrors(): Locator {
    return this.page.locator('.oxd-input-field-error-message');
  }
}
