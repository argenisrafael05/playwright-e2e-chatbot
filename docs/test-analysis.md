# Test analysis

Version 0.1 · October 2026

Test basis: [requirements](requirements.md) v0.2 and the two systems under test as they are publicly available.

## 1. Static review of the requirements

Findings from the review of the requirements v0.1 and how they were resolved in v0.2.

Types: ambiguity, gap, contradiction and not verifiable.

| ID | Requirement | Finding | Type | Resolution |
| --- | --- | --- | --- | --- |
| SR-01 | US-01 | "The dashboard can't be reached" doesn't say how it is checked | Not verifiable | The login page stays with its form visible. The error message is checked as support |
| SR-02 | US-01 | Only one negative case | Gap | Three equivalence partitions: wrong password, wrong username and empty fields |
| SR-03 | US-01 | "The dashboard is reached" doesn't say how it is checked | Not verifiable | The dashboard page is shown. How it is recognized comes from the locator analysis |
| SR-04 | US-02 | "The menu options exist" doesn't say which ones | Ambiguity | All the menu options of the logged-in user, kept in the test data |
| SR-05 | US-02 | "The Personal Details text is obtained": read it or check it? | Ambiguity | The Personal Details section is shown |
| SR-06 | US-03, US-04 | "The save button is clicked" has no expected result | Gap | A success confirmation is shown and the values are still there after reloading |
| SR-07 | US-03 | "Employee Full Name" is three fields | Ambiguity | First, middle and last name are filled in |
| SR-08 | US-03 | Dates and the Employee Id have formats and limits that aren't stated | Gap | The data respects the demo's formats and limits. Assumption A-01 |
| SR-09 | US-04 | Test_Field is a custom field that anyone can delete in the shared demo | Gap | If it doesn't exist, the test says so clearly. Assumption A-02 |
| SR-10 | US-05 | "It can be edited": the comment or the file? | Ambiguity | Its comment is edited and the new one is shown |
| SR-11 | US-05 | "It can be downloaded" doesn't say what is checked | Not verifiable | The downloaded file has the same name as the uploaded one |
| SR-12 | US-05 | "It can be deleted" doesn't say how it is checked, and a failing test leaves the attachment behind | Not verifiable | Deleted after confirming and gone from the list. Any attachment left by the tests is removed at the end |
| SR-13 | US-06 | "The user can leave the dashboard" doesn't say how it is checked | Not verifiable | The login page is shown, and the dashboard can't be opened without logging in again |
| SR-14 | US-07 | "The correct website is reached" doesn't say how it is recognized | Not verifiable | The page that loads is the sample chat page |
| SR-15 | US-07 | "The chatbot is found inside the website" doesn't say what is checked | Not verifiable | The chat is present and visible inside the page |
| SR-16 | US-07 | "Its buttons can be clicked": which ones? Some lead to a person | Ambiguity | The button that opens the chat and one informational quick reply, each checked by its effect. Buttons that lead to sales or contact are never used |
| SR-17 | US-07 | "The bot's name can be obtained": read it or check it? | Ambiguity | It is the expected name, kept in the test data. A rename by the vendor is a change worth knowing |
| SR-18 | US-07, US-08 | The chat remembers the conversation between visits, and the input disappears when a conversation ends | Gap | Each test starts with no previous conversation and with the input available |
| SR-19 | US-08 | "The reply is validated as correct": what is correct? | Ambiguity | By intent, not by exact text: a new bot message that isn't empty, isn't an error or an "I didn't understand", and is a greeting, in any language |
| SR-20 | US-08 | The bot greets on its own when the chat opens | Ambiguity | The reply that counts is the bot's first message after "Hola" |
| SR-21 | US-08 | The bot takes a different time to reply every time | Gap | The test waits up to a maximum time and, if nothing arrives, says the bot didn't reply. Assumption A-03 |
| SR-22 | US-07, US-08 | The site belongs to a third party and can go down or change | Gap | If it doesn't load, the test says so clearly, and the chatbot tests run in their own job. Assumption A-04 |
| SR-23 | US-09 | "Every time changes are pushed to main", but the repository is published at the end | Contradiction | Assumption A-05 |
| SR-24 | US-09 | What happens to the pipeline if one part fails? | Gap | The pipeline fails, and the report says which part failed |
| SR-25 | US-09 | Videos were planned, but the criterion only mentions screenshot and trace | Contradiction | Screenshot and trace only. The trace already records every step |
| SR-26 | US-09 | What happens to the report of a manual run? | Gap | Every run on `main`, manual or from a push, publishes its report |
| SR-27 | US-09 | Is there a report if one part fails halfway? | Gap | The report is generated anyway, with what ran |
| SR-28 | US-10 | "Run locally without errors": does a site that is down count as an error? | Ambiguity | Without setup errors. The README lists the prerequisites, and if a site doesn't load the tests say which one |
| SR-29 | US-10 | "Understand the project" is vague | Ambiguity | The README explains what the project is, how to run it, how it's organized and its key decisions |
| SR-30 | NFR-01 | No number of repetitions, and repeating a lot is unfair to the third-party bot | Gap | Web tests 3 times in a row, chatbot tests 2 times. No test marked as flaky in the pipeline |
| SR-31 | NFR-03 | It doesn't say where it is checked | Gap | In the pipeline, before the tests |
| SR-32 | NFR-04 | How is the cleanup checked, and are the original personal details restored? | Gap | The attachments test checks that none of its attachments remain. Assumption A-06 |
| SR-33 | Definition of done | It doesn't say where the tests pass or that they must be able to fail | Gap | In CI mode locally and, once published, in the pipeline. Important tests are proven to fail by breaking something on purpose |

### Assumptions

Open questions that would go to the client in a real team. They are written down and checked as stated.

| ID | Assumption | How it is checked |
| --- | --- | --- |
| A-01 | The demo's date format and the Employee Id limits are the ones observed on the page | Locator analysis of the personal details screen |
| A-02 | The custom field Test_Field exists in the demo | On every run; if it is missing, the test says so |
| A-03 | The bot replies within 15 seconds | On every run; if not, the test says the bot didn't reply |
| A-04 | Both sites are available. If the bot changes completely, it is replaced and this analysis is updated | On every run; if a site doesn't load, the test says which one |
| A-05 | The pipeline runs for real once the repository is published. Until then, each phase is verified in CI mode locally | First pipeline run after publishing |
| A-06 | The demo user's original personal details are not restored: the demo is shared and resets, and our data is unique per run | Not applicable |

## 2. Test scope

**Tested:** US-01 to US-10 and NFR-01 to NFR-04, on Chromium, locally and in GitHub Actions.

**Not tested:** what the requirements leave out of scope, and the internals of OrangeHRM and ChatBot.com. No load is put on the third-party systems.

**Test types:** a few smoke tests that run first and confirm that both sites are up and the login works; end-to-end tests through the UI of both systems; pipeline checks (linting, formatting and types); and stability by repetition.

## 3. Locator and assertion strategy

- **The state of the system decides whether a test passed; messages are checked as support.** A failed login is a login page that is still there with its form visible; the error message only supports it.
- **Elements are located the way a user sees them,** in this order: role with its accessible name, label, placeholder and text. CSS only when nothing else is stable, and with a reason.
- **Inside the third-party iframe,** the frame is located by a stable attribute and, inside it, the same user-facing locators are used. Never position-based chains.
- **Before automating each screen,** a locator analysis on the real page: what is shown, which elements are unique and stable, and which state proves the outcome.
- **Assertions wait on their own;** no fixed waits. Each outcome has one decisive assertion and, if useful, supporting ones.
- **The chatbot reply is checked by intent** (SR-19) and is always the first bot message after "Hola" (SR-20).

## 4. How the tests are verified

A test that never fails proves nothing. At the end of every phase, before it is reviewed:

- **Repetition:** the new tests run 3 times in a row on the web and 2 times on the chatbot, with no intermittent failures (NFR-01).
- **CI mode:** they also run with the retries and traces the pipeline uses.
- **Broken on purpose:** the important tests are made to fail on purpose and must fail with a clear message. Since neither system is ours, what changes is the expected value or the data, never the system. Then it is restored.
- **Nothing hidden:** no focused or accidentally skipped tests.
- **One command:** `npm run verify` (formatting, types, linting and tests) is clean.

The evidence of these checks goes into the summary of each phase.

## 5. Risks

The priority comes from crossing impact and probability. High priority is automated first.

| ID | Risk | Impact | Probability | Priority | Requirement |
| --- | --- | --- | --- | --- | --- |
| R-01 | Other users change or delete demo data during a run | High | Medium | High | US-03, US-04, NFR-04 |
| R-02 | The demo resets, slows down or is unavailable | High | Medium | High | E1 |
| R-03 | The third-party bot changes its page or flow, or disappears | High | Medium | High | E2 |
| R-04 | The test reads the automatic welcome as if it were the reply and passes without a real answer | High | High | High | US-08 |
| R-05 | Timing makes tests flaky: an async bot reply or a slow demo | High | High | High | NFR-01 |
| R-06 | Logging out ends the session that other tests share | High | Medium | High | US-06 |
| R-07 | A date or Employee Id in the wrong format makes saving fail | Medium | Medium | Medium | US-03 |
| R-08 | Attachments left by the tests pile up in the shared demo | Medium | Medium | Medium | US-05, NFR-04 |
| R-09 | The pipeline looks green while something failed, or there is no report when it fails | High | Low | Medium | US-09 |
| R-10 | A bot button sends the conversation to a real person | Medium | Low | Low | US-07 |
| R-11 | Linting or type errors get into `main` | Low | Medium | Low | NFR-03 |

## 6. Test conditions

### 6.1 Equivalence partitions: login (US-01)

| Partition | Username | Password | Expected result |
| --- | --- | --- | --- |
| Valid credentials | Valid | Valid | The dashboard page is shown |
| Wrong password | Valid | Wrong | The login page stays with its form visible, and an invalid credentials message is shown |
| Wrong username | Wrong | Valid | Same as the wrong password |
| Empty fields | Empty | Empty | The login page stays, and the required fields are flagged |

### 6.2 State transitions: session (US-01, US-06)

States: **Logged out** and **Logged in**.

| Current state | Event | Next state | Expected result |
| --- | --- | --- | --- |
| Logged out | Valid login | Logged in | The dashboard page is shown |
| Logged out | Invalid login | Logged out | The login page stays, with a message |
| Logged in | Logout | Logged out | The login page is shown |
| Logged out, after a logout | Open the dashboard address | Logged out | The login page is shown |

### 6.3 State transitions: an attachment (US-05)

| Current state | Event | Next state | Expected result |
| --- | --- | --- | --- |
| No attachment | Upload an image | Uploaded | It appears in the list |
| Uploaded | Edit its comment | Edited | The new comment is shown |
| Edited | Download it | Edited | The file has the same name |
| Edited | Delete it and confirm | No attachment | It no longer appears in the list |

### 6.4 State transitions: the conversation (US-07, US-08)

| Current state | Event | Next state | Expected result |
| --- | --- | --- | --- |
| Closed | Click the button that opens the chat | Open | The welcome and the quick replies are shown |
| Open | Click an informational quick reply | Answered | The bot answers that option |
| Open | Send "Hola" | Waiting | The message is shown in the conversation |
| Waiting | The bot replies | Answered | The first bot message after "Hola" is a greeting |
| Waiting | Nothing arrives within the maximum time | Waiting | The test fails saying the bot didn't reply |

### 6.5 Error guessing

- Reading the automatic welcome as the reply.
- A previous conversation restored from the browser storage.
- The chat input hidden because the conversation ended.
- A quick reply that ends the conversation before "Hola" is sent.
- The session expired because the demo reset.
- An Employee Id that already exists or is too long.
- A date typed in the wrong format.
- The success confirmation disappearing before it is checked.
- The download not being captured.
- The delete confirmation not being handled.
- The third-party iframe still loading when the test looks inside it.

## 7. Traceability matrix

Each case of the original request maps to a story, its conditions and its spec. Spec names are proposed and may change during construction.

| Requested case | Requirement | Conditions | Spec | Type |
| --- | --- | --- | --- | --- |
| Wrong credentials | US-01 | Partitions: wrong password, wrong username, empty fields | `web/login.spec.ts` | E2E |
| Login | US-01 | Valid credentials, session transitions | `web/login.spec.ts` | E2E |
| My Info | US-02 | Menu options, My Info section, Personal Details | `web/my-info.spec.ts` | E2E |
| Personal Details | US-03 | Full name, data formats, saved and kept after reloading | `web/personal-details.spec.ts` | E2E |
| Custom Fields | US-04 | Blood Type, Test_Field, saved and kept after reloading | `web/custom-fields.spec.ts` | E2E |
| Attachments | US-05 | Attachment transitions, cleanup | `web/attachments.spec.ts` | E2E |
| Logout | US-06 | Session transitions | `web/logout.spec.ts` | E2E |
| Access the URL | US-07 | Sample chat page | `chatbot/chatbot.spec.ts` | E2E |
| Find the bot | US-07 | Chat present and visible | `chatbot/chatbot.spec.ts` | E2E |
| Interact with the iframe | US-07 | Open the chat, quick reply, bot name | `chatbot/chatbot.spec.ts` | E2E |
| Type and send "Hola" | US-08 | Clean start, input available | `chatbot/chatbot.spec.ts` | E2E |
| Receive and validate the reply | US-08 | Intent, first message after "Hola", maximum wait | `chatbot/chatbot.spec.ts` | E2E |
| Pipeline with both suites | US-09 | Quality check first, two jobs, fails if any part fails | GitHub Actions workflow | CI |
| Report | US-09 | Merged report, screenshot and trace, published | GitHub Actions workflow | CI |
| README | US-09, US-10 | Prerequisites, run, pipeline, structure, decisions | `README.md` | Manual review |
| — | NFR-01 | Repetitions, no flaky tests | All | Stability |
| — | NFR-02 | Chromium | Playwright configuration | Configuration |
| — | NFR-03 | Linting, formatting and types | GitHub Actions workflow | CI |
| — | NFR-04 | Unique data, cleanup | `web/attachments.spec.ts`, test data | E2E |

## 8. Manual tests

- The locator analysis of each screen before automating it.
- A review of the README and the published report from a clean clone, before publishing.
- A short exploratory session of 30 minutes on both systems before the final version.
- When choosing the bot's quick reply, a check that it doesn't lead to a person.
- A spelling and wording review of everything people read: the README, the docs, the test names (they show up in the report) and the commit messages, before publishing.

## 9. Phase plan

The order comes from the risks: first an end-to-end flow, then the highest risks.

| Phase | Covers | Done when |
| --- | --- | --- |
| 2 · Base and login | Project setup, `npm run verify`, page objects with fixtures, test data, the smoke tests, US-01 and the workflow file | The login and smoke tests are green and stable, and `npm run verify` is clean |
| 3 · Chatbot | US-07 and US-08 | The chatbot tests are green and stable, with the intent checks |
| 4 · My Info and personal data | US-02, US-03 and US-04, with the shared session | The tests are green and stable, and the data respects the demo's formats |
| 5 · Attachments and logout | US-05 and US-06 | The tests are green and stable, and no attachments are left behind |
| 6 · Pipeline and report | US-09 and the NFR checks | The workflow is complete and verified in CI mode |
| 7 · README | US-10 | A clean clone installs and runs by following the README |

Before publishing, a light final review checks that the phases are consistent with each other and measures the suite: requested cases covered, number of tests and run time, stability, linting and types, and the time from a clean clone to the first run.
