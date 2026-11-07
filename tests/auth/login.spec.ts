import { env } from '../../src/config/env';
import { expect, test } from '../../src/fixtures';

// These tests are about the login screen itself, so they must not reuse the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials open the dashboard', { tag: '@smoke' }, async ({ loginPage }) => {
    await loginPage.login(env.username, env.password);
    await loginPage.expectLoggedIn();
  });

  test('wrong password shows an error', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.login(env.username, 'not-the-password');
    await loginPage.expectInvalidCredentials();
  });

  test('empty form shows required messages', { tag: '@regression' }, async ({ loginPage, page }) => {
    await loginPage.login('', '');
    await expect(page.locator('.oxd-input-field-error-message')).toHaveCount(2);
  });
});
