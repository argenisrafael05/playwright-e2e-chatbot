import type { Download, Locator, Page } from "@playwright/test";

export class AttachmentsSection {
  readonly page: Page;
  readonly heading: Locator;
  readonly addButton: Locator;
  readonly form: Locator;
  readonly file: Locator;
  readonly comment: Locator;
  readonly saveButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly recordsFound: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Attachments" });
    this.addButton = page.getByRole("button", { name: "Add" });
    // The page has several forms with a "Save" button, so this one is told apart by its hint.
    this.form = page.locator("form").filter({ hasText: "Accepts up to 1MB" });
    // The browser exposes the file input as a "Choose File" button.
    this.file = this.form.getByRole("button", { name: "Choose File" });
    this.comment = this.form.getByRole("textbox", {
      name: "Type comment here",
    });
    this.saveButton = this.form.getByRole("button", { name: "Save" });
    this.confirmDeleteButton = page
      .getByRole("dialog")
      .getByRole("button", { name: "Yes, Delete" });
    this.recordsFound = page.getByText(/Records? Found/);
  }

  row(comment: string) {
    return this.page.getByRole("row").filter({
      has: this.page.getByRole("cell", { name: comment, exact: true }),
    });
  }

  // The row actions are icon buttons without a name, so each one is found by its icon.
  editButton(row: Locator) {
    return row.locator("button:has(.bi-pencil-fill)");
  }

  deleteButton(row: Locator) {
    return row.locator("button:has(.bi-trash)");
  }

  downloadButton(row: Locator) {
    return row.locator("button:has(.bi-download)");
  }

  async add(filePath: string, comment: string) {
    await this.addButton.click();
    await this.file.setInputFiles(filePath);
    await this.comment.fill(comment);
    await this.saveButton.click();
  }

  async openEdit(comment: string) {
    await this.editButton(this.row(comment)).click();
  }

  async replaceComment(text: string) {
    await this.comment.fill(text);
    await this.saveButton.click();
  }

  async download(comment: string): Promise<Download> {
    const download = this.page.waitForEvent("download");
    await this.downloadButton(this.row(comment)).click();
    return download;
  }

  async delete(comment: string) {
    await this.deleteButton(this.row(comment)).click();
    await this.confirmDelete();
  }

  // The table reloads while a row is deleted, so the server's answer is what confirms it.
  async confirmDelete() {
    const deleted = this.page.waitForResponse(
      (response) =>
        response.request().method() === "DELETE" &&
        response.url().includes("/attachments"),
    );
    await this.confirmDeleteButton.click();
    await deleted;
  }

  // Removes every attachment these tests left behind, never anyone else's.
  async deleteLeftovers(commentPrefix: string) {
    await this.recordsFound.waitFor();
    const ours = this.page.getByRole("row").filter({ hasText: commentPrefix });
    const left = await ours.count();
    for (let i = 0; i < left; i++) {
      await this.deleteButton(ours.first()).click();
      await this.confirmDelete();
    }
  }
}
