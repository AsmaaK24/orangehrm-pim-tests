import { expect } from '@playwright/test';
import { Employee } from '../data/employee.data';
import { BasePage } from './base.page';

export class AddEmployeePage extends BasePage {
  private readonly heading = this.page.getByRole('heading', { name: 'Add Employee' });
  private readonly firstName = this.page.getByPlaceholder('First Name');
  private readonly middleName = this.page.getByPlaceholder('Middle Name');
  private readonly lastName = this.page.getByPlaceholder('Last Name');
  private readonly employeeId = this.inputByLabel('Employee Id');
  private readonly saveButton = this.page.getByRole('button', { name: 'Save' });

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/pim/addEmployee');
    await expect(this.heading).toBeVisible();
    // the form pre-fills the next free id asynchronously, wait for it so we don't race it
    await expect(this.employeeId).not.toHaveValue('');
  }

  async fillForm(employee: Employee): Promise<void> {
    await this.firstName.fill(employee.firstName);
    await this.middleName.fill(employee.middleName);
    await this.lastName.fill(employee.lastName);
    await this.employeeId.fill(employee.employeeId);
  }

  async submit(): Promise<void> {
    await this.saveButton.click();
  }

  /** Saves the form and returns the empNumber from the details page URL. */
  async saveAndGetEmpNumber(): Promise<number> {
    await this.submit();
    await this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
    const match = this.page.url().match(/empNumber\/(\d+)/);
    return Number(match![1]);
  }

  async clearEmployeeId(): Promise<void> {
    await this.employeeId.clear();
  }

  async expectRequiredErrorsOnNames(): Promise<void> {
    // first and last name are the mandatory ones
    await expect(this.validationErrors.filter({ hasText: 'Required' })).toHaveCount(2);
  }

  async expectDuplicateIdError(): Promise<void> {
    await expect(this.validationErrors.filter({ hasText: 'Employee Id already exists' })).toBeVisible();
  }
}
