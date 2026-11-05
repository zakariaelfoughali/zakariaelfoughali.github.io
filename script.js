const GITHUB_USER = 'zakariaelfoughali';
const GITHUB_REPO = 'zakariaelfoughali.github.io';
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

let posts = [];
const app = document.getElementById('app');
const navMenu = document.getElementById('nav-menu');
const menuBtn = document.getElementById('menu-btn');

const bioText = `
    <p>زكرياء الفغالي كاتب ومحلّل مغربي من مدينة وجدة، من مواليد 22 ماي 2000، يبلغ من العمر 26 سنة. يشتغل على الكتابة بوصفها مساحة للتفكير والتحليل واكتشاف الذات والعالم، ويكتب في الفلسفة والشذرات والمقالات والروايات والكتب الذاتية، دون أن يحصر نفسه في جنس كتابي واحد. يرى في الكتابة امتدادًا لشغف أعمق بالمعرفة والعلوم والتعلم المستمر، ويستلهم من التاريخ والحضارات والعلوم القديمة والحديثة ما يوسّع أفق النص ويمنحه عمقًا إنسانيًا.</p>
    <p>يتابع القراءة المستديمة بوصفها عادة يومية ومصدرًا للتأمل والتكوين، ويتبنى فلسفة «كايزن» اليابانية في التحسين المستمر والتراكم الهادئ، مؤمنًا بأن المعرفة مشروع لا ينتهي، وأن الكتابة الجادة تنمو بالقراءة والصبر والمراجعة. تميل كتاباته إلى المزج بين التأمل الفلسفي والتحليل الهادئ واللغة التي تقترب من الفكرة دون تعقيد، مع اهتمام خاص بالأسئلة الإنسانية الكبرى: الوجود، الهوية، الذاكرة، المعنى، وعلاقة الإنسان بعصره.</p>
    <p>يقدّم هذا الموقع مساحة لنشر نصوصه ومقالاته وشذراته وأعماله السردية والذاتية، ولتوثيق رحلته مع القراءة والكتابة والتعلم المستمر.</p>
    
    <p style="margin-bottom: 20px;">لديه عدة كتب منشورة على موقع "مكتبة نور" (<a href="https://www.noor-book.com/u/Zakii-EL-Foughali/books" target="_blank" style="color: #22c55e; text-decoration: none; font-weight: bold; display: inline-flex; align-items: center; gap: 5px;">رابط كتبه على مكتبة نور <svg viewBox="0 0 24 24" width="22" height="22" fill="#22c55e" style="vertical-align: middle;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></a>)</p>

    <h3>كتب منشورة:</h3>
    <ul>
        <li>دهاليز القلب</li>
        <li>مذكرات بائس</li>
        <li>خذلان</li>
        <li>سديم الروح (مجموعة شعرية)</li>
        <li>مغامرات شيرلوك هولمز: الجريمة الصامتة</li>
        <li>مغامرات شيرلوك هولمز: لغز اختفاء جورج هاروود</li>
    </ul>
`;

const contactHTML = `
    <div class="contact-links">
        <a href="mailto:zakariafoughali40@gmail.com" class="contact-icon" title="البريد الإلكتروني">
            <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
        <a href="https://www.instagram.com/zakaria_foughali" target="_blank" class="contact-icon" title="إنستغرام">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
    </div>
`;

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const files = await response.json();
        if (Array.isArray(files)) {
            for (let file of files) {
                if (file.name.endsWith('.md')) {
                    const rawContent = await fetch(file.download_url).then(res => res.text());
                    const parts = rawContent.split('---');
                    if (parts.length >= 3) {
                        const meta = parts[1];
                        const content = parts.slice(2).join('---');
                        const titleMatch = meta.match(/title:\s*(.*)/);
                        const dateMatch = meta.match(/date:\s*(.*)/);
                        posts.push({
                            slug: file.name.replace('.md', ''),
                            title: titleMatch ? titleMatch[1].replace(/["']/g, '').trim() : 'بدون عنوان',
                            date: dateMatch ? dateMatch[1].split('T')[0] : '',
                            content: content,
                            excerpt: content.replace(/(<([^>]+)>)/gi, "").substring(0, 100) + '...'
                        });
                    }
                }
            }
        }
    } catch (e) { console.log(e); }
    render(); 
}

function renderHome() {
    let postsHTML = posts.length === 0 ? '<p>لا توجد مقالات بعد.</p>' : '';
    posts.forEach(post => {
        postsHTML += `
            <div class="post-card">
                <h3>${post.title}</h3>
                <small>${post.date}</small>
                <p>${post.excerpt}</p>
                <a href="#/post/${encodeURIComponent(post.slug)}">اقرأ المزيد &larr;</a>
            </div>
        `;
    });

    app.innerHTML = `
        <div class="hero" id="home">
            <h1>Zakariaelfoughali</h1>
            <p>كتابات عربية في التأمل والأدب والفكر. نصوص هادئة تُكتب ببطء، وتُقرأ بتمهل.</p>
            <div style="margin-top:20px;">
                <a href="#/posts" class="btn">اقرأ الكتابات</a>
                <a href="#/about-scroll" class="btn outline">تعرف علي</a>
            </div>
        </div>
        
        <section id="posts-section">
            <h2 class="section-title">أحدث الكتابات</h2>
            <div class="posts-grid">${postsHTML}</div>
        </section>

        <section id="about-section">
            <h2 class="section-title">تعرف علي</h2>
            <div class="about-text">${bioText}</div>
        </section>

        <section id="contact-section">
            <h2 class="section-title">تواصل معي</h2>
            ${contactHTML}
        </section>
    `;
}

function renderPostsOnly() {
    let postsHTML = posts.length === 0 ? '<p>لا توجد مقالات بعد.</p>' : '';
    posts.forEach(post => {
        postsHTML += `
            <div class="post-card" style="margin-bottom: 20px;">
                <h3>${post.title}</h3>
                <small>${post.date}</small>
                <p>${post.excerpt}</p>
                <a href="#/post/${encodeURIComponent(post.slug)}">اقرأ المزيد &larr;</a>
            </div>
        `;
    });

    app.innerHTML = `
        <div style="padding-top: 40px;">
            <h2 class="section-title">كل الكتابات</h2>
            <div class="posts-grid">${postsHTML}</div>
        </div>
    `;
}

function renderSinglePost(slug) {
    const post = posts.find(p => p.slug === slug);
    if (!post) {
        app.innerHTML = `<h2>المقال غير موجود</h2><a href="#/">العودة للرئيسية</a>`;
        return;
    }
    app.innerHTML = `
        <div style="padding-top: 40px; line-height: 1.8;">
            <a href="#/" style="color: var(--accent); text-decoration: none; display: inline-block; margin-bottom: 20px; font-weight: bold;">&rarr; العودة للرئيسية</a>
            <h1 style="color: var(--accent);">${post.title}</h1>
            <small style="color: var(--muted); display: block; margin-bottom: 20px;">${post.date}</small>
            <div style="margin-top: 30px; font-size: 1.1rem;">
                ${marked.parse(post.content)}
            </div>
        </div>
    `;
}

function render() {
    const hash = window.location.hash || '#/';

    if (hash === '#/' || hash === '') {
        renderHome();
    } else if (hash === '#/posts') {
        renderPostsOnly();
    } else if (hash.startsWith('#/post/')) {
        const slug = decodeURIComponent(hash.replace('#/post/', ''));
        renderSinglePost(slug);
    } else if (hash === '#/about-scroll') {
        renderHome();
        setTimeout(() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (hash === '#/contact-scroll') {
        renderHome();
        setTimeout(() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' }), 100);
    }
    
    navMenu.classList.remove('active');
    
    if (hash !== '#/about-scroll' && hash !== '#/contact-scroll') {
        window.scrollTo(0, 0);
    }
}

window.addEventListener('hashchange', render);

menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navMenu.classList.toggle('active');
});

// تحميل مكتبة Marked وتشغيل الموقع
const markedScript = document.createElement('script');
markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
markedScript.onload = () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.innerText = new Date().getFullYear(); // فقط يضع السنة، ولا يلمس الاسم
    fetchPosts();
};
document.head.appendChild(markedScript);
