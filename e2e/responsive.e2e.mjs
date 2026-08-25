import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const VIEWPORTS = [
  { width: 360, height: 800, name: "phone-360" },
  { width: 390, height: 844, name: "phone-390" },
  { width: 768, height: 1024, name: "tablet-768" },
];

const results = [];
function record(name, passed, detail = "") {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  const browser = await chromium.launch({
    proxy: process.env.HTTPS_PROXY
      ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" }
      : undefined,
  });

  for (const viewport of VIEWPORTS) {
    for (const locale of ["en-US", "ru-RU"]) {
      const ctx = await browser.newContext({
        viewport,
        locale,
        baseURL: BASE,
      });
      const page = await ctx.newPage();
      const tag = `${viewport.name}/${locale}`;

      // Create a poll so the poll + manage pages have content.
      // Selectors are positional because labels are localized.
      await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
      await page.fill("#question", "Mobile check: A or B?");
      const textboxes = page.getByRole("textbox");
      await textboxes.nth(1).fill("A");
      await textboxes.nth(2).fill("B");
      await page.getByRole("button", { name: /Create vote|Создать голосование/ }).click();
      await page.waitForURL(/\/p\/[a-z0-9]+/, { timeout: 20000 });
      const pollPath = new URL(page.url()).pathname;

      const paths = ["/", "/polls", pollPath, "/p/nonexistent9"];

      for (const path of paths) {
        await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        record(`no_horizontal_overflow ${path} @${tag}`, overflow <= 0, `overflowPx=${overflow}`);
      }

      await ctx.close();
    }
  }

  await browser.close();

  const failed = results.filter((r) => !r.passed);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
