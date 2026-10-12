import { expect, test } from "../../fixtures/pages.fixture";
import { attachment, newAttachmentComment } from "../../support/test-data";

test.describe("Attachments", () => {
  test.beforeEach(async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await expect(
      myInfoPage.attachments.heading,
      "the saved session is still valid",
    ).toBeVisible();
  });

  // Runs even when the test fails halfway, so the shared demo is left as it was.
  test.afterEach(async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.attachments.deleteLeftovers(attachment.commentPrefix);
  });

  test("uploads, edits, downloads and deletes an image", async ({
    myInfoPage,
  }) => {
    const { attachments } = myInfoPage;
    const comment = newAttachmentComment();
    const editedComment = newAttachmentComment() + "-edited";

    // The success notices linger and stack, so each step is checked in the table, not in a notice.
    await attachments.add(attachment.file, comment);
    await expect(attachments.row(comment)).toContainText(attachment.fileName);

    await attachments.openEdit(comment);
    // The edit form loads the attachment after it opens; anything typed earlier would be overwritten.
    await expect(attachments.comment).toHaveValue(comment);
    await attachments.replaceComment(editedComment);
    await expect(attachments.row(editedComment)).toBeVisible();
    await expect(attachments.row(comment)).toHaveCount(0);

    const download = await attachments.download(editedComment);
    expect(download.suggestedFilename()).toBe(attachment.fileName);

    await attachments.delete(editedComment);
    // While the table reloads it shows no rows at all, so the absence is checked after reloading.
    await myInfoPage.page.reload({ waitUntil: "domcontentloaded" });
    await expect(attachments.recordsFound).toBeVisible();
    await expect(attachments.row(editedComment)).toHaveCount(0);
  });
});
