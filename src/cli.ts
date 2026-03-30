#!/usr/bin/env node

import { TreasuryClient, TreasuryApiError } from "./api/client.js";
import { parseGlobal, extractGlobalOpts, buildQueryParams } from "./cli/parseArgs.js";
import { MAIN_HELP } from "./cli/help.js";
import type { OutputFormat } from "./cli/formatters.js";
import { formatOutput } from "./cli/formatters.js";

import { handleDebt } from "./commands/debt.js";
import {
  handleCash,
  handleDeposits,
  handleDebtTransactions,
  handleDebtLimit,
  handleTaxDeposits,
  handleRefunds,
} from "./commands/dts.js";
import { handleSpending, handleRevenue } from "./commands/mts.js";
import { handleExchange } from "./commands/exchange.js";
import { handleQuery } from "./commands/query.js";

const VERSION = "0.0.0-dev";

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  // Quick check for --help and --version before full parse
  if (argv.length === 0 || argv.includes("--help") && !argv[0]) {
    process.stdout.write(MAIN_HELP);
    return;
  }

  const command = argv[0];

  if (command === "--help" || command === "-h") {
    process.stdout.write(MAIN_HELP);
    return;
  }

  if (command === "--version" || command === "-v") {
    process.stdout.write(VERSION + "\n");
    return;
  }

  const parsed = parseGlobal(argv);
  const global = extractGlobalOpts(parsed.values as Record<string, unknown>);
  const format = global.format as OutputFormat;

  if (global.help) {
    process.stdout.write(MAIN_HELP);
    return;
  }

  if (global.version) {
    process.stdout.write(VERSION + "\n");
    return;
  }

  const positionals = parsed.positionals as string[];
  const group = positionals[0];
  const action = positionals[1];

  // No API key needed — Treasury Fiscal Data API is open
  const client = new TreasuryClient();

  switch (group) {
    case "debt":
      await handleDebt(action, global, client, format);
      return;

    case "rates": {
      const params = buildQueryParams(global);
      if (!params.sort) params.sort = "-record_date";
      const data = await client.getAvgInterestRates(params);
      process.stdout.write(formatOutput(data, format) + "\n");
      return;
    }

    case "cash":
      await handleCash(global, client, format);
      return;

    case "deposits":
      await handleDeposits(global, client, format);
      return;

    case "debt-transactions":
      await handleDebtTransactions(global, client, format);
      return;

    case "debt-limit":
      await handleDebtLimit(global, client, format);
      return;

    case "tax-deposits":
      await handleTaxDeposits(global, client, format);
      return;

    case "refunds":
      await handleRefunds(global, client, format);
      return;

    case "spending":
      await handleSpending(global, client, format);
      return;

    case "revenue":
      await handleRevenue(global, client, format);
      return;

    case "exchange":
      await handleExchange(global, client, format);
      return;

    case "query":
      await handleQuery(action, global, client, format);
      return;

    default:
      process.stderr.write(`Unknown command: ${group}\n\n`);
      process.stdout.write(MAIN_HELP);
      process.exitCode = 1;
      return;
  }
}

main().catch((err) => {
  if (err instanceof TreasuryApiError) {
    process.stderr.write(`Error: ${err.message}\n`);
  } else if (err instanceof Error) {
    process.stderr.write(`Error: ${err.message}\n`);
  } else {
    process.stderr.write(`Error: ${String(err)}\n`);
  }
  process.exitCode = 1;
});
