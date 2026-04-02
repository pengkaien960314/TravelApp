// ==================== js/router.js ====================
// TravelApp 路由管理器（已修正 currencyPage 跳轉問題）

const router = {
  history: ['homePage'],

  // 所有頁面 ID 必須與 HTML 中的 id 完全一致
  pages: {
    homePage: document.getElementById('homePage'),
    translationInputPage: document.getElementById('translationInputPage'),
    currencyPage: document.getElementById('currency')     // ← 這一行必須存在
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
