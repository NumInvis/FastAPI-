// FastAPI 大师课 v2 - 交互系统

document.addEventListener('DOMContentLoaded', () => {
  // 深色模式
  const themeToggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }

  // 移动端菜单
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }

  // 返回顶部
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 代码复制
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code-block').querySelector('code')?.innerText 
        || btn.closest('.code-block').querySelector('pre')?.innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制!';
        setTimeout(() => btn.textContent = '复制', 1500);
      } catch {
        btn.textContent = '失败';
      }
    });
  });

  // 高亮当前侧边栏链接
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(current)) {
      link.classList.add('active');
    }
  });

  // 标签页切换
  document.querySelectorAll('.tab-group').forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');
    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[idx]?.classList.add('active');
      });
    });
  });

  // 折叠面板
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.closest('.accordion');
      const isOpen = accordion.classList.contains('open');
      // 可选：关闭其他
      // document.querySelectorAll('.accordion.open').forEach(a => a.classList.remove('open'));
      accordion.classList.toggle('open', !isOpen);
    });
  });

  // 测验系统
  document.querySelectorAll('.quiz-box').forEach(quiz => {
    const options = quiz.querySelectorAll('.quiz-option');
    const explanation = quiz.querySelector('.quiz-explanation');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('disabled')) return;
        const isCorrect = opt.dataset.correct === 'true';
        options.forEach(o => {
          o.classList.add('disabled');
          if (o.dataset.correct === 'true') o.classList.add('correct');
        });
        if (!isCorrect) opt.classList.add('wrong');
        if (explanation) explanation.classList.add('show');
        // 保存进度
        const quizId = quiz.dataset.quizId;
        if (quizId) {
          const progress = JSON.parse(localStorage.getItem('course_progress') || '{}');
          progress[quizId] = true;
          localStorage.setItem('course_progress', JSON.stringify(progress));
        }
      });
    });
  });

  // 进度保存与恢复
  updateProgressIndicator();
});

function updateProgressIndicator() {
  const progress = JSON.parse(localStorage.getItem('course_progress') || '{}');
  const total = document.querySelectorAll('.quiz-box[data-quiz-id]').length;
  const done = Object.keys(progress).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill = document.querySelector('.progress-fill');
  if (fill) fill.style.width = pct + '%';
  
  // 首页卡片状态
  document.querySelectorAll('.course-card').forEach(card => {
    const href = card.getAttribute('href');
    if (!href) return;
    // 简单逻辑：如果该章有测验完成，标记为done
    const chapterQuizzes = document.querySelectorAll(`[data-chapter="${href}"]`);
    // 这个逻辑在首页不太好用，简化处理
  });
}
