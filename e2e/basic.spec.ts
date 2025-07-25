import { test, expect } from "@playwright/test";
import * as fs from "fs";

const responseMap: Record<string, { contentType: string; body: string }> = {
  // File-based JSON mocks
  "http://localhost:5005/v1/watchdog/list": {
    contentType: "application/json",
    body: fs.readFileSync("./e2e/mocks/watchdog_find.json", "utf-8"),
  },
  "http://localhost:5005/v1/watchdog/assess": {
    contentType: "application/json",
    body: fs.readFileSync("./e2e/mocks/watchdog_assess.json", "utf-8"),
  },
  "http://localhost:5003/v1/events/subscribe-matching": {
    contentType: "application/json",
    body: fs.readFileSync("./e2e/mocks/events_subscribe-matching.ndjson", "utf-8"),
  },
  "http://localhost:5001/v1/store/find": {
    contentType: "application/json",
    body: fs.readFileSync("./e2e/mocks/store_find.ndjson", "utf-8"),
  },

  // Service discovery responses (plain text wrapped in full mock object)
  "Tinkwell.Store": {
    contentType: "text/plain",
    body: "http://localhost:5001",
  },
  "Tinkwell.Watchdog": {
    contentType: "text/plain",
    body: "http://localhost:5005",
  },
  "Tinkwell.EventsGateway": {
    contentType: "text/plain",
    body: "http://localhost:5003",
  },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/*", async route => {
    const url = route.request().url();
    // console.log("Intercepted:", url);

    // Try exact match first
    let mock = responseMap[url];

    // Then fallback to query param match
    if (!mock && url.includes("/api/v1/services?name=")) {
      const nameParam = new URL(url).searchParams.get("name");
      mock = responseMap[nameParam!];
    }

    if (mock) {
      await route.fulfill({
        status: 200,
        contentType: mock.contentType,
        body: mock.body,
      });
    } else {
      await route.continue();
    }
  });

  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()}`);
    console.log(` Method: ${request.method()}`);
    console.log(` Failure Text: ${request.failure()?.errorText}`);
  });

  // page.on('console', msg => {
  //   console.log(`[${msg.type()}] ${msg.text()}`);
  // });

  // Navigate to the application
  await page.goto("/");
});

test("Dashboard page loads and displays expected content", async ({ page }) => {
  await page.locator('nav[aria-label="Desktop"] a', { hasText: "Dashboard" }).click();
  await expect(page.locator('text="CPU"')).toBeVisible();
  await expect(page.locator('text="Memory"')).toBeVisible();
  await expect(page.locator('text="Threads"')).toBeVisible();
});

test("Health page loads and displays expected content", async ({ page }) => {
  await page.locator('nav[aria-label="Desktop"] a', { hasText: "Health" }).click();
  await expect(page.locator('text="Runner"')).toBeVisible();
  await expect(page.locator("text=Supervisor")).toBeVisible();
  await expect(page.locator("text=Acceptable")).toHaveCount(4);
});

test("Events page loads and displays expected content", async ({ page }) => {
  await page.locator('nav[aria-label="Desktop"] a', { hasText: "Events" }).click();
  await expect(page.locator("text=TRIGGERED")).toBeVisible();
  await expect(page.locator("text=CLEARED")).toBeVisible();
});

test("Measures page loads and displays expected content", async ({ page }) => {
  await page.locator('nav[aria-label="Desktop"] a', { hasText: "Measures" }).click();
  await expect(page.locator('text="Name"')).toBeVisible();
  await expect(page.locator('text="Electric Potential"')).toBeVisible();
  await expect(page.locator('text="Electric Current"')).toBeVisible();
  await expect(page.locator('text="Power"')).toBeVisible();
});