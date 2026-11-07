import { test as setup } from '@playwright/test';
import { authFile, env } from '../src/config/env';
import { LoginPage } from '../src/pages/login.page';

setup('log in and store the session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, env.password);
  await loginPage.expectLoggedIn();
  await page.context().storageState({ path: authFile });
});
