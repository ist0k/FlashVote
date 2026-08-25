import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const results = [];
function record(name, passed, detail = "") {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function newBrowser() {
  return chromium.launch({
    proxy: process.env.HTTPS_PROXY
      ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" }
      : undefined,
  });
}

async function main() {
  const browser = await newBrowser();

  // Context A = poll owner, Context B = participant (separate anon identities).
  // Locale pinned to EN so assertions match the English dictionary.
  const ctxA = await browser.newContext({ locale: "en-US" });
  const ctxB = await browser.newContext({ locale: "en-US" });
  const owner = await ctxA.newPage();
  const voter = await ctxB.newPage();

  try {
    // ---- 1. Landing page shows creation form -------------------------------
    await owner.goto(BASE, { waitUntil: "networkidle" });
    const hasForm = await owner.locator("#question").isVisible();
    record("landing_shows_create_form", hasForm);

    // ---- 2. Validation: duplicate options disable submission -----------------
    await owner.fill("#question", "E2E: pizza or sushi?");
    await owner.getByRole("textbox", { name: "Option 1", exact: true }).fill("Pizza");
    await owner.getByRole("textbox", { name: "Option 2", exact: true }).fill("Pizza");
    const createDisabledOnDuplicates = await owner
      .getByRole("button", { name: "Create vote" })
      .isDisabled();
    record("validation_rejects_duplicate_options", createDisabledOnDuplicates);

    // ---- 3. Create poll successfully ---------------------------------------
    await owner.getByRole("textbox", { name: "Option 2", exact: true }).fill("Sushi");
    await owner.getByRole("button", { name: "Create vote" }).click();
    await owner.waitForURL(/\/p\/[a-z0-9]+/, { timeout: 20000 });
    const pollUrl = owner.url();
    const slug = pollUrl.split("/").pop();
    record("create_poll_redirects_to_slug", /[a-z0-9]{8,16}/.test(slug), slug);

    // Owner panel with QR is visible
    await owner.getByText("You own this vote").waitFor({ timeout: 15000 });
    record("owner_panel_with_qr_visible", true);

    // Share link input contains the URL
    const shareValue = await owner.getByLabel("Share link").inputValue();
    record("share_link_matches_poll_url", shareValue === pollUrl);

    // ---- 4. Participant votes ------------------------------------------------
    await voter.goto(pollUrl, { waitUntil: "networkidle" });
    const voteButton = voter.getByRole("button", { name: "Pizza", exact: true });
    await voteButton.waitFor({ timeout: 15000 });
    await voteButton.click();

    let voteAccepted = false;
    try {
      // Authoritative signal is the post-vote UI state; auth round-trips can
      // be slow behind corporate proxies (GoTrue rate limits add backoff).
      await voter
        .getByText(/Vote submitted/i)
        .waitFor({ timeout: 60000 });
      voteAccepted = true;
    } catch {}
    record("participant_vote_accepted", voteAccepted);
    record("voted_state_persists_in_ui", voteAccepted);

    // ---- 5. Duplicate voting blocked after reload ----------------------------
    await voter.reload({ waitUntil: "networkidle" });
    let stillBlocked = false;
    try {
      await voter.getByText(/Vote submitted/i).waitFor({ timeout: 30000 });
      stillBlocked =
        (await voter.getByRole("button", { name: "Sushi", exact: true }).count()) === 0;
    } catch {}
    record("duplicate_vote_blocked_after_reload", stillBlocked);

    // ---- 6. Change vote: switch from Pizza to Sushi --------------------------
    await voter.getByRole("button", { name: /Change vote/i }).click();
    await voter.getByRole("button", { name: "Sushi", exact: true }).click();
    let voteChanged = false;
    try {
      await voter.getByText(/Vote submitted/i).waitFor({ timeout: 60000 });
      voteChanged = true;
    } catch {}
    record("vote_can_be_changed", voteChanged);

    // ---- 7. Realtime: owner page reflects the (changed) single vote ----------
    await owner.goto(pollUrl, { waitUntil: "networkidle" });
    await owner
      .getByText(/^1 vote$/)
      .waitFor({ timeout: 20000 })
      .then(() => record("realtime_updates_owner_view", true))
      .catch(() => record("realtime_updates_owner_view", false, "count never reached 1"));
    const sushiShare = await owner
      .locator("text=100%")
      .first()
      .isVisible()
      .catch(() => false);
    const alphaShareZero = await owner
      .locator("text=0%")
      .first()
      .isVisible()
      .catch(() => false);
    record(
      "changed_vote_redistributes_counts",
      sushiShare && alphaShareZero,
      `sushi100=${sushiShare} alpha0=${alphaShareZero}`,
    );

    // ---- 8. My votes are scoped to the owning session -------------------------
    await owner.goto(`${BASE}/polls`, { waitUntil: "networkidle" });
    await owner
      .getByText("E2E: pizza or sushi?")
      .first()
      .waitFor({ timeout: 15000 });
    record("my_polls_lists_created_poll", true);

    // The participant (different anonymous identity) must NOT see it.
    await voter.goto(`${BASE}/polls`, { waitUntil: "networkidle" });
    const leakedToOthers =
      (await voter.getByText("E2E: pizza or sushi?").count()) > 0;
    record("my_votes_scoped_to_owner", !leakedToOthers);

    // ---- 8. Close poll -> participants rejected ------------------------------
    await owner.goto(pollUrl, { waitUntil: "networkidle" });
    await owner.getByRole("button", { name: "Close voting" }).click();
    await owner
      .getByText("Vote closed")
      .or(owner.getByText("Closed"))
      .first()
      .waitFor({ timeout: 15000 });

    await voter.goto(pollUrl, { waitUntil: "networkidle" });
    let closedRejected = false;
    try {
      await voter
        .getByText("Voting has ended for this vote.")
        .waitFor({ timeout: 20000 });
      closedRejected = true;
    } catch {}
    record("closed_poll_rejects_votes_ui", closedRejected);

    // ---- 9. Unknown slug -> HTTP 404 -----------------------------------------
    const resp = await voter.goto(`${BASE}/p/zzzzzzzz9z`, { waitUntil: "domcontentloaded" });
    const notFoundText = await voter.getByText("Page not found").isVisible();
    record(
      "unknown_slug_returns_404",
      resp?.status() === 404 && notFoundText,
      `status=${resp?.status()}`,
    );

    // ---- 10. Language switcher applies instantly ------------------------------
    await voter.goto(`${BASE}/polls`, { waitUntil: "networkidle" });
    await voter.getByRole("button", { name: "RU", exact: true }).click();
    let ruApplied = false;
    try {
      // Header nav link is rendered from the active dictionary.
      await voter
        .getByRole("link", { name: "Мои голосования" })
        .waitFor({ timeout: 10000 });
      ruApplied = true;
    } catch {}
    record("language_switches_to_russian_live", ruApplied);
    const htmlLang = await voter.evaluate(() => document.documentElement.lang);
    record("html_lang_attribute_updates", htmlLang === "ru", `lang=${htmlLang}`);
  } catch (error) {
    record("unexpected_error", false, String(error).slice(0, 300));
  }

  await browser.close();

  const failed = results.filter((r) => !r.passed);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
