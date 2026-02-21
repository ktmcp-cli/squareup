![Banner](https://raw.githubusercontent.com/ktmcp-cli/squareup/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Square CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with Square, Inc.

A production-ready command-line interface for [Square](https://squareup.com/) — manage payments, customers, orders, and locations directly from your terminal.

## Features

- **Payments** — List and retrieve payment details
- **Customers** — Manage customer database and search
- **Orders** — Query and manage orders
- **Locations** — View business locations
- **Sandbox Support** — Test with Square sandbox environment
- **JSON output** — All commands support `--json` for scripting

## Installation

```bash
npm install -g @ktmcp-cli/squareup
```

## Quick Start

```bash
# Get your access token at https://developer.squareup.com/
squareup config set --access-token YOUR_ACCESS_TOKEN

# List recent payments
squareup payments list

# List customers
squareup customers list

# Get payment details
squareup payments get PAYMENT_ID
```

## Commands

### Config

```bash
squareup config set --access-token <token>
squareup config set --environment sandbox   # Use sandbox for testing
squareup config show
```

### Payments

```bash
squareup payments list                   # List recent payments
squareup payments list --limit 10
squareup payments get <payment-id>       # Get payment details
squareup payments list --json            # JSON output
```

### Customers

```bash
squareup customers list                  # List all customers
squareup customers get <customer-id>     # Get customer details
squareup customers search "john@example.com"
squareup customers list --json
```

### Orders

```bash
squareup orders get <order-id>           # Get order details
squareup orders get <order-id> --json
```

### Locations

```bash
squareup locations                       # List business locations
squareup locations --json
```

## JSON Output

All commands support `--json` for structured output:

```bash
squareup payments list --json | jq '.[0].amount_money'
squareup customers list --json | jq '.customers[].email_address'
```

## Sandbox vs Production

```bash
# Use sandbox for testing
squareup config set --environment sandbox --access-token SANDBOX_TOKEN

# Switch to production
squareup config set --environment production --access-token PROD_TOKEN
```

## Why CLI > MCP?

No server to run. No protocol overhead. Just install and go.

- **Simpler** — Just a binary you call directly
- **Composable** — Pipe to `jq`, `grep`, `awk`
- **Scriptable** — Works in cron jobs, CI/CD, shell scripts

## License

MIT — Part of the [Kill The MCP](https://killthemcp.com) project.


---

## Support KTMCP

If you find this CLI useful, we'd greatly appreciate your support! Share your experience on:
- Reddit
- Twitter/X
- Hacker News

**Incentive:** Users who can demonstrate that their support/advocacy helped advance KTMCP will have their feature requests and issues prioritized.

Just be mindful - these are real accounts and real communities. Authentic mentions and genuine recommendations go a long way!

## Support This Project

If you find this CLI useful, we'd appreciate support across Reddit, Twitter, Hacker News, or Moltbook. Please be mindful - these are real community accounts. Contributors who can demonstrate their support helped advance KTMCP will have their PRs and feature requests prioritized.
