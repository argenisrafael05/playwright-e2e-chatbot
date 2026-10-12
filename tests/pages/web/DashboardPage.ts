import type { Locator, Page } from "@playwright/test";
import { routes } from "../../support/test-data";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly sidepanel: Locator;
  readonly menuOptions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Dashboard" });
    this.sidepanel = page.getByRole("navigation", { name: "Sidepanel" });
    // The brand logo is a link too, so the options are read from the menu list only.
    this.menuOptions = this.sidepanel.getByRole("list").getByRole("link");
  }

  async goto() {
    await this.page.goto(routes.dashboard, { waitUntil: "domcontentloaded" });
  }

  async openFromMenu(option: string) {
    await this.sidepanel
      .getByRole("link", { name: option, exact: true })
      .click();
  }
}
