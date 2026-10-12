import { expect, test } from "../../fixtures/pages.fixture";
import { credentials, routes } from "../../support/test-data";

test.describe("Logout", () => {
  // Logging out ends the session, so this test logs in on its own instead of using the shared one.
  test.use({ storageState: { cookies: [], origins: [] } });

  test("logs out and the dashboard can't be opened again", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await expect(dashboardPage.heading).toBeVisible();

    await dashboardPage.logout();

    await expect(loginPage.page).toHaveURL(new RegExp(`${routes.login}$`));
    await expect(loginPage.heading).toBeVisible();

    await dashboardPage.goto();
    await expect(loginPage.page).toHaveURL(new RegExp(`${routes.login}$`));
    await expect(loginPage.username).toBeVisible();
  });
});
