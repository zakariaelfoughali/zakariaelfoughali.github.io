// تحميل مكتبة لتحويل نصوص مارك داون إلى HTML
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
document.head.appendChild(script);

// إعدادات الاتصال بمستودعك
const GITHUB_USER = 'zakii-hu';
const GITHUB_REPO = 'zakaria-site';
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

let posts = [];

// جلب المقالات من GitHub
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const files = await response.json();

        if (!Array.isArray(files)) return; // إذا كان المجلد فارغاً

        files.sort((a, b) => b.name.localeCompare(a.name)); // ترتيب من الأحدث للأقدم

        for (let file of files) {
            if (file.name.endsWith('.md')) {
                const rawContent = await fetch(file.download_url).then(res => res.text());
                
                // فصل البيانات (العنوان والتاريخ) عن المحتوى
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
                        content: marked.parse(content),
                        excerpt: content.substring(0, 100) + '...'
                    });
                }
            }
        }

        renderPosts();
        handleRouting();

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// عرض المقالات في الصفحة الرئيسية
function renderPosts() {
    const container = document.querySelector('.posts-grid') || document.getElementById('posts-container');
    if (!container) return;

    container.innerHTML = posts.map(post => `
        <article class="post-card">
            <h3><a href="#/post/${post.slug}">${post.title}</a></h3>
            <span class="post-date">${post.date}</span>
            <p>${post.excerpt}</p>
            <a href="#/post/${post.slug}" class="read-more">اقرأ المزيد &larr;</a>
        </article>
    `).join('');
}

// قراءة المقال عند الضغط عليه
function handleRouting() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#/post/')) {
        const slug = hash.replace('#/post/', '');
        const post = posts.find(p => p.slug === slug);
        
        if (post) {
            const main = document.querySelector('main');
            if (main) {
                main.innerHTML = `
                    <article class="single-post" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
                        <a href="#/" style="display:inline-block; margin-bottom: 20px; color: #3B82F6; text-decoration: none;">&rarr; العودة للرئيسية</a>
                        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #fff;">${post.title}</h1>
                        <p style="color: #94A3B8; margin-bottom: 2rem;">${post.date}</p>
                        <div class="post-content" style="line-height: 1.8; color: #E5E7EB; font-size: 1.1rem;">${post.content}</div>
                    </article>
                `;
            }
        }
    }
}

// تشغيل الكود عند فتح الموقع
window.addEventListener('DOMContentLoaded', fetchPosts);
window.addEventListener('hashchange', handleRouting);
