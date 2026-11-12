/**
 * Exchange Rate Update Script
 * 
 * Fetches latest rates from open.er-api.com (free, no API key required)
 * and generates ./js/currency.js for use by all calculator pages.
 * 
 * Usage: node scripts/update-rates.js
 * 
 * Run this script periodically (e.g., weekly) to keep rates current.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

function fetchRates() {
  return new Promise((resolve, reject) => {
    const url = 'https://open.er-api.com/v6/latest/USD';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.result === 'success') {
            resolve(json);
          } else {
            reject(new Error('API returned error: ' + JSON.stringify(json)));
          }
        } catch (e) {
          reject(new Error('Failed to parse API response: ' + e.message));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function generateCurrencyJS(rates, timeLastUpdateUtc) {
  const lines = [
    '/**',
    ' * Currency exchange rates for CPM Calculator',
    ` * Base currency: USD`,
    ` * Last updated: ${timeLastUpdateUtc}`,
    ' * Source: open.er-api.com (free, no API key)',
    ' * ',
    ' * To update rates, run: node scripts/update-rates.js',
    ' */',
    ''
  ];

  lines.push('var currencies = {');
  
  for (const currency of SUPPORTED_CURRENCIES) {
    const rate = rates[currency.code];
    if (rate !== undefined) {
      const roundedRate = Math.round(rate * 100) / 100;
      lines.push(`  ${currency.code}: { rate: ${roundedRate}, symbol: '${currency.symbol}', name: '${currency.name}' },`);
    }
  }
  
  lines.push('};');
  lines.push('');
  
  return lines.join('\n');
}

async function main() {
  console.log('Fetching latest exchange rates from open.er-api.com...');
  
  try {
    const data = await fetchRates();
    const timeLastUpdateUtc = data.time_last_update_utc;
    
    console.log(`Rates received, last updated: ${timeLastUpdateUtc}`);
    
    const currencyJS = generateCurrencyJS(data.rates, timeLastUpdateUtc);
    const outputPath = path.join(__dirname, '..', 'js', 'currency.js');
    
    fs.writeFileSync(outputPath, currencyJS, 'utf-8');
    console.log(`✓ Generated ${outputPath}`);
    console.log(`  Supported currencies: ${SUPPORTED_CURRENCIES.length}`);
    console.log(`\nDone! Exchange rates are now up to date.`);
    
  } catch (error) {
    console.error('✗ Failed to update exchange rates:', error.message);
    console.error('\nThis script uses the free open.er-api.com API which requires no key.');
    console.error('If the API is temporarily unavailable, try again later.');
    process.exit(1);
  }
}

main();
