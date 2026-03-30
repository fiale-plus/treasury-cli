// ── Query parameter types ──────────────────────────────────────────

export interface QueryParams {
  fields?: string;
  filter?: string;
  sort?: string;
  page_number?: number;
  page_size?: number;
}

// ── Response envelope ──────────────────────────────────────────────

export interface TreasuryMeta {
  count: number;
  labels: Record<string, string>;
  dataTypes: Record<string, string>;
  dataFormats: Record<string, string>;
  "total-count": number;
  "total-pages": number;
}

export interface TreasuryLinks {
  self: string;
  first: string;
  prev: string | null;
  next: string | null;
  last: string;
}

export interface TreasuryResponse {
  data: Record<string, string>[];
  meta: TreasuryMeta;
  links: TreasuryLinks;
}

// ── Debt types ─────────────────────────────────────────────────────

export interface DebtToPenny {
  record_date: string;
  debt_held_public_amt: string;
  intragov_hold_amt: string;
  tot_pub_debt_out_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface AvgInterestRate {
  record_date: string;
  security_type_desc: string;
  security_desc: string;
  avg_interest_rate_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface MspdTable1 {
  record_date: string;
  security_type_desc: string;
  security_class_desc: string;
  debt_held_public_mil_amt: string;
  intragov_hold_mil_amt: string;
  total_mil_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

// ── Daily Treasury Statement types ─────────────────────────────────

export interface OperatingCashBalance {
  record_date: string;
  account_type: string;
  close_today_bal: string;
  open_today_bal: string;
  open_month_bal: string;
  open_fiscal_year_bal: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface DepositsWithdrawals {
  record_date: string;
  transaction_type: string;
  transaction_catg: string;
  transaction_catg_desc: string;
  transaction_today_amt: string;
  transaction_mtd_amt: string;
  transaction_fytd_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface PublicDebtTransactions {
  record_date: string;
  transaction_type: string;
  transaction_type_desc: string;
  transaction_today_amt: string;
  transaction_mtd_amt: string;
  transaction_fytd_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface DebtSubjectToLimit {
  record_date: string;
  debt_catg: string;
  debt_catg_desc: string;
  close_today_bal: string;
  open_today_bal: string;
  open_month_bal: string;
  open_fiscal_year_bal: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface FederalTaxDeposits {
  record_date: string;
  tax_deposit_type: string;
  tax_deposit_type_desc: string;
  tax_deposit_today_amt: string;
  tax_deposit_mtd_amt: string;
  tax_deposit_fytd_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface IncomeTaxRefunds {
  record_date: string;
  refund_type: string;
  refund_type_desc: string;
  refund_today_amt: string;
  refund_mtd_amt: string;
  refund_fytd_amt: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

// ── Monthly Treasury Statement types ───────────────────────────────

export interface MtsTable1 {
  record_date: string;
  parent_id: string;
  classification_id: string;
  classification_desc: string;
  current_month_receipts_amt: string;
  current_month_outlays_amt: string;
  current_month_surplus_deficit_amt: string;
  current_fytd_receipts_amt: string;
  current_fytd_outlays_amt: string;
  current_fytd_surplus_deficit_amt: string;
  prior_fytd_receipts_amt: string;
  prior_fytd_outlays_amt: string;
  prior_fytd_surplus_deficit_amt: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

export interface MtsTable5 {
  record_date: string;
  parent_id: string;
  classification_id: string;
  classification_desc: string;
  current_month_gross_amt: string;
  current_month_refund_amt: string;
  current_month_net_amt: string;
  current_fytd_gross_amt: string;
  current_fytd_refund_amt: string;
  current_fytd_net_amt: string;
  prior_fytd_gross_amt: string;
  prior_fytd_refund_amt: string;
  prior_fytd_net_amt: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}

// ── Exchange Rate types ────────────────────────────────────────────

export interface ExchangeRate {
  record_date: string;
  country_currency_desc: string;
  exchange_rate: string;
  effective_date: string;
  src_line_nbr: string;
  record_fiscal_year: string;
  record_fiscal_quarter: string;
  record_calendar_year: string;
  record_calendar_quarter: string;
  record_calendar_month: string;
  record_calendar_day: string;
}
