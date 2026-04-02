// ==================== js/config.js ====================
// TravelApp 全域設定檔
// 集中管理 API、環境變數、預設狀態與未來擴充功能

const config = {
  // ==================== 1. 核心與環境設定 ====================
  app: {
    name: "TravelApp AI",
    version: "2.0.0",      // 升級為 2.0 高級版
    devMode: false,         // true = 啟用模擬資料 (免燒 API 額度)，false = 真實呼叫
    debugLog: true         // 是否在 Console 印出除錯訊息
  },

  // ==================== 2. API 相關設定 ====================
  api: {
    geminiKey: "AIzaSyB_tEx6ILOy6U7NOwtYmclHwLWqNXyRQmQ", // 你的金鑰
    model: "gemini-2.5-flash",  // 未來如果出新模型，直接改這裡即可
    timeout: 15000              // API 請求超時時間 (毫秒)
  },

  // ==================== 3. 翻譯與偏好設定 ====================
  translation: {
    defaultSource: "🤖 AI 自動偵測",
    defaultTarget: "🇨🇳 中文",
    maxInputLength: 1000,       // 允許輸入的最大字數
    historyLimit: 50            // 未來擴充：最多儲存 50 筆翻譯紀錄
  },

  // ==================== 4. 存儲快取 Keys ====================
  // 集中管理 LocalStorage 的 Key，避免以後在不同檔案打錯字
  storageKeys: {
    preferences: "travelApp_user_prefs",
    history: "travelApp_translation_history"
  },

  // ==================== 5. UI 與視覺設定 ====================
  ui: {
    theme: "premium",          // 主題：premium, light, dark
    animationSpeed: 300        // 基礎動畫延遲 (毫秒)
  },

  // ==================== 6. 未來功能開關 (Feature Flags) ====================
  // 方便以後加新功能時，可以隨時開啟或關閉測試
  features: {
    historyRecord: false,      // 未來擴充：翻譯歷史紀錄
    voiceInput: false,         // 未來擴充：麥克風語音輸入
    currencyConverter: false,  // 未來擴充：AI 匯率換算
    itineraryPlanner: false    // 未來擴充：AI 景點規劃
  }
};

// 將 config 暴露給全域環境，讓 translation.js 可以直接讀取
window.config = config;

// 📝 [備註]：如果未來你改用模組化開發 (Vite/React/Vue 等)，可以解開下方的註解：
// export default config;
