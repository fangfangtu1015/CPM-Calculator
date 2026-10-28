/**
 * Currency exchange rates for CPM Calculator
 * Base currency: USD
 * Last updated: Mon, 26 Oct 2026 00:02:31 +0000
 * Source: open.er-api.com (free, no API key)
 * 
 * To update rates, run: node scripts/update-rates.js
 */

var currencies = {
  USD: { rate: 1, symbol: '$', name: 'US Dollar' },
  EUR: { rate: 0.89, symbol: '€', name: 'Euro' },
  GBP: { rate: 0.75, symbol: '£', name: 'British Pound' },
  CNY: { rate: 6.68, symbol: '¥', name: 'Chinese Yuan' },
  JPY: { rate: 156.87, symbol: '¥', name: 'Japanese Yen' },
  INR: { rate: 95.16, symbol: '₹', name: 'Indian Rupee' },
  CAD: { rate: 1.4, symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { rate: 1.42, symbol: 'A$', name: 'Australian Dollar' },
  BRL: { rate: 5, symbol: 'R$', name: 'Brazilian Real' },
  KRW: { rate: 1323.9, symbol: '₩', name: 'Korean Won' },
  MXN: { rate: 18.72, symbol: 'MX$', name: 'Mexican Peso' },
  SGD: { rate: 1.28, symbol: 'S$', name: 'Singapore Dollar' },
  CHF: { rate: 0.82, symbol: 'CHF', name: 'Swiss Franc' },
  HKD: { rate: 7.84, symbol: 'HK$', name: 'Hong Kong Dollar' },
  ZAR: { rate: 16.6, symbol: 'R', name: 'South African Rand' },
};
