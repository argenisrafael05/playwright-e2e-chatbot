import { expect, test } from "../../fixtures/pages.fixture";
import { menuOptions, routes } from "../../support/test-data";

test.describe("My Info", () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test("shows all the menu options on the dashboard", async ({
    dashboardPage,
  }) => {
    await expect(dashboardPage.menuOptions).toHaveText(menuOptions);
  });

  test("opens My Info and shows the personal details", async ({
    dashboardPage,
    myInfoPage,
  }) => {
    await dashboardPage.openFromMenu("My Info");

    await expect(myInfoPage.page).toHaveURL(new RegExp(routes.personalDetails));
    await expect(myInfoPage.personalDetailsHeading).toBeVisible();
  });
});
