import { defineConfig, devices } from "@playwright/test";
import { sessionFile } from "./tests/support/test-data";

const orangeHrm = {
  ...devices["Desktop Chrome"],
  baseURL: "https://opensource-demo.orangehrmlive.com",
};

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
      name: "setup",
      testDir: "./tests/setup",
      testMatch: /.*\.setup\.ts/,
      timeout: 60_000,
      use: orangeHrm,
    },
    {
      name: "web",
      testDir: "./tests/specs/web",
      dependencies: ["setup"],
      // The demo is shared and slows down with several sessions at once, and the tests use the same user.
      workers: 1,
      timeout: 60_000,
      use: { ...orangeHrm, storageState: sessionFile },
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
