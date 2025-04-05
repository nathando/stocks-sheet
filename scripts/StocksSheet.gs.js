// ===== REMEMBER: Make your own copy as the sheet are shared, other can see your api keys
// Replace with your Finnhub API key
const FINNHUB_API_KEY = "xxx";
// Replace with your Apla API key
const ALPHA_API_KEY = "yyy";

/*
  Google Finance (gf):   The metric name used in Google Finance.
  Finnhub (finnhub):    The metric name used in Finnhub API.
  Alpha Vantage (alpha): The metric name used in Alpha Vantage API.
*/
const METRIC_MAP = {
  // === Real-time & Price Metrics ===
  price:         { gf: "price",        finnhub: "quote.c",                       alpha: null },
  priceopen:     { gf: "priceopen",    finnhub: "quote.o",                       alpha: null },
  high:          { gf: "high",         finnhub: "quote.h",                       alpha: null },
  low:           { gf: "low",          finnhub: "quote.l",                       alpha: null },
  change:        { gf: "change",       finnhub: "quote.d",                       alpha: null },
  changepct:     { gf: "changepct",    finnhub: "quote.dp",                      alpha: null },
  closeyest:     { gf: "closeyest",    finnhub: "quote.pc",                      alpha: null },

  // === Trading Activity ===
  volume:        { gf: "volume",       finnhub: null,                            alpha: "Volume" },
  volumeavg:     { gf: "volumeavg",    finnhub: "metric.10DayAverageTradingVolume", alpha: "AverageDailyVolume10Day" },
  shares:        { gf: "shares",       finnhub: null,                            alpha: "SharesOutstanding" },
  tradetime:     { gf: "tradetime",    finnhub: null,                            alpha: null },
  datadelay:     { gf: "datadelay",    finnhub: null,                            alpha: null },

  // === Valuation Metrics ===
  marketcap:     { gf: "marketcap",    finnhub: "metric.marketCapitalization",   alpha: "MarketCapitalization" },
  pe:            { gf: "pe",           finnhub: "metric.peTTM",                  alpha: "PERatio" },
  eps:           { gf: "eps",          finnhub: "metric.epsTTM",                 alpha: "EPS" },
  pb:            { gf: null,           finnhub: "metric.pbAnnual",               alpha: "PriceToBookRatio" },
  ps:            { gf: null,           finnhub: "metric.psTTM",                  alpha: "PriceToSalesRatioTTM" },
  pfcf:          { gf: null,           finnhub: "metric.pfcfShareTTM",           alpha: null },
  evfcf:         { gf: null,           finnhub: "metric.currentEv/freeCashFlowTTM", alpha: null },

  // === Dividend & Yield ===
  dividend:      { gf: null,           finnhub: "metric.currentDividendYieldTTM", alpha: "DividendYield" },
  dividendper:   { gf: null,           finnhub: "metric.dividendPerShareTTM",    alpha: "DividendPerShare" },
  payout:        { gf: null,           finnhub: "metric.payoutRatioTTM",         alpha: "PayoutRatio" },
  dividendgrowth:{ gf: null,           finnhub: "metric.dividendGrowthRate5Y",   alpha: null },

  // === Growth Metrics ===
  epsgrowth3y:   { gf: null,           finnhub: "metric.epsGrowth3Y",            alpha: null },
  epsgrowth5y:   { gf: null,           finnhub: "metric.epsGrowth5Y",            alpha: null },
  revenuegrowth: { gf: null,           finnhub: "metric.revenueGrowthTTMYoy",    alpha: "RevenueTTM" },

  // === Per Share Metrics ===
  revpershare:   { gf: null,           finnhub: "metric.revenuePerShareTTM",     alpha: "RevenuePerShareTTM" },
  cfpershare:    { gf: null,           finnhub: "metric.cashFlowPerShareTTM",    alpha: null },
  bvps:          { gf: null,           finnhub: "metric.bookValuePerShareAnnual", alpha: "BookValue" },
  tbvps:         { gf: null,           finnhub: "metric.tangibleBookValuePerShareAnnual", alpha: null },

  // === Margins & Profitability ===
  grossmargin:   { gf: null,           finnhub: "metric.grossMarginTTM",         alpha: "GrossProfitMargin" },
  netmargin:     { gf: null,           finnhub: "metric.netProfitMarginTTM",     alpha: "ProfitMargin" },
  operatingmargin:{ gf: null,          finnhub: "metric.operatingMarginTTM",     alpha: "OperatingMarginTTM" },
  pretaxmargin:  { gf: null,           finnhub: "metric.pretaxMarginTTM",        alpha: null },
  roe:           { gf: null,           finnhub: "metric.roeTTM",                 alpha: "ReturnOnEquityTTM" },
  roa:           { gf: null,           finnhub: "metric.roaTTM",                 alpha: "ReturnOnAssetsTTM" },
  roi:           { gf: null,           finnhub: "metric.roiTTM",                 alpha: null },
  netincome:     { gf: null,           finnhub: null,                            alpha: "income.netIncome" },

  // === Ratios & Health ===
  currentratio:  { gf: null,           finnhub: "metric.currentRatioAnnual",     alpha: "CurrentRatio" },
  quickratio:    { gf: null,           finnhub: "metric.quickRatioAnnual",       alpha: "QuickRatio" },
  debttoequity:  { gf: null,           finnhub: "metric.totalDebt/totalEquityAnnual", alpha: "DebtEquityRatio" },
  longtermdebttoe: { gf: null,         finnhub: "metric.longTermDebt/equityAnnual", alpha: null },

  // === Volatility & Technical ===
  beta:          { gf: "beta",         finnhub: "metric.beta",                   alpha: "Beta" },
  high52:        { gf: "high52",       finnhub: "metric.52WeekHigh",             alpha: "52WeekHigh" },
  low52:         { gf: "low52",        finnhub: "metric.52WeekLow",              alpha: "52WeekLow" }
};

// Get the overview for a symbol from Alpha Vantage
function getAlphaOverview(symbol) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_API_KEY}`;
  const response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText());
}

// Get the latest report from Alpha Vantage
function getLatestReportFromAlpha(symbol) {
  const url = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${ALPHA_API_KEY}`;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  if (data.annualReports && data.annualReports.length > 0) {
    return data.annualReports[0];
  } else {
    return {};
  }
}

// Combine all apis to get the metric
function SMARTMETRIC(symbol, metricKey) {
  const metric = METRIC_MAP[metricKey.toLowerCase()];
  if (!metric) return "Unknown metric";

  // Finnhub fallback
  if (metric.finnhub) {
    try {
      if (metric.finnhub.startsWith("quote.")) {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const json = JSON.parse(UrlFetchApp.fetch(url).getContentText());
        const key = metric.finnhub.split(".")[1];
        console.log("Value from finn: " +json.metric[key]);
        return json[key] ?? "N/A";
      } else if (metric.finnhub.startsWith("metric.")) {
        const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
        const json = JSON.parse(UrlFetchApp.fetch(url).getContentText());
        const key = metric.finnhub.split(".")[1];
        console.log("Value from finn: " +json.metric[key]);
        return json.metric[key] ?? "N/A";
      }
    } catch (e) {
      Logger.log(`Finnhub failed for ${symbol} - ${metricKey}: ${e.message}`);
    }
  }

  // 3. Alpha Vantage
  if (metric.alpha) {
    try {
      // get income statement if starts with Income
      if (metric.alpha.startsWith("income.")) {
        const incomeReport = getLatestReportFromAlpha(symbol);
        const key = metric.alpha.split(".")[1];
        if (incomeReport && incomeReport[key] !== undefined) {
          return isNaN(incomeReport[key]) ? incomeReport[key] : parseFloat(incomeReport[key]);
        }
      }
      // else get overview
      else {
        const overview = getAlphaOverview(symbol);
        if (overview && overview[metric.alpha] !== undefined) {
          return isNaN(overview[metric.alpha]) ? overview[metric.alpha] : parseFloat(overview[metric.alpha]);
        }
      }

    } catch (e) {
      Logger.log(`Alpha Vantage failed for ${symbol} - ${metricKey}: ${e.message}`);
    }
  }

  return "N/A";
}

// This function is triggered when a cell is edited
// It replaces the METRIC(...) formula with the SMARTMETRIC(...) formula but it tries GoogleFinance first
function onEdit(e) {
  const range = e.range;
  const formula = range.getFormula();

  if (!formula || !formula.toUpperCase().startsWith("=METRIC(")) return;

  try {
    // Match only METRIC("AAPL", "pe") part
    const metricCall = formula.match(/^=METRIC\(([^)]+)\)/i);
    if (!metricCall || !metricCall[1]) return;

    // Parse the arguments inside METRIC(...)
    const args = metricCall[1]
      .split(",");

    if (args.length !== 2) return;

    const [symbol, metric] = args;

    // Replace only the METRIC(...) portion
    const wrapped = `IFERROR(GOOGLEFINANCE(${symbol}, ${metric}), SMARTMETRIC(${symbol}, ${metric}))`;
    const newFormula = formula.replace(/^=METRIC\([^)]+\)/i, "=" + wrapped);

    range.setFormula(newFormula);

  } catch (err) {
    Logger.log("Failed to process METRIC formula: " + err);
  }
}

// Auto refresh function
function setupAutoRefresh() {
  ScriptApp.newTrigger("refreshSheet")
    .timeBased()
    .everyHours(1)
    .create();
}

function refreshSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getDataRange();
  range.setValues(range.getValues()); // Forces re-calculation
}


