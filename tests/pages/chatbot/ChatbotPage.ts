import type { FrameLocator, Locator, Page } from "@playwright/test";
import { routes } from "../../support/test-data";

export class ChatbotPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly chatFrame: Locator;
  readonly chat: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Embedded Chat Widget" });
    // The vendor renders a second, hidden frame with the same title, so the frame is found by its name.
    this.chatFrame = page.locator('iframe[name="chat-widget"]');
    this.chat = this.chatFrame.contentFrame();
  }

  async goto() {
    await this.page.goto(routes.chatbotSample);
  }
}
