import type { TreasuryClient } from "../api/client.js";
import type { OutputFormat } from "../cli/formatters.js";
import { formatOutput } from "../cli/formatters.js";
import type { GlobalOptions } from "../cli/parseArgs.js";
import { buildQueryParams } from "../cli/parseArgs.js";
import { QUERY_HELP } from "../cli/help.js";
import type { QueryParams } from "../api/types.js";

export async function handleQuery(
  endpoint: string | undefined,
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  if (!endpoint) {
    process.stdout.write(QUERY_HELP);
    return;
  }

  const params = buildQueryParams(global) as QueryParams;
  const data = await client.query(endpoint, params);
  process.stdout.write(formatOutput(data, format) + "\n");
}
