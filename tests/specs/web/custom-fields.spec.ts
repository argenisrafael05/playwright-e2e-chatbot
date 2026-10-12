import { expect, test } from "../../fixtures/pages.fixture";
import { newCustomFields } from "../../support/test-data";

test.describe("Custom fields", () => {
  test.beforeEach(async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await expect(
      myInfoPage.personalDetailsHeading,
      "the saved session is still valid",
    ).toBeVisible();
    // The forms load the current data after the page; anything typed earlier would be overwritten.
    await expect(myInfoPage.firstName).not.toHaveValue("");
  });

  test("saves the custom fields and keeps them after reloading", async ({
    myInfoPage,
  }) => {
    const fields = newCustomFields();
    // Anyone can delete this field in the shared demo.
    await expect(myInfoPage.testField, "the demo has Test_Field").toBeVisible();

    await myInfoPage.fillCustomFields(fields);
    await myInfoPage.saveCustomFields();
    await expect(myInfoPage.savedMessage).toBeVisible();

    await myInfoPage.page.reload({ waitUntil: "domcontentloaded" });
    await expect(myInfoPage.bloodType).toHaveText(fields.bloodType);
    await expect(myInfoPage.testField).toHaveValue(fields.testField);
  });
});
