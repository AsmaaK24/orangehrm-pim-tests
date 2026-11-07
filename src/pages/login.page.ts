import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByPlaceholder('Username');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly errorAlert = this.page.locator('.oxd-alert-content-text');

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/index/);
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.errorAlert).toHaveText('Invalid credentials');
  }
}
