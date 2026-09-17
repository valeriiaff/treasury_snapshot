# The Treasury Snapshot

**The Treasury Snapshot** is a simple, offline-first dashboard for tracking multi-currency cash balances, converting them into a single currency, and spotting liquidity risks.

---

## 💡 What Does It Do?

When a company holds money across multiple banks and currencies (like USD, EUR, GBP, or JPY), calculating total cash and currency risk in spreadsheets can be slow and messy.

**The Treasury Snapshot** solves this in seconds:
1. Load your bank accounts (via CSV or with one click using Demo data).
2. Choose your base currency (e.g., USD or EUR) and adjust exchange rates if needed.
3. Instantly see your consolidated total balance, currency risk breakdown, and alerts.

---

## ✨ Key Features

- 📂 **Easy CSV Import & Demo Data**: Drop your bank statement CSV file or select ready-to-use demo datasets to test right away.
- 💱 **Dynamic Currency Conversion**: Automatically converts all account balances into your chosen base reporting currency with custom live exchange rates.
- ⚠️ **>50% Liquidity Alert**: Automatically highlights accounts in red if any single account holds more than 50% of total company funds.
- 📊 **Visual Charts & Summaries**: Interactive exposure donut chart and breakdown by currency and bank.
- 💾 **Offline Standalone Export**: Download a single, portable `.html` file that works anywhere without an internet connection or server.
- 🔒 **100% Private & Secure**: All calculations run locally inside your browser. No financial data ever leaves your device.

---

## 📋 CSV File Format

Your CSV file should have columns for bank, account name, currency code, and balance:

```csv
Bank Name,Account Name,Currency,Balance
JPMorgan Chase,Main Operating,USD,14500000.00
BNP Paribas,European Operations,EUR,7250000.00
Barclays,UK Payroll,GBP,1890000.00
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the application
npm run dev

# 3. Build for production
npm run build
```

---

## 👤 Author

**Valeriia F**
