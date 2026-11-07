import { expect } from '@playwright/test';
import { EmployeeUpdate } from '../data/employee.data';
import { BasePage } from './base.page';

export class PersonalDetailsPage extends BasePage {
  private readonly firstName = this.page.getByPlaceholder('First Name');
  private readonly lastName = this.page.getByPlaceholder('Last Name');
  // the page has a second form (custom fields) with its own Save button, we only want the first
  private readonly saveButton = this.page.getByRole('button', { name: 'Save' }).first();

  async goto(empNumber: number): Promise<void> {
    await this.page.goto(`/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`);
    await this.waitUntilLoaded();
  }

  /** Fields are filled in by an XHR after the page shell renders. */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.firstName).not.toHaveValue('');
  }

  async edit(update: EmployeeUpdate): Promise<void> {
    await this.firstName.fill(update.firstName);
    await this.lastName.fill(update.lastName);
    await this.selectOption('Nationality', update.nationality);
    await this.selectOption('Marital Status', update.maritalStatus);
    await this.fieldGroup('Gender').locator('.oxd-radio-wrapper').filter({ hasText: update.gender })
      .locator('.oxd-radio-input').click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.expectToast('Successfully Updated');
  }

  async expectDetails(expected: EmployeeUpdate): Promise<void> {
    await expect(this.firstName).toHaveValue(expected.firstName);
    await expect(this.lastName).toHaveValue(expected.lastName);
    await expect(this.fieldGroup('Nationality').locator('.oxd-select-text-input')).toHaveText(expected.nationality);
    await expect(this.fieldGroup('Marital Status').locator('.oxd-select-text-input')).toHaveText(expected.maritalStatus);
    await expect(
      this.fieldGroup('Gender').locator('.oxd-radio-wrapper').filter({ hasText: expected.gender }).locator('input'),
    ).toBeChecked();
  }

  private async selectOption(label: string, option: string): Promise<void> {
    await this.fieldGroup(label).locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: option }).click();
  }
}
