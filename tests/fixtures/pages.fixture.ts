import { test as base } from "@playwright/test";
import { ChatbotPage } from "../pages/chatbot/ChatbotPage";
import { DashboardPage } from "../pages/web/DashboardPage";
import { LoginPage } from "../pages/web/LoginPage";

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  chatbotPage: ChatbotPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  chatbotPage: async ({ page }, use) => {
    await use(new ChatbotPage(page));
  },
});

export { expect } from "@playwright/test";
