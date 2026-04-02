// ==================== js/router.js ====================
// TravelApp 路由管理器（已修正 currencyPage 跳轉問題與加入動態標題）

const router = {
  history: ['homePage'],

  // 🔥 1. 建立頁面 ID 與瀏覽器標題的對應表
  pageTitles: {
    'homePage': 'TravelApp - AI 多功能助手',
    'translationInputPage': 'AI 翻譯助手 | TravelApp',
    'itineraryPage': '智能行程規劃 | TravelApp',
    'navigationPage': '精準 AR 導航 | TravelApp',
    'currencyPage': '即時匯率換算 | TravelApp'
  },

  // 所有頁面 ID 必須與 HTML 中的 id 完全一致
  pages: {
    homePage: document.getElementById('homePage'),
    translationInputPage: document.getElementById('translationInputPage'),
    // 💡 幫你修正了這裡：原本是 'currency'，已改成與 HTML 對應的 'currencyPage'
    currencyPage: document.getElementById('currencyPage')     
  },

  goTo: function(pageId) {
    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
      console.error(`❌ 找不到頁面 ID: ${pageId}`);
      alert('✨ 這個功能正在開發中，敬請期待！');
      return;
    }

    // 隱藏所有頁面
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
      page.classList.add('hidden');
    });

    // 顯示目標頁面
    targetPage.classList.remove('hidden');
    setTimeout(() => {
      targetPage.classList.add('active');
    }, 10);

    // 更新歷史紀錄
    if (this.history[this.history.length - 1] !== pageId) {
      this.history.push(pageId);
    }

    // 🔥 2. 動態更新瀏覽器的分頁標題
    if (this.pageTitles[pageId]) {
      document.title = this.pageTitles[pageId];
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  goBack: function() {
    if (this.history.length > 1) {
      this.history.pop();
      const previousPageId = this.history[this.history.length - 1];
      
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
      });

      const targetPage = document.getElementById(previousPageId);
      if (targetPage) {
        targetPage.classList.remove('hidden');
        setTimeout(() => {
          targetPage.classList.add('active');
        }, 10);

        // 🔥 3. 返回上一頁時，也要記得把標題改回來！
        if (this.pageTitles[previousPageId]) {
          document.title = this.pageTitles[previousPageId];
        }
      }
    } else {
      this.goTo('homePage');
    }
  }
};

// 暴露給全域
window.router = router;

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Router 初始化完成');
  router.goTo('homePage');
});
