// 1. تحميل مكتبة تحويل النصوص
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => { initWebsite(); }; 
document.head.appendChild(script);

const GITHUB_USER = 'zakariaelfoughali';
const GITHUB_REPO = 'zakaria-site';
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

let posts = [];
let originalMainHTML = ''; 

// 2. الدالة الرئيسية
async function initWebsite() {
    const main = document.querySelector('main') || document.body;
    originalMainHTML = main.innerHTML; 

    // جلب المقالات
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

    // عرض المقالات في الرئيسية
    displayPostsInHome();
    
    // تفعيل القائمة والروابط
    setupMenuAndLinks();
    
    // تفعيل التنقل بين المقالات
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
}

// 3. عرض المقالات في الصفحة الرئيسية
function displayPostsInHome() {
    let container = document.querySelector('.posts-grid') || document.querySelector('#posts-container');
    
    let postsHTML = '';
    if (posts.length === 0) {
        postsHTML = '<p style="text-align:center; color:#fff;">لا توجد مقالات.</p>';
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
        else document.body.appendChild(section);
    }
}

// 4. إصلاح القائمة والروابط (بشكل إجباري)
function setupMenuAndLinks() {
    // إصلاح القائمة
    const header = document.querySelector('header');
    if (header) {
        // نبحث عن أي زر في الهيدر
        const btns = header.querySelectorAll('button, .menu-toggle, .hamburger, i, svg');
        const nav = header.querySelector('nav') || header.querySelector('ul');
        
        btns.forEach(btn => {
            btn.onclick = function(e) {
                if (nav) {
                    e.preventDefault();
                    // إذا كانت القائمة مخفية، نظهرها بشكل قائمة عمودية
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

        // إصلاح الروابط
        const links = header.querySelectorAll('a');
        links.forEach(link => {
            link.onclick = function(e) {
                // إغلاق القائمة
                if (nav) nav.style.display = 'none';
                
                // إذا كنا في صفحة مقال، نعود للرئيسية أولاً
                const main = document.querySelector('main') || document.body;
                if (window.location.hash.startsWith('#/post/')) {
                    window.location.hash = '';
                    main.innerHTML = originalMainHTML;
                    displayPostsInHome();
                }

                const text = link.innerText.trim();
                
                // إذا كان "الرئيسية" أو "الكتابات"، نصعد لأعلى الصفحة
                if (text.includes('الرئيسية') || text.includes('الكتابات')) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } 
                // إذا كان "عني" أو "تواصل"، نبحث عن القسم وننزل إليه
                else if (text.includes('عني') || text.includes('تواصل') || text.includes('اتصل')) {
                    e.preventDefault();
                    const headings = document.querySelectorAll('h1, h2, h3, section');
                    for (let h of headings) {
                        if (h.innerText.includes(text)) {
                            h.scrollIntoView({ behavior: 'smooth' });
                            break;
                        }
                    }
                }
            };
        });
    }
}

// 5. عرض المقال عند الضغط عليه
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

            document.getElementById('back-btn').onclick = function(e) {
                e.preventDefault();
                window.location.hash = '';
                main.innerHTML = originalMainHTML;
                displayPostsInHome();
                setupMenuAndLinks(); // إعادة تفعيل القائمة
            };
        }
    } else {
        if (main.innerHTML !== originalMainHTML) {
            main.innerHTML = originalMainHTML;
            displayPostsInHome();
            setupMenuAndLinks();
        }
    }
}
