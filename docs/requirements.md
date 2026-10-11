# Requirements

| Version | Date | Change |
| --- | --- | --- |
| 0.1 | October 2026 | Initial version |
| 0.2 | October 2026 | Static review: verifiable acceptance criteria, extra negative login cases and documented assumptions ([test analysis](test-analysis.md)) |

## 1. Vision

End-to-end automated tests for two systems: a human resources web platform and a chatbot inside a website. They run in a CI pipeline every time changes are pushed or when triggered manually, and they leave a report that shows what happened and, when something fails, why.

Neither system is ours: one is a shared public demo and the other is a third-party bot. That is why the tests have to stay stable even though we don't control what they test.

## 2. Users

**Of what we test**

| User | Goal |
| --- | --- |
| Employee using OrangeHRM | Log in, review and update their information, upload documents and log out |
| Visitor of a website with a chatbot | Find the bot, greet it and get a reply |

**Of what we build (the tests and their pipeline)**

| User | Goal |
| --- | --- |
| Team QA | Know after every change, without manual testing, whether everything still works, and when something fails, see why |
| Technical reviewer | Clone, run and understand the project without errors |

## 3. Scope

**Systems under test:**

- [OrangeHRM public demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login): shared by anyone who uses it, so other people can change its data, and it gets reset.
- [ChatBot.com sample chat](https://www.chatbot.com/preview-embedded/): a real bot inside an iframe that can change without notice.

**Includes:** on the web platform, login, My Info, personal details, custom fields, attachments and logout; on the chatbot, finding it and greeting it; and the pipeline with its published report. Also, stability measured by repeating the tests.

**Out of scope for now:** a daily scheduled run, an AI bot, other OrangeHRM modules, other browsers and mobile devices, and accessibility, visual or performance tests.

**Constraints:** Playwright with TypeScript, the Page Object Model pattern, Git and GitHub, a CI/CD pipeline and a README.

## 4. Epics

| Epic | Description | Stories |
| --- | --- | --- |
| E1. Web platform | What an employee does in OrangeHRM | US-01 to US-06 |
| E2. Chatbot | What a visitor does with the bot | US-07 and US-08 |
| E3. The tests | What the QA and the reviewer need | US-09 and US-10 |

## 5. User stories

Priority uses MoSCoW: **Must** (required), **Should** (important) and **Could** (nice to have).

The acceptance criteria describe what has to be observed, not how the tests find it on the page. That is defined in the locator and assertion strategy of the [test analysis](test-analysis.md).

### E1. Web platform

**US-01 Log in** · Must

As an employee, I want to log in to OrangeHRM so that I can use the system.

- With a wrong password, a wrong username or empty fields, the dashboard can't be reached: the login page stays, with its form visible.
- A message explains the problem: invalid credentials, or which fields are required.
- With valid credentials, the dashboard page is shown.

**US-02 View my information** · Must

As an employee, I want to open My Info so that I can review my data.

- All the menu options of the logged-in user exist on the dashboard.
- The My Info section can be opened.
- The Personal Details section is shown.

**US-03 Update my personal details** · Must

As an employee, I want to update my personal details so that my information stays up to date.

- The fields Employee Full Name (first, middle and last name), Employee Id, Driver's License Number, Other Id, License Expiry Date, Nationality, Marital Status, Date of Birth and Gender are filled in with data that respects the demo's formats and limits.
- After clicking save, a success confirmation is shown, and the values are still there after reloading the page.

**US-04 Fill in custom fields** · Must

As an employee, I want to fill in my custom fields so that my information is complete.

- The fields Blood Type and Test_Field are filled in. If one of them doesn't exist in the demo, the test says so clearly.
- After clicking save, a success confirmation is shown, and the values are still there after reloading the page.

**US-05 Manage my attachments** · Must

As an employee, I want to manage the attachments on my profile so that my documents stay organized.

- An image can be uploaded, and it appears in the attachments list.
- Its comment can be edited, and the new comment is shown.
- It can be downloaded, and the downloaded file has the same name as the uploaded one.
- It can be deleted after confirming, and it no longer appears in the list.
- No attachment created by the tests is left behind, even if a test fails halfway.

**US-06 Log out** · Must

As an employee, I want to log out so that I can leave the system.

- The user can leave the dashboard: the login page is shown.
- After logging out, the dashboard can't be opened without logging in again.

### E2. Chatbot

**US-07 Find the bot** · Must

As a visitor, I want to find the chatbot on the website so that I can start a conversation.

- The page that loads is the sample chat page.
- The chat is present and visible inside the page.
- The bot's iframe can be used: the button that opens the chat opens it, and an informational quick reply gets an answer. Buttons that lead to a person (sales or contact) are never used.
- The bot shows its name, and it is the expected one.

**US-08 Greet the bot** · Must

As a visitor, I want to greet the bot so that I get its reply.

- Each test starts with no previous conversation and with the chat input available.
- The text "Hola" is typed in the chatbot input and sent.
- The reply that counts is the bot's first message after "Hola", not its automatic welcome.
- The reply is correct when it matches the intent: it isn't empty, it isn't an error or an "I didn't understand", and it is a greeting, in any language.
- If no reply arrives within the maximum wait time, the test says the bot didn't reply.

### E3. The tests

**US-09 Run everything in the pipeline** · Must

As a QA, I want the pipeline to run the web platform and chatbot tests and leave me a report, so that I know whether something broke without testing by hand.

- It runs every time changes are pushed to `main` and when triggered manually.
- It first checks linting, formatting and types. If that check fails, the pipeline fails without running the tests.
- It runs the web platform and chatbot tests. If any part fails, the pipeline fails.
- When it finishes, it leaves a report with the results, even if a part failed, and the report says which part failed.
- When a test fails, the report includes a screenshot and the trace to understand why.
- Every run on `main`, manual or from a push, publishes its report on a page, and the README links to it.
- The README explains how the pipeline runs.

**US-10 Run it on my machine** · Must

As a technical reviewer, I want to clone the project and run it by following the README, so that I can evaluate it without asking for help.

- The README explains what the project is, what it needs beforehand, how to install and run it, how it's organized and its key decisions.
- The project can be cloned, installed and run locally without setup errors.
- If one of the sites under test doesn't load, the tests fail saying which one.

## 6. Non-functional requirements

| ID | Requirement | How it is validated |
| --- | --- | --- |
| NFR-01 | The tests are stable when repeated, locally and in the pipeline | The web tests pass 3 times in a row and the chatbot tests 2 times, with no failures. In the pipeline, no test is marked as flaky |
| NFR-02 | The tests run on Chromium, the browser bundled with Playwright | Playwright configuration and a pipeline run |
| NFR-03 | The code passes linting, formatting and type checking | ESLint, Prettier and TypeScript with no errors, checked in the pipeline before the tests |
| NFR-04 | The tests don't depend on data that others can change in the demo, and they clean up what they create | Unique data per run, and the attachments test checks that none of its attachments remain |

## 7. Definition of done

A story is done when:

- It meets its acceptance criteria.
- It has automated tests that pass and stay stable when repeated, in CI mode locally and, once published, in the pipeline.
- Its important tests were proven to fail by breaking something on purpose.
- It passed code review.
- It appears in the traceability matrix.
- It was approved and merged into `main`.
