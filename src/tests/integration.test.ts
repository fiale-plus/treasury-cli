import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = join(__dirname, "..", "cli.ts");
const TSX = join(__dirname, "..", "..", "node_modules", ".bin", "tsx");

async function run(
  args: string[],
  env?: Record<string, string>,
): Promise<{ stdout: string; stderr: string }> {
  try {
    const result = await exec(TSX, [CLI, ...args], {
      env: { ...process.env, ...env },
      timeout: 15_000,
    });
    return { stdout: result.stdout, stderr: result.stderr };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string };
    return { stdout: e.stdout || "", stderr: e.stderr || "" };
  }
}

describe("CLI integration (offline)", () => {
  it("shows help with --help", async () => {
    const { stdout } = await run(["--help"]);
    assert.ok(stdout.includes("treasury-cli"));
    assert.ok(stdout.includes("COMMANDS"));
    assert.ok(stdout.includes("debt"));
  });

  it("shows help with no args", async () => {
    const { stdout } = await run([]);
    assert.ok(stdout.includes("treasury-cli"));
  });

  it("shows version with --version", async () => {
    const { stdout } = await run(["--version"]);
    assert.match(stdout.trim(), /^\d+\.\d+\.\d+/);
  });

  it("errors on unknown command", async () => {
    const { stderr } = await run(["foobar"]);
    assert.ok(stderr.includes("Unknown command"));
  });
});

// ── Live API tests (no auth needed — Treasury API is open) ──────

describe("CLI integration (live API)", () => {
  it("treasury debt returns JSON with data array", async () => {
    const { stdout } = await run(["debt"]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
    assert.ok(data.data[0].tot_pub_debt_out_amt);
  });

  it("treasury debt history --limit 3 returns debt data", async () => {
    const { stdout } = await run([
      "debt", "history", "--limit", "3",
    ]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length <= 3);
  });

  it("treasury rates returns interest rate data", async () => {
    const { stdout } = await run(["rates", "--limit", "5"]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
  });

  it("treasury cash returns operating cash balance", async () => {
    const { stdout } = await run(["cash", "--limit", "3"]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
  });

  it("treasury exchange returns exchange rate data", async () => {
    const { stdout } = await run(["exchange", "--limit", "5"]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
    assert.ok(data.data[0].country_currency_desc);
  });

  it("treasury spending returns MTS receipts/outlays", async () => {
    const { stdout } = await run(["spending", "--limit", "5"]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
  });

  it("treasury query works with raw endpoint", async () => {
    const { stdout } = await run([
      "query", "v2/accounting/od/debt_to_penny", "--limit", "2",
    ]);
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
  });

  it("supports csv output format", async () => {
    const { stdout } = await run([
      "debt", "history", "--limit", "3", "-f", "csv",
    ]);
    const lines = stdout.trim().split("\n");
    const headerIdx = lines.findIndex((l) => l.startsWith("record_date,"));
    assert.ok(headerIdx >= 0);
    assert.ok(lines.length > headerIdx + 1);
  });

  it("supports table output format", async () => {
    const { stdout } = await run([
      "exchange", "--limit", "3", "-f", "table",
    ]);
    assert.ok(stdout.includes("\u2500")); // box-drawing horizontal
  });
});
