import type { TreasuryClient } from "../api/client.js";
import type { OutputFormat } from "../cli/formatters.js";
import { formatOutput } from "../cli/formatters.js";
import type { GlobalOptions } from "../cli/parseArgs.js";
import { buildQueryParams } from "../cli/parseArgs.js";
import type { QueryParams } from "../api/types.js";

export async function handleSpending(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getMtsReceiptsOutlays(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}

export async function handleRevenue(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getMtsReceiptsBySource(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}
