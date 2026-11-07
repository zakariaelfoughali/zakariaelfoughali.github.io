import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBPNpPnlfxJK-LpLj5ftafkt-BkBkpIdl0",
    authDomain: "zakariasite-ef589.firebaseapp.com",
    projectId: "zakariasite-ef589",
    storageBucket: "zakariasite-ef589.firebasestorage.app",
    messagingSenderId: "162821766116",
    appId: "1:162821766116:web:a365b9df5deb061999a5f1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let posts = [];
let isAdmin = false; // متغير لمعرفة هل المستخدم مدير أم لا
const appDiv = document.getElementById('app');
const navMenu = document.getElementById('nav-menu');
const menuBtn = document.getElementById('menu-btn');

// مراقبة حالة الدخول
onAuthStateChanged(auth, (user) => {
    if (user) {
        isAdmin = true; // المستخدم مسجل دخول
    } else {
        isAdmin = false; // المستخدم زائر عادي
    }
    render(); // إعادة رسم الصفحة لإظهار/إخفاء النقاط الثلاث
});

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
        const querySnapshot = await getDocs(collection(db, "posts"));
        posts = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                title: data.title,
                type: data.type,
                content: data.content,
                date: data.date,
                timestamp: data.timestamp || 0,
                image: data.image || null,
                excerpt: data.content.substring(0, 120) + '...'
            });
        });
        posts.sort((a, b) => b.timestamp - a.timestamp); 
        render(); 
    } catch (e) { 
        console.error(e); 
        render();
    }
}

// إنشاء كود النقاط الثلاث (يظهر فقط للمدير)
function getAdminMenu(postId) {
    if (!isAdmin) return '';
    return `
        <button class="post-menu-btn" onclick="toggleMenu('${postId}', event)">⋮</button>
        <div class="post-dropdown" id="menu-${postId}">
            <a href="admin.html?id=${postId}">تعديل المقال</a>
            <button onclick="deletePostMain('${postId}')">حذف المقال</button>
        </div>
    `;
}

function renderHome() {
    let postsHTML = posts.length === 0 ? '<p>لا توجد مقالات بعد.</p>' : '';
    posts.forEach(post => {
        postsHTML += `
            <div class="post-card">
                ${getAdminMenu(post.id)}
                <span style="background: #1E3A8A; padding: 2px 8px; border-radius: 5px; font-size: 0.8rem; color: #fff; margin-bottom: 10px; display: inline-block;">${post.type}</span>
                <h3 style="margin-top: 5px;">${post.title}</h3>
                <small>${post.date}</small>
${post.image ? `<a href="#/post/${post.id}" style="display: flex; justify-content: center; width: 100%; margin-bottom: 10px;"><img src="${post.image}" style="width: 100%; max-height: 450px; object-fit: cover; border-radius: 8px; cursor: pointer;"></a>` : ''}                <p>${post.excerpt}</p>
                <a href="#/post/${post.id}">اقرأ المزيد &larr;</a>
            </div>
        `;
    });

    appDiv.innerHTML = `
        <div class="hero" id="home">
            <h1 class="notranslate" style="font-family: 'Amiri', serif; font-size: 3.5rem; color: #E5E7EB; margin-bottom: 20px;">زكرياء الفغالي</h1>
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

function renderCategory(categoryName) {
    let filteredPosts = posts;
    if (categoryName !== 'الكل') {
        filteredPosts = posts.filter(p => p.type === categoryName);
    }

    let postsHTML = filteredPosts.length === 0 ? `<p style="text-align:center; padding: 50px; color:#fff; font-size:1.2rem;">لا توجد منشورات في قسم "${categoryName}" بعد.</p>` : '';
    
    filteredPosts.forEach(post => {
        postsHTML += `
            <div class="post-card" style="margin-bottom: 20px;">
                ${getAdminMenu(post.id)}
                <span style="background: #1E3A8A; padding: 2px 8px; border-radius: 5px; font-size: 0.8rem; color: #fff; margin-bottom: 10px; display: inline-block;">${post.type}</span>
                <h3 style="margin-top: 5px;">${post.title}</h3>
                <small>${post.date}</small>
${post.image ? `<a href="#/post/${post.id}" style="display: flex; justify-content: center; width: 100%; margin-bottom: 10px;"><img src="${post.image}" style="width: 100%; max-height: 450px; object-fit: cover; border-radius: 8px; cursor: pointer;"></a>` : ''}                <a href="#/post/${post.id}">اقرأ المزيد &larr;</a>
            </div>
        `;
    });
    appDiv.innerHTML = `<div style="padding-top: 40px;"><h2 class="section-title">${categoryName === 'الكل' ? 'كل الكتابات' : categoryName}</h2><div class="posts-grid">${postsHTML}</div></div>`;
}

function renderSinglePost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) {
        appDiv.innerHTML = `<h2>المقال غير موجود</h2><a href="#/">العودة للرئيسية</a>`;
        return;
    }
    appDiv.innerHTML = `
        <div style="padding-top: 40px; line-height: 1.8;">
            <a href="#/" style="color: var(--accent); text-decoration: none; display: inline-block; margin-bottom: 20px; font-weight: bold;">&rarr; العودة للرئيسية</a>
            <h1 style="color: var(--accent);">${post.title}</h1>
            <small style="color: var(--muted); display: block; margin-bottom: 20px;">${post.date} | ${post.type}</small>
            ${post.image ? `<img src="${post.image}" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; margin-bottom: 20px;">` : ''}
            <div style="margin-top: 30px; font-size: 1.1rem; white-space: pre-wrap;">${post.content}</div>
        </div>
    `;
}

// دوال النقاط الثلاث
window.toggleMenu = function(id, event) {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${id}`);
    document.querySelectorAll('.post-dropdown').forEach(el => {
        if (el.id !== `menu-${id}`) el.style.display = 'none';
    });
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

document.addEventListener('click', () => {
    document.querySelectorAll('.post-dropdown').forEach(el => el.style.display = 'none');
});

window.deletePostMain = async function(id) {
    if (confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) {
        try {
            await deleteDoc(doc(db, "posts", id));
            alert("تم الحذف بنجاح!");
            window.location.reload();
        } catch (e) {
            alert("حدث خطأ أثناء الحذف: " + e.message);
        }
    }
};

function render() {
    const hash = window.location.hash || '#/';
    
    if (hash === '#/' || hash === '') { renderHome(); } 
    else if (hash === '#/posts') { renderCategory('الكل'); } 
    else if (hash.startsWith('#/category/')) { 
        const category = decodeURIComponent(hash.replace('#/category/', '')); 
        renderCategory(category); 
    } 
    else if (hash.startsWith('#/post/')) { 
        renderSinglePost(decodeURIComponent(hash.replace('#/post/', ''))); 
    } 
    else if (hash === '#/about-scroll') {
        renderHome();
        setTimeout(() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (hash === '#/contact-scroll') {
        renderHome();
        setTimeout(() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' }), 100);
    }
    
    navMenu.classList.remove('active');
    if (hash !== '#/about-scroll' && hash !== '#/contact-scroll') window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

menuBtn.onclick = function(e) {
    e.preventDefault();
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = '#0B1220';
        navMenu.style.padding = '20px';
        navMenu.style.zIndex = '99999';
        navMenu.style.boxShadow = '0 10px 10px rgba(0,0,0,0.5)';
    }
};

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { navMenu.style.display = 'none'; });
});

// إعدادات اللغة والوضع النهاري
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const themeToggle = document.getElementById('theme-toggle');
const langSelect = document.getElementById('lang-select');

if (settingsBtn) {
    settingsBtn.onclick = (e) => {
        e.stopPropagation();
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    };
}

document.addEventListener('click', (e) => {
    if (settingsPanel && settingsBtn && !settingsPanel.contains(e.target) && e.target !== settingsBtn) {
        settingsPanel.style.display = 'none';
    }
});

if (themeToggle) {
    themeToggle.onclick = () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    };
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

if (langSelect) {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) langSelect.value = savedLang;
    langSelect.onchange = (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('lang', selectedLang);
        if (selectedLang === 'ar') {
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
        } else {
            document.cookie = "googtrans=/ar/" + selectedLang + "; path=/";
            document.cookie = "googtrans=/ar/" + selectedLang + "; path=/; domain=" + window.location.hostname;
        }
        window.location.reload();
    };
}

// إخفاء شريط جوجل
setTimeout(() => {
    const googleBanner = document.querySelector('.goog-te-banner-frame');
    if (googleBanner) {
        googleBanner.style.display = 'none';
        googleBanner.remove();
    }
    document.body.style.top = '0px';
}, 1000);

fetchPosts();
