import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    // Both systems are public and shared, so they are often slower than a local app.
    timeout: 10_000,
  },
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "web",
      testDir: "./tests/specs/web",
      // The demo is shared and slows down with several sessions at once, and the tests use the same user.
      workers: 1,
      timeout: 60_000,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://opensource-demo.orangehrmlive.com",
      },
    },
    {
      name: "chatbot",
      testDir: "./tests/specs/chatbot",
      // A third-party bot: one conversation at a time, to be a good neighbor.
      workers: 1,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://www.chatbot.com",
      },
    },
  ],
});
