// ============================================================
// DOMContentLoaded 事件：页面 HTML 全部加载完后才执行里面的代码
// 如果把 JS 放在 <head> 里，这时 body 还没解析完，
// 所以要等这个事件触发才能操作页面元素
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // ===== 打字机效果 =====
    const texts = ['前端学习者', '3D 建模爱好者', '终身学习者'];  // 要轮播的文字
    let textIndex = 0;     // 当前显示第几句话
    let charIndex = 0;     // 当前打到第几个字
    let isDeleting = false; // 正在删除吗？
    const typingEl = document.querySelector('.typing-text');  // 找到放文字的 span

    function type() {
        const current = texts[textIndex];
        if (isDeleting) {
            // 删除模式：逐个减少文字
            typingEl.textContent = current.substring(0, charIndex--);
        } else {
            // 打字模式：逐个增加文字
            typingEl.textContent = current.substring(0, charIndex++);
        }

        if (!isDeleting && charIndex === current.length + 1) {
            // 打完了，停 2 秒然后开始删除
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            // 删完了，切换到下一句，停 0.5 秒开始打字
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;  // 循环
            setTimeout(type, 500);
        } else {
            // 正在打字中，速度：打字 100ms/字，删除 50ms/字
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    type();  // 启动打字机

    // ===== 移动端汉堡菜单 =====
    const hamburger = document.querySelector('.hamburger');  // 三个横线的按钮
    const navMenu = document.querySelector('.nav-menu');     // 导航菜单

    hamburger.addEventListener('click', () => {
        // 点击汉堡图标：切换展开/收起
        hamburger.classList.toggle('active');   // 三条横线变 X
        navMenu.classList.toggle('open');       // 显示/隐藏菜单
    });

    // 点击导航链接后自动收起菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
    // 点击底部导航链接也收起（防止残留）
    document.querySelectorAll('.bottom-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // ===== 导航栏滚动高亮 & 阴影 =====
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section[id]');  // 所有带 id 的 section
    const navLinks = document.querySelectorAll('.nav-link');     // 顶部导航链接
    const bottomLinks = document.querySelectorAll('.bottom-link'); // 底部导航链接

    function updateNav() {
        // 判断当前滚动到了哪个 section
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 200;  // 偏移 200px，让高亮提前一点
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        // 高亮对应的导航按钮
        navLinks.forEach(link => {
            // href="#about" → 提取 "about"
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
        bottomLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });

        // 滚动超过 50px 时给导航栏加阴影
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    // 每次滚动页面都执行 updateNav
    window.addEventListener('scroll', updateNav);

    // ===== 滚动显示动画 (reveal) =====
    // IntersectionObserver 监听元素是否进入浏览器视口
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {         // 元素进入视口了
                entry.target.classList.add('visible');  // 添加类触发 CSS 动画
                observer.unobserve(entry.target);       // 只触发一次，不再监听
            }
        });
    }, { threshold: 0.1 });   // 元素露出 10% 就算进入视口

    revealEls.forEach(el => observer.observe(el));

    // ===== 数字滚动动画（统计数据） =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);  // 从 data-target 读取目标值
                let current = 0;
                const step = Math.ceil(target / 60);         // 分 60 步走完
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + '+';       // 最终显示
                        clearInterval(timer);
                    } else {
                        el.textContent = current;
                    }
                }, 25);  // 每 25ms 更新一次 → 总共约 60*25=1500ms 完成
                statObserver.unobserve(el);  // 只触发一次
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

    // ===== 技能条动画 =====
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 读取 data-width，设为进度条宽度 → CSS transition 触发动画
                const fill = entry.target;
                fill.style.width = fill.dataset.width + '%';
                skillObserver.unobserve(fill);  // 只触发一次
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObserver.observe(el));

    // ===== 暗色模式切换 =====
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');  // 从浏览器本地存储读取偏好

    if (savedTheme) {
        // 如果有保存的偏好，直接应用
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';  // 切换

        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);        // 保存到本地，下次打开还在
        themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });

    // ===== 返回顶部按钮 =====
    const backBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // 滚动超过 500px 时显示按钮
        backBtn.classList.toggle('show', window.scrollY > 500);
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });  // 平滑滚动回顶部
    });

    // ===== 联系表单 =====
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();  // 阻止表单默认提交（页面刷新）
        alert('感谢你的留言！(目前是前端演示，尚未接入后端)');
        form.reset();        // 清空表单
    });

});
