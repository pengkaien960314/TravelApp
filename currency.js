// ==================== currency.js ====================
// 即時匯率換算模組

// 💡 關鍵修復：正確讀取 config.js 中的 devMode 設定
const DEV_MODE = window.config ? window.config.app.devMode : false;

// 使用免費公開匯率 API (exchangerate-api.com)
// 這是真實市場匯率，每日更新，非常適合旅遊 APP
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

  // 先顯示區塊，並呈現「載入中」狀態
  resultDiv.classList.remove("hidden");
  resultAmount.innerHTML = `<span class="text-2xl text-gray-400 font-medium">🔄 獲取最新匯率中...</span>`;
  resultRate.textContent = "請稍候";

  // 如果是在 config.js 裡開啟開發模式，就用模擬的
  if (DEV_MODE) {
    setTimeout(() => {
      console.log(`🔧 開發模式 - 模擬 ${fromCurrency} → ${toCurrency}`);
      const mockRates = {
        "TWD": { "USD": 0.031, "JPY": 4.65, "KRW": 41.8, "EUR": 0.0285, "THB": 1.12, "VND": 780 },
        "USD": { "TWD": 32.1, "JPY": 150.5, "KRW": 1345, "EUR": 0.92, "THB": 36.2, "VND": 25000 },
        "JPY": { "TWD": 0.215, "USD": 0.0066, "KRW": 8.95, "EUR": 0.0061, "THB": 0.24, "VND": 166.5 }
      };

      let rate = 1;
      if (mockRates[fromCurrency] && mockRates[fromCurrency][toCurrency]) {
        rate = mockRates[fromCurrency][toCurrency];
      } else {
        rate = (Math.random() * 30 + 0.5).toFixed(4); // 隨機模擬
      }

      const converted = (amount * rate).toFixed(2);
      resultAmount.textContent = `${converted} ${toCurrency}`;
      resultRate.textContent = `1 ${fromCurrency} ≈ ${rate} ${toCurrency} (開發模擬)`;
    }, 600); // 假裝有網路延遲
    return;
  }

  // ==================== 正式模式：呼叫真實匯率 API ====================
  try {
    const response = await fetch(`${EXCHANGE_API_URL}${fromCurrency}`);
    const data = await response.json();

    if (data.result !== "success") {
      resultAmount.innerHTML = `<span class="text-xl text-red-500">❌ 無法取得匯率</span>`;
      resultRate.textContent = "請稍後再試";
      return;
    }

    const rate = data.rates[toCurrency];
    if (!rate) {
      resultAmount.innerHTML = `<span class="text-xl text-red-500">❌ 不支援此幣別轉換</span>`;
      resultRate.textContent = "請選擇其他幣別";
      return;
    }

    const converted = (amount * rate).toFixed(2); // 換算結果保留兩位小數
    
    // API 會提供最後更新的 Unix 時間戳，我們把它轉成好讀的日期格式
    const lastUpdateDate = new Date(data.time_last_update_unix * 1000).toLocaleDateString('zh-TW');

    resultAmount.textContent = `${converted} ${toCurrency}`;
    resultRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}（真實匯率更新於 ${lastUpdateDate}）`;

  } catch (e) {
    console.error("API 請求失敗:", e);
    resultAmount.innerHTML = `<span class="text-xl text-red-500">❌ 網路錯誤</span>`;
    resultRate.textContent = "請檢查您的網路連線";
  }
}

// ==================== 頁面載入時執行 ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ 真實匯率模組載入成功");
});
