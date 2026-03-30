import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { TreasuryClient, TreasuryApiError } from "../api/client.js";
import {
  DEBT_TO_PENNY_RESPONSE,
  AVG_INTEREST_RATES_RESPONSE,
  OPERATING_CASH_RESPONSE,
  EXCHANGE_RATES_RESPONSE,
  MTS_TABLE1_RESPONSE,
  DEPOSITS_RESPONSE,
} from "./fixtures/treasury.js";

let client: TreasuryClient;
let fetchMock: ReturnType<typeof mock.fn>;

function mockFetch(response: unknown, status = 200) {
  fetchMock = mock.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
  }));
  (globalThis as { fetch: unknown }).fetch = fetchMock;
}

function getCalledUrl(): URL {
  const call = fetchMock.mock.calls[0];
  return new URL(call.arguments[0] as string);
}

describe("TreasuryClient", () => {
  beforeEach(() => {
    client = new TreasuryClient();
  });

  afterEach(() => {
    mock.restoreAll();
  });

  // ── Request mechanics ───────────────────────────────────────────

  describe("request mechanics", () => {
    it("includes format=json in every request", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny();
      const url = getCalledUrl();
      assert.equal(url.searchParams.get("format"), "json");
    });

    it("sets User-Agent header", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny();
      const call = fetchMock.mock.calls[0];
      const opts = call.arguments[1] as RequestInit;
      assert.equal((opts.headers as Record<string, string>)["User-Agent"], "treasury-cli");
    });

    it("constructs correct base URL for debt_to_penny", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny();
      const url = getCalledUrl();
      assert.equal(url.origin, "https://api.fiscaldata.treasury.gov");
      assert.equal(url.pathname, "/services/api/fiscal_service/v2/accounting/od/debt_to_penny");
    });

    it("throws TreasuryApiError on non-ok response", async () => {
      mockFetch({ error: "Bad Request" }, 400);
      await assert.rejects(
        () => client.getDebtToPenny(),
        (err: unknown) => {
          assert.ok(err instanceof TreasuryApiError);
          assert.equal(err.status, 400);
          return true;
        },
      );
    });

    it("does not include undefined parameters", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny({ fields: undefined });
      const url = getCalledUrl();
      assert.equal(url.searchParams.has("fields"), false);
    });

    it("sends fields parameter when provided", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny({ fields: "record_date,tot_pub_debt_out_amt" });
      const url = getCalledUrl();
      assert.equal(url.searchParams.get("fields"), "record_date,tot_pub_debt_out_amt");
    });

    it("sends filter parameter when provided", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny({ filter: "record_date:gte:2024-01-01" });
      const url = getCalledUrl();
      assert.equal(url.searchParams.get("filter"), "record_date:gte:2024-01-01");
    });

    it("sends sort parameter when provided", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny({ sort: "-record_date" });
      const url = getCalledUrl();
      assert.equal(url.searchParams.get("sort"), "-record_date");
    });

    it("sends page[number] and page[size] when provided", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getDebtToPenny({ page_number: 2, page_size: 10 });
      const url = getCalledUrl();
      assert.equal(url.searchParams.get("page[number]"), "2");
      assert.equal(url.searchParams.get("page[size]"), "10");
    });
  });

  // ── Debt endpoints ─────────────────────────────────────────────

  describe("debt", () => {
    it("getDebtToPenny hits correct endpoint", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      const result = await client.getDebtToPenny();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v2/accounting/od/debt_to_penny");
      assert.equal(result.data[0].record_date, "2024-01-25");
    });

    it("getAvgInterestRates hits correct endpoint", async () => {
      mockFetch(AVG_INTEREST_RATES_RESPONSE);
      const result = await client.getAvgInterestRates();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v2/accounting/od/avg_interest_rates");
      assert.equal(result.data.length, 2);
    });

    it("getMspdTable1 hits correct endpoint", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.getMspdTable1();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/debt/mspd/mspd_table_1");
    });
  });

  // ── Daily Treasury Statement endpoints ─────────────────────────

  describe("daily treasury statement", () => {
    it("getOperatingCashBalance hits correct endpoint", async () => {
      mockFetch(OPERATING_CASH_RESPONSE);
      const result = await client.getOperatingCashBalance();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/dts/operating_cash_balance");
      assert.equal(result.data[0].account_type, "Federal Reserve Account");
    });

    it("getDepositsWithdrawals hits correct endpoint", async () => {
      mockFetch(DEPOSITS_RESPONSE);
      await client.getDepositsWithdrawals();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/dts/deposits_withdrawals_operating_cash");
    });

    it("getPublicDebtTransactions hits correct endpoint", async () => {
      mockFetch(DEPOSITS_RESPONSE);
      await client.getPublicDebtTransactions();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/dts/public_debt_transactions");
    });

    it("getDebtSubjectToLimit hits correct endpoint", async () => {
      mockFetch(DEPOSITS_RESPONSE);
      await client.getDebtSubjectToLimit();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/dts/debt_subject_to_limit");
    });

    it("getFederalTaxDeposits hits correct endpoint", async () => {
      mockFetch(DEPOSITS_RESPONSE);
      await client.getFederalTaxDeposits();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/dts/federal_tax_deposits");
    });

    it("getIncomeTaxRefunds hits correct endpoint", async () => {
      mockFetch(DEPOSITS_RESPONSE);
      await client.getIncomeTaxRefunds();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/dts/income_tax_refunds_issued");
    });
  });

  // ── Monthly Treasury Statement endpoints ───────────────────────

  describe("monthly treasury statement", () => {
    it("getMtsReceiptsOutlays hits correct endpoint", async () => {
      mockFetch(MTS_TABLE1_RESPONSE);
      const result = await client.getMtsReceiptsOutlays();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/mts/mts_table_1");
      assert.equal(result.data[0].classification_desc, "Individual Income Taxes");
    });

    it("getMtsReceiptsBySource hits correct endpoint", async () => {
      mockFetch(MTS_TABLE1_RESPONSE);
      await client.getMtsReceiptsBySource();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/mts/mts_table_5");
    });
  });

  // ── Exchange Rates ─────────────────────────────────────────────

  describe("exchange rates", () => {
    it("getExchangeRates hits correct endpoint", async () => {
      mockFetch(EXCHANGE_RATES_RESPONSE);
      const result = await client.getExchangeRates();
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v1/accounting/od/rates_of_exchange");
      assert.equal(result.data.length, 2);
      assert.equal(result.data[0].country_currency_desc, "Canada-Dollar");
    });

    it("getExchangeRates sends filter", async () => {
      mockFetch(EXCHANGE_RATES_RESPONSE);
      await client.getExchangeRates({ filter: "country_currency_desc:eq:Japan-Yen" });
      const url = getCalledUrl();
      assert.equal(url.searchParams.get("filter"), "country_currency_desc:eq:Japan-Yen");
    });
  });

  // ── Generic query ──────────────────────────────────────────────

  describe("generic query", () => {
    it("query sends arbitrary endpoint", async () => {
      mockFetch(DEBT_TO_PENNY_RESPONSE);
      await client.query("v2/accounting/od/debt_to_penny", { page_size: 5 });
      const url = getCalledUrl();
      assert.equal(url.pathname, "/services/api/fiscal_service/v2/accounting/od/debt_to_penny");
      assert.equal(url.searchParams.get("page[size]"), "5");
    });
  });
});
