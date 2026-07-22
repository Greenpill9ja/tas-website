import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const proofDir = join(process.cwd(), "output/playwright/agentic-browser-proof");

type RuntimeErrors = {
  consoleErrors: string[];
  pageErrors: string[];
};

function collectRuntimeErrors(page: Page): RuntimeErrors {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  return { consoleErrors, pageErrors };
}

async function captureAgenticProof(
  page: Page,
  id: string,
  runtimeErrors: RuntimeErrors,
  checks: string[],
) {
  await mkdir(proofDir, { recursive: true });

  const screenshotPath = join(proofDir, `${id}.png`);
  const ariaSnapshotPath = join(proofDir, `${id}.aria.yml`);
  const reportPath = join(proofDir, `${id}.json`);

  const [ariaSnapshot, llmsTxt, webMcp, reducedMotion] = await Promise.all([
    page.locator("main").ariaSnapshot({ mode: "ai" }),
    page.evaluate(async () => {
      try {
        const response = await fetch("/llms.txt", { cache: "no-store" });
        const body = await response.text();
        return {
          status: response.ok ? "ok" : "missing",
          statusCode: response.status,
          contentType: response.headers.get("content-type") || "",
          bytes: new TextEncoder().encode(body).length,
        };
      } catch (error) {
        return {
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        };
      }
    }),
    page.evaluate(() => {
      const modelContext = "modelContext" in navigator
        ? (navigator as Navigator & { modelContext?: { registerTool?: unknown } }).modelContext
        : undefined;
      const declarativeTools = [...document.querySelectorAll("form[toolname], form[tooldescription]")].map((form) => ({
        name: form.getAttribute("toolname") || "",
        description: form.getAttribute("tooldescription") || "",
      }));
      const hasRuntimeSignal = Boolean(modelContext) || declarativeTools.length > 0;

      return {
        status: hasRuntimeSignal ? "detected" : "not_configured",
        navigatorModelContext: Boolean(modelContext),
        registerToolType: typeof modelContext?.registerTool,
        declarativeTools,
      };
    }),
    page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
  ]);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await writeFile(ariaSnapshotPath, ariaSnapshot);
  await writeFile(reportPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    route: page.url(),
    viewport: page.viewportSize(),
    reducedMotion,
    checks,
    consoleErrors: runtimeErrors.consoleErrors,
    pageErrors: runtimeErrors.pageErrors,
    llmsTxt,
    webMcp,
    artifacts: {
      screenshot: relative(process.cwd(), screenshotPath),
      ariaSnapshot: relative(process.cwd(), ariaSnapshotPath),
    },
  }, null, 2)}\n`);
}

test("homepage renders core sections without runtime errors", async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page);

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Tech and Sun Empowering Builders and Communities/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /The TAS Solution/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Our Hubs/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /The Stack/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /2026 Roadmap/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Meet the team/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Hub Activities & Education/i })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Message")).toBeVisible();
  await expect(page.getByText(/Built on Ethereum/i)).toHaveCount(0);
  await expect(page.getByTestId("team-member-anthony-amio").getByLabel(/Anthony Amio on LinkedIn/i)).toBeVisible();

  await captureAgenticProof(page, "homepage-desktop", runtimeErrors, [
    "core public sections visible",
    "contact labels visible",
    "Hub Activities section visible",
    "Anthony Amio LinkedIn link accessible by label",
  ]);

  expect(runtimeErrors.consoleErrors).toEqual([]);
  expect(runtimeErrors.pageErrors).toEqual([]);
});

test("mobile layout keeps roadmap readable without runtime errors", async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page);

  await page.setViewportSize({ width: 393, height: 852 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: /Tech and Sun Empowering Builders and Communities/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /The TAS Solution/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Our Hubs/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /The Stack/i })).toBeVisible();

  const roadmapMobile = page.getByTestId("roadmap-mobile");
  await roadmapMobile.scrollIntoViewIfNeeded();
  await expect(roadmapMobile).toContainText("Q1 2026");
  await expect(roadmapMobile).toContainText("Q2 2026");
  await expect(roadmapMobile).toContainText("Q3 2026");
  await expect(roadmapMobile).toContainText("Q4 2026");

  const horizontalOverflow = await roadmapMobile.evaluate((element) => ({
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
  }));
  expect(horizontalOverflow.scrollWidth).toBeLessThanOrEqual(horizontalOverflow.clientWidth + 1);

  await captureAgenticProof(page, "homepage-mobile-reduced-motion", runtimeErrors, [
    "mobile public sections visible",
    "roadmap milestones readable",
    "roadmap has no horizontal overflow",
    "reduced motion media emulated",
  ]);

  expect(runtimeErrors.consoleErrors).toEqual([]);
  expect(runtimeErrors.pageErrors).toEqual([]);
});
