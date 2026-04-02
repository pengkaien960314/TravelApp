// ==================== currency.js ====================
// 即時匯率換算模組
// 
const DEV_MODE = window.config ? window.config.app.devMode : false;
const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/";

// ==================== 專屬下拉選單控制邏輯 ====================
window.selectCurrencyOption = function(dropdownId, text) {
  // 1. 更新按鈕上顯示的文字
  if (dropdownId === 'fromCurrencyDropdown') {
    document.getElementById('fromCurrencySelected').textContent = text;
  } else {
    document.getElementById('toCurrencySelected').textContent = text;
  }
  
  // 2. 選擇後立刻關閉選單
  const dropdownMenu = document.querySelector(`#${dropdownId} .dropdown-options`);
  if (dropdownMenu) {
    dropdownMenu.classList.remove('show');
  }
};

// ==================== 萃取幣別代碼 (例如: "🇺🇸 USD 美元" -> "USD") ====================
function extractCurrencyCode(text) {
  // 使用正規表達式抓取連續三個大寫英文字母
  const match = text.match(/[A-Z]{3}/);
  return match ? match[0] : "USD"; // 預設防呆回傳 USD
}

// ==================== 主要換算函式 ====================
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  
  // 讀取 UI 上選單裡的完整文字
  const fromText = document.getElementById("fromCurrencySelected").textContent;
  const toText = document.getElementById("toCurrencySelected").textContent;

  // 萃取出純粹的英文代碼給 API 用
  const fromCurrency = extractCurrencyCode(fromText);
  const toCurrency = extractCurrencyCode(toText);

  const resultDiv = document.getElementById("currencyResult");
  const resultAmount = document.getElementById("resultAmount");
  const resultRate = document.getElementById("resultRate");

  if (!amount || amount <= 0) {
    alert("請輸入有效的金額！");
    return;
  }

  resultDiv.classList.remove("hidden");
  resultAmount.innerHTML = `<span class="text-2xl text-gray-400 font-medium">🔄 獲取最新匯率中...</span>`;
  resultRate.textContent = "請稍候";

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
        rate = (Math.random() * 30 + 0.5).toFixed(4);
      }

      const converted = (amount * rate).toFixed(2);
      resultAmount.textContent = `${converted} ${toCurrency}`;
      resultRate.textContent = `1 ${fromCurrency} ≈ ${rate} ${toCurrency} (開發模擬)`;
    }, 600);
    return;
  }

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

    const converted = (amount * rate).toFixed(2);
    const lastUpdateDate = new Date(data.time_last_update_unix * 1000).toLocaleDateString('zh-TW');

    resultAmount.textContent = `${converted} ${toCurrency}`;
    resultRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}（真實匯率更新於 ${lastUpdateDate}）`;

  } catch (e) {
    console.error("API 請求失敗:", e);
    resultAmount.innerHTML = `<span class="text-xl text-red-500">❌ 網路錯誤</span>`;
    resultRate.textContent = "請檢查您的網路連線";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ 真實匯率模組載入成功");
});
