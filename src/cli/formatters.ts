export type OutputFormat = "json" | "csv" | "table";

// Known array fields in Treasury API responses
const ARRAY_FIELDS = [
  "data",
] as const;

type DataRecord = Record<string, unknown>;

function extractItems(data: DataRecord): unknown[] {
  for (const field of ARRAY_FIELDS) {
    if (Array.isArray(data[field])) {
      return data[field] as unknown[];
    }
  }
  return [data];
}

function hasPagination(data: DataRecord): {
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
} | null {
  const meta = data.meta as DataRecord | undefined;
  if (!meta) return null;

  const totalCount = meta["total-count"];
  const totalPages = meta["total-pages"];
  const count = meta.count;

  if (
    typeof totalCount === "number" &&
    typeof totalPages === "number" &&
    typeof count === "number" &&
    totalPages > 1
  ) {
    // Derive current page from links or default to 1
    const links = data.links as DataRecord | undefined;
    let pageNumber = 1;
    if (links?.self && typeof links.self === "string") {
      const selfUrl = links.self;
      const match = selfUrl.match(/page%5Bnumber%5D=(\d+)|page\[number\]=(\d+)/);
      if (match) {
        pageNumber = Number(match[1] || match[2]);
      }
    }
    const pageSize = count;
    if (pageNumber * pageSize < totalCount) {
      return { totalCount, totalPages, pageSize, pageNumber };
    }
  }
  return null;
}

function addTruncationMeta(data: DataRecord): DataRecord {
  const pag = hasPagination(data);
  if (pag) {
    return { ...data, _truncated: true, _next_page: pag.pageNumber + 1 };
  }
  return data;
}

export function formatOutput(data: object, format: OutputFormat): string {
  const d = data as DataRecord;
  switch (format) {
    case "json":
      return JSON.stringify(addTruncationMeta(d), null, 2);
    case "csv":
      return formatCSV(d);
    case "table":
      return formatTable(d);
  }
}

function formatCSV(data: DataRecord): string {
  const items = extractItems(data);
  if (items.length === 0) return "";

  const lines: string[] = [];
  const pag = hasPagination(data);

  if (pag) {
    lines.push(
      `# Showing page ${pag.pageNumber} of ${pag.totalPages} (${pag.totalCount} total). Use --page/--page-size for more.`,
    );
  }

  if (typeof items[0] === "string") {
    lines.push("value");
    for (const item of items) {
      lines.push(String(item));
    }
    return lines.join("\n");
  }

  const first = items[0] as DataRecord;
  const headers = Object.keys(first);
  lines.push(headers.join(","));

  for (const item of items) {
    const row = item as DataRecord;
    lines.push(
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(","),
    );
  }

  return lines.join("\n");
}

function formatTable(data: DataRecord): string {
  const items = extractItems(data);
  if (items.length === 0) return "(no results)";

  if (typeof items[0] === "string") {
    return items.join("\n");
  }

  const rows = items as DataRecord[];
  const headers = Object.keys(rows[0]);

  const widths = headers.map((h) =>
    Math.max(
      h.length,
      ...rows.map((r) => String(r[h] ?? "").length),
    ),
  );

  const maxWidth = 50;
  const cappedWidths = widths.map((w) => Math.min(w, maxWidth));

  const pad = (val: string, width: number) =>
    val.length > width ? val.slice(0, width - 1) + "\u2026" : val.padEnd(width);

  const lines: string[] = [];
  lines.push(headers.map((h, i) => pad(h, cappedWidths[i])).join("  "));
  lines.push(cappedWidths.map((w) => "\u2500".repeat(w)).join("  "));

  for (const row of rows) {
    lines.push(
      headers
        .map((h, i) => pad(String(row[h] ?? ""), cappedWidths[i]))
        .join("  "),
    );
  }

  const pag = hasPagination(data);
  if (pag) {
    lines.push(
      `\nShowing page ${pag.pageNumber} of ${pag.totalPages} (${pag.totalCount} total). Use --page and --page-size to paginate.`,
    );
  }

  return lines.join("\n");
}
