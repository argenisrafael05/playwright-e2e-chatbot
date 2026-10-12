# playwright-e2e-chatbot

Playwright and TypeScript tests for the OrangeHRM demo and a real chatbot, run by a GitHub Actions pipeline that publishes the report. The chatbot is the tricky part, because it's a third-party bot and it never answers the same way twice.

## What's tested

- OrangeHRM: login, the menu, My Info, personal details, custom fields, attachments and logout.
- The ChatBot.com sample chat: the page, the bot's name, a quick reply and the answer to "Hola".

Both sites are public demos, so a run depends on them. If one is down, the report shows which page didn't load.

## Stack

- Playwright 1.63 with TypeScript
- ESLint and Prettier
- GitHub Actions and GitHub Pages

## How to run it

You need Node 24 (the version is in `.nvmrc`).

```bash
nvm use
npm ci
npx playwright install chromium
npm test
```

On Linux, add `--with-deps` to the install command. The OrangeHRM tests log in with the demo's public user, and you can use another one with `ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD`.

## Scripts

| Command                                 | What it does                         |
| --------------------------------------- | ------------------------------------ |
| `npm test`                              | Runs all the tests                   |
| `npx playwright test --project=web`     | Runs only the OrangeHRM tests        |
| `npx playwright test --project=chatbot` | Runs only the chatbot tests          |
| `npm run test:smoke`                    | Runs only the `@smoke` tests         |
| `npm run verify`                        | Formatting, types, linting and tests |
| `npx playwright show-report`            | Opens the last report                |

## Pipeline

It runs on every push to `main`, or by hand from the Actions tab. First it checks formatting, types and linting. Then it runs the OrangeHRM and chatbot tests in parallel, merges both results into one report and publishes it on GitHub Pages, even if one part fails. Each failure comes with a screenshot and a trace.

In CI, a failing test gets one retry, and if it only passes on the second try it shows up as flaky instead of green. Hiding that would make the report lie.

## Structure

```text
tests/
  setup/      logs in once and saves the session
  specs/      the tests, for web and chatbot
  pages/      page objects
  fixtures/   gives the tests their page objects
  support/    test data and the image for attachments
docs/         requirements, test analysis and decisions
```

## Decisions

- The chatbot is a real third-party bot, on purpose. Its replies change and nobody here controls them, and that's the real challenge. So the test checks that the first message after "Hola" is a greeting, whatever the wording.
- A test passes or fails on what the page shows. A failed login is a login page that's still there, and the error message only backs it up.
- Locators go by role, label or text, the way a user finds things. CSS shows up only where the page gives nothing better, and the code says why.
- The web tests log in once and share the session. Login and logout start from scratch, so a logout never touches the shared one.
- Other people use the same demo. Every run uses new data, deletes only what it created and runs one test at a time.

The full list is in [docs/decisions.md](docs/decisions.md).

## Docs

- [Requirements](docs/requirements.md)
- [Test analysis](docs/test-analysis.md)
- [Decisions](docs/decisions.md)

## Resumen en español

Pruebas con Playwright y TypeScript para el demo de OrangeHRM y un chatbot real. GitHub Actions las corre en cada cambio y publica el reporte. Lo difícil es el bot, porque no es nuestro y nunca contesta igual, así que la prueba valida la intención de la respuesta y no el texto exacto. Para correrlas necesitas Node 24 y estos comandos: `nvm use`, `npm ci`, `npx playwright install chromium` y `npm test`.
