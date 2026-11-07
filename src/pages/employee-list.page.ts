import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class EmployeeListPage extends BasePage {
  private readonly heading = this.page.getByRole('heading', { name: 'Employee Information' });
  private readonly filterForm = this.page.locator('.oxd-table-filter');
  private readonly employeeIdFilter = this.inputByLabel('Employee Id', this.filterForm);
  private readonly searchButton = this.page.getByRole('button', { name: 'Search' });
  private readonly resultSummary = this.page.getByText(/\(\d+\) Records? Found|No Records Found/).first();

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.heading).toBeVisible();
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.employeeIdFilter.fill(employeeId);
    await this.searchButton.click();
    await expect(this.resultSummary).toBeVisible();
  }

  rowFor(employeeId: string): Locator {
    return this.page.getByRole('row').filter({ hasText: employeeId });
  }

  async expectSingleResult(employeeId: string, names: { firstName: string; lastName: string }): Promise<void> {
    await expect(this.page.getByText('(1) Record Found')).toBeVisible();
    const row = this.rowFor(employeeId);
    await expect(row).toContainText(names.firstName);
    await expect(row).toContainText(names.lastName);
  }

  async expectNoRecords(): Promise<void> {
    await expect(this.page.getByText('No Records Found').first()).toBeVisible();
  }

  async openEmployee(employeeId: string): Promise<void> {
    // second cell is the Id column (first one is the checkbox)
    await this.rowFor(employeeId).getByRole('cell').nth(1).click();
    await this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await this.rowFor(employeeId)
      .getByRole('button')
      .filter({ has: this.page.locator('.bi-trash') })
      .click();
    await this.page.getByRole('button', { name: /Yes, Delete/ }).click();
    await this.expectToast('Successfully Deleted');
  }
}
