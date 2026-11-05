// 1. تحميل مكتبة تحويل النصوص
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => { initWebsite(); }; 
document.head.appendChild(script);

const GITHUB_USER = 'zakariaelfoughali';
const GITHUB_REPO = 'zakariaelfoughali.github.io';
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

let posts = [];
let homeHTML = ''; 
let aboutHTML = ''; // متغير لحفظ محتوى قسم "عني" منفصلاً

// 2. الدالة الرئيسية
async function initWebsite() {
    const main = document.querySelector('main') || document.body;
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = main.innerHTML;

    // --- استخراج قسم "عني" وفصله عن الرئيسية ---
    // نبحث عن أي قسم (section) أو حاوية (div) تحتوي على كلمة "عني"
    const sections = tempDiv.querySelectorAll('section, div');
    for (let sec of sections) {
        if (sec.innerText.includes('عني') || sec.innerText.includes('About')) {
            aboutHTML = sec.innerHTML; // نحفظ محتوى قسم عني
            sec.remove(); // نمسحه من الصفحة الرئيسية
            break; 
        }
    }
    // حفظ الصفحة الرئيسية بعد إزالة قسم "عني"
    homeHTML = tempDiv.innerHTML; 

    // جلب المقالات من GitHub
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
    } catch (error) {
        console.log("لا توجد مقالات أو حدث خطأ.");
    }

    // إصلاح الأزرار والقائمة
    fixButtonsAndMenu();
    
    // تشغيل نظام التنقل
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
}

// 3. إصلاح الأزرار والقائمة (إجبارها على تغيير الرابط)
function fixButtonsAndMenu() {
    const clickables = document.querySelectorAll('a, button, .btn');
    
    clickables.forEach(el => {
        const text = el.innerText.trim();
        
        // زر اقرأ الكتابات
        if (text.includes('الكتابات') || text.includes('اقرأ')) {
            el.setAttribute('href', '#/posts');
            el.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.hash = '#/posts';
            };
        } 
        // زر تعرف علي (Hero) ورابط عني (القائمة)
        else if (text.includes('تعرف') || text.includes('عني')) {
            el.setAttribute('href', '#/about');
            el.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.hash = '#/about'; // يأخذك لصفحة عني المستقلة
            };
        } 
        // رابط الرئيسية
        else if (text.includes('الرئيسية')) {
            el.setAttribute('href', '#/');
            el.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.hash = '#/';
            };
        }
    });

    // قائمة الموبايل
    const header = document.querySelector('header');
    if (header) {
        const btns = header.querySelectorAll('button, .menu-toggle, .hamburger, i, svg');
        const nav = header.querySelector('nav') || header.querySelector('ul');
        
        btns.forEach(btn => {
            btn.onclick = function(e) {
                if (nav) {
                    e.preventDefault();
                    if (nav.style.display === 'none' || nav.style.display === '') {
                        nav.style.display = 'flex';
                        nav.style.flexDirection = 'column';
                        nav.style.position = 'absolute';
                        nav.style.top = '70px'; 
                        nav.style.left = '0';
                        nav.style.width = '100%';
                        nav.style.backgroundColor = '#05070D';
                        nav.style.zIndex = '9999';
                        nav.style.padding = '20px';
                        nav.style.borderBottom = '1px solid #1E3A8A';
                    } else {
                        nav.style.display = 'none';
                    }
                }
            };
        });
    }
}

// 4. صفحة قائمة المقالات
function renderPostsPage() {
    const main = document.querySelector('main') || document.body;
    let html = '<div style="padding: 40px 20px; max-width: 800px; margin: 0 auto; direction: rtl; min-height: 70vh;">';
    html += '<h1 style="color: #3B82F6; margin-bottom: 30px; text-align: center;">كل الكتابات</h1>';
    
    if (posts.length === 0) {
        html += '<p style="text-align:center; color:#fff;">لا توجد مقالات بعد.</p>';
    } else {
        posts.forEach(post => {
            html += `
                <div style="background: #101B33; padding: 20px; margin-bottom: 15px; border-radius: 10px; border: 1px solid #1E3A8A; text-align:right;">
                    <h3 style="color: #E5E7EB; margin-bottom: 5px;">${post.title}</h3>
                    <small style="color: #94A3B8;">${post.date}</small>
                    <p style="margin-top: 10px; color: #cbd5e1;">${post.excerpt}</p>
                    <a href="#/post/${encodeURIComponent(post.slug)}" style="color: #3B82F6; text-decoration: none; font-weight: bold;">اقرأ المزيد &larr;</a>
                </div>
            `;
        });
    }
    html += '</div>';
    main.innerHTML = html;
}

// 5. صفحة "عني" المستقلة (تحتوي فقط على معلوماتك)
function renderAboutPage() {
    const main = document.querySelector('main') || document.body;
    
    main.innerHTML = `<div style="padding: 40px 20px; max-width: 800px; margin: 0 auto; direction: rtl; min-height: 70vh;">
        <h1 style="color: #3B82F6; margin-bottom: 30px; text-align: center;">تعرف علي</h1>
        <div style="color: #cbd5e1; line-height: 1.8; font-size: 1.1rem;">
            ${aboutHTML ? aboutHTML : '<p>معلومات "عني" غير متوفرة حالياً.</p>'}
        </div>
    </div>`;
}

// 6. صفحة الرئيسية (بدون قسم عني)
function renderHomePage() {
    const main = document.querySelector('main') || document.body;
    // نعيد بناء الرئيسية (التي مسحنا منها قسم "عني")
    main.innerHTML = homeHTML; 
    
    // نضع المقالات في مكانها
    let container = document.querySelector('.posts-grid') || document.querySelector('#posts-container');
    if (container) {
        let postsHTML = '';
        posts.forEach(post => {
            postsHTML += `
                <div style="background: #101B33; padding: 20px; margin-bottom: 15px; border-radius: 10px; border: 1px solid #1E3A8A; text-align:right; direction:rtl;">
                    <h3 style="color: #E5E7EB; margin-bottom: 5px;">${post.title}</h3>
                    <small style="color: #94A3B8;">${post.date}</small>
                    <p style="margin-top: 10px; color: #cbd5e1;">${post.excerpt}</p>
                    <a href="#/post/${encodeURIComponent(post.slug)}" style="color: #3B82F6; text-decoration: none; font-weight: bold;">اقرأ المزيد &larr;</a>
                </div>
            `;
        });
        container.innerHTML = postsHTML;
    }
    setTimeout(fixButtonsAndMenu, 100); 
}

// 7. صفحة قراءة المقال
function renderSinglePost(slug) {
    const main = document.querySelector('main') || document.body;
    const post = posts.find(p => p.slug === slug);
    
    if (post) {
        main.innerHTML = `
            <div style="padding: 40px 20px; max-width: 800px; margin: 0 auto; color: #fff; line-height: 1.8; direction: rtl; min-height: 70vh;">
                <a href="#/posts" style="color: #3B82F6; text-decoration: none; display:inline-block; margin-bottom: 20px; font-weight:bold; font-size: 1.2rem;">&rarr; العودة للكتابات</a>
                <h1 style="color: #3B82F6; margin-bottom: 10px;">${post.title}</h1>
                <small style="color: #94A3B8;">${post.date}</small>
                <div style="margin-top: 30px; font-size: 1.15rem;">${marked.parse(post.content)}</div>
            </div>
        `;
    } else {
        main.innerHTML = `<div style="text-align:center; padding:50px;"><h1>المقال غير موجود</h1><a href="#/">العودة للرئيسية</a></div>`;
    }
}

// 8. نظام التوجيه (يقرر أي صفحة تظهر)
function handleRouting() {
    const hash = window.location.hash;
    
    if (hash === '#/about') {
        renderAboutPage(); // صفحة عني فقط
    } else if (hash === '#/posts') {
        renderPostsPage(); // صفحة المقالات فقط
    } else if (hash.startsWith('#/post/')) {
        renderSinglePost(decodeURIComponent(hash.replace('#/post/', ''))); // صفحة قراءة مقال
    } else {
        renderHomePage(); // الرئيسية (التي لا تحتوي على قسم عني)
    }
    window.scrollTo(0,0); // دائماً اصعد لأعلى عند تغيير الصفحة
}
