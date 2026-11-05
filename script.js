// تحميل مكتبة تحويل النصوص
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => { fetchPosts(); }; 
document.head.appendChild(script);

const GITHUB_USER = 'zakii-hu';
const GITHUB_REPO = 'zakaria-site';
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

let posts = [];
let originalMainHTML = ''; 

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
                        
                        const title = titleMatch ? titleMatch[1].replace(/["']/g, '').trim() : 'بدون عنوان';
                        const date = dateMatch ? dateMatch[1].split('T')[0] : '';
                        
                        posts.push({
                            slug: file.name.replace('.md', ''),
                            title: title,
                            date: date,
                            content: content,
                            excerpt: content.replace(/(<([^>]+)>)/gi, "").substring(0, 100) + '...'
                        });
                    }
                }
            }
        }
        initApp();
    } catch (error) {
        console.error("خطأ في جلب المقالات:", error);
        initApp(); 
    }
}

function initApp() {
    const main = document.querySelector('main') || document.body;
    originalMainHTML = main.innerHTML; 

    displayPostsInHome();
    handleRouting();

    // 🛠️ إصلاح جذري للقائمة والروابط
    const header = document.querySelector('header');
    if (header) {
        const btn = header.querySelector('button');
        const nav = header.querySelector('nav') || header.querySelector('ul');
        
        // 1. إجبار القائمة على الفتح والإغلاق
        if (btn && nav) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // إذا كانت مخفية، نظهرها بالقوة
                if (nav.style.display === 'none' || getComputedStyle(nav).display === 'none') {
                    nav.style.setProperty('display', 'flex', 'important');
                    nav.style.setProperty('flex-direction', 'column', 'important');
                    nav.style.setProperty('position', 'absolute', 'important');
                    nav.style.setProperty('top', '100%', 'important');
                    nav.style.setProperty('left', '0', 'important');
                    nav.style.setProperty('width', '100%', 'important');
                    nav.style.setProperty('background-color', '#05070D', 'important');
                    nav.style.setProperty('padding', '20px', 'important');
                    nav.style.setProperty('z-index', '1000', 'important');
                    nav.style.setProperty('border-bottom', '1px solid #1E3A8A', 'important');
                } else {
                    nav.style.display = 'none';
                }
            });
        }

        // 2. إجبار الروابط على العمل والتمرير
        const links = header.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // إغلاق القائمة بعد الضغط
                if (nav && window.innerWidth <= 768) nav.style.display = 'none';

                // إذا كنا في مقال، نرجع للرئيسية أولاً
                if (window.location.hash.startsWith('#/post/')) {
                    window.location.hash = '';
                    main.innerHTML = originalMainHTML;
                    displayPostsInHome();
                }

                const targetHash = link.getAttribute('href');
                const text = link.innerText.trim();

                // التمرير بناءً على الـ ID أو النص
                if (targetHash && targetHash.startsWith('#') && targetHash !== '#/' && targetHash !== '#') {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetHash);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // إذا لم يكن هناك ID، نبحث عن العنوان بالاسم
                    const headings = document.querySelectorAll('h1, h2, h3');
                    for (let h of headings) {
                        if (h.innerText.includes(text) && h.closest('section')) {
                            e.preventDefault();
                            h.closest('section').scrollIntoView({ behavior: 'smooth' });
                            break;
                        }
                    }
                }
            });
        });
    }
}

function displayPostsInHome() {
    const main = document.querySelector('main') || document.body;
    let container = document.querySelector('.posts-grid') || document.querySelector('#posts-container');
    
    let postsHTML = '';
    if (posts.length === 0) {
        postsHTML = '<p style="text-align:center; color:#fff;">لا توجد مقالات بعد.</p>';
    } else {
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
    }

    if (container) {
        container.innerHTML = postsHTML;
    } else {
        const section = document.createElement('section');
        section.id = 'dynamic-posts';
        section.style.cssText = 'padding: 40px 20px; max-width: 800px; margin: 0 auto; direction: rtl;';
        section.innerHTML = `<h2 style="margin-bottom:20px; color:#3B82F6; text-align:center;">أحدث المقالات</h2>` + postsHTML;
        const footer = document.querySelector('footer');
        if(footer) footer.before(section);
        else main.appendChild(section);
    }
}

function handleRouting() {
    const hash = window.location.hash;
    const main = document.querySelector('main') || document.body;
    
    if (hash.startsWith('#/post/')) {
        const slug = decodeURIComponent(hash.replace('#/post/', ''));
        const post = posts.find(p => p.slug === slug);
        
        if (post) {
            main.innerHTML = `
                <div style="padding: 40px 20px; max-width: 800px; margin: 0 auto; color: #fff; line-height: 1.8; direction: rtl; min-height: 70vh;">
                    <a href="#" id="back-btn" style="color: #3B82F6; text-decoration: none; display:inline-block; margin-bottom: 20px; font-weight:bold; font-size: 1.2rem;">&rarr; العودة للرئيسية</a>
                    <h1 style="color: #3B82F6; margin-bottom: 10px;">${post.title}</h1>
                    <small style="color: #94A3B8;">${post.date}</small>
                    <div style="margin-top: 30px; font-size: 1.15rem;">${marked.parse(post.content)}</div>
                </div>
            `;
            window.scrollTo(0,0);

            document.getElementById('back-btn').addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '';
                main.innerHTML = originalMainHTML;
                displayPostsInHome();
            });
        }
    } else {
        if (main.innerHTML !== originalMainHTML) {
            main.innerHTML = originalMainHTML;
            displayPostsInHome();
        }
    }
}

window.addEventListener('hashchange', handleRouting);
