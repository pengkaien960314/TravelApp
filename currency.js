// ==================== js/currency.js ====================
// 即時匯率換算模組

// 使用免費公開匯率 API (exchangerate-api.com)
const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/";

// ==================== 主要換算函式 ====================
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;

  const resultDiv = document.getElementById("currencyResult");
  const resultAmount = document.getElementById("resultAmount");
  const resultRate = document.getElementById("resultRate");

  if (!amount || amount <= 0) {
    alert("請輸入有效的金額！");
    return;
  }

  resultDiv.classList.add("hidden");

  // 如果是開發模式，使用模擬資料
  if (DEV_MODE) {
    console.log(`🔧 開發模式 - 模擬 ${fromCurrency} → ${toCurrency}`);
    
    // 模擬匯率
    const mockRates = {
      "TWD": { "USD": 0.031, "JPY": 4.52, "KRW": 41.8, "EUR": 0.0285, "THB": 1.05, "VND": 730 },
      "USD": { "TWD": 32.1, "JPY": 145.5, "KRW": 1345, "EUR": 0.92, "THB": 33.8, "VND": 23500 },
      "JPY": { "TWD": 0.221, "USD": 0.0069, "KRW": 9.25, "EUR": 0.0063, "THB": 0.232, "VND": 161.5 }
    };

    let rate = 1;
    if (mockRates[fromCurrency] && mockRates[fromCurrency][toCurrency]) {
      rate = mockRates[fromCurrency][toCurrency];
    } else {
      rate = (Math.random() * 30 + 0.5).toFixed(4); // 隨機模擬
    }

    const converted = (amount * rate).toFixed(2);

    resultAmount.textContent = `${converted} ${toCurrency}`;
    resultRate.textContent = `1 ${fromCurrency} ≈ ${rate} ${toCurrency}`;
    resultDiv.classList.remove("hidden");
    
    return;
  }

  // ==================== 正式模式：呼叫真實匯率 API ====================
  try {
    const response = await fetch(`${EXCHANGE_API_URL}${fromCurrency}`);
    const data = await response.json();

    if (data.result !== "success") {
      alert("無法取得最新匯率，請稍後再試");
      return;
    }

    const rate = data.rates[toCurrency];
    if (!rate) {
      alert("目前不支援此幣別轉換");
      return;
    }

    const converted = (amount * rate).toFixed(4);

    resultAmount.textContent = `${converted} ${toCurrency}`;
    resultRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}（即時匯率）`;
    resultDiv.classList.remove("hidden");

  } catch (e) {
    console.error(e);
    alert("網路錯誤，請檢查連線後再試");
  }
}

// ==================== 頁面載入時執行 ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ 匯率模組載入成功");
  
  // 預設顯示 1 USD → TWD
  const amountInput = document.getElementById("amount");
  if (amountInput) amountInput.value = "1";
});
