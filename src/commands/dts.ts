import type { TreasuryClient } from "../api/client.js";
import type { OutputFormat } from "../cli/formatters.js";
import { formatOutput } from "../cli/formatters.js";
import type { GlobalOptions } from "../cli/parseArgs.js";
import { buildQueryParams } from "../cli/parseArgs.js";
import type { QueryParams } from "../api/types.js";

export async function handleCash(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getOperatingCashBalance(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}

export async function handleDeposits(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getDepositsWithdrawals(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}

export async function handleDebtTransactions(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getPublicDebtTransactions(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}

export async function handleDebtLimit(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getDebtSubjectToLimit(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}

export async function handleTaxDeposits(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getFederalTaxDeposits(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}

export async function handleRefunds(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getIncomeTaxRefunds(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}
