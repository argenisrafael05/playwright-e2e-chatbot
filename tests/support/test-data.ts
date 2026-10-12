export const credentials = {
  username: process.env.ORANGEHRM_USERNAME ?? "Admin",
  password: process.env.ORANGEHRM_PASSWORD ?? "admin123",
};

// The logged-in session, saved once by the setup project and reused by the web tests.
export const sessionFile = "playwright/.auth/admin.json";

export const routes = {
  login: "/web/index.php/auth/login",
  dashboard: "/web/index.php/dashboard/index",
  myInfo: "/web/index.php/pim/viewMyDetails",
  personalDetails: "/web/index.php/pim/viewPersonalDetails/",
  chatbotSample: "/preview-embedded/",
};

export const messages = {
  invalidCredentials: "Invalid credentials",
  required: "Required",
  // The title of every success notice; the line below it is not the same in every form.
  saved: "Success",
};

export const menuOptions = [
  "Admin",
  "PIM",
  "Leave",
  "Time",
  "Recruitment",
  "My Info",
  "Performance",
  "Dashboard",
  "Directory",
  "Maintenance",
  "Claim",
  "Buzz",
];

// The demo is shared, so every run writes values nobody else uses.
function uniqueSuffix() {
  return Date.now().toString(36).slice(-6);
}

export function newPersonalDetails() {
  const suffix = uniqueSuffix();
  return {
    firstName: "Ana",
    middleName: `QA${suffix}`,
    lastName: "Tester",
    // Kept at 8 characters: the demo doesn't say its limit and the id must be unique.
    employeeId: `E${Date.now().toString().slice(-7)}`,
    otherId: `OID-${suffix}`,
    driversLicense: `DL-${suffix}`,
    // Days above 12 can't pass for a month, so a date in the wrong format is never saved.
    licenseExpiryDate: { year: 2031, month: 6, day: 15 },
    dateOfBirth: { year: 1994, month: 3, day: 23 },
    nationality: "Mexican",
    maritalStatus: "Married",
    gender: "Female",
  };
}

type DateParts = { year: number; month: number; day: number };

// Writes a date in the format a field shows as its hint, such as "yyyy-mm-dd" or "dd-mm-yyyy".
export function formatDate({ year, month, day }: DateParts, format: string) {
  return format
    .replace("yyyy", String(year))
    .replace("mm", String(month).padStart(2, "0"))
    .replace("dd", String(day).padStart(2, "0"));
}

export function newCustomFields() {
  return {
    bloodType: "O+",
    testField: `TF-${uniqueSuffix()}`,
  };
}

export const attachment = {
  file: "tests/support/files/e2e-attachment.png",
  fileName: "e2e-attachment.png",
  // Every comment the tests write starts with this, so leftovers are found and nobody else's is touched.
  commentPrefix: "e2e-attachment-",
};

export function newAttachmentComment() {
  return `${attachment.commentPrefix}${uniqueSuffix()}`;
}

export const chatbot = {
  botName: "ChatBot",
  greeting: "Hola",
  // Informational: it never leads to sales or contact, so no person is bothered.
  quickReply: /Build AI chatbot/,
  maxReplyWait: 15_000,
  // The bot words its greeting differently each time, so the reply is checked by intent.
  greetingIntent:
    /\b(hi|hello|hey|hola|welcome)\b|good to see|great to see|nice to meet/i,
  fallbackIntent: /sorry|didn't (understand|get)|don't understand|try again/i,
};
