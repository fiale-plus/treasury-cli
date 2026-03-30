import type { QueryParams, TreasuryResponse } from "./types.js";

const BASE_URL = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service";

export class TreasuryApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly errorMessage: string,
  ) {
    super(`Treasury API error ${status}: ${errorMessage}`);
    this.name = "TreasuryApiError";
  }
}

export class TreasuryClient {
  private timeout: number;

  constructor(timeout = 10_000) {
    this.timeout = timeout;
  }

  private async request(
    endpoint: string,
    params: QueryParams = {},
  ): Promise<TreasuryResponse> {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.set("format", "json");

    if (params.fields) {
      url.searchParams.set("fields", params.fields);
    }
    if (params.filter) {
      url.searchParams.set("filter", params.filter);
    }
    if (params.sort) {
      url.searchParams.set("sort", params.sort);
    }
    if (params.page_number !== undefined) {
      url.searchParams.set("page[number]", String(params.page_number));
    }
    if (params.page_size !== undefined) {
      url.searchParams.set("page[size]", String(params.page_size));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { "User-Agent": "treasury-cli" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        throw new TreasuryApiError(res.status, text);
      }

      return (await res.json()) as TreasuryResponse;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Debt ──────────────────────────────────────────────────────────

  async getDebtToPenny(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v2/accounting/od/debt_to_penny", params);
  }

  async getAvgInterestRates(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v2/accounting/od/avg_interest_rates", params);
  }

  async getMspdTable1(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/debt/mspd/mspd_table_1", params);
  }

  // ── Daily Treasury Statement ──────────────────────────────────────

  async getOperatingCashBalance(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/dts/operating_cash_balance", params);
  }

  async getDepositsWithdrawals(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/dts/deposits_withdrawals_operating_cash", params);
  }

  async getPublicDebtTransactions(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/dts/public_debt_transactions", params);
  }

  async getDebtSubjectToLimit(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/dts/debt_subject_to_limit", params);
  }

  async getFederalTaxDeposits(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/dts/federal_tax_deposits", params);
  }

  async getIncomeTaxRefunds(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/dts/income_tax_refunds_issued", params);
  }

  // ── Monthly Treasury Statement ────────────────────────────────────

  async getMtsReceiptsOutlays(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/mts/mts_table_1", params);
  }

  async getMtsReceiptsBySource(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/mts/mts_table_5", params);
  }

  // ── Exchange Rates ────────────────────────────────────────────────

  async getExchangeRates(params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request("v1/accounting/od/rates_of_exchange", params);
  }

  // ── Generic query ─────────────────────────────────────────────────

  async query(endpoint: string, params: QueryParams = {}): Promise<TreasuryResponse> {
    return this.request(endpoint, params);
  }
}
