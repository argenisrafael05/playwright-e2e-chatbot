import { expect, test } from "../../fixtures/pages.fixture";

test.describe("Chatbot", () => {
  test.beforeEach(async ({ chatbotPage }) => {
    await chatbotPage.goto();
  });

  test(
    "shows the sample page with the chat",
    { tag: "@smoke" },
    async ({ chatbotPage }) => {
      await expect(chatbotPage.heading).toBeVisible();
      await expect(chatbotPage.chatFrame).toBeVisible();
    },
  );
});
