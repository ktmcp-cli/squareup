import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured } from './config.js';
import {
  listPayments,
  getPayment,
  listCustomers,
  getCustomer,
  createCustomer,
  searchCustomers,
  searchOrders,
  getOrder,
  listLocations,
  getLocation,
  listCatalog,
  searchCatalog
} from './api.js';

const program = new Command();

// ============================================================
// Helpers
// ============================================================

function printSuccess(message) {
  console.log(chalk.green('✓') + ' ' + message);
}

function printError(message) {
  console.error(chalk.red('✗') + ' ' + message);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

async function withSpinner(message, fn) {
  const spinner = ora(message).start();
  try {
    const result = await fn();
    spinner.stop();
    return result;
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

function requireAuth() {
  if (!isConfigured()) {
    printError('Access token not configured.');
    console.log('\nRun the following to configure:');
    console.log(chalk.cyan('  squareup config set --access-token YOUR_TOKEN'));
    console.log('\nGet your token at: https://developer.squareup.com/');
    process.exit(1);
  }
}

// ============================================================
// Program metadata
// ============================================================

program
  .name('squareup')
  .description(chalk.bold('Square CLI') + ' - Payments, customers, and orders from Square')
  .version('1.0.0');

// ============================================================
// CONFIG
// ============================================================

const configCmd = program.command('config').description('Manage CLI configuration');

configCmd
  .command('set')
  .description('Set configuration values')
  .option('--access-token <token>', 'Square access token')
  .option('--environment <env>', 'Environment: production or sandbox')
  .action((options) => {
    if (options.accessToken) {
      setConfig('accessToken', options.accessToken);
      printSuccess('Access token set');
    }
    if (options.environment) {
      setConfig('environment', options.environment);
      printSuccess(`Environment set to ${options.environment}`);
    }
    if (!options.accessToken && !options.environment) {
      printError('No options provided. Use --access-token or --environment');
    }
  });

configCmd
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const token = getConfig('accessToken');
    const env = getConfig('environment');
    console.log(chalk.bold('\nSquare CLI Configuration\n'));
    console.log('Access Token: ', token ? chalk.green(token.substring(0, 10) + '...') : chalk.red('not set'));
    console.log('Environment:  ', chalk.cyan(env));
    console.log('');
  });

// ============================================================
// PAYMENTS
// ============================================================

const paymentsCmd = program.command('payments').description('Manage payments');

paymentsCmd
  .command('list')
  .description('List recent payments')
  .option('--limit <n>', 'Limit results')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    requireAuth();

    try {
      const params = {};
      if (options.limit) params.limit = options.limit;

      const data = await withSpinner('Fetching payments...', () => listPayments(params));

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(chalk.bold('\nPayments\n'));
      if (data.payments && data.payments.length > 0) {
        data.payments.forEach((p) => {
          console.log(`${chalk.cyan(p.id)} - ${p.amount_money?.amount / 100} ${p.amount_money?.currency} - ${p.status}`);
        });
      } else {
        console.log(chalk.yellow('No payments found'));
      }
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

paymentsCmd
  .command('get <id>')
  .description('Get payment by ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    requireAuth();

    try {
      const data = await withSpinner(`Fetching payment ${id}...`, () => getPayment(id));

      if (options.json) {
        printJson(data);
        return;
      }

      const p = data.payment;
      console.log(chalk.bold('\nPayment Details\n'));
      console.log('ID:        ', chalk.cyan(p.id));
      console.log('Amount:    ', `${p.amount_money?.amount / 100} ${p.amount_money?.currency}`);
      console.log('Status:    ', chalk.green(p.status));
      console.log('Created:   ', p.created_at);
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// CUSTOMERS
// ============================================================

const customersCmd = program.command('customers').description('Manage customers');

customersCmd
  .command('list')
  .description('List customers')
  .option('--limit <n>', 'Limit results')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    requireAuth();

    try {
      const params = {};
      if (options.limit) params.limit = options.limit;

      const data = await withSpinner('Fetching customers...', () => listCustomers(params));

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(chalk.bold('\nCustomers\n'));
      if (data.customers && data.customers.length > 0) {
        data.customers.forEach((c) => {
          console.log(`${chalk.cyan(c.id)} - ${c.given_name} ${c.family_name} (${c.email_address || 'No email'})`);
        });
      } else {
        console.log(chalk.yellow('No customers found'));
      }
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

customersCmd
  .command('get <id>')
  .description('Get customer by ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    requireAuth();

    try {
      const data = await withSpinner(`Fetching customer ${id}...`, () => getCustomer(id));

      if (options.json) {
        printJson(data);
        return;
      }

      const c = data.customer;
      console.log(chalk.bold('\nCustomer Details\n'));
      console.log('ID:        ', chalk.cyan(c.id));
      console.log('Name:      ', `${c.given_name || ''} ${c.family_name || ''}`);
      console.log('Email:     ', c.email_address || 'N/A');
      console.log('Phone:     ', c.phone_number || 'N/A');
      console.log('Created:   ', c.created_at);
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

customersCmd
  .command('search <query>')
  .description('Search customers by name or email')
  .option('--json', 'Output as JSON')
  .action(async (query, options) => {
    requireAuth();

    try {
      const searchQuery = {
        query: {
          filter: {
            email_address: { fuzzy: query }
          }
        }
      };

      const data = await withSpinner('Searching customers...', () => searchCustomers(searchQuery));

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(chalk.bold('\nSearch Results\n'));
      if (data.customers && data.customers.length > 0) {
        data.customers.forEach((c) => {
          console.log(`${chalk.cyan(c.id)} - ${c.given_name} ${c.family_name} (${c.email_address})`);
        });
      } else {
        console.log(chalk.yellow('No customers found'));
      }
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// ORDERS
// ============================================================

const ordersCmd = program.command('orders').description('Manage orders');

ordersCmd
  .command('get <id>')
  .description('Get order by ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    requireAuth();

    try {
      const data = await withSpinner(`Fetching order ${id}...`, () => getOrder(id));

      if (options.json) {
        printJson(data);
        return;
      }

      const o = data.order;
      console.log(chalk.bold('\nOrder Details\n'));
      console.log('ID:        ', chalk.cyan(o.id));
      console.log('State:     ', chalk.green(o.state));
      console.log('Total:     ', `${o.total_money?.amount / 100} ${o.total_money?.currency}`);
      console.log('Created:   ', o.created_at);
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// LOCATIONS
// ============================================================

program
  .command('locations')
  .description('List business locations')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    requireAuth();

    try {
      const data = await withSpinner('Fetching locations...', () => listLocations());

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(chalk.bold('\nLocations\n'));
      if (data.locations && data.locations.length > 0) {
        data.locations.forEach((loc) => {
          console.log(`${chalk.cyan(loc.id)} - ${loc.name} (${loc.country})`);
        });
      } else {
        console.log(chalk.yellow('No locations found'));
      }
      console.log('');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// Parse
// ============================================================

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.help();
}
