(function () {
  'use strict';

  /* ===== إعدادات قابلة للتعديل ===== */
  var EMAIL = 'hello@example.com'; // غيّر هذا البريد إلى بريدك الحقيقي
  var SITE_NAME = 'Zakariaelfoughali';

  /* ===== المقالات: عدّل أو أضف هنا ===== */
  var POSTS = [
    {
      slug: 'why-we-write',
      title: 'لماذا نكتب؟',
      excerpt: 'الكتابة ليست نقلًا لفكرة جاهزة، بل الطريقة التي تتحول بها الفكرة إلى شيء يمكن الإمساك به.',
      date: '2026-10-28',
      tags: ['تأمل', 'الكتابة'],
      readTime: 3,
      content: [
        'نظن أحيانًا أن الكاتب يعرف ما سيقوله ثم يجلس ليدوّنه. الحقيقة أن أغلبنا يكتشف رأيه أثناء الكتابة، حين تُجبره الجملة على أن يكون دقيقًا.',
        '## الورقة تسألك',
        'حين تكتب «أشعر بالضيق» تسألك الجملة التالية: من أي شيء؟ ومنذ متى؟ هذه الأسئلة الصغيرة هي ما يجعل الكتابة أداة تفكير قبل أن تكون أداة نشر.',
        'ولهذا أكتب. لا لأن عندي إجابات، بل لأن السطر الفارغ يعلّمني أي الأسئلة تستحق أن تُطرح.'
      ]
    },
    {
      slug: 'first-sentence',
      title: 'فن الجملة الأولى',
      excerpt: 'الجملة الأولى وعدٌ صغير للقارئ. كيف نكتبها دون أن نُثقلها بما لا تحتمل؟',
      date: '2026-10-14',
      tags: ['الكتابة', 'أسلوب'],
      readTime: 3,
      content: [
        'تتعطل كثير من النصوص عند سطرها الأول. نريد له أن يكون لامعًا ومحكمًا، فنؤجل الكتابة كلها بحثًا عنه.',
        '## ابدأ من الوسط',
        'جرّب أن تكتب الفقرة التي تعرفها جيدًا أولًا. حين يكتمل النص ستجد أن جملتك الأولى كانت مختبئة داخل الفقرة الثانية أو الثالثة، وما عليك إلا أن تنقلها.',
        'الجملة الأولى الجيدة لا تعد بأكثر مما يملكه النص. تكفي أن تفتح بابًا صغيرًا يشجع القارئ على الدخول.'
      ]
    },
    {
      slug: 'rewriting',
      title: 'ما تعلمته من إعادة الكتابة',
      excerpt: 'المسودة الأولى تكتب لك، أما المسودة الثانية فهي التي تكتبها أنت.',
      date: '2026-09-30',
      tags: ['تحرير', 'الكتابة'],
      readTime: 4,
      content: [
        'في المسودة الأولى أسمح لنفسي بكل شيء: التكرار، والاستطراد، والجمل الطويلة التي لا تعرف أين تنتهي. الهدف الوحيد أن يوجد نص أعمل عليه.',
        '## الحذف أصعب من الإضافة',
        'في المراجعة أسأل عن كل فقرة: لو حذفتها، هل يلاحظ القارئ؟ إن كان الجواب لا، فهي لنفسي وليست له، وأحتفظ بها في ملف جانبي.',
        'أقرأ النص بصوت مسموع أيضًا. الأذن تلتقط تعثّر الإيقاع قبل أن تراه العين، وهذه أسرع طريقة عرفتها لتحسين الجملة.'
      ]
    },
    {
      slug: 'daily-habits',
      title: 'عادات صغيرة لكاتب يومي',
      excerpt: 'لا تحتاج إلى إلهام دائم. تحتاج إلى موعد ثابت، وهدف صغير، وقدر من التسامح مع نفسك.',
      date: '2026-09-12',
      tags: ['عادات', 'تأمل'],
      readTime: 3,
      content: [
        'الإلهام ضيف لا يأتي بموعد، أما العادة فتأتي كل يوم. وقد وجدت أن الالتزام الصغير أنفع من الحماس الكبير.',
        '## قاعدة الخمس عشرة دقيقة',
        'أجلس كل صباح خمس عشرة دقيقة أكتب فيها أي شيء. بعض الأيام تخرج فقرة جيدة، وبعضها لا يخرج إلا قائمة بما أريد قوله. الاثنان يحسبان.',
        'أما الأيام التي أنقطع فيها فلا أحاسب نفسي عليها. أعود في اليوم التالي كأن شيئًا لم يكن، لأن الكتابة صداقة طويلة وليست سباقًا.'
      ]
    }
  ];

  /* ===== أدوات مساعدة ===== */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var VIEWS = ['home', 'writings', 'post', 'about', 'contact'];
  var TITLES = {
    home: SITE_NAME + ' | مدونة كتابات عربية',
    writings: 'الكتابات | ' + SITE_NAME,
    about: 'عني | ' + SITE_NAME,
    contact: 'تواصل | ' + SITE_NAME
  };
  var state = { q: '', tag: '' };
  var firstLoad = true;
  var toastTimer;

  document.documentElement.classList.add('js');

  function el(tag, props, kids) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'class') n.className = props[k];
      else if (k === 'text') n.textContent = props[k];
      else n.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) {
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function fmtDate(d) {
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return d; }
  }

  function sorted() {
    return POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ===== البطاقات ===== */
  function card(p) {
    var a = el('a', { class: 'card reveal', href: '#/post/' + p.slug });
    a.appendChild(el('div', { class: 'meta' }, [
      el('time', { datetime: p.date, text: fmtDate(p.date) }),
      el('span', { text: 'قراءة ' + p.readTime + ' د' })
    ]));
    a.appendChild(el('h3', { text: p.title }));
    a.appendChild(el('p', { text: p.excerpt }));
    var ul = el('ul', { class: 'tags', 'aria-label': 'الوسوم' });
    p.tags.forEach(function (t) { ul.appendChild(el('li', { text: t })); });
    a.appendChild(ul);
    return a;
  }

  function renderLatest() {
    var box = $('#latest-list');
    box.textContent = '';
    sorted().slice(0, 3).forEach(function (p) { box.appendChild(card(p)); });
  }

  /* ===== قائمة الكتابات: بحث وفلترة ===== */
  function renderFilters() {
    var box = $('#filters');
    box.textContent = '';
    var tags = [];
    POSTS.forEach(function (p) {
      p.tags.forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); });
    });
    ['الكل'].concat(tags).forEach(function (t) {
      var val = t === 'الكل' ? '' : t;
      var b = el('button', { class: 'chip', type: 'button', 'aria-pressed': String(state.tag === val), text: t });
      b.addEventListener('click', function () {
        state.tag = val;
        renderFilters();
        renderList();
      });
      box.appendChild(b);
    });
  }

  function renderList() {
    var q = state.q.trim().toLowerCase();
    var list = sorted().filter(function (p) {
      var okTag = !state.tag || p.tags.indexOf(state.tag) >= 0;
      var hay = (p.title + ' ' + p.excerpt + ' ' + p.tags.join(' ')).toLowerCase();
      return okTag && (!q || hay.indexOf(q) >= 0);
    });
    var box = $('#posts-list');
    box.textContent = '';
    list.forEach(function (p) { box.appendChild(card(p)); });
    $('#empty').hidden = list.length > 0;
    $('#count').textContent = list.length + ' من الكتابات';
    observeReveal();
  }

  /* ===== صفحة المقال ===== */
  function copyLink() {
    var url = location.href;
    function fallback() {
      var ta = el('textarea', { 'aria-hidden': 'true' });
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? 'تم نسخ رابط المقال' : 'تعذّر النسخ، انسخ الرابط من شريط العنوان');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(
        function () { toast('تم نسخ رابط المقال'); },
        fallback
      );
    } else { fallback(); }
  }

  function backLink() {
    var a = el('a', { class: 'back', href: '#/writings' });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-arrow');
    svg.appendChild(use);
    a.appendChild(svg);
    a.appendChild(document.createTextNode('الرجوع إلى الكتابات'));
    return a;
  }

  function renderPost(slug) {
    var box = $('#post-view');
    box.textContent = '';
    var p = POSTS.filter(function (x) { return x.slug === slug; })[0];
    box.appendChild(backLink());
    if (!p) {
      box.appendChild(el('h1', { class: 'post-title', text: 'المقال غير موجود' }));
      box.appendChild(el('p', { class: 'muted', text: 'ربما تغيّر الرابط أو حُذف المقال. يمكنك العودة إلى قائمة الكتابات.' }));
      return null;
    }
    var art = el('article');
    art.appendChild(el('h1', { class: 'post-title', text: p.title }));
    art.appendChild(el('div', { class: 'post-meta' }, [
      el('time', { datetime: p.date, text: fmtDate(p.date) }),
      el('span', { text: 'وقت القراءة: ' + p.readTime + ' دقائق' })
    ]));
    var ul = el('ul', { class: 'tags', 'aria-label': 'الوسوم' });
    p.tags.forEach(function (t) { ul.appendChild(el('li', { text: t })); });
    art.appendChild(ul);
    var prose = el('div', { class: 'prose' });
    p.content.forEach(function (c) {
      if (c.indexOf('## ') === 0) prose.appendChild(el('h2', { text: c.slice(3) }));
      else prose.appendChild(el('p', { text: c }));
    });
    art.appendChild(prose);
    var actions = el('div', { class: 'post-actions' });
    var copy = el('button', { class: 'btn btn-ghost copy-btn', type: 'button' });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-copy');
    svg.appendChild(use);
    copy.appendChild(svg);
    copy.appendChild(document.createTextNode('نسخ رابط المقال'));
    copy.addEventListener('click', copyLink);
    actions.appendChild(copy);
    art.appendChild(actions);
    box.appendChild(art);
    return p;
  }

  /* ===== ظهور تدريجي عند التمرير ===== */
  var io = null;
  function observeReveal() {
    var items = document.querySelectorAll('.reveal:not(.in)');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
    }
    items.forEach(function (n) { io.observe(n); });
  }

  /* ===== التوجيه عبر hash ===== */
  function closeMenu() {
    $('#nav').classList.remove('open');
    var b = $('#menu-btn');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', 'فتح القائمة');
  }

  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var r = parts[0] || 'home';
    if (VIEWS.indexOf(r) < 0) r = 'home';
    var title = TITLES[r];

    if (r === 'post') {
      var slug = decodeURIComponent(parts.slice(1).join('/'));
      var p = renderPost(slug);
      title = (p ? p.title : 'المقال غير موجود') + ' | ' + SITE_NAME;
      var meta = $('meta[name="description"]');
      if (meta && p) meta.setAttribute('content', p.excerpt);
    } else {
      var m = $('meta[name="description"]');
      if (m) m.setAttribute('content', 'مدونة ' + SITE_NAME + ' الشخصية: مقالات ونصوص عربية في الكتابة والتأمل والفكر.');
    }

    VIEWS.forEach(function (v) { $('#view-' + v).hidden = v !== r; });
    var active = r === 'post' ? 'writings' : r;
    document.querySelectorAll('.nav a').forEach(function (a) {
      if (a.getAttribute('data-route') === active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.title = title;
    closeMenu();
    window.scrollTo(0, 0);
    if (!firstLoad) $('#main').focus({ preventScroll: true });
    firstLoad = false;
    observeReveal();
  }

  /* ===== نموذج التواصل (mailto) ===== */
  function setupForm() {
    var form = $('#contact-form');
    var status = $('#form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      ['f-name', 'f-email', 'f-msg'].forEach(function (id) {
        var f = $('#' + id);
        var ok = f.value.trim() && (id !== 'f-email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = f;
      });
      if (bad) {
        status.textContent = 'أكمل الحقول المطلوبة وتأكد من صحة البريد الإلكتروني.';
        bad.focus();
        return;
      }
      var name = $('#f-name').value.trim();
      var from = $('#f-email').value.trim();
      var msg = $('#f-msg').value.trim();
      var subject = 'رسالة من ' + name + ' عبر الموقع';
      var body = msg + '\n\n— ' + name + '\n' + from;
      status.textContent = 'سيفتح تطبيق البريد لإرسال الرسالة. إن لم يفتح، راسلني مباشرة على ' + EMAIL;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ===== التشغيل ===== */
  function init() {
    $('#year').textContent = new Date().getFullYear();
    var link = $('#email-link');
    link.href = 'mailto:' + EMAIL;
    link.textContent = EMAIL;
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      if (a.id !== 'email-link') a.href = 'mailto:' + EMAIL;
    });

    var btn = $('#menu-btn');
    btn.addEventListener('click', function () {
      var open = $('#nav').classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); }
    });
    window.addEventListener('scroll', function () {
      $('#site-header').classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

    $('#search').addEventListener('input', function (e) {
      state.q = e.target.value;
      renderList();
    });

    renderLatest();
    renderFilters();
    renderList();
    setupForm();
    window.addEventListener('hashchange', route);
    route();
  }

  init();
})();
