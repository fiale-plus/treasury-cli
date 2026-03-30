# @fiale-plus/treasury-cli

[![npm version](https://img.shields.io/npm/v/@fiale-plus/treasury-cli.svg)](https://www.npmjs.com/package/@fiale-plus/treasury-cli)
[![npm downloads](https://img.shields.io/npm/dm/@fiale-plus/treasury-cli.svg)](https://www.npmjs.com/package/@fiale-plus/treasury-cli)
[![Test](https://github.com/fiale-plus/treasury-cli/actions/workflows/test.yml/badge.svg)](https://github.com/fiale-plus/treasury-cli/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Unofficial** CLI and TypeScript client for the [US Treasury Fiscal Data API](https://fiscaldata.treasury.gov/) — designed for AI agents.

## Features

- **14 Treasury API endpoints** mapped to intuitive CLI commands
- **No API key required** — Treasury Fiscal Data API is completely open
- **Zero runtime dependencies** — Node 18+ native `fetch` and `parseArgs`
- **JSON output by default** — structured, agent-friendly, pipe to `jq`
- **CSV and table formats** — `--format csv` or `--format table` for human workflows
- **Truncation detection** — auto-adds `_truncated` and `_next_page` to JSON when results are paginated
- **TypeScript library** — import `TreasuryClient` for programmatic use with full type safety

## Quick Start

```bash
npm install -g @fiale-plus/treasury-cli

treasury debt
treasury rates --limit 20
treasury exchange --filter "country_currency_desc:eq:Canada-Dollar"
treasury cash --limit 5
```

No API key needed.

## Installation

```bash
# Global (CLI usage)
npm install -g @fiale-plus/treasury-cli

# Local (library usage)
npm install @fiale-plus/treasury-cli
```

Requires Node.js >= 18.0.0.

## CLI Usage

### Debt Commands

```bash
treasury debt                     # Latest total public debt
treasury debt history             # Debt with date range filter
treasury debt mspd                # Monthly statement of public debt
treasury rates                    # Average interest rates on Treasury securities
```

### Daily Treasury Statement Commands

```bash
treasury cash                     # Operating cash balance
treasury deposits                 # Deposits & withdrawals of operating cash
treasury debt-transactions        # Public debt transactions
treasury debt-limit               # Debt subject to limit
treasury tax-deposits             # Federal tax deposits
treasury refunds                  # Income tax refunds issued
```

### Monthly Treasury Statement Commands

```bash
treasury spending                 # Monthly receipts & outlays (MTS Table 1)
treasury revenue                  # Receipts by source (MTS Table 5)
```

### Exchange Rates

```bash
treasury exchange                 # Foreign exchange rates
```

### Raw Query

```bash
treasury query <endpoint>         # Query any Fiscal Data endpoint
```

### Common Options

| Flag | Description |
|------|-------------|
| `-f, --format <json\|csv\|table>` | Output format (default: `json`) |
| `--limit <n>` | Max results per page |
| `--sort <field>` | Sort field (`-field` for descending) |
| `--filter <field:op:value>` | Filter expression |
| `--fields <field1,field2>` | Comma-separated fields to return |
| `--page <n>` | Page number |
| `--page-size <n>` | Page size (alias for `--limit`) |

### Filter Operators

| Operator | Description |
|----------|-------------|
| `eq` | Equal to |
| `lt` | Less than |
| `lte` | Less than or equal to |
| `gt` | Greater than |
| `gte` | Greater than or equal to |
| `in` | In list |
| `range` | Within range |

Example: `--filter "record_date:gte:2024-01-01"`

### Pagination and Truncation

The API uses page-based pagination. When results span multiple pages:

- **JSON**: Adds `_truncated: true` and `_next_page` fields
- **Table**: Shows footer with page info
- **CSV**: Adds comment header with page info

## Library Usage

```typescript
import { TreasuryClient } from "@fiale-plus/treasury-cli";

const treasury = new TreasuryClient();

// Get latest total public debt
const debt = await treasury.getDebtToPenny({ page_size: 1, sort: "-record_date" });
console.log(debt.data[0].tot_pub_debt_out_amt);

// Get exchange rates for Canada
const rates = await treasury.getExchangeRates({
  filter: "country_currency_desc:eq:Canada-Dollar",
  sort: "-record_date",
  page_size: 5,
});
console.log(rates.data);

// Query any endpoint
const custom = await treasury.query("v1/accounting/dts/operating_cash_balance", {
  page_size: 10,
});
console.log(custom.data);
```

All endpoints are available as typed methods on `TreasuryClient`.

## Development

```bash
git clone https://github.com/fiale-plus/treasury-cli.git
cd treasury-cli
npm install
npm run build
npm test

# Dev mode (runs TypeScript directly)
npm run dev -- debt
npm run dev -- exchange --limit 5

# Integration tests (no API key needed)
npm run test:integration
```

## Disclaimer

This is an **unofficial**, **community-maintained** tool. It is **not affiliated with, endorsed by, or connected to the US Department of the Treasury**, the Bureau of the Fiscal Service, or any government entity.

This tool accesses the publicly available [Treasury Fiscal Data API](https://fiscaldata.treasury.gov/). Data retrieved through this tool is sourced from the US Treasury and is provided for informational purposes only. It should not be used as the sole basis for financial decisions. Always verify data against official sources.

This software is provided "AS IS" under the MIT License, without warranty of any kind.

## Links

- [Treasury Fiscal Data API Documentation](https://fiscaldata.treasury.gov/api-documentation/)
- [GitHub Repository](https://github.com/fiale-plus/treasury-cli)
- [npm Package](https://www.npmjs.com/package/@fiale-plus/treasury-cli)

## License

[MIT](LICENSE)
