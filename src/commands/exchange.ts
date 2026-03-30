import type { TreasuryClient } from "../api/client.js";
import type { OutputFormat } from "../cli/formatters.js";
import { formatOutput } from "../cli/formatters.js";
import type { GlobalOptions } from "../cli/parseArgs.js";
import { buildQueryParams } from "../cli/parseArgs.js";
import type { QueryParams } from "../api/types.js";

export async function handleExchange(
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;
  if (!params.sort) params.sort = "-record_date";
  const data = await client.getExchangeRates(params);
  process.stdout.write(formatOutput(data, format) + "\n");
}
