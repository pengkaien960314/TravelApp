// ==================== js/translation.js ====================
// AI 翻譯模組 (無縫接力對話 + 30國熱門旅遊語系版)

const API_KEY = window.config ? window.config.api.geminiKey : "你的預設Key";
const DEV_MODE = window.config ? window.config.app.devMode : true;

// ==================== UI 與標籤多國語系字典 (30種語言) ====================
const uiDictionary = {
  "中文": { title: "AI 翻譯助手", inputLabel: "📥 請輸入訊息", translateBtn: "開始翻譯與解析", translating: "⏳ 翻譯中...", sourceLabel: "來源語言", translationLabel: "翻譯", suggestionLabel: "💡 智能回應 (點擊自動回覆)" },
  "英文": { title: "AI Translator", inputLabel: "📥 Enter your message", translateBtn: "Translate", translating: "⏳ Translating...", sourceLabel: "Source", translationLabel: "Translation", suggestionLabel: "💡 Smart Reply (Click to send)" },
  "日文": { title: "AI 翻訳アシスタント", inputLabel: "📥 メッセージを入力", translateBtn: "翻訳する", translating: "⏳ 翻訳中...", sourceLabel: "出典", translationLabel: "翻訳", suggestionLabel: "💡 スマート返信 (クリックして送信)" },
  "韓文": { title: "AI 번역기", inputLabel: "📥 메시지 입력", translateBtn: "번역하기", translating: "⏳ 번역 중...", sourceLabel: "출처", translationLabel: "번역", suggestionLabel: "💡 스마트 답장 (클릭하여 전송)" },
  "泰文": { title: "นักแปล AI", inputLabel: "📥 ใส่ข้อความของคุณ", translateBtn: "แปลภาษา", translating: "⏳ กำลังแปล...", sourceLabel: "ต้นทาง", translationLabel: "การแปล", suggestionLabel: "💡 ตอบกลับอัจฉริยะ (คลิกเพื่อส่ง)" },
  "越南文": { title: "Trợ lý dịch AI", inputLabel: "📥 Nhập tin nhắn", translateBtn: "Dịch", translating: "⏳ Đang dịch...", sourceLabel: "Nguồn", translationLabel: "Bản dịch", suggestionLabel: "💡 Trả lời thông minh (Nhấn để gửi)" },
  "菲律賓文": { title: "Tagasalin ng AI", inputLabel: "📥 Ilagay ang mensahe", translateBtn: "Isalin", translating: "⏳ Nagsasalin...", sourceLabel: "Pinagmulan", translationLabel: "Pagsasalin", suggestionLabel: "💡 Matalinong Sagot (I-click para ipadala)" },
  "馬來文": { title: "Penterjemah AI", inputLabel: "📥 Masukkan mesej", translateBtn: "Terjemah", translating: "⏳ Menterjemah...", sourceLabel: "Sumber", translationLabel: "Terjemahan", suggestionLabel: "💡 Balasan Pintar (Klik untuk hantar)" },
  "印尼文": { title: "Penerjemah AI", inputLabel: "📥 Masukkan pesan", translateBtn: "Terjemahkan", translating: "⏳ Menerjemahkan...", sourceLabel: "Sumber", translationLabel: "Terjemahan", suggestionLabel: "💡 Balasan Cerdas (Klik untuk mengirim)" },
  "法文": { title: "Traducteur IA", inputLabel: "📥 Entrez votre message", translateBtn: "Traduire", translating: "⏳ Traduction...", sourceLabel: "Source", translationLabel: "Traduction", suggestionLabel: "💡 Réponse intelligente (Cliquez pour envoyer)" },
  "德文": { title: "KI-Übersetzer", inputLabel: "📥 Nachricht eingeben", translateBtn: "Übersetzen", translating: "⏳ Übersetzen...", sourceLabel: "Quelle", translationLabel: "Übersetzung", suggestionLabel: "💡 Intelligente Antwort (Klicken zum Senden)" },
  "西班牙文": { title: "Traductor AI", inputLabel: "📥 Introduce tu mensaje", translateBtn: "Traducir", translating: "⏳ Traduciendo...", sourceLabel: "Origen", translationLabel: "Traducción", suggestionLabel: "💡 Respuesta inteligente (Clic para enviar)" },
  "義大利文": { title: "Traduttore IA", inputLabel: "📥 Inserisci messaggio", translateBtn: "Traduci", translating: "⏳ Traducendo...", sourceLabel: "Origine", translationLabel: "Traduzione", suggestionLabel: "💡 Risposta intelligente (Clicca per inviare)" },
  "荷蘭文": { title: "AI Vertaler", inputLabel: "📥 Voer bericht in", translateBtn: "Vertalen", translating: "⏳ Vertalen...", sourceLabel: "Bron", translationLabel: "Vertaling", suggestionLabel: "💡 Slim antwoord (Klik om te verzenden)" },
  "捷克文": { title: "AI Překladač", inputLabel: "📥 Zadejte zprávu", translateBtn: "Přeložit", translating: "⏳ Překládám...", sourceLabel: "Zdroj", translationLabel: "Překlad", suggestionLabel: "💡 Chytrá odpověď (Kliknutím odešlete)" },
  "瑞士德文": { title: "KI-Übersetzer (CH)", inputLabel: "📥 Nachricht eingeben", translateBtn: "Übersetzen", translating: "⏳ Übersetzen...", sourceLabel: "Quelle", translationLabel: "Übersetzung", suggestionLabel: "💡 Intelligente Antwort (Klicken zum Senden)" },
  "希臘文": { title: "Μεταφραστής AI", inputLabel: "📥 Εισάγετε μήνυμα", translateBtn: "Μετάφραση", translating: "⏳ Μετάφραση...", sourceLabel: "Πηγή", translationLabel: "Μετάφραση", suggestionLabel: "💡 Έξυπνη απάντηση (Κάντε κλικ για αποστολή)" },
  "冰島文": { title: "AI Þýðandi", inputLabel: "📥 Sláðu inn skilaboð", translateBtn: "Þýða", translating: "⏳ Þýði...", sourceLabel: "Heimild", translationLabel: "Þýðing", suggestionLabel: "💡 Snjall svar (Smelltu til að senda)" },
  "葡萄牙文": { title: "Tradutor IA", inputLabel: "📥 Digite a mensagem", translateBtn: "Traduzir", translating: "⏳ Traduzindo...", sourceLabel: "Origem", translationLabel: "Tradução", suggestionLabel: "💡 Resposta Inteligente (Clique para enviar)" },
  "土耳其文": { title: "Yapay Zeka Çevirmen", inputLabel: "📥 Mesajınızı girin", translateBtn: "Çevir", translating: "⏳ Çevriliyor...", sourceLabel: "Kaynak", translationLabel: "Çeviri", suggestionLabel: "💡 Akıllı Yanıt (Göndermek için tıklayın)" },
  "阿拉伯文": { title: "مترجم ذكي", inputLabel: "📥 أدخل رسالتك", translateBtn: "ترجمة", translating: "⏳ جاري الترجمة...", sourceLabel: "المصدر", translationLabel: "ترجمة", suggestionLabel: "💡 رد ذكي (انقر للإرسال)" },
  "俄文": { title: "ИИ Переводчик", inputLabel: "📥 Введите сообщение", translateBtn: "Перевести", translating: "⏳ Перевод...", sourceLabel: "Источник", translationLabel: "Перевод", suggestionLabel: "💡 Умный ответ (Нажмите для отправки)" },
  "瑞典文": { title: "AI Översättare", inputLabel: "📥 Ange meddelande", translateBtn: "Översätt", translating: "⏳ Översätter...", sourceLabel: "Källa", translationLabel: "Översättning", suggestionLabel: "💡 Smart svar (Klicka för att skicka)" },
  "丹麥文": { title: "AI Oversætter", inputLabel: "📥 Indtast besked", translateBtn: "Oversæt", translating: "⏳ Oversætter...", sourceLabel: "Kilde", translationLabel: "Oversættelse", suggestionLabel: "💡 Smart svar (Klik for at sende)" },
  "芬蘭文": { title: "Tekoälykääntäjä", inputLabel: "📥 Syötä viesti", translateBtn: "Käännä", translating: "⏳ Käännetään...", sourceLabel: "Lähde", translationLabel: "Käännös", suggestionLabel: "💡 Älykäs vastaus (Napsauta lähettääksesi)" },
  "挪威文": { title: "AI Oversetter", inputLabel: "📥 Skriv inn melding", translateBtn: "Oversett", translating: "⏳ Oversetter...", sourceLabel: "Kilde", translationLabel: "Oversettelse", suggestionLabel: "💡 Smart svar (Klikk for å sende)" },
  "波蘭文": { title: "Tłumacz AI", inputLabel: "📥 Wpisz wiadomość", translateBtn: "Tłumacz", translating: "⏳ Tłumaczenie...", sourceLabel: "Źródło", translationLabel: "Tłumaczenie", suggestionLabel: "💡 Inteligentna odpowiedź (Kliknij, aby wysłać)" },
  "匈牙利文": { title: "AI Fordító", inputLabel: "📥 Írja be az üzenetet", translateBtn: "Fordítás", translating: "⏳ Fordítás...", sourceLabel: "Forrás", translationLabel: "Fordítás", suggestionLabel: "💡 Intelligens válasz (Kattintson a küldéshez)" },
  "高棉文": { title: "អ្នកបកប្រែ AI", inputLabel: "📥 បញ្ចូលសាររបស់អ្នក", translateBtn: "បកប្រែ", translating: "⏳ កំពុងបកប្រែ...", sourceLabel: "ប្រភព", translationLabel: "ការបកប្រែ", suggestionLabel: "💡 ការឆ្លើយតបឆ្លាតវៃ (ចុចដើម្បីផ្ញើ)" },
  "印地文": { title: "AI अनुवादक", inputLabel: "📥 अपना संदेश दर्ज करें", translateBtn: "अनुवाद करें", translating: "⏳ अनुवाद कर रहा है...", sourceLabel: "स्रोत", translationLabel: "अनुवाद", suggestionLabel: "💡 स्मार्ट उत्तर (भेजने के लिए क्लिक करें)" }
};

// ==================== 查字典小幫手 ====================
function getDictByLangName(langString) {
  if (!langString) return uiDictionary["英文"];
  for (let key in uiDictionary) {
    if (langString.includes(key) || (key === "中文" && langString.includes("自動偵測"))) {
      return uiDictionary[key];
    }
  }
  return uiDictionary["英文"];
}

// ==================== 更新翻譯頁面的 UI 狀態 ====================
function updateTranslationUI() {
  const source = document.getElementById("sourceSelected").textContent;
  const target = document.getElementById("targetSelected").textContent;

  document.getElementById("ui-source-lang").textContent = source;
  document.getElementById("ui-target-lang").textContent = target;

  const dict = getDictByLangName(source);

  document.getElementById("ui-title").textContent = dict.title;
  document.getElementById("ui-input-label").textContent = dict.inputLabel;
  document.getElementById("ui-translate-btn").textContent = dict.translateBtn;
}

// ==================== 語言交換按鈕功能 ====================
function swapLanguages() {
  let source = document.getElementById("sourceSelected").textContent;
  let target = document.getElementById("targetSelected").textContent;

  // 強制轉為中文
  if (source.includes("自動偵測")) {
    source = "🇹🇼 中文";
  }

  document.getElementById("sourceSelected").textContent = target;
  document.getElementById("targetSelected").textContent = source;

  document.getElementById("inputMsg").value = "";
  resetUI();
  updateTranslationUI();
}

// ==================== 下拉選單功能 ====================
// 1. 點擊按鈕，展開或收合選單
function toggleDropdown(id) {
  const dropdown = document.querySelector(`#${id} .dropdown-options`);
  
  // 先把其他已經打開的選單關掉 (避免上下兩個同時打開)
  document.querySelectorAll('.dropdown-options').forEach(el => {
    if (el !== dropdown) el.classList.remove('show');
  });

  // 切換當前選單的顯示狀態
  dropdown.classList.toggle('show');
}

// 2. 點選語言後，替換文字並【立刻關閉選單】
function selectOption(dropdownId, text) {
  // 更新畫面上的語言文字
  if (dropdownId === 'sourceDropdown') {
    document.getElementById('sourceSelected').textContent = text;
  } else {
    document.getElementById('targetSelected').textContent = text;
  }
  
  // 關鍵：立刻抓到該選單，並移除 'show' 狀態，讓它瞬間關閉
  const dropdownMenu = document.querySelector(`#${dropdownId} .dropdown-options`);
  if (dropdownMenu) {
    dropdownMenu.classList.remove('show');
  }
}

// 3. 點擊畫面其他空白處，自動關閉所有選單
window.onclick = function(event) {
  // 如果點擊的地方不是選單內部，就關掉所有選單
  if (!event.target.closest('.custom-dropdown')) {
    document.querySelectorAll('.dropdown-options').forEach(el => {
      el.classList.remove('show');
    });
  }
}

// ==================== 重置 UI 狀態 ====================
function resetUI() {
  document.getElementById("result").classList.add("hidden");
  document.querySelectorAll('.custom-dropdown').forEach(dd => dd.classList.remove("active"));
}

// ==================== 主要翻譯功能 ====================
async function translateMessage() {
  resetUI();

  const msg = document.getElementById("inputMsg").value.trim();
  const sourceLang = document.getElementById("sourceSelected").textContent;
  const targetLang = document.getElementById("targetSelected").textContent;

  if (!msg) {
    alert("請輸入訊息！");
    return;
  }

  const currentDict = getDictByLangName(sourceLang);
  const btnTextSpan = document.getElementById("ui-translate-btn");
  const originalBtnText = btnTextSpan.textContent;
  btnTextSpan.textContent = currentDict.translating;

  let text = "";
  
  if (DEV_MODE) {
    console.log("🔧 開發模式啟用 - 使用模擬資料");
    text = `
    【來源語言】：${sourceLang}
    【翻譯】：這是模擬翻譯成 ${targetLang} 的結果。
    【回應1】：這是自動回應測試 1
    【回應2】：這是自動回應測試 2
    【回應3】：這是自動回應測試 3
    `;
    setTimeout(() => {
      const displayHTML = parseAndDisplay(text, targetLang);
      document.getElementById("result").innerHTML = displayHTML;
      document.getElementById("result").classList.remove("hidden");
      btnTextSpan.textContent = originalBtnText;
    }, 800);
    
  } else {
    const prompt = `
    請將以下訊息進行翻譯：
    原文內容："${msg}"
    原文語言：${sourceLang}
    目標語言：${targetLang}

    請全部使用「${targetLang}」來回覆，不要出現任何${sourceLang}的解釋。
    請嚴格使用以下格式回覆：

    【原文語言】：這段原文的語言名稱（請用${targetLang}表示）
    【翻譯】：翻譯結果（請用${targetLang}）
    【回應1】：預測對方聽完這句話後，可能會怎麼回答的建議 1（口語化，用${targetLang}）
    【回應2】：預測對方聽完這句話後，可能會怎麼回答的建議 2（口語化，用${targetLang}）
    【回應3】：預測對方聽完這句話後，可能會怎麼回答的建議 3（口語化，用${targetLang}）
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      text = data.candidates[0].content.parts[0].text;

      const displayHTML = parseAndDisplay(text, targetLang);
      document.getElementById("result").innerHTML = displayHTML;
      document.getElementById("result").classList.remove("hidden");

    } catch (e) {
      alert("❌ 發生錯誤，請檢查網路或 API Key");
    } finally {
      btnTextSpan.textContent = originalBtnText;
    }
  }
}

// ==================== 解析並產生美觀 UI ====================
function parseAndDisplay(text, targetLang) {
  let sourceLangText = "未知語言";
  let translationText = "（翻譯內容）";
  let options = [];

  const lines = text.split('\n');

  for (let line of lines) {
    line = line.trim();
    if (line.includes("【原文語言】")) {
      sourceLangText = line.replace(/【原文語言】[：:]/, "").trim();
    } else if (line.includes("【翻譯】")) {
      translationText = line.replace(/【翻譯】[：:]/, "").trim();
    } else if (line.includes("【回應1】")) {
      options.push(line.replace(/【回應1】[：:]/, "").trim());
    } else if (line.includes("【回應2】")) {
      options.push(line.replace(/【回應2】[：:]/, "").trim());
    } else if (line.includes("【回應3】")) {
      options.push(line.replace(/【回應3】[：:]/, "").trim());
    }
  }

  const dict = getDictByLangName(targetLang);
  const sourceLabel = dict.sourceLabel;
  const translationLabel = dict.translationLabel;
  const suggestionLabel = dict.suggestionLabel || "💡 智能回應建議";

  let html = `
    <div class="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-premium">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold tracking-wider">${sourceLabel}</span>
          <span class="text-sm font-medium text-navy-900">${sourceLangText}</span>
        </div>
        <span class="text-xs bg-gold-400 text-white px-2 py-1 rounded-md font-bold tracking-wider">${translationLabel}</span>
      </div>
      <p class="text-xl leading-relaxed text-navy-900 font-light">${translationText}</p>
    </div>

    <p class="text-xs font-semibold text-gray-400 mb-3 tracking-widest uppercase ml-1">${suggestionLabel}</p>
    <div class="space-y-3">
  `;

  options.forEach(optionText => {
    html += `
      <button onclick="selectOptionForReply(this)" 
              data-text="${optionText.replace(/"/g, '&quot;')}"
              class="w-full text-left bg-white border border-gray-200 text-navy-900 py-3 px-4 rounded-xl shadow-sm hover:border-gold-400 hover:shadow-md transition-all font-medium flex items-center justify-between group">
        <span>${optionText}</span>
        <svg class="w-4 h-4 text-gray-300 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      </button>`;
  });
  
  html += `</div>`;
  return html;
}

// ==================== ✨ 點擊按鈕自動接力翻譯 ✨ ====================
function selectOptionForReply(button) {
  const text = button.getAttribute("data-text");

  swapLanguages();
  document.getElementById("inputMsg").value = text;

  button.style.transform = "scale(0.95)";
  setTimeout(() => button.style.transform = "scale(1)", 180);

  document.getElementById("inputMsg").scrollIntoView({ behavior: "smooth" });
  translateMessage();
}

// ==================== 空白處點擊關閉下拉 ====================
document.addEventListener('click', function(e) {
  if (!e.target.closest('.custom-dropdown') && 
      !e.target.closest('textarea') && 
      !e.target.closest('button')) {
    document.querySelectorAll('.custom-dropdown').forEach(dd => {
      dd.classList.remove("active");
    });
  }
});
