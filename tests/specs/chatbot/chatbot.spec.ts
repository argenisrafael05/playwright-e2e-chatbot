import { expect, test } from "../../fixtures/pages.fixture";
import { chatbot, routes } from "../../support/test-data";

test.describe("Chatbot", () => {
  test.beforeEach(async ({ chatbotPage }) => {
    await chatbotPage.goto();
  });

  test(
    "shows the sample page with the chat",
    { tag: "@smoke" },
    async ({ chatbotPage }) => {
      await expect(chatbotPage.page).toHaveURL(
        new RegExp(routes.chatbotSample),
      );
      await expect(chatbotPage.heading).toBeVisible();
      await expect(chatbotPage.chatFrame).toBeVisible();
    },
  );

  test("opens the chat and shows the bot's name", async ({ chatbotPage }) => {
    await chatbotPage.openChat();

    await expect(chatbotPage.botName).toHaveText(chatbot.botName);
    await expect(chatbotPage.messageInput).toBeEditable();
  });

  test("answers an informational quick reply", async ({ chatbotPage }) => {
    await chatbotPage.openChat();

    await chatbotPage.quickReply(chatbot.quickReply).click();

    const choice = chatbotPage.visitorMessage(chatbot.quickReply);
    await expect(choice).toBeVisible();
    const answer = chatbotPage.messageAfter(choice);
    // The bot first shows an empty "typing" row, so the wait is for its text.
    await expect(answer, "the bot answers the quick reply").not.toBeEmpty({
      timeout: chatbot.maxReplyWait,
    });
  });

  test("greets back when the visitor says Hola", async ({ chatbotPage }) => {
    await chatbotPage.openChat();
    await expect(chatbotPage.messageInput).toBeEditable();

    await chatbotPage.send(chatbot.greeting);

    const greeting = chatbotPage.visitorMessage(chatbot.greeting);
    await expect(greeting).toBeVisible();
    // The reply that counts is the first message after "Hola": the automatic welcome is a greeting too.
    const reply = chatbotPage.messageAfter(greeting);
    await expect(reply, "the bot replies to Hola").not.toBeEmpty({
      timeout: chatbot.maxReplyWait,
    });
    await expect(reply).toContainText(chatbot.greetingIntent);
    await expect(reply).not.toContainText(chatbot.fallbackIntent);
  });
});
