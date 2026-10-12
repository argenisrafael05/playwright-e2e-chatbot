import { expect, test } from "../../fixtures/pages.fixture";
import { formatDate, newPersonalDetails } from "../../support/test-data";

test.describe("Personal details", () => {
  test.beforeEach(async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await expect(
      myInfoPage.personalDetailsHeading,
      "the saved session is still valid",
    ).toBeVisible();
    // The form loads the current data after the page; anything typed earlier would be overwritten.
    await expect(myInfoPage.firstName).not.toHaveValue("");
  });

  test("saves the personal details and keeps them after reloading", async ({
    myInfoPage,
  }) => {
    const details = newPersonalDetails();

    await myInfoPage.fillPersonalDetails(details);
    await myInfoPage.savePersonalDetails();
    await expect(myInfoPage.savedMessage).toBeVisible();

    await myInfoPage.page.reload({ waitUntil: "domcontentloaded" });
    const format = await myInfoPage.dateFormat();
    await expect(myInfoPage.firstName).toHaveValue(details.firstName);
    await expect(myInfoPage.middleName).toHaveValue(details.middleName);
    await expect(myInfoPage.lastName).toHaveValue(details.lastName);
    await expect(myInfoPage.employeeId).toHaveValue(details.employeeId);
    await expect(myInfoPage.otherId).toHaveValue(details.otherId);
    await expect(myInfoPage.driversLicense).toHaveValue(details.driversLicense);
    await expect(myInfoPage.licenseExpiryDate).toHaveValue(
      formatDate(details.licenseExpiryDate, format),
    );
    await expect(myInfoPage.dateOfBirth).toHaveValue(
      formatDate(details.dateOfBirth, format),
    );
    await expect(myInfoPage.nationality).toHaveText(details.nationality);
    await expect(myInfoPage.maritalStatus).toHaveText(details.maritalStatus);
    await expect(myInfoPage.gender(details.gender)).toBeChecked();
  });
});
