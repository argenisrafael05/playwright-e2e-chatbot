import { expect, test } from "../../fixtures/pages.fixture";
import type { LoginPage } from "../../pages/web/LoginPage";
import { credentials, messages, routes } from "../../support/test-data";

const invalidLogins = [
  {
    partition: "a wrong password",
    username: credentials.username,
    password: "wrong-password",
  },
  {
    partition: "a wrong username",
    username: "unknown-user",
    password: credentials.password,
  },
];

// The decisive check of a failed login: the user is still on the login page with the form ready.
async function expectLoginForm(loginPage: LoginPage) {
  await expect(loginPage.page).toHaveURL(new RegExp(`${routes.login}$`));
  await expect(loginPage.username).toBeVisible();
  await expect(loginPage.password).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
}

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("shows the login form", { tag: "@smoke" }, async ({ loginPage }) => {
    await expect(loginPage.heading).toBeVisible();
    await expectLoginForm(loginPage);
  });

  test(
    "valid credentials open the dashboard",
    { tag: "@smoke" },
    async ({ loginPage, dashboardPage }) => {
      await loginPage.login(credentials.username, credentials.password);

      await expect(dashboardPage.page).toHaveURL(
        new RegExp(`${routes.dashboard}$`),
      );
      await expect(dashboardPage.heading).toBeVisible();
    },
  );

  for (const { partition, username, password } of invalidLogins) {
    test(`${partition} keeps the user on the login page`, async ({
      loginPage,
    }) => {
      await loginPage.login(username, password);

      // The message tells us the server already answered; only then the state can be checked.
      await expect(loginPage.errorAlert).toContainText(
        messages.invalidCredentials,
      );
      await expectLoginForm(loginPage);
    });
  }

  test("empty fields keep the user on the login page", async ({
    loginPage,
  }) => {
    await loginPage.loginButton.click();

    await expect(loginPage.requiredMessages).toHaveCount(2);
    await expectLoginForm(loginPage);
  });
});
