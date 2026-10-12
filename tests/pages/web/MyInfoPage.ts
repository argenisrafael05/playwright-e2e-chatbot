import type { Locator, Page } from "@playwright/test";
import { AttachmentsSection } from "./AttachmentsSection";
import {
  formatDate,
  messages,
  newCustomFields,
  newPersonalDetails,
  routes,
} from "../../support/test-data";

type PersonalDetails = ReturnType<typeof newPersonalDetails>;
type CustomFields = ReturnType<typeof newCustomFields>;

export class MyInfoPage {
  readonly page: Page;
  readonly personalDetailsHeading: Locator;
  readonly personalDetailsForm: Locator;
  readonly firstName: Locator;
  readonly middleName: Locator;
  readonly lastName: Locator;
  readonly employeeId: Locator;
  readonly otherId: Locator;
  readonly driversLicense: Locator;
  readonly licenseExpiryDate: Locator;
  readonly dateOfBirth: Locator;
  readonly nationality: Locator;
  readonly maritalStatus: Locator;
  readonly customFieldsForm: Locator;
  readonly bloodType: Locator;
  readonly testField: Locator;
  readonly savedMessage: Locator;
  readonly attachments: AttachmentsSection;

  constructor(page: Page) {
    this.page = page;
    this.personalDetailsHeading = page.getByRole("heading", {
      name: "Personal Details",
    });
    this.personalDetailsForm = page
      .locator("form")
      .filter({ hasText: "Employee Full Name" });
    this.firstName = page.getByRole("textbox", { name: "First Name" });
    this.middleName = page.getByRole("textbox", { name: "Middle Name" });
    this.lastName = page.getByRole("textbox", { name: "Last Name" });
    this.employeeId = this.field("Employee Id").getByRole("textbox");
    this.otherId = this.field("Other Id").getByRole("textbox");
    this.driversLicense = this.field("Driver's License Number").getByRole(
      "textbox",
    );
    this.licenseExpiryDate = this.field("License Expiry Date").getByRole(
      "textbox",
    );
    this.dateOfBirth = this.field("Date of Birth").getByRole("textbox");
    this.nationality = this.dropdown("Nationality");
    this.maritalStatus = this.dropdown("Marital Status");
    this.customFieldsForm = page
      .locator("form")
      .filter({ hasText: "Blood Type" });
    this.bloodType = this.dropdown("Blood Type");
    this.testField = this.field("Test_Field").getByRole("textbox");
    this.savedMessage = page.getByText(messages.saved, { exact: true });
    this.attachments = new AttachmentsSection(page);
  }

  // The labels aren't linked to their inputs, so each field is found inside the group of its visible label.
  field(label: string) {
    return this.page.locator(".oxd-input-group", {
      has: this.page.getByText(label, { exact: true }),
    });
  }

  // OrangeHRM's dropdowns are plain divs without a role.
  dropdown(label: string) {
    return this.field(label).locator(".oxd-select-text");
  }

  gender(name: string) {
    return this.page.getByRole("radio", { name });
  }

  async goto() {
    await this.page.goto(routes.myInfo, { waitUntil: "domcontentloaded" });
  }

  // The date format is a demo setting anyone can change, so dates follow the hint the field shows.
  async dateFormat() {
    const format = await this.licenseExpiryDate.getAttribute("placeholder");
    if (!format) throw new Error("the date field shows no format hint");
    return format;
  }

  async choose(select: Locator, option: string) {
    await select.click();
    await this.page.getByRole("option", { name: option, exact: true }).click();
  }

  async fillPersonalDetails(details: PersonalDetails) {
    const format = await this.dateFormat();
    await this.firstName.fill(details.firstName);
    await this.middleName.fill(details.middleName);
    await this.lastName.fill(details.lastName);
    await this.employeeId.fill(details.employeeId);
    await this.otherId.fill(details.otherId);
    await this.driversLicense.fill(details.driversLicense);
    await this.licenseExpiryDate.fill(
      formatDate(details.licenseExpiryDate, format),
    );
    await this.choose(this.nationality, details.nationality);
    await this.choose(this.maritalStatus, details.maritalStatus);
    await this.dateOfBirth.fill(formatDate(details.dateOfBirth, format));
    // The radio sits under a styled circle, so it is chosen through its label, as a user does.
    await this.page.getByText(details.gender, { exact: true }).click();
  }

  async savePersonalDetails() {
    await this.personalDetailsForm
      .getByRole("button", { name: "Save" })
      .click();
  }

  async fillCustomFields(fields: CustomFields) {
    await this.choose(this.bloodType, fields.bloodType);
    await this.testField.fill(fields.testField);
  }

  async saveCustomFields() {
    await this.customFieldsForm.getByRole("button", { name: "Save" }).click();
  }
}
