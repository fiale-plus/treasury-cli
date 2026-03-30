import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatOutput } from "../cli/formatters.js";
import { validateDate, validatePositiveInt, validateFilter } from "../utils/validation.js";

describe("formatters", () => {
  const sampleData = {
    data: [
      { record_date: "2024-01-25", tot_pub_debt_out_amt: "34100000000000.00" },
      { record_date: "2024-01-24", tot_pub_debt_out_amt: "34050000000000.00" },
    ],
    meta: {
      count: 2,
      labels: { record_date: "Record Date" },
      dataTypes: { record_date: "DATE" },
      dataFormats: { record_date: "YYYY-MM-DD" },
      "total-count": 100,
      "total-pages": 50,
    },
    links: {
      self: "&page%5Bnumber%5D=1&page%5Bsize%5D=2",
      first: "&page%5Bnumber%5D=1&page%5Bsize%5D=2",
      prev: null,
      next: "&page%5Bnumber%5D=2&page%5Bsize%5D=2",
      last: "&page%5Bnumber%5D=50&page%5Bsize%5D=2",
    },
  };

  describe("json format", () => {
    it("outputs valid JSON", () => {
      const output = formatOutput(sampleData, "json");
      const parsed = JSON.parse(output);
      assert.equal(parsed.data.length, 2);
    });

    it("adds _truncated when paginated", () => {
      const output = formatOutput(sampleData, "json");
      const parsed = JSON.parse(output);
      assert.equal(parsed._truncated, true);
      assert.equal(parsed._next_page, 2);
    });

    it("does not add _truncated when all results shown", () => {
      const fullData = {
        ...sampleData,
        meta: { ...sampleData.meta, "total-count": 2, "total-pages": 1 },
      };
      const output = formatOutput(fullData, "json");
      const parsed = JSON.parse(output);
      assert.equal(parsed._truncated, undefined);
    });
  });

  describe("csv format", () => {
    it("outputs header row + data rows", () => {
      const output = formatOutput(sampleData, "csv");
      const lines = output.split("\n");
      const headerLine = lines.find((l) => l.startsWith("record_date,"))!;
      assert.ok(headerLine);
      assert.ok(headerLine.includes("tot_pub_debt_out_amt"));
    });

    it("includes truncation comment when needed", () => {
      const output = formatOutput(sampleData, "csv");
      assert.ok(output.startsWith("# Showing page 1 of 50"));
    });

    it("quotes values containing commas", () => {
      const data = {
        data: [{ record_date: "2024-01-25", desc: "One, Two, Three" }],
        meta: { count: 1, labels: {}, dataTypes: {}, dataFormats: {}, "total-count": 1, "total-pages": 1 },
        links: { self: "", first: "", prev: null, next: null, last: "" },
      };
      const output = formatOutput(data, "csv");
      assert.ok(output.includes('"One, Two, Three"'));
    });
  });

  describe("table format", () => {
    it("outputs aligned columns", () => {
      const output = formatOutput(sampleData, "table");
      const lines = output.split("\n");
      assert.ok(lines.length >= 4); // header + sep + 2 rows
      assert.ok(lines[0].includes("record_date"));
      assert.ok(lines[1].includes("\u2500")); // box-drawing horizontal
    });

    it("shows pagination footer when truncated", () => {
      const output = formatOutput(sampleData, "table");
      assert.ok(output.includes("Showing page 1 of 50"));
    });

    it("returns '(no results)' for empty data", () => {
      const empty = {
        data: [],
        meta: { count: 0, labels: {}, dataTypes: {}, dataFormats: {}, "total-count": 0, "total-pages": 0 },
        links: { self: "", first: "", prev: null, next: null, last: "" },
      };
      const output = formatOutput(empty, "table");
      assert.equal(output, "(no results)");
    });
  });
});

describe("validation", () => {
  describe("validateDate", () => {
    it("accepts valid date", () => {
      assert.doesNotThrow(() => validateDate("2024-01-01", "test"));
    });

    it("rejects invalid format", () => {
      assert.throws(() => validateDate("01/01/2024", "test"), /YYYY-MM-DD/);
    });

    it("rejects partial date", () => {
      assert.throws(() => validateDate("2024-01", "test"), /YYYY-MM-DD/);
    });
  });

  describe("validatePositiveInt", () => {
    it("accepts valid positive integer", () => {
      assert.equal(validatePositiveInt("10", "test"), 10);
    });

    it("rejects zero", () => {
      assert.throws(() => validatePositiveInt("0", "test"), /positive integer/);
    });

    it("rejects negative", () => {
      assert.throws(() => validatePositiveInt("-1", "test"), /positive integer/);
    });

    it("rejects non-numeric", () => {
      assert.throws(() => validatePositiveInt("abc", "test"), /positive integer/);
    });

    it("rejects value exceeding max", () => {
      assert.throws(() => validatePositiveInt("200", "test", 100), /exceeds maximum/);
    });
  });

  describe("validateFilter", () => {
    it("accepts valid filter format", () => {
      assert.doesNotThrow(() => validateFilter("record_date:gte:2024-01-01"));
    });

    it("rejects filter with too few parts", () => {
      assert.throws(() => validateFilter("record_date"), /field:operator:value/);
    });

    it("rejects filter with only field:operator", () => {
      assert.throws(() => validateFilter("record_date:gte"), /field:operator:value/);
    });
  });
});
