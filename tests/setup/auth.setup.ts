import { expect, test as setup } from "../fixtures/pages.fixture";
import { credentials, sessionFile } from "../support/test-data";

setup(
  "log in once and save the session",
  async ({ loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    await expect(dashboardPage.heading).toBeVisible();
    await dashboardPage.page.context().storageState({ path: sessionFile });
  },
);
