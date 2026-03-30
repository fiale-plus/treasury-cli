import { parseArgs } from "node:util";

export interface GlobalOptions {
  format: "json" | "csv" | "table";
  limit?: string;
  sort?: string;
  filter?: string;
  fields?: string;
  page?: string;
  pageSize?: string;
  help: boolean;
  version: boolean;
}

const GLOBAL_OPTIONS = {
  format: { type: "string" as const, short: "f", default: "json" },
  limit: { type: "string" as const },
  sort: { type: "string" as const },
  filter: { type: "string" as const },
  fields: { type: "string" as const },
  page: { type: "string" as const },
  "page-size": { type: "string" as const },
  help: { type: "boolean" as const, default: false },
  version: { type: "boolean" as const, default: false },
};

export function parseGlobal(argv: string[]) {
  return parseArgs({
    args: argv,
    options: GLOBAL_OPTIONS,
    strict: false,
    allowPositionals: true,
  });
}

export function extractGlobalOpts(
  values: Record<string, unknown>,
): GlobalOptions {
  return {
    format: (values.format as "json" | "csv" | "table") || "json",
    limit: values.limit as string | undefined,
    sort: values.sort as string | undefined,
    filter: values.filter as string | undefined,
    fields: values.fields as string | undefined,
    page: values.page as string | undefined,
    pageSize: values["page-size"] as string | undefined,
    help: (values.help as boolean) || false,
    version: (values.version as boolean) || false,
  };
}

/** Build API query params from global options */
export function buildQueryParams(opts: GlobalOptions): Record<string, string | number | undefined> {
  return {
    fields: opts.fields,
    filter: opts.filter,
    sort: opts.sort,
    page_number: opts.page ? Number(opts.page) : undefined,
    page_size: opts.limit ? Number(opts.limit) : opts.pageSize ? Number(opts.pageSize) : undefined,
  };
}
