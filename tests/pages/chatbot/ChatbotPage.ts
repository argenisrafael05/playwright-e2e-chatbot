import type { FrameLocator, Locator, Page } from "@playwright/test";
import { routes } from "../../support/test-data";

export class ChatbotPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly chatFrame: Locator;
  readonly chat: FrameLocator;
  readonly chatWithUsButton: Locator;
  readonly botName: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly quickReplies: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Embedded Chat Widget" });
    // The vendor renders a second, hidden frame with the same title, so the frame is found by its id.
    this.chatFrame = page.locator("#chat-widget");
    this.chat = this.chatFrame.contentFrame();
    this.chatWithUsButton = this.chat.getByRole("button", {
      name: "Chat with us",
    });
    this.botName = this.chat.getByRole("heading", { level: 1 });
    this.messageInput = this.chat.getByRole("textbox", {
      name: /write a message/i,
    });
    this.sendButton = this.chat.getByRole("button", { name: "Send a message" });
    this.quickReplies = this.chat.getByRole("group");
  }

  async goto() {
    await this.page.goto(routes.chatbotSample);
  }

  // The chat is ready once the automatic welcome ends with its quick replies.
  async openChat() {
    await this.chatWithUsButton.click();
    await this.quickReplies.first().waitFor();
  }

  async send(text: string) {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  quickReply(name: RegExp) {
    return this.quickReplies.first().getByRole("button", { name });
  }

  // A message row is named after its text; the menu rows are named after their question, so they never match.
  visitorMessage(text: string | RegExp) {
    return this.chat.getByRole("row", { name: text }).first();
  }

  // Messages carry no author marks and the bot's replies sit in another container,
  // so the XPath following axis is the only way to ask for "the next message".
  messageAfter(message: Locator) {
    return message.locator('xpath=following::*[@role="row"][1]');
  }
}
