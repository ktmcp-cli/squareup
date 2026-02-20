# Square CLI — Agent Instructions

This is the **Square CLI** — a command-line tool for managing Square payments, customers, orders, and locations.

## What This CLI Does

Square is a payment processing platform. This CLI lets you:
- List and retrieve payment transactions
- Manage customer database
- Query orders
- View business locations
- Work with both production and sandbox environments

## Installation

```bash
npm install -g @ktmcp-cli/squareup
```

## Configuration

**Required:** Get an access token from https://developer.squareup.com/

```bash
squareup config set --access-token YOUR_ACCESS_TOKEN
squareup config set --environment production  # or sandbox
squareup config show
```

## Key Commands

```bash
# Payments
squareup payments list
squareup payments get <payment-id>

# Customers
squareup customers list
squareup customers get <customer-id>
squareup customers search "email@example.com"

# Orders
squareup orders get <order-id>

# Locations
squareup locations

# JSON output
squareup payments list --json
```

## When to Use This CLI

Use this CLI when you need to:
- Query payment transaction history
- Look up customer details
- Retrieve order information
- List business locations
- Integrate Square data into automation workflows

## Sandbox vs Production

Square provides a sandbox environment for testing. Configure the environment:

```bash
# Sandbox (testing)
squareup config set --environment sandbox

# Production (live data)
squareup config set --environment production
```

## Output Formats

All commands support `--json` for structured output that can be parsed or piped to other tools.
