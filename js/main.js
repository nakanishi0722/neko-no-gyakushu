/* =========================================================
   捨て猫の逆襲 ── サイト共通スクリプト
   キャスト・お知らせ・メニュー・写真の中身は data/ フォルダのファイルで編集します。
   このファイルは通常、編集する必要はありません。
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 小さな道具 ---------- */
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    return n;
  };
  const lines = v => (Array.isArray(v) ? v : String(v || '').split('\n')).map(s => String(s).trim()).filter(Boolean);
  // 改行つきテキスト（配列または \n 区切り）を <br> でつないで入れる
  const putLines = (node, v) => {
    lines(v).forEach((s, i) => { if (i) node.appendChild(document.createElement('br')); node.appendChild(document.createTextNode(s)); });
    return node;
  };
  const list = name => {
    const v = window[name];
    if (Array.isArray(v)) return v;
    if (v !== undefined) console.error('[捨て猫の逆襲] data フォルダの ' + name + ' の書き方を確認してください。');
    return null;
  };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const silhouette = () => {
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('class', 'sil');
    s.setAttribute('viewBox', '0 0 300 400');
    s.setAttribute('preserveAspectRatio', 'xMidYMax meet');
    s.setAttribute('aria-hidden', 'true');
    const u = document.createElementNS(SVGNS, 'use');
    u.setAttribute('href', '#sil');
    s.appendChild(u);
    return s;
  };
  const img = (src, alt, eager) => {
    const i = new Image();
    // 画面に近づいてから読み込む（src より先に指定しないと効かない）
    if (eager) i.setAttribute('fetchpriority', 'high'); else i.loading = 'lazy';
    i.decoding = 'async';
    i.alt = alt || '';
    // メニュー・お知らせの写真は切り抜かずに全体を見せる。
    //  .ph-natural … 枠を写真と同じ形にする
    //  .ph-fit     … 決まった形の枠に全体を収め、余白は同じ写真をぼかして埋める
    i.addEventListener('load', () => {
      const box = i.closest('.ph-natural, .ph-fit');
      if (!box || !i.naturalWidth) return;
      if (box.classList.contains('ph-natural')) box.style.aspectRatio = i.naturalWidth + ' / ' + i.naturalHeight;
      box.style.setProperty('--ph-bg', 'url("' + i.src.replace(/"/g, '%22') + '")');
      box.classList.add('has-img');
      // タップで写真を大きく表示（リンクの中にある写真は除く）
      if (box.hasAttribute('data-zoom') && !box.closest('a') && !box.querySelector('a.zoom')) {
        const a = el('a', 'zoom');
        a.href = i.src;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', (i.alt || '写真') + 'を拡大して見る');
        box.appendChild(a);
      }
    });
    // ファイル名の間違いなどで読み込めないときは、写真を外して猫のシルエットに戻す
    i.addEventListener('error', () => {
      console.warn('[捨て猫の逆襲] 写真が見つかりません: ' + src);
      const box = i.closest('.ph-natural, .ph-fit');
      if (box) { box.classList.remove('has-img'); box.style.aspectRatio = ''; }
      i.remove();
    });
    i.src = src;
    return i;
  };
  // 写真の枠（写真がなければ猫のシルエット）
  const photoBox = (src, alt, cls, withSil) => {
    const ph = el('div', cls || 'ph');
    if (withSil !== false) ph.appendChild(silhouette());
    if (src) ph.appendChild(img(src, alt));
    return ph;
  };
  const fmtDate = d => String(d || '').replace(/-/g, '.');
  const yen = p => (typeof p === 'number' ? '¥' + p.toLocaleString('ja-JP') : String(p || ''));
  const crossSvg = () => {
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 10 16');
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', 'M5 0v16M1 5h8');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '1.4');
    p.setAttribute('fill', 'none');
    s.appendChild(p);
    return s;
  };
  const empty = (msg, linkText, href) => {
    const p = el('p', 'empty-note', msg);
    if (linkText) {
      const a = el('a', '', linkText);
      a.href = href;
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
      p.appendChild(document.createTextNode(' '));
      p.appendChild(a);
    }
    return p;
  };
  const X_URL = 'https://x.com/Neko_otr';

  /* ---------- 固定の写真（data/photos.js） ---------- */
  const PHOTOS = window.PHOTOS || {};
  document.querySelectorAll('[data-photo]').forEach(box => {
    const key = box.getAttribute('data-photo');
    const src = PHOTOS[key];
    if (src) box.appendChild(img(src, box.getAttribute('data-alt') || '', key === 'main'));
  });

  /* ---------- キャスト（data/cast.js） ---------- */
  const castMeta = c => {
    const dl = el('dl', 'cast-meta');
    [['誕生日', c.birthday], ['好きなもの', c.likes], ['出勤', c.days]].forEach(([k, v]) => {
      if (!v) return;
      dl.appendChild(el('dt', '', k));
      dl.appendChild(el('dd', '', v));
    });
    return dl.children.length ? dl : null;
  };
  const castBody = (c, wrapCls, nameTag) => {
    const b = el('div', wrapCls);
    b.appendChild(el(nameTag, 'cast-name', c.name));
    if (c.en) b.appendChild(el('p', 'cast-en', c.en));
    if (lines(c.quote).length) b.appendChild(putLines(el('p', 'cast-quote'), c.quote));
    const m = castMeta(c);
    if (m) b.appendChild(m);
    return b;
  };
  const CAST = list('CAST');
  const castTop = document.querySelector('[data-render="cast-top"]');
  if (castTop) {
    // TOPにはリストの上から8人まで（名前・英字名・ひとこと自己PR）
    const picks = (CAST || []).filter(c => c && c.name).slice(0, 8);
    if (!picks.length) castTop.appendChild(empty('キャストは近日公開します。最新情報は', '公式X', X_URL));
    picks.forEach((c, i) => {
      const a = el('article', 'cast reveal');
      const ph = el('div', 'cast-photo');
      ph.appendChild(el('span', 'ci-no', String(i + 1).padStart(2, '0'))).setAttribute('aria-hidden', 'true');
      ph.appendChild(photoBox(c.photo, c.name));
      a.appendChild(ph);
      const b = el('div', 'cast-body');
      b.appendChild(el('h3', 'cast-name', c.name));
      if (c.en) b.appendChild(el('p', 'cast-en', c.en));
      if (lines(c.quote).length) b.appendChild(putLines(el('p', 'cast-quote'), c.quote));
      a.appendChild(b);
      castTop.appendChild(a);
    });
  }
  const castAll = document.querySelector('[data-render="cast-all"]');
  if (castAll) {
    const all = (CAST || []).filter(c => c && c.name);
    if (!all.length) castAll.replaceWith(empty('キャストは近日公開します。最新情報は', '公式X', X_URL));
    all.forEach((c, i) => {
      const li = el('li', 'ci reveal');
      const ph = el('div', 'ci-photo');
      ph.appendChild(el('span', 'ci-no', String(i + 1).padStart(2, '0'))).setAttribute('aria-hidden', 'true');
      ph.appendChild(photoBox(c.photo, c.name));
      li.appendChild(ph);
      li.appendChild(castBody(c, 'ci-body', 'h2'));
      castAll.appendChild(li);
    });
  }

  /* ---------- お知らせ（data/news.js） ---------- */
  const NEWS_RAW = list('NEWS');
  const NEWS = (NEWS_RAW || []).filter(n => n && n.title)
    .map((n, i) => ({ ...n, _i: i }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || a._i - b._i);
  const seen = {};
  NEWS.forEach(n => {
    const base = 'news-' + String(n.date || '').replace(/\D/g, '');
    seen[base] = (seen[base] || 0) + 1;
    n.id = seen[base] > 1 ? base + '-' + seen[base] : base;
  });
  const meta = n => {
    const m = el('div', 'meta');
    const t = el('time', '', fmtDate(n.date));
    if (n.date) t.dateTime = n.date;
    m.appendChild(t);
    if (n.tag) m.appendChild(el('span', 'tag', n.tag));
    return m;
  };
  // 写真のないお知らせ：猫のマーク・爪痕・タグ名で、サイトの雰囲気に合わせた絵を入れる
  const newsMark = n => {
    const box = el('div', 'ph-mark');
    box.setAttribute('aria-hidden', 'true');
    const claws = document.createElementNS(SVGNS, 'svg');
    claws.setAttribute('class', 'claws');
    claws.setAttribute('viewBox', '0 0 100 125');
    claws.setAttribute('preserveAspectRatio', 'none');
    ['M58 8 Q70 60 92 118', 'M68 4 Q80 55 100 108', 'M78 2 Q88 48 104 96'].forEach(d => {
      const p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', d);
      claws.appendChild(p);
    });
    box.appendChild(claws);
    const cat = document.createElementNS(SVGNS, 'svg');
    cat.setAttribute('class', 'cat');
    cat.setAttribute('viewBox', '0 0 24 24');
    const u = document.createElementNS(SVGNS, 'use');
    u.setAttribute('href', '#cat');
    cat.appendChild(u);
    box.appendChild(cat);
    box.appendChild(el('span', 'label', n.tag || 'News'));
    return box;
  };
  const paragraphs = (node, v) => { lines(v).forEach(s => node.appendChild(el('p', '', s))); return node; };
  const newsLink = n => {
    if (!n.link || !n.link.url) return null;
    const a = el('a', 'nl-link');
    a.href = n.link.url;
    if (/^https?:/.test(n.link.url)) { a.target = '_blank'; a.rel = 'noopener'; }
    a.appendChild(el('span', 'u', n.link.label || '詳しく見る'));
    return a;
  };

  const newsTop = document.querySelector('[data-render="news-top"]');
  if (newsTop) {
    if (!NEWS.length) newsTop.appendChild(empty('お知らせはまだありません。'));
    NEWS.slice(0, 3).forEach(n => {
      const a = el('a', 'news-card reveal');
      a.href = 'news.html#' + n.id;
      const ph = el('div', 'ph plain ph-fit');
      if (n.photo) ph.appendChild(img(n.photo, n.title)); else ph.appendChild(newsMark(n));
      a.appendChild(ph);
      a.appendChild(meta(n));
      const h = el('h3');
      h.appendChild(el('span', 'u', n.title));
      a.appendChild(h);
      newsTop.appendChild(a);
    });
  }

  const newsAll = document.querySelector('[data-render="news-all"]');
  if (newsAll) {
    if (!NEWS.length) newsAll.appendChild(empty('お知らせはまだありません。'));
    const [first, ...rest] = NEWS;
    if (first) {
      const art = el('article', 'grid12 nl-feature reveal');
      art.id = first.id;
      const ph = el('div', 'ph plain ph-natural'); ph.setAttribute('data-zoom', '');
      if (first.photo) ph.appendChild(img(first.photo, first.title));
      art.appendChild(ph);
      const body = el('div', 'nl-feature-body');
      body.appendChild(meta(first));
      body.appendChild(el('h2', '', first.title));
      paragraphs(body, first.text);
      const l = newsLink(first);
      if (l) body.appendChild(l);
      art.appendChild(body);
      newsAll.appendChild(art);
    }
    if (rest.length) {
      const ul = el('ul', 'nl-list reveal');
      rest.forEach(n => {
        const li = el('li', 'grid12 nl-item' + (n.photo ? ' has-photo' : ''));
        li.id = n.id;
        li.appendChild(meta(n));
        const body = el('div', 'nl-body');
        body.appendChild(el('h2', '', n.title));
        paragraphs(body, n.text);
        const l = newsLink(n);
        if (l) body.appendChild(l);
        li.appendChild(body);
        if (n.photo) {
          const ph = el('div', 'ph plain nl-photo ph-natural'); ph.setAttribute('data-zoom', '');
          ph.appendChild(img(n.photo, n.title));
          li.appendChild(ph);
        }
        ul.appendChild(li);
      });
      newsAll.appendChild(ul);
    }
  }

  /* ---------- メニュー（data/menu.js） ---------- */
  const MENU = (list('MENU') || []).filter(c => c && Array.isArray(c.items));
  const item = (it, headTag) => {
    const d = el('div', 'item');
    d.appendChild(el(headTag, '', it.name));
    if (it.en) d.appendChild(el('span', 'en', it.en));
    if (it.price != null && it.price !== '') d.appendChild(el('span', 'price', yen(it.price)));
    if (it.text) d.appendChild(el('p', '', it.text));
    return d;
  };
  // TOPのMenu：写真の横に出す料金（data/menu.js の MENU_TOP）
  const menuTop = document.querySelector('[data-render="menu-top"]');
  const MT = window.MENU_TOP;
  if (menuTop && MT && Array.isArray(MT.items)) {
    const box = el('div', 'menu-cat');
    const h = el('h3', '', MT.en || MT.title);
    if (MT.en && MT.title) { h.appendChild(document.createTextNode(' ')); h.appendChild(el('small', '', MT.title)); }
    box.appendChild(h);
    MT.items.filter(it => it && it.name).forEach(it => box.appendChild(item(it, 'h4')));
    if (MT.note) box.appendChild(el('p', 'note', MT.note));
    menuTop.appendChild(box);
  }
  const menuAll = document.querySelector('[data-render="menu-all"]');
  if (menuAll) {
    if (!MENU.length) menuAll.appendChild(empty('メニューは準備中です。'));
    MENU.forEach(c => {
      const box = el('div', 'mn-cat reveal');
      const h = el('h2', '', c.en || c.jp);
      if (c.en && c.jp) { h.appendChild(document.createTextNode(' ')); h.appendChild(el('small', '', c.jp)); }
      box.appendChild(h);
      c.items.filter(it => it && it.name).forEach(it => box.appendChild(item(it, 'h3')));
      menuAll.appendChild(box);
    });
  }

  /* ---------- ヘッダー・メニュー ---------- */
  const hd = document.getElementById('hd');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (hd) {
    const onScroll = () => hd.classList.toggle('is-scrolled', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (burger && drawer) {
    const setOpen = open => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      void drawer.offsetHeight;   // 表示の切り替えをここで確定させる
      if (open) { const f = drawer.querySelector('a'); if (f) f.focus({ preventScroll: true }); }
    };
    burger.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
      setOpen(false);
      // 同じページ内のリンク（#concept など）は、メニューを閉じてからスクロールする
      const h = a.getAttribute('href');
      const t = h && h.charAt(0) === '#' ? document.getElementById(h.slice(1)) : null;
      if (t) {
        e.preventDefault();
        history.pushState(null, '', h);
        t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }));
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setOpen(false); burger.focus(); }
    });
    // PC幅に戻ったら閉じる
    matchMedia('(min-width: 861px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }
  document.querySelectorAll('.totop').forEach(b => b.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' })));

  /* ---------- スクロールで表示 ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    reveals.forEach(n => io.observe(n));
  } else {
    reveals.forEach(n => n.classList.add('in'));
  }

  // ページ内リンク（news.html#news-… など）で開いたとき、描画後の位置へ移動する
  if (location.hash.length > 1) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) { t.classList.add('in'); t.scrollIntoView({ block: 'start' }); }
  }

  /* ---------- TOPの開幕演出 ---------- */
  const intro = document.getElementById('intro');
  if (intro) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const open = () => {
      if (intro.classList.contains('open')) return;
      intro.classList.add('open');
      setTimeout(() => intro.classList.add('done'), 1600);
    };
    if (reduce || location.hash.length > 1) intro.classList.add('done');
    else {
      const t = setTimeout(open, 2850);
      const skip = () => { clearTimeout(t); open(); };
      intro.addEventListener('click', skip);
      addEventListener('keydown', skip, { once: true });
    }
  }

  /* ---------- TOPのマウス視差（PCのみ） ---------- */
  const hero = document.getElementById('hero');
  if (hero && matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      hero.style.setProperty('--px', (x * -28).toFixed(1) + 'px');
      hero.style.setProperty('--py', (y * -18).toFixed(1) + 'px');
    });
  }
})();
