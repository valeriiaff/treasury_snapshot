export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Treasury Snapshot - Executive Liquidity Engine</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- CDN Dependencies -->
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    :root {
      --bg-dark: #0a0a0c;
      --card-bg: #16161a;
      --card-border: rgba(255, 255, 255, 0.07);
      --accent-cyan: #10B981;
      --accent-purple: #8B5CF6;
      --accent-emerald: #10B981;
      --accent-amber: #F59E0B;
      --accent-rose: #EC4899;
      --text-main: #F3F4F6;
      --text-muted: #9CA3AF;
      --font-display: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-body);
      min-height: 100vh;
      line-height: 1.5;
      background-image: 
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.06), transparent),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 32px 32px, 32px 32px;
      padding-bottom: 4rem;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    /* Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 1.15rem;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
    }

    .brand h1 {
      font-family: var(--font-display);
      font-size: 1.25rem;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-weight: 700;
      color: #FFFFFF;
    }

    .brand p {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-mono);
      border: none;
      outline: none;
    }

    .btn-primary {
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      font-weight: 700;
    }
    .btn-primary:hover {
      background: rgba(16, 185, 129, 0.25);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #E5E7EB;
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.725rem;
      font-family: var(--font-mono);
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.1);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #10B981;
      box-shadow: 0 0 8px #10B981;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 900px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .card-title {
      font-family: var(--font-display);
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #E2E8F0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* File Upload Box */
    .dropzone {
      border: 2px dashed #334155;
      border-radius: 12px;
      padding: 2.25rem 1.5rem;
      text-align: center;
      background: rgba(15, 23, 42, 0.4);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .dropzone:hover, .dropzone.dragover {
      border-color: var(--accent-cyan);
      background: rgba(0, 240, 255, 0.03);
      box-shadow: inset 0 0 20px rgba(0, 240, 255, 0.05);
    }

    .dropzone-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      color: var(--accent-cyan);
    }

    .dropzone p {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .file-input {
      display: none;
    }

    /* FX Rates Form */
    .fx-form-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      background: rgba(15, 23, 42, 0.5);
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .fx-form-controls label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-family: var(--font-display);
    }

    .select-input {
      background: #1E293B;
      color: #FFFFFF;
      border: 1px solid #334155;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      cursor: pointer;
    }

    .fx-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .fx-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 0.65rem 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .fx-item-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .fx-item-header strong {
      color: #FFFFFF;
      font-size: 0.85rem;
    }

    .fx-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .fx-input {
      width: 100%;
      background: #090D16;
      border: 1px solid #334155;
      color: var(--accent-cyan);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      font-weight: 600;
      transition: border-color 0.2s;
    }

    .fx-input:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
    }

    /* KPI Highlights */
    .kpi-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 900px) {
      .kpi-row {
        grid-template-columns: 1fr;
      }
    }

    .kpi-card {
      background: linear-gradient(145deg, #0E1420 0%, #131B2C 100%);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.5rem;
      position: relative;
    }

    .kpi-card.hero {
      border-color: rgba(0, 240, 255, 0.3);
      box-shadow: 0 0 30px rgba(0, 240, 255, 0.07);
    }

    .kpi-card.hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #00F0FF, #3B82F6);
    }

    .kpi-label {
      font-size: 0.775rem;
      font-family: var(--font-display);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .kpi-value {
      font-family: var(--font-mono);
      font-size: 2.2rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .kpi-currency-badge {
      font-size: 0.9rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: rgba(0, 240, 255, 0.15);
      color: var(--accent-cyan);
      border: 1px solid rgba(0, 240, 255, 0.3);
    }

    .kpi-subtext {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    /* Dashboard Main Grid: Chart & Breakdown */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 960px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    .chart-container {
      position: relative;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tables */
    .table-responsive {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      text-align: left;
    }

    th {
      font-family: var(--font-display);
      font-size: 0.725rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--card-border);
      background: rgba(15, 23, 42, 0.4);
    }

    td {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid rgba(30, 41, 59, 0.5);
      font-family: var(--font-mono);
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .currency-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .progress-bar-container {
      width: 100%;
      height: 6px;
      background: #1E293B;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.25rem;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.4s ease;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted);
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <div class="brand">
        <div class="brand-icon">TS</div>
        <div>
          <h1>The Treasury Snapshot</h1>
          <p>Autonomous Global Liquidity Engine</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="badge-status">
          <span class="badge-dot"></span>
          <span>OFFLINE LOCAL ENGINE</span>
        </div>
        <button class="btn btn-secondary" onclick="loadSampleData()">
          ⚡ Load Studio Demo
        </button>
        <button class="btn btn-secondary" onclick="downloadTemplateCsv()">
          📥 Template CSV
        </button>
      </div>
    </header>

    <!-- Upload & FX Matrix Row -->
    <div class="grid-2">
      <!-- File Upload Card -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📁 Input 1: Bank Cash Report (.CSV)</h2>
          <span id="file-status" style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">No file chosen</span>
        </div>
        <div class="dropzone" id="dropzone" onclick="document.getElementById('csv-file').click()">
          <div class="dropzone-icon">⚡</div>
          <p><strong>Click to browse</strong> or drag & drop treasury CSV</p>
          <p style="font-size: 0.75rem; opacity: 0.7;">Expected columns: Bank Name, Account Name, Currency, Balance</p>
          <input type="file" id="csv-file" class="file-input" accept=".csv" />
        </div>
      </div>

      <!-- Dynamic FX Rates Card -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">💱 Input 2: Dynamic FX Rates</h2>
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="resetFxRates()">
            Reset Defaults
          </button>
        </div>
        <div class="fx-form-controls">
          <label for="base-currency-select">Base Currency:</label>
          <select id="base-currency-select" class="select-input" onchange="handleBaseCurrencyChange()">
            <option value="USD" selected>USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CHF">CHF - Swiss Franc</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="PLN">PLN - Polish Złoty</option>
          </select>
        </div>
        <div id="fx-rates-container" class="fx-grid">
          <div style="grid-column: 1 / -1; color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 1.5rem;">
            Upload a CSV to generate currency exchange rate fields.
          </div>
        </div>
      </div>
    </div>

    <!-- Output Dashboard (Shown when data is loaded) -->
    <div id="dashboard-output">
      <!-- Headline KPI Metrics -->
      <div class="kpi-row">
        <!-- Main Headline Metric -->
        <div class="kpi-card hero">
          <div class="kpi-label">Headline Metric</div>
          <div style="font-size: 1rem; font-weight: 600; color: var(--accent-cyan); margin-bottom: 0.25rem;">
            Total Consolidated Global Liquidity
          </div>
          <div class="kpi-value">
            <span id="kpi-total-liquidity">$0.00</span>
            <span class="kpi-currency-badge" id="kpi-base-badge">USD</span>
          </div>
          <div class="kpi-subtext" id="kpi-accounts-subtext">0 accounts across 0 banking institutions</div>
        </div>

        <!-- Metric 2: Primary Exposure Risk -->
        <div class="kpi-card">
          <div class="kpi-label">Currency Concentration</div>
          <div style="font-size: 0.9rem; font-weight: 600; color: #FFFFFF; margin-bottom: 0.25rem;">
            Primary Currency Exposure
          </div>
          <div class="kpi-value" style="font-size: 1.6rem;">
            <span id="kpi-primary-curr">--</span>
            <span style="font-size: 1.1rem; color: var(--accent-cyan);" id="kpi-primary-pct">0%</span>
          </div>
          <div class="kpi-subtext" id="kpi-primary-subtext">Portfolio concentration</div>
        </div>

        <!-- Metric 3: Non-Base FX Exposure -->
        <div class="kpi-card">
          <div class="kpi-label">Foreign Exchange Risk</div>
          <div style="font-size: 0.9rem; font-weight: 600; color: #FFFFFF; margin-bottom: 0.25rem;">
            Non-Base FX Exposure
          </div>
          <div class="kpi-value" style="font-size: 1.6rem;">
            <span id="kpi-foreign-val">$0.00</span>
          </div>
          <div class="kpi-subtext" id="kpi-foreign-pct">0% of total cash holdings</div>
        </div>
      </div>

      <!-- Dashboard Visual & Table Row -->
      <div class="dashboard-grid">
        <!-- Visual Donut Chart -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">📊 Currency Risk & Allocation</h2>
          </div>
          <div class="chart-container">
            <canvas id="currencyDonutChart"></canvas>
          </div>
        </div>

        <!-- Breakdown Table Grouped by Currency -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">📑 Cash Balances by Currency</h2>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th style="text-align: right;">Raw Balance</th>
                  <th style="text-align: right;">FX Rate</th>
                  <th style="text-align: right;">Consolidated (<span class="base-ccy-label">USD</span>)</th>
                  <th style="text-align: right;">% Share</th>
                </tr>
              </thead>
              <tbody id="currency-table-body">
                <!-- Dynamically generated rows -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Detailed Accounts Ledger -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🏦 Consolidated Account Ledger</h2>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);" id="ledger-count-badge">0 records</span>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Bank Institution</th>
                <th>Account Name</th>
                <th>Currency</th>
                <th style="text-align: right;">Raw Balance</th>
                <th style="text-align: right;">Normalized Balance (<span class="base-ccy-label">USD</span>)</th>
              </tr>
            </thead>
            <tbody id="ledger-table-body">
              <!-- Dynamically populated accounts -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    // --- Application State ---
    const STATE = {
      accounts: [],
      currencies: [],
      fxRates: {},
      baseCurrency: 'USD',
      chartInstance: null
    };

    const CURRENCY_META = {
      USD: { name: 'US Dollar', symbol: '$', rate: 1.0, color: '#00F0FF' },
      EUR: { name: 'Euro', symbol: '€', rate: 1.08, color: '#3B82F6' },
      PLN: { name: 'Polish Złoty', symbol: 'zł', rate: 0.25, color: '#EC4899' },
      UAH: { name: 'Ukrainian Hryvnia', symbol: '₴', rate: 0.024, color: '#FACC15' },
      GBP: { name: 'British Pound', symbol: '£', rate: 1.28, color: '#8B5CF6' },
      JPY: { name: 'Japanese Yen', symbol: '¥', rate: 0.0067, color: '#EF4444' },
      CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 0.74, color: '#F97316' },
      CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 1.13, color: '#10B981' }
    };

    const PALETTE = ['#00F0FF', '#3B82F6', '#EC4899', '#FACC15', '#10B981', '#8B5CF6', '#F97316', '#06B6D4', '#EF4444'];

    // --- File Drop & Input Handlers ---
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('csv-file');

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length) handleFile(files[0]);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
      document.getElementById('file-status').textContent = file.name;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        complete: function(results) {
          processParsedData(results.data);
        },
        error: function(err) {
          alert('Error parsing CSV: ' + err.message);
        }
      });
    }

    // --- Demo Data Generator ---
    function loadSampleData() {
      const sampleCsv = \`Bank Name,Account Name,Currency,Balance
JPMorgan Chase,Steam Valve Primary Payout,USD,14500000.00
JPMorgan Chase,PlayStation Store Settlements,USD,8920000.50
Bank of America,Epic Games Royalty Payout,USD,3410500.00
BNP Paribas,EU Publishing & Regional HQ,EUR,7250000.00
Deutsche Bank,Berlin Core R&D Operations,EUR,2180000.00
PKO Bank Polski,Warsaw Engine & Rendering Lab,PLN,18450000.00
Santander Bank Polska,Kraków Art Studio Payroll,PLN,6320000.00
PrivatBank,Kyiv Animation & Rigging Hub,UAH,42800000.00
Barclays,London Audio & Orchestral Stage,GBP,1890000.00
Mitsubishi UFJ,Tokyo QA & Localization Center,JPY,485000000
Royal Bank of Canada,Montreal Motion Capture Facility,CAD,3240000.00
UBS Switzerland,Zurich IP & Franchise Holdings,CHF,4150000.00\`;

      document.getElementById('file-status').textContent = 'nexus_studio_treasury_demo.csv';
      Papa.parse(sampleCsv, {
        header: true,
        skipEmptyLines: 'greedy',
        complete: function(results) {
          processParsedData(results.data);
        }
      });
    }

    function downloadTemplateCsv() {
      const template = "Bank Name,Account Name,Currency,Balance\\nJPMorgan Chase,Main Operating Account,USD,5000000.00\\nBNP Paribas,EU Payroll,EUR,2500000.00\\nPKO Bank Polski,Warsaw Studio,PLN,8000000.00\\nPrivatBank,Kyiv Dev Hub,UAH,15000000.00";
      const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'treasury_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // --- Processing & Calculation Engine ---
    function processParsedData(rows) {
      const accounts = [];
      const currSet = new Set();

      rows.forEach((row, idx) => {
        const keys = Object.keys(row);
        const bankKey = keys.find(k => /bank/i.test(k)) || keys[0];
        const accKey = keys.find(k => /account/i.test(k)) || keys[1];
        const currKey = keys.find(k => /curr/i.test(k)) || keys[2];
        const balKey = keys.find(k => /balance|amount/i.test(k)) || keys[3];

        if (!currKey || !balKey) return;

        const rawBank = (row[bankKey] || 'Bank Institution').trim();
        const rawAcc = (row[accKey] || 'Account ' + (idx + 1)).trim();
        const rawCurr = (row[currKey] || 'USD').trim().toUpperCase();
        const rawBalStr = String(row[balKey] || '').replace(/[$€£¥₴zł,\\s]/g, '');
        const balance = parseFloat(rawBalStr);

        if (!isNaN(balance)) {
          currSet.add(rawCurr);
          accounts.push({
            id: 'acc-' + idx,
            bankName: rawBank,
            accountName: rawAcc,
            currency: rawCurr,
            rawBalance: balance
          });
        }
      });

      STATE.accounts = accounts;
      STATE.currencies = Array.from(currSet).sort();

      // Initialize FX rates
      populateFxRateInputs();
      recalculateAndRender();
    }

    function populateFxRateInputs() {
      const container = document.getElementById('fx-rates-container');
      container.innerHTML = '';

      const base = STATE.baseCurrency;
      const baseUsdRate = CURRENCY_META[base]?.rate || 1.0;

      STATE.currencies.forEach((curr) => {
        let rate = STATE.fxRates[curr];
        if (rate === undefined) {
          if (curr === base) {
            rate = 1.0;
          } else {
            const currUsdRate = CURRENCY_META[curr]?.rate || 1.0;
            rate = Math.round((currUsdRate / baseUsdRate) * 1000000) / 1000000;
          }
          STATE.fxRates[curr] = rate;
        }

        const isBase = curr === base;
        const item = document.createElement('div');
        item.className = 'fx-item';
        item.innerHTML = \`
          <div class="fx-item-header">
            <strong>\${curr}</strong>
            <span>\${isBase ? 'BASE' : '1 ' + curr + ' ='}</span>
          </div>
          <div class="fx-input-wrap">
            <input type="number" step="any" class="fx-input" 
                   value="\${rate}" 
                   \${isBase ? 'disabled' : ''}
                   onchange="updateFxRate('\${curr}', this.value)" />
          </div>
        \`;
        container.appendChild(item);
      });
    }

    function updateFxRate(currency, value) {
      const num = parseFloat(value);
      if (!isNaN(num) && num > 0) {
        STATE.fxRates[currency] = num;
        recalculateAndRender();
      }
    }

    function handleBaseCurrencyChange() {
      const select = document.getElementById('base-currency-select');
      STATE.baseCurrency = select.value;
      STATE.fxRates = {}; // Reset rates to auto-compute relative to new base
      populateFxRateInputs();
      recalculateAndRender();
    }

    function resetFxRates() {
      STATE.fxRates = {};
      populateFxRateInputs();
      recalculateAndRender();
    }

    // --- The Engine & Render ---
    function recalculateAndRender() {
      if (!STATE.accounts.length) return;

      const base = STATE.baseCurrency;
      document.querySelectorAll('.base-ccy-label').forEach(el => el.textContent = base);
      document.getElementById('kpi-base-badge').textContent = base;

      let totalLiquidity = 0;
      const currencyGroups = {};

      // Normalize each account
      STATE.accounts.forEach(acc => {
        const rate = (acc.currency === base) ? 1.0 : (STATE.fxRates[acc.currency] || 1.0);
        const normalized = acc.rawBalance * rate;
        acc.normalizedBalance = normalized;
        totalLiquidity += normalized;

        if (!currencyGroups[acc.currency]) {
          currencyGroups[acc.currency] = {
            currency: acc.currency,
            totalRaw: 0,
            normalized: 0,
            count: 0
          };
        }
        currencyGroups[acc.currency].totalRaw += acc.rawBalance;
        currencyGroups[acc.currency].normalized += normalized;
        currencyGroups[acc.currency].count += 1;
      });

      const summaries = Object.values(currencyGroups).map(g => {
        const rate = (g.currency === base) ? 1.0 : (STATE.fxRates[g.currency] || 1.0);
        const pct = totalLiquidity > 0 ? (g.normalized / totalLiquidity) * 100 : 0;
        return { ...g, rate, percentageShare: pct };
      }).sort((a, b) => b.normalized - a.normalized);

      // Render Headline Metrics
      document.getElementById('kpi-total-liquidity').textContent = formatMoney(totalLiquidity, base);
      const uniqueBanks = new Set(STATE.accounts.map(a => a.bankName)).size;
      document.getElementById('kpi-accounts-subtext').textContent = \`\${STATE.accounts.length} accounts across \${uniqueBanks} institutions\`;

      // Primary Exposure
      if (summaries.length) {
        document.getElementById('kpi-primary-curr').textContent = summaries[0].currency;
        document.getElementById('kpi-primary-pct').textContent = summaries[0].percentageShare.toFixed(1) + '%';
        document.getElementById('kpi-primary-subtext').textContent = formatMoney(summaries[0].normalized, base);
      }

      // Foreign FX Exposure
      const foreignTotal = summaries.filter(s => s.currency !== base).reduce((sum, s) => sum + s.normalized, 0);
      const foreignPct = totalLiquidity > 0 ? (foreignTotal / totalLiquidity) * 100 : 0;
      document.getElementById('kpi-foreign-val').textContent = formatMoney(foreignTotal, base);
      document.getElementById('kpi-foreign-pct').textContent = \`\${foreignPct.toFixed(1)}% in non-\${base} holdings\`;

      // Render Currency Breakdown Table
      const tableBody = document.getElementById('currency-table-body');
      tableBody.innerHTML = '';

      summaries.forEach((s, idx) => {
        const color = CURRENCY_META[s.currency]?.color || PALETTE[idx % PALETTE.length];
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td>
            <span class="currency-pill">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:\${color};"></span>
              \${s.currency}
            </span>
          </td>
          <td style="text-align: right;">\${formatMoney(s.totalRaw, s.currency)}</td>
          <td style="text-align: right; color: var(--accent-cyan);">\${s.rate.toFixed(4)}</td>
          <td style="text-align: right; font-weight: 700; color: #FFFFFF;">\${formatMoney(s.normalized, base)}</td>
          <td style="text-align: right;">
            <div>\${s.percentageShare.toFixed(1)}%</div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: \${s.percentageShare}%; background: \${color};"></div>
            </div>
          </td>
        \`;
        tableBody.appendChild(tr);
      });

      // Render Ledger Table
      const ledgerBody = document.getElementById('ledger-table-body');
      ledgerBody.innerHTML = '';
      document.getElementById('ledger-count-badge').textContent = \`\${STATE.accounts.length} accounts\`;

      STATE.accounts.forEach(acc => {
        const isOverThreshold = totalLiquidity > 0 && (acc.normalizedBalance / totalLiquidity) > 0.5;
        const pct = totalLiquidity > 0 ? ((acc.normalizedBalance / totalLiquidity) * 100).toFixed(1) : '0.0';
        const tr = document.createElement('tr');
        if (isOverThreshold) {
          tr.style.background = 'rgba(239, 68, 68, 0.12)';
          tr.style.borderLeft = '4px solid #EF4444';
        }
        tr.innerHTML = \`
          <td style="color: \${isOverThreshold ? '#FECACA' : '#FFFFFF'}; font-weight: 500;">
            \${acc.bankName}
          </td>
          <td style="color: \${isOverThreshold ? '#FCA5A5' : 'var(--text-muted)'};">
            \${acc.accountName}
            \${isOverThreshold ? \`<span style="display:inline-block; margin-left:6px; font-size:0.7rem; font-weight:700; color:#EF4444; background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.4); padding:2px 6px; border-radius:4px;">⚠️ &gt;50% Liquidity (\${pct}%)</span>\` : ''}
          </td>
          <td><span class="currency-pill" style="\${isOverThreshold ? 'background:rgba(239,68,68,0.2); border-color:rgba(239,68,68,0.4); color:#FECACA;' : ''}">\${acc.currency}</span></td>
          <td style="text-align: right; color: \${isOverThreshold ? '#FECACA' : 'inherit'};">\${formatMoney(acc.rawBalance, acc.currency)}</td>
          <td style="text-align: right; color: \${isOverThreshold ? '#EF4444' : 'var(--accent-cyan)'}; font-weight: \${isOverThreshold ? '700' : '600'};">\${formatMoney(acc.normalizedBalance, base)}</td>
        \`;
        ledgerBody.appendChild(tr);
      });

      // Render Donut Chart
      renderDonutChart(summaries);
    }

    function renderDonutChart(summaries) {
      const ctx = document.getElementById('currencyDonutChart').getContext('2d');
      const labels = summaries.map(s => s.currency);
      const data = summaries.map(s => s.normalized);
      const colors = summaries.map((s, idx) => CURRENCY_META[s.currency]?.color || PALETTE[idx % PALETTE.length]);

      if (STATE.chartInstance) {
        STATE.chartInstance.destroy();
      }

      STATE.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#0E1420',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#94A3B8',
                font: { family: 'Plus Jakarta Sans', size: 12 },
                padding: 16
              }
            },
            tooltip: {
              backgroundColor: '#0E1420',
              titleColor: '#FFFFFF',
              bodyColor: '#00F0FF',
              borderColor: '#1E293B',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const val = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                  return \` \${context.label}: \${formatMoney(val, STATE.baseCurrency)} (\${pct}%)\`;
                }
              }
            }
          }
        }
      });
    }

    function formatMoney(amount, currency) {
      const symbol = CURRENCY_META[currency]?.symbol || currency;
      return symbol + ' ' + new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }

    // Auto-load sample demo data on first start
    window.addEventListener('DOMContentLoaded', () => {
      loadSampleData();
    });
  </script>
</body>
</html>`;
}
