import type { Locator, Page } from "@playwright/test";
import { messages, routes } from "../../support/test-data";

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly requiredMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Login" });
    // The labels aren't linked to their inputs, so the accessible name comes from the placeholder.
    this.username = page.getByRole("textbox", { name: "Username" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorAlert = page.getByRole("alert");
    this.requiredMessages = page.getByText(messages.required, { exact: true });
  }

  async goto() {
    // Waiting for every asset of the demo is slow; the elements are awaited by each action and assertion.
    await this.page.goto(routes.login, { waitUntil: "domcontentloaded" });
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
