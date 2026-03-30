import type { TreasuryClient } from "../api/client.js";
import type { OutputFormat } from "../cli/formatters.js";
import { formatOutput } from "../cli/formatters.js";
import type { GlobalOptions } from "../cli/parseArgs.js";
import { buildQueryParams } from "../cli/parseArgs.js";
import { DEBT_HELP } from "../cli/help.js";
import type { QueryParams } from "../api/types.js";

export async function handleDebt(
  action: string | undefined,
  global: GlobalOptions,
  client: TreasuryClient,
  format: OutputFormat,
): Promise<void> {
  const params = buildQueryParams(global) as QueryParams;

  if (!action) {
    // Default: latest debt to the penny
    if (!params.sort) params.sort = "-record_date";
    if (!params.page_size) params.page_size = 1;
    const data = await client.getDebtToPenny(params);
    process.stdout.write(formatOutput(data, format) + "\n");
    return;
  }

  switch (action) {
    case "history": {
      if (!params.sort) params.sort = "-record_date";
      const data = await client.getDebtToPenny(params);
      process.stdout.write(formatOutput(data, format) + "\n");
      return;
    }

    case "mspd": {
      if (!params.sort) params.sort = "-record_date";
      const data = await client.getMspdTable1(params);
      process.stdout.write(formatOutput(data, format) + "\n");
      return;
    }

    case "--help":
    case "-h": {
      process.stdout.write(DEBT_HELP);
      return;
    }

    default:
      process.stderr.write(`Unknown debt subcommand: ${action}\n\n`);
      process.stdout.write(DEBT_HELP);
      process.exitCode = 1;
      return;
  }
}
