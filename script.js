// تحميل مكتبة تحويل النصوص
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => { fetchPosts(); }; 
document.head.appendChild(script);

const GITHUB_USER = 'zakii-hu';
const GITHUB_REPO = 'zakaria-site';
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

let posts = [];

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const files = await response.json();

        if (!Array.isArray(files)) return;

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

        displayPosts();
        handleRouting();

    } catch (error) {
        console.error("خطأ:", error);
    }
}

function displayPosts() {
    let container = document.querySelector('main') || document.querySelector('#app') || document.getElementById('my-posts');
    if (!container) {
        container = document.createElement('div');
        container.id = 'my-posts';
        document.body.appendChild(container);
    }

    let html = '<div style="padding: 20px; max-width: 800px; margin: 0 auto; color: #fff; direction: rtl;"><h2 style="margin-bottom:20px; color:#3B82F6; text-align:center;">أحدث المقالات</h2>';
    
    if (posts.length === 0) {
        html += '<p style="text-align:center;">لا توجد مقالات بعد.</p>';
    } else {
        posts.forEach(post => {
            html += `
                <div style="background: #101B33; padding: 20px; margin-bottom: 15px; border-radius: 10px; border: 1px solid #1E3A8A;">
                    <h3 style="color: #E5E7EB; margin-bottom: 5px;">${post.title}</h3>
                    <small style="color: #94A3B8;">${post.date}</small>
                    <p style="margin-top: 10px; color: #cbd5e1;">${post.excerpt}</p>
                    <a href="#/post/${encodeURIComponent(post.slug)}" style="color: #3B82F6; text-decoration: none; font-weight: bold;">اقرأ المزيد &larr;</a>
                </div>
            `;
        });
    }
    html += '</div>';
    container.innerHTML = html;
}

function handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#/post/')) {
        // هنا نقوم بفك تشفير الرابط ليتطابق مع اسم الملف
        const slug = decodeURIComponent(hash.replace('#/post/', ''));
        const post = posts.find(p => p.slug === slug);
        
        if (post) {
            let container = document.querySelector('main') || document.querySelector('#app') || document.getElementById('my-posts');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; max-width: 800px; margin: 0 auto; color: #fff; line-height: 1.8; direction: rtl;">
                        <a href="#/" style="color: #3B82F6; text-decoration: none; display:inline-block; margin-bottom: 20px; font-weight:bold;">&rarr; العودة للرئيسية</a>
                        <h1 style="color: #3B82F6; margin-bottom: 10px;">${post.title}</h1>
                        <small style="color: #94A3B8;">${post.date}</small>
                        <div style="margin-top: 30px; font-size: 1.1rem;">${marked.parse(post.content)}</div>
                    </div>
                `;
            }
        }
    } else {
        displayPosts(); // العودة للقائمة الرئيسية
    }
}

window.addEventListener('hashchange', handleRouting);
