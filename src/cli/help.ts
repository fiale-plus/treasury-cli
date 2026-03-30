export const MAIN_HELP = `treasury-cli — Unofficial CLI for the US Treasury Fiscal Data API

USAGE
  treasury <command> [options]

COMMANDS
  debt                     Total public debt (debt to the penny)
  debt history             Debt with date range filter
  debt mspd                Monthly statement of public debt
  rates                    Average interest rates on Treasury securities
  cash                     Operating cash balance (Daily Treasury Statement)
  deposits                 Deposits & withdrawals of operating cash
  debt-transactions        Public debt transactions
  debt-limit               Debt subject to limit
  tax-deposits             Federal tax deposits
  refunds                  Income tax refunds issued
  spending                 Monthly receipts & outlays (MTS Table 1)
  revenue                  Receipts by source (MTS Table 5)
  exchange                 Foreign exchange rates
  query <endpoint>         Raw query any Fiscal Data endpoint

GLOBAL OPTIONS
  -f, --format <json|csv|table>    Output format (default: json)
  --limit <n>                      Max results per page (page size)
  --sort <field>                   Sort field (-field for descending)
  --filter <field:op:value>        Filter expression
  --fields <field1,field2>         Comma-separated fields to return
  --page <n>                       Page number
  --page-size <n>                  Page size (alias for --limit)
  --help                           Show help
  --version                        Show version

FILTER OPERATORS
  eq, lt, lte, gt, gte, in, range
  Example: --filter "record_date:gte:2024-01-01"

EXAMPLES
  treasury debt
  treasury debt history --filter "record_date:gte:2024-01-01" --limit 10
  treasury rates --limit 20
  treasury cash --limit 5
  treasury exchange --filter "country_currency_desc:eq:Canada-Dollar"
  treasury spending --limit 10
  treasury query v2/accounting/od/debt_to_penny --limit 5

DISCLAIMER
  This tool is NOT affiliated with the US Department of the Treasury
  or any government entity. Data is sourced from the publicly available
  Treasury Fiscal Data API (https://fiscaldata.treasury.gov/).
`;

export const DEBT_HELP = `treasury debt — Total public debt outstanding

USAGE
  treasury debt                                    Latest debt to the penny
  treasury debt history                            Debt with date range
  treasury debt mspd                               Monthly statement of public debt

EXAMPLES
  treasury debt
  treasury debt history --filter "record_date:gte:2024-01-01" --limit 30
  treasury debt history --sort "-record_date" --limit 10
  treasury debt mspd --limit 20
`;

export const DTS_HELP = `treasury cash/deposits/debt-transactions/debt-limit/tax-deposits/refunds — Daily Treasury Statement

USAGE
  treasury cash                                    Operating cash balance
  treasury deposits                                Deposits & withdrawals
  treasury debt-transactions                       Public debt transactions
  treasury debt-limit                              Debt subject to limit
  treasury tax-deposits                            Federal tax deposits
  treasury refunds                                 Income tax refunds issued

EXAMPLES
  treasury cash --limit 5
  treasury deposits --limit 10 --sort "-record_date"
  treasury debt-limit --filter "record_date:gte:2024-01-01"
`;

export const MTS_HELP = `treasury spending/revenue — Monthly Treasury Statement

USAGE
  treasury spending                                Receipts & outlays (MTS Table 1)
  treasury revenue                                 Receipts by source (MTS Table 5)

EXAMPLES
  treasury spending --limit 20
  treasury revenue --limit 10 --sort "-record_date"
`;

export const EXCHANGE_HELP = `treasury exchange — Foreign exchange rates

USAGE
  treasury exchange                                All exchange rates

EXAMPLES
  treasury exchange --limit 20
  treasury exchange --filter "country_currency_desc:eq:Canada-Dollar"
  treasury exchange --sort "-record_date" --limit 10
`;

export const QUERY_HELP = `treasury query — Raw query any Fiscal Data endpoint

USAGE
  treasury query <endpoint>                        Query any endpoint path

The endpoint path is relative to the Fiscal Data API base URL.
All global options (--filter, --sort, --fields, --limit, etc.) apply.

EXAMPLES
  treasury query v2/accounting/od/debt_to_penny --limit 5
  treasury query v1/accounting/od/rates_of_exchange --filter "country_currency_desc:eq:Japan-Yen"
  treasury query v1/accounting/dts/operating_cash_balance --fields "record_date,close_today_bal"
`;
