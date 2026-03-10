import { test, expect } from "@playwright/test";

test("home page loads and shows artist brand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Ewura Abena" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Albums" })).toBeVisible();
});
