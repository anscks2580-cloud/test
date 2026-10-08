/* ==========================================================================
   PAPERTOV — 화면 동작
   --------------------------------------------------------------------------
   콘텐츠는 site-data.js, 미리보기 화면은 previews.js 에 있습니다.
   이 파일은 그 데이터로 화면을 그리고 인터랙션을 붙입니다.
   ========================================================================== */
(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  root.classList.add('js');

  /* ---------------------------------------------------------------- helpers */
  const $ = (s, el) => (el || doc).querySelector(s);
  const $$ = (s, el) => Array.from((el || doc).querySelectorAll(s));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const mod = (n, m) => ((n % m) + m) % m;
  const pad2 = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const unique = (arr) => arr.filter((v, i) => v && arr.indexOf(v) === i);
  const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);

  const mq = {
    reduce: matchMedia('(prefers-reduced-motion: reduce)'),
    fine: matchMedia('(hover: hover) and (pointer: fine)'),
    desk: matchMedia('(min-width: 901px)'),
  };
  const reduced = () => mq.reduce.matches;

  const ICON = {
    ext: '<svg class="ext" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6.5 5H11v4.5"/></svg>',
    arrow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  };

  /* ---------------------------------------------------------------- data
     관리자 페이지를 붙일 때는 이 함수만 바꾸면 됩니다.
     (예: Firestore 에서 같은 모양의 객체를 불러와 resolve) */
  function loadSiteData() {
    return Promise.resolve(window.PAPERTOV_DATA);
  }

  /* ---------------------------------------------------------------- mockup markup */
  function shotSrc(p, phone) {
    const im = p.images || {};
    return phone ? im.mobile : im.desktop;
  }
  function hasPhoneView(p) {
    const im = p.images || {};
    // 데스크톱 스크린샷만 있고 모바일이 없으면 휴대폰 목업은 쓰지 않습니다.
    return !(im.desktop && !im.mobile);
  }
  function screenInner(p, phone) {
    const src = shotSrc(p, phone);
    if (src) return `<img class="shot" src="${esc(src)}" alt="" loading="lazy" decoding="async">`;
    const tpl = window.PAPERTOV_PREVIEWS && window.PAPERTOV_PREVIEWS[p.preview];
    return tpl ? tpl() : `<div class="pv pv-empty">${esc(p.title)}</div>`;
  }
  function screenHTML(p, phone) {
    return `<span class="screen${phone ? ' is-phone' : ''}"><span class="screen__inner">${screenInner(p, phone)}</span></span>`;
  }
  function desktopFrame(p, attrs) {
    return `<span class="frame"${attrs || ''}><span class="frame__bar"><i></i><i></i><i></i><span class="frame__url">${esc(p.host || p.title)}</span></span>${screenHTML(p, false)}</span>`;
  }
  function phoneFrame(p) {
    return `<span class="phone"><span class="phone__island"></span>${screenHTML(p, true)}</span>`;
  }

  /* ---------------------------------------------------------------- boot */
  loadSiteData()
    .then((D) => {
      if (!D) throw new Error('site-data.js 를 찾지 못했습니다.');
      init(D);
    })
    .catch((err) => console.error('[PAPERTOV]', err));

  function init(D) {
    const P = (D.portfolio || []).filter(Boolean);

    renderBrand(D);
    renderIntro(D, P);
    renderChapters(P);
    renderIndex(P);
    renderProcess(D);
    renderServices(D);
    renderPricing(D);
    renderTrust(D);
    renderFaq(D);
    renderContact(D);

    const detail = setupDetail(P, D);
    const contact = setupForm(D);

    // 상세 열기 / 비슷한 홈페이지 상담하기 / 가격 / 업종 버튼 (이벤트 위임)
    doc.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open]');
      if (opener) {
        e.preventDefault();
        detail.open(+opener.getAttribute('data-open'), opener);
        return;
      }
      const sim = e.target.closest('[data-similar]');
      if (sim) {
        const p = P[+sim.getAttribute('data-similar')];
        detail.close();
        contact.prefill({ industry: p.industry, message: `'${p.title}' 같은 홈페이지를 생각하고 있어요.` });
        return;
      }
      const plan = e.target.closest('[data-plan]');
      if (plan) { contact.prefill({ plan: plan.getAttribute('data-plan') }); return; }
      const ind = e.target.closest('[data-industry]');
      if (ind && !ind.closest('[data-form]')) { contact.prefill({ industry: ind.getAttribute('data-industry') }); return; }
      const go = e.target.closest('[data-goto-contact]');
      if (go) { e.preventDefault(); contact.prefill({}); }
    });

    setupHeader();
    setupMobileNav();
    setupWords();
    try { setupSphere(P, (i, from) => detail.open(i, from)); } catch (err) { console.error('[PAPERTOV] sphere', err); }
    setupChapters();
    setupIndex(P);
    setupProcess();
    setupCursor();
  }

  /* ================================================================ RENDER */

  function renderBrand(D) {
    const B = D.brand || {};
    $$('[data-brand-en]').forEach((el) => { el.textContent = B.nameEn || 'PAPERTOV'; });
    const C = D.contact || {};
    const info = [
      B.name && `상호 ${B.name}`,
      B.owner && `대표 ${B.owner}`,
      B.bizNumber && `사업자등록번호 ${B.bizNumber}`,
      B.address,
      C.email,
      `© ${B.year || new Date().getFullYear()} ${B.nameEn || 'PAPERTOV'}`,
    ].filter(Boolean);
    const el = $('[data-bizinfo]');
    if (el) el.innerHTML = info.map((t) => `<span>${esc(t)}</span>`).join('');
  }

  function renderIntro(D, P) {
    const el = $('[data-facts]');
    if (!el || !P.length) return;
    const cats = unique(P.map((p) => p.categoryKo));
    el.innerHTML = `지금까지 <strong>${P.length}개의 홈페이지와 시스템</strong>을 ${cats.map(esc).join(', ')} 분야에서 만들었습니다.`;
  }

  function overviewHTML(p, noSwatches) {
    const o = p.overview || {};
    const sw = !noSwatches && (p.palette || []).length
      ? `<span class="chip-swatches" aria-hidden="true">${p.palette.map((c) => `<i style="--c:${esc(c.hex)}" title="${esc(c.name)} ${esc(c.hex)}"></i>`).join('')}</span>`
      : '';
    const rows = [
      ['브랜드 / 업종', esc(o.brand)],
      ['제작 목적', esc(o.purpose)],
      ['주요 기능', (o.features || []).length ? `<ul>${o.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''],
      ['디자인 방향', o.design ? esc(o.design) + sw : ''],
    ].filter((r) => r[1]);
    return rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  }

  function renderChapters(P) {
    const box = $('[data-chapters]');
    if (!box) return;
    const list = P.map((p, i) => ({ p, i })).filter((x) => x.p.featured);
    box.innerHTML = list.map(({ p, i }) => {
      const no = pad2(i + 1);
      const link = p.url
        ? `href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="${esc(p.title)} 사이트 열기 (새 창)"`
        : `href="#all-works" data-open="${i}" aria-label="${esc(p.title)} 자세히 보기"`;
      const viewBtn = p.url
        ? `<a class="btn btn--ink" href="${esc(p.url)}" target="_blank" rel="noopener">VIEW WEBSITE ${ICON.ext}</a><button class="btn btn--line" type="button" data-open="${i}">프로젝트 자세히</button>`
        : `<button class="btn btn--ink" type="button" data-open="${i}">자세히 보기</button>`;
      return `
      <article class="chapter" id="project-${esc(p.id)}" data-chapter>
        <div class="wrap">
          <p class="chapter__head"><span class="label">PROJECT ${no}</span><span class="rule" aria-hidden="true"></span><span class="label">${esc(p.category)}</span></p>
          <h3 class="chapter__title">${esc(p.title)}</h3>
          <p class="chapter__sub">${esc(p.subtitle)}</p>
          <div class="chapter__stage">
            <a class="chapter__desktop" ${link} data-cursor="view">${desktopFrame(p)}</a>
            ${hasPhoneView(p) ? `<div class="chapter__phone" aria-hidden="true">${phoneFrame(p)}</div>` : ''}
          </div>
          <div class="chapter__body">
            <p class="chapter__summary">${esc(p.summary)}</p>
            <div class="chapter__side">
              <dl class="overview">${overviewHTML(p)}</dl>
              <div class="chapter__actions">${viewBtn}<button class="text-link" type="button" data-similar="${i}">비슷한 홈페이지 상담하기</button></div>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  function renderIndex(P) {
    const list = $('[data-index-list]');
    const filters = $('[data-filters]');
    const float = $('[data-float]');
    if (!list) return;
    list.innerHTML = P.map((p, i) => `
      <li class="index__item" data-cat="${esc(p.categoryKo)}">
        <button class="index__row" type="button" data-open="${i}" data-fi="${i}">
          <span class="row__no">${pad2(i + 1)}</span>
          <span class="row__title">${esc(p.title)}</span>
          <span class="row__cat">${esc(p.categoryKo)}</span>
          <span class="row__year">${esc(p.year)}</span>
          <span class="row__go" aria-hidden="true">${ICON.arrow}</span>
        </button>
      </li>`).join('');
    const cats = unique(P.map((p) => p.categoryKo));
    if (filters) {
      filters.innerHTML = ['전체'].concat(cats).map((c, k) =>
        `<button class="chip" type="button" aria-pressed="${k === 0}" data-filter="${k === 0 ? '' : esc(c)}">${esc(c)}</button>`).join('');
    }
    if (float) float.innerHTML = P.map((p, i) => desktopFrame(p, ` data-float-i="${i}"`)).join('');
  }

  function renderProcess(D) {
    const box = $('[data-steps]');
    if (!box) return;
    box.innerHTML = (D.process || []).map((s, i) => `
      <li class="step" data-step-i="${i + 1}">
        <span class="step__no" aria-hidden="true">${pad2(i + 1)}</span>
        <h3><span class="sr-only">${i + 1}단계 </span>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        ${s.output ? `<span class="step__out">${esc(s.output)}</span>` : ''}
      </li>`).join('');
  }

  function renderServices(D) {
    const box = $('[data-services]');
    if (box) {
      box.innerHTML = (D.services || []).map((s) => `
        <li class="svc">
          <h3>${esc(s.title)}</h3>
          <p class="svc__desc">${esc(s.desc)}</p>
          ${s.fit ? `<p class="svc__fit"><span>이런 곳에</span>${esc(s.fit)}</p>` : ''}
        </li>`).join('');
    }
    const chips = $('[data-industry-chips]');
    if (chips) {
      chips.innerHTML = ((D.contact || {}).industries || []).filter((x) => x !== '기타')
        .map((x) => `<button class="chip" type="button" data-industry="${esc(x)}">${esc(x)}</button>`).join('');
    }
  }

  function renderPricing(D) {
    const pr = D.pricing || {};
    const box = $('[data-plans]');
    if (box) {
      box.innerHTML = (pr.plans || []).map((pl) => `
        <article class="plan${pl.featured ? ' plan--featured' : ''}">
          <div class="plan__top"><span class="plan__name">${esc(pl.name)}</span>${pl.featured ? '<span class="plan__badge">추천</span>' : ''}</div>
          <p class="plan__label">${esc(pl.label)}</p>
          <p class="plan__price"><span class="plan__num">${esc(pl.price)}</span><span class="plan__unit">${esc(pl.unit)}</span></p>
          ${pl.fit ? `<p class="plan__fit"><span>이런 곳에 맞습니다</span>${esc(pl.fit)}</p>` : ''}
          <ul class="plan__features">${(pl.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          ${pl.period ? `<p class="plan__period">제작 기간 ${esc(pl.period)}</p>` : ''}
          <button class="btn${pl.featured ? '' : ' btn--ink'}" type="button" data-plan="${esc(pl.name)}">이 구성으로 상담하기</button>
        </article>`).join('');
    }
    const note = $('[data-pricing-note]');
    if (note) note.textContent = pr.note || '';
  }

  function renderTrust(D) {
    const T = D.trust || {};
    const pbox = $('[data-promises]');
    if (pbox) pbox.innerHTML = (T.promises || []).map((x) => `<div class="promise"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div>`).join('');
    const sbox = $('[data-systems]');
    if (sbox) sbox.innerHTML = (T.systems || []).map((x) => `<li><b>${esc(x.label)}</b><p>${esc(x.detail)}</p></li>`).join('');
    const rbox = $('[data-reviews]');
    const R = (D.reviews || []).filter((r) => r && r.quote);
    if (rbox && R.length) {
      rbox.innerHTML = R.map((r) => `<figure class="review"><blockquote>${esc(r.quote)}</blockquote><p>${esc(r.name)}${r.project ? ` · ${esc(r.project)}` : ''}</p></figure>`).join('');
      rbox.hidden = false;
    }
  }

  function renderFaq(D) {
    const box = $('[data-faq]');
    if (!box) return;
    box.innerHTML = (D.faq || []).map((f) => `
      <details class="qa">
        <summary>${esc(f.q)}<span class="qa__pm" aria-hidden="true"></span></summary>
        <p class="qa__a">${esc(f.a)}</p>
      </details>`).join('');
  }

  function renderContact(D) {
    const C = D.contact || {};
    const rows = [];
    if (C.phone) rows.push(['전화', `<a href="tel:${esc(C.phone.replace(/[^0-9+]/g, ''))}">${esc(C.phone)}</a>`]);
    if (C.email) rows.push(['이메일', `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`]);
    if (C.kakaoUrl) rows.push(['카카오톡', `<a href="${esc(C.kakaoUrl)}" target="_blank" rel="noopener">채널에서 상담하기</a>`]);
    if (C.instagram) rows.push(['인스타그램', `<a href="https://instagram.com/${esc(C.instagram)}" target="_blank" rel="noopener">@${esc(C.instagram)}</a>`]);
    if (C.hours) rows.push(['상담 시간', esc(C.hours)]);
    const dl = $('[data-direct]');
    if (dl) dl.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    const note = $('[data-response-note]');
    if (note) note.textContent = C.responseNote || '';
    const ind = $('[data-form-industries]');
    if (ind) ind.innerHTML = (C.industries || []).map((x) => `<button class="chip" type="button" aria-pressed="false" data-industry="${esc(x)}">${esc(x)}</button>`).join('');
    const plans = $('[data-form-plans]');
    if (plans) {
      const names = ((D.pricing || {}).plans || []).map((p) => p.name).concat('아직 모르겠어요');
      plans.innerHTML = names.map((x) => `<button class="chip" type="button" aria-pressed="false" data-plan-chip="${esc(x)}">${esc(x)}</button>`).join('');
    }
  }

  /* ================================================================ HERO · WEBSITE SPHERE
     제작한 홈페이지 화면들이 모여 하나의 구를 이룹니다.

     장면 (스크롤 진행도 s: 0 → 1, 이어서 착지 c: 0 → 1)
       OUTSIDE   검은 공간 한가운데, 화면 높이의 절반쯤 되는 구가 아주 천천히 돈다
       APPROACH  카메라가 실제로 구를 향해 날아간다 (화각 고정 — 확대가 아니라 이동)
       CLOSE     구가 PROJECT 01 화면을 정면으로 돌려 세우고, 주변 화면은 시야 밖으로 밀려난다
       ENTER     그 화면의 가운데가 열리며 카메라가 표면을 통과한다
       INSIDE    구 안에서 앞으로, 조금씩 아래로 내려가며 PROJECT 01 이 떠오른다
       LANDING   바닥의 빛으로 내려앉고, 소개 섹션이 그 빛에서 이어진다

     · 스크롤 값은 스프링으로 한 번 걸러(관성) 카메라 경로에 넣습니다.
     · 경로는 축별 단조 3차 보간 — 중간에 멈칫하거나 되돌아가지 않습니다.
     · 마우스는 구의 미세한 회전과 시점만, 스크롤은 카메라의 공간 이동만 맡습니다.
     · 화면 소스: site-data.js 의 images(실제 스크린샷) → 없으면 assets/img/previews/ 의 렌더 이미지 */
  const PREVIEW_DIR = 'assets/img/previews/';
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const smoother = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  const lerp = (a, b, t) => a + (b - a) * t;
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function projectSources(p) {
    const im = p.images || {};
    return {
      d: im.desktop || (p.preview ? `${PREVIEW_DIR}${p.preview}-desktop.webp` : ''),
      m: im.mobile || (!im.desktop && p.preview ? `${PREVIEW_DIR}${p.preview}-mobile.webp` : ''),
    };
  }
  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img.naturalWidth ? img : null);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  function hasWebGL() {
    try {
      const c = doc.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  // 단조 3차 보간 (Fritsch–Carlson, Brodlie 가중치): 키 사이에서 값이 튀거나 되돌아가지 않고,
  // 양 끝은 속도 0 — 정지 상태에서 출발해 정지 상태로 도착합니다.
  function monotone(keys) {
    const n = keys.length;
    const t = keys.map((k) => k[0]), v = keys.map((k) => k[1]);
    const d = [];
    for (let i = 0; i < n - 1; i++) d.push((v[i + 1] - v[i]) / (t[i + 1] - t[i]));
    const m = new Array(n).fill(0);
    for (let i = 1; i < n - 1; i++) {
      if (d[i - 1] * d[i] > 0) {
        const h0 = t[i] - t[i - 1], h1 = t[i + 1] - t[i];
        const w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
        m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
      }
    }
    return (x) => {
      if (x <= t[0]) return v[0];
      if (x >= t[n - 1]) return v[n - 1];
      let i = 0;
      while (x > t[i + 1]) i++;
      const h = t[i + 1] - t[i], u = (x - t[i]) / h, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * v[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * v[i + 1] + (u3 - u2) * h * m[i + 1];
    };
  }

  function setupSphere(P, onOpen) {
    const hero = $('[data-hero]');
    const stage = $('[data-stage]');
    const host = $('[data-sphere]');
    if (!hero || !stage || !host || !P.length) return;

    const ui = {
      intro: $('[data-hero-intro]'), meta: $('[data-hero-meta]'), cue: $('[data-hero-cue]'),
      feat: $('[data-hero-feature]'), hover: $('[data-hero-hover]'), vignette: $('.hero__vignette'),
    };
    const featIn = ui.feat ? $('.hero__feature-in', ui.feat) : null;
    const hoverDefault = ui.hover ? ui.hover.innerHTML : '';
    const cats = unique(P.map((p) => p.categoryKo));
    const cpEl = $('[data-count-projects]'); if (cpEl) cpEl.textContent = pad2(P.length);
    const ciEl = $('[data-count-industries]'); if (ciEl) ciEl.textContent = pad2(cats.length);

    // 카메라가 통과하는 화면이자, 구 안에서 크게 등장하는 작업 = PROJECT 01
    const FEAT = 0;
    const fp = P[FEAT];
    const setText = (sel, v) => { const el = $(sel); if (el) el.textContent = v || ''; };
    setText('[data-f-no]', pad2(FEAT + 1));
    setText('[data-f-cat]', fp.category);
    setText('[data-f-title]', fp.title);
    setText('[data-f-sum]', fp.summary);
    const fOpen = $('[data-f-open]');
    if (fOpen) fOpen.addEventListener('click', () => onOpen(FEAT, fOpen));
    const fBtns = $$('.hero__factions a, .hero__factions button');

    const THREE = window.THREE;
    let renderer = null, cv = null, lost = false;
    if (!THREE || !hasWebGL()) { fallback(); return; }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { fallback(); return; }
    const film = !reduced();
    root.classList.toggle('film', film);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    cv = renderer.domElement;
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; fallback(); });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.03, 300);
    const world = new THREE.Group(); // 구 전체 (회전)
    scene.add(world);

    const R = 10;                          // 구 반지름
    const BASE_TILT = 0.16;                // 윗면이 살짝 보이도록
    const AUTO = reduced() ? 0 : 0.028;    // rad/s — 거의 알아채지 못할 만큼
    const FLOOR_Y = -8.2;                  // 구 안 바닥의 빛
    const FADE_START = 2.8, FADE_END = 0.9; // 표면을 지날 때 가까운 화면이 투명해지는 거리
    const UP = new THREE.Vector3(0, 1, 0);
    let mobile = !mq.desk.matches;
    const startMobile = mobile;
    let W = 0, H = 0, D0 = 60;

    /* ---------------- 셰이더 */
    const uniforms = {
      uAtlas: { value: null }, uReveal: { value: 0 }, uInside: { value: 0 }, uOutside: { value: 1 },
      uFogA: { value: 40 }, uFogB: { value: 80 }, uFocus: { value: 1 },
      uLight: { value: new THREE.Vector3(-0.55, 0.6, 0.58).normalize() },
      uRimDir: { value: new THREE.Vector3(0.62, 0.42, -0.66).normalize() },
      uFloorY: { value: FLOOR_Y }, uFloorGlow: { value: 0 }, uInLight: { value: 0.42 },
    };
    const VARY = `
      varying vec2 vUv;
      varying vec2 vUvB;
      varying vec2 vLocal;
      varying vec3 vNrm;
      varying vec3 vView;
      varying float vAspect;
      varying float vDist;
      varying float vWorldY;
      varying float vHi;
      varying float vBirth;`;
    const SHADE = `
      uniform sampler2D uAtlas;
      uniform float uReveal;
      uniform float uInside;
      uniform float uOutside;
      uniform float uFogA;
      uniform float uFogB;
      uniform float uFocus;
      uniform vec3 uLight;
      uniform vec3 uRimDir;
      uniform float uFloorY;
      uniform float uFloorGlow;
      uniform float uInLight;
      ${VARY}
      vec3 shade(vec3 tex, float wall) {
        vec3 n = normalize(vNrm);
        vec3 v = normalize(vView);
        float facing = dot(n, v);
        // 밖에서는 정면이 밝고 옆·뒤로 갈수록 어둡게, 안에서는 안쪽 면을 고르게
        float f = gl_FrontFacing ? facing : mix(-0.8, -facing, uInside);
        float k = mix(0.05, 1.0, smoothstep(-0.1, 0.9, f));
        // 왼쪽 위에서 오는 부드러운 빛
        float lam = max(dot(n, uLight), 0.0);
        k *= mix(mix(0.22, 1.0, lam), uInLight, uInside);
        vec3 col = tex * k * 0.82;
        if (gl_FrontFacing) {
          // 화면 유리에 스치는 빛: 구가 돌면서 몇몇 화면에만 잠깐
          vec3 hv = normalize(uLight + v);
          col += vec3(pow(max(dot(n, hv), 0.0), 56.0) * 0.16 * uOutside);
          // 구의 가장자리를 따라 아주 약한 빛
          float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 3.0) * max(dot(n, uRimDir), 0.0);
          col += vec3(0.80, 0.84, 0.90) * rim * 0.24 * uOutside;
        }
        col *= mix(1.0, 0.07, smoothstep(uFogA, uFogB, vDist));
        // 바닥의 빛이 아래쪽 벽을 비춤
        float b = uFloorGlow * smoothstep(uFloorY + 7.0, uFloorY + 0.6, vWorldY);
        col = col * (1.0 + b * 0.3) + vec3(0.05, 0.048, 0.045) * b;
        col *= mix(1.0, uFocus, wall);
        // 화면 테두리
        float ty = 0.014;
        float tx = ty / max(vAspect, 0.25);
        float inner = step(tx, vLocal.x) * step(vLocal.x, 1.0 - tx) * step(ty, vLocal.y) * step(vLocal.y, 1.0 - ty);
        col = mix(col * 0.16, col, inner);
        col = mix(col, col * 1.08 + 0.03, vHi);
        // 화면이 하나씩 켜짐 (켜지기 전에는 공간보다 어두운 유리)
        float on = smoothstep(vBirth * 0.72, vBirth * 0.72 + 0.28, uReveal);
        return mix(vec3(0.03, 0.031, 0.034) * (0.45 + 0.55 * inner), col, on);
      }`;
    const VS_INST = `
      attribute vec4 aUv;
      attribute float aAspect;
      attribute float aHover;
      attribute float aPick;
      attribute float aHide;
      attribute float aBirth;
      ${VARY}
      void main() {
        vLocal = uv;
        vUv = aUv.xy + uv * aUv.zw;
        vUvB = aUv.xy + vec2(1.0 - uv.x, uv.y) * aUv.zw;
        vAspect = aAspect;
        vHi = max(aHover, aPick);
        vBirth = aBirth;
        vec3 pos = position;
        pos.xy *= 1.0 + aPick * 0.3;
        #ifdef USE_INSTANCING
          mat4 m = modelMatrix * instanceMatrix;
        #else
          mat4 m = modelMatrix;
        #endif
        vec3 nrm = normalize((m * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
        vec4 wp = m * vec4(pos, 1.0);
        wp.xyz += nrm * (aHover * 0.28 + aPick * 1.6);
        vNrm = nrm;
        vec3 toCam = cameraPosition - wp.xyz;
        vDist = length(toCam);
        vView = toCam / max(vDist, 0.0001);
        vWorldY = wp.y;
        gl_Position = projectionMatrix * viewMatrix * wp;
        // 따로 그리는 화면(가까운 화면, 목적지 화면)은 여기서 숨김
        if (aHide > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      }`;
    const VS_ONE = `
      uniform vec4 uUv;
      uniform float uAspect;
      uniform float uBirth;
      ${VARY}
      void main() {
        vLocal = uv;
        vUv = uUv.xy + uv * uUv.zw;
        vUvB = uUv.xy + vec2(1.0 - uv.x, uv.y) * uUv.zw;
        vAspect = uAspect;
        vHi = 0.0;
        vBirth = uBirth;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vNrm = normalize((modelMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
        vec3 toCam = cameraPosition - wp.xyz;
        vDist = length(toCam);
        vView = toCam / max(vDist, 0.0001);
        vWorldY = wp.y;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`;
    const FS_INST = `
      ${SHADE}
      void main() {
        if (vDist < 0.25) discard;
        vec3 tex = texture2D(uAtlas, gl_FrontFacing ? vUv : vUvB).rgb;
        gl_FragColor = vec4(shade(tex, 1.0), 1.0);
      }`;
    const FS_POOL = `
      uniform float uAlpha;
      ${SHADE}
      void main() {
        if (vDist < 0.2 || uAlpha < 0.004) discard;
        vec3 tex = texture2D(uAtlas, gl_FrontFacing ? vUv : vUvB).rgb;
        gl_FragColor = vec4(shade(tex, 1.0), uAlpha);
      }`;
    const FS_TARGET = `
      uniform sampler2D uTex;
      uniform float uHole;
      uniform float uLift;
      ${SHADE}
      void main() {
        // 화면 가운데부터 부드럽게 열리며 그 너머(구의 안쪽)가 보입니다
        vec2 p = (vLocal - 0.5) * vec2(vAspect, 1.0);
        float r = length(p) / (0.5 * length(vec2(vAspect, 1.0)));
        float a = smoothstep(uHole - 0.42, uHole + 0.02, r);
        if (a < 0.004 || vDist < 0.06) discard;
        vec3 tex = texture2D(uTex, gl_FrontFacing ? vUv : vUvB).rgb;
        vec3 col = shade(tex, 0.0) * uLift;
        col += vec3(0.7) * a * (1.0 - a) * step(0.001, uHole) * 0.28;
        gl_FragColor = vec4(col, a);
      }`;
    const FEAT_VS = `
      varying vec2 vL;
      void main() { vL = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const FEAT_FS = `
      uniform sampler2D uBar;
      uniform sampler2D uPage;
      uniform float uBarFrac;
      uniform float uVis;
      uniform float uScroll;
      uniform float uOpacity;
      uniform float uAspect;
      varying vec2 vL;
      void main() {
        float top = 1.0 - uBarFrac;
        // 주소창 + 실제 페이지 (천천히 스크롤되며 살아 있는 사이트처럼)
        vec3 bar = texture2D(uBar, vec2(vL.x, clamp((vL.y - top) / uBarFrac, 0.0, 1.0))).rgb;
        float q = clamp(vL.y / top, 0.0, 1.0);
        float pageTop = 1.0 - uScroll * (1.0 - uVis);
        vec3 page = texture2D(uPage, vec2(vL.x, pageTop - (1.0 - q) * uVis)).rgb;
        vec3 col = mix(page, bar, step(top, vL.y));
        float ty = 0.005;
        float tx = ty / uAspect;
        float inner = step(tx, vL.x) * step(vL.x, 1.0 - tx) * step(ty, vL.y) * step(vL.y, 1.0 - ty);
        col = mix(vec3(0.08), col, inner);
        gl_FragColor = vec4(col, uOpacity);
      }`;

    const material = new THREE.ShaderMaterial({ uniforms, side: THREE.DoubleSide, vertexShader: VS_INST, fragmentShader: FS_INST });
    const panelGeo = new THREE.PlaneGeometry(1, 1);
    function singleMaterial(extra, fs) {
      const u = Object.assign({}, uniforms, {
        uUv: { value: new THREE.Vector4(0, 0, 1, 1) }, uAspect: { value: 1 }, uBirth: { value: 0 }, uAlpha: { value: 1 },
      }, extra || {});
      return new THREE.ShaderMaterial({ uniforms: u, side: THREE.DoubleSide, transparent: true, depthWrite: false, vertexShader: VS_ONE, fragmentShader: fs });
    }
    // 표면을 통과하는 순간 카메라 가까이의 화면: 개별 메시 + 투명도
    const POOL = 16;
    const poolMeshes = [];
    for (let k = 0; k < POOL; k++) {
      const pm = new THREE.Mesh(panelGeo, singleMaterial(null, FS_POOL));
      pm.matrixAutoUpdate = false;
      pm.visible = false;
      pm.frustumCulled = false;
      scene.add(pm);
      poolMeshes.push(pm);
    }

    /* ---------------- 상태 */
    let atlas = null, mesh = null, target = null, feature = null, floor = null;
    let candidates = [], lock = null;
    let instMats = [], instCenters = [], instNormals = [], instLatLon = [], instUv = [], instAsp = [], instBirth = [];
    let instProj = new Int16Array(0), hoverArr = null, pickArr = null, hideArr = null;
    let pooled = new Set();
    let path = null, land = null, featRest = null, featT0 = 0;
    let spin = 0, spinVel = 0, tilt = 0, tiltVel = 0;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    let sT = 0, sCur = 0, sVel = 0, cT = 0, cCur = 0, cVel = 0, snap = true;
    let heroTop = 0, heroH = 1, stageH = 1;
    let raf = 0, last = 0, inView = true, t0 = 0;
    let drag = null, pointerDirty = false, hoverKey = '', hoverId = -1;
    const hoverAnim = new Map();
    let pickAnim = null;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2(-9, -9);
    const dlg = $('[data-detail]');
    const dialogOpen = () => !!(dlg && dlg.open);
    const uiCache = {};
    const tmpV = new THREE.Vector3(), tmpN = new THREE.Vector3(), tmpD = new THREE.Vector3();
    const tmpF = new THREE.Vector3(), tmpR = new THREE.Vector3(), tmpU = new THREE.Vector3();
    const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();

    /* ---------------- 텍스처: 모든 화면을 한 장의 아틀라스로 */
    const BAR = 0.075; // 데스크톱 화면 위쪽 브라우저 바 비율
    function pack(items, AW, k) {
      const pad = Math.max(2, Math.round(6 * k));
      const dW = Math.round(640 * k), dH = Math.round(400 * k), mW = Math.round(240 * k), mH = Math.round(520 * k);
      const order = items.map((_, i) => i).sort((a, b) => (items[a].kind === items[b].kind ? a - b : items[a].kind === 'd' ? -1 : 1));
      const list = new Array(items.length);
      let x = pad, y = pad, rowH = 0;
      order.forEach((i) => {
        const w = items[i].kind === 'd' ? dW : mW;
        const h = items[i].kind === 'd' ? dH : mH;
        if (x + w + pad > AW) { x = pad; y += rowH + pad; rowH = 0; }
        list[i] = { x, y, w, h };
        x += w + pad; rowH = Math.max(rowH, h);
      });
      return { list, height: y + rowH + pad };
    }
    function typeCell(g, p, x, y, w, h) {
      g.fillStyle = '#1B1C20'; g.fillRect(x, y, w, h);
      g.fillStyle = '#D9D9D3';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = `500 ${Math.round(h * 0.085)}px Hahmlet, "Noto Serif KR", serif`;
      g.fillText(p.title, x + w / 2, y + h / 2, w * 0.86);
    }
    function browserBar(g, x, y, w, bh, label) {
      g.fillStyle = '#ECECE8'; g.fillRect(x, y, w, bh);
      g.fillStyle = '#C6C6C0';
      for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x + bh * (0.62 + k * 0.44), y + bh / 2, bh * 0.13, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#DFDFDA';
      roundRect(g, x + w * 0.3, y + bh * 0.22, w * 0.4, bh * 0.56, bh * 0.28); g.fill();
      if (label) {
        g.fillStyle = '#8E9096'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = `500 ${Math.round(bh * 0.3)}px Archivo, "IBM Plex Sans KR", sans-serif`;
        g.fillText(label, x + w / 2, y + bh / 2 + 0.5, w * 0.36);
      }
    }
    function makeCanvasTexture(c) {
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    }
    async function buildAtlas() {
      if (doc.fonts && doc.fonts.ready) { try { await doc.fonts.ready; } catch (_) { /* noop */ } }
      const loaded = await Promise.all(P.map(async (p) => {
        const src = projectSources(p);
        const [d, m] = await Promise.all([loadImage(src.d), loadImage(src.m)]);
        return { d, m };
      }));
      const big = !startMobile && renderer.capabilities.maxTextureSize >= 4096;
      const AW = big ? 4096 : 2048, AH = AW / 2;
      const items = [];
      loaded.forEach((o, i) => {
        if (o.d) {
          const iw = o.d.naturalWidth, ih = o.d.naturalHeight;
          const ch = iw * ((400 * (1 - BAR)) / 640);
          items.push({ kind: 'd', project: i, img: o.d, sy: 0, sh: Math.min(ch, ih) });
          if (ih > ch * 1.3) items.push({ kind: 'd', project: i, img: o.d, sy: Math.min(ih - ch, Math.max(ch * 0.7, ih * 0.5 - ch * 0.5)), sh: ch });
        } else items.push({ kind: 'd', project: i, img: null, sy: 0 });
        if (o.m) {
          const iw = o.m.naturalWidth, ih = o.m.naturalHeight;
          const ch = iw * (520 / 240);
          items.push({ kind: 'm', project: i, img: o.m, sy: 0, sh: Math.min(ch, ih) });
          if (ih > ch * 1.28) items.push({ kind: 'm', project: i, img: o.m, sy: Math.min(ih - ch, ih * 0.45), sh: ch });
        }
      });
      let k = big ? 1 : 0.5, packed = pack(items, AW, k);
      for (let n = 0; n < 8 && packed.height > AH; n++) { k *= 0.86; packed = pack(items, AW, k); }
      const c = doc.createElement('canvas');
      c.width = AW; c.height = AH;
      const g = c.getContext('2d');
      g.fillStyle = '#121316'; g.fillRect(0, 0, AW, AH);
      g.imageSmoothingQuality = 'high';
      items.forEach((it, idx) => {
        const { x, y, w, h } = packed.list[idx];
        const p = P[it.project];
        if (it.kind === 'd') {
          const bh = Math.round(h * BAR);
          browserBar(g, x, y, w, bh, '');
          if (it.img) g.drawImage(it.img, 0, it.sy, it.img.naturalWidth, it.sh, x, y + bh, w, h - bh);
          else typeCell(g, p, x, y + bh, w, h - bh);
        } else if (it.img) {
          g.drawImage(it.img, 0, it.sy, it.img.naturalWidth, it.sh, x, y, w, h);
        } else typeCell(g, p, x, y, w, h);
        it.uv = [(x + 1) / AW, 1 - (y + h - 1) / AH, (w - 2) / AW, (h - 2) / AH];
        it.aspect = w / h;
      });
      return { tex: makeCanvasTexture(c), items, loaded };
    }

    /* ---------------- 위도 링 배치 */
    function ringLayout(cfg, rand, dList, mList) {
      const out = [];
      const dLat = (cfg.rowH + cfg.gap) / R;
      const rows = Math.max(3, Math.floor((cfg.latMax * 2) / dLat) + 1);
      const lat0 = -((rows - 1) * dLat) / 2;
      let di = Math.floor(rand() * dList.length), mi = Math.floor(rand() * Math.max(1, mList.length));
      for (let r = 0; r < rows; r++) {
        const lat = lat0 + r * dLat;
        const ringR = R * Math.cos(lat);
        const circ = Math.PI * 2 * ringR;
        const items = [];
        let used = 0;
        for (;;) {
          const useM = mList.length && rand() < cfg.mShare;
          const crop = useM ? mList[mi++ % mList.length] : dList[di++ % dList.length];
          const w = cfg.rowH * crop.aspect;
          if (used + w + cfg.gap > circ) break;
          items.push({ crop, w });
          used += w + cfg.gap;
        }
        if (!items.length) continue;
        di += 1 + Math.floor(rand() * 3);
        mi += Math.floor(rand() * 2);
        const extra = (circ - used) / items.length;
        let arc = rand() * circ;
        items.forEach((it) => {
          const lon = (arc + it.w / 2) / ringR;
          out.push({ lat, lon, w: it.w, h: cfg.rowH, crop: it.crop });
          arc += it.w + cfg.gap + extra;
        });
      }
      return out;
    }

    function buildPanels() {
      if (!atlas) return;
      releaseLock();
      if (mesh) { world.remove(mesh); mesh.geometry.dispose(); mesh = null; }
      const rand = mulberry32(20261007);
      const dList = atlas.items.filter((it) => it.kind === 'd');
      const mList = atlas.items.filter((it) => it.kind === 'm');
      for (let i = dList.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [dList[i], dList[j]] = [dList[j], dList[i]]; }
      for (let i = mList.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [mList[i], mList[j]] = [mList[j], mList[i]]; }
      const cfg = mobile
        ? { rowH: 2.15, gap: 0.2, latMax: 1.2, mShare: 0.2 }
        : { rowH: 1.55, gap: 0.16, latMax: 1.26, mShare: 0.22 };
      const panels = ringLayout(cfg, rand, dList, mList);

      // PROJECT 01 화면을 적도 위 몇 곳에 둡니다. 스크롤을 시작하면 가장 가까운 곳으로 날아갑니다.
      candidates = [];
      const featCrop = atlas.items.find((it) => it.kind === 'd' && it.project === FEAT && it.sy === 0);
      if (featCrop) {
        let eq = Infinity;
        panels.forEach((pn) => { eq = Math.min(eq, Math.abs(pn.lat)); });
        const ring = panels.map((_, i) => i).filter((i) => Math.abs(panels[i].lat) === eq && panels[i].crop.kind === 'd');
        const K = mobile ? 4 : 5;
        for (let j = 0; j < K; j++) {
          const want = (j / K) * Math.PI * 2;
          let best = -1, bd = Infinity;
          ring.forEach((i) => {
            if (candidates.includes(i)) return;
            const dd = Math.abs(Math.atan2(Math.sin(panels[i].lon - want), Math.cos(panels[i].lon - want)));
            if (dd < bd) { bd = dd; best = i; }
          });
          if (best >= 0) { panels[best].crop = featCrop; candidates.push(best); }
        }
      }

      const n = panels.length;
      const geo = new THREE.PlaneGeometry(1, 1);
      const aUv = new Float32Array(n * 4), aAsp = new Float32Array(n), aBirth = new Float32Array(n);
      hoverArr = new Float32Array(n); pickArr = new Float32Array(n); hideArr = new Float32Array(n);
      instProj = new Int16Array(n);
      instMats = []; instCenters = []; instNormals = []; instLatLon = []; instUv = []; instAsp = []; instBirth = [];
      mesh = new THREE.InstancedMesh(geo, material, n);
      const m4 = new THREE.Matrix4(), e = new THREE.Vector3(), u = new THREE.Vector3(), nn = new THREE.Vector3(), pp = new THREE.Vector3();
      const L = uniforms.uLight.value;
      panels.forEach((pn, i) => {
        const cl = Math.cos(pn.lat), sl = Math.sin(pn.lat), cL = Math.cos(pn.lon), sL = Math.sin(pn.lon);
        nn.set(cl * sL, sl, cl * cL);                        // 바깥을 향하는 법선
        e.set(cL, 0, -sL).multiplyScalar(pn.w);               // 가로 (동쪽)
        u.set(-sl * sL, cl, -sl * cL).multiplyScalar(pn.h);   // 세로 (북쪽)
        pp.copy(nn).multiplyScalar(R + (rand() - 0.5) * 0.26);
        m4.makeBasis(e, u, nn).setPosition(pp);
        mesh.setMatrixAt(i, m4);
        // 빛을 받는 쪽부터, 조금씩 섞여서 켜짐
        const birth = clamp(0.58 * rand() + 0.42 * (0.5 - 0.5 * nn.dot(L)), 0, 1);
        instMats.push(m4.clone()); instCenters.push(pp.clone()); instNormals.push(nn.clone());
        instLatLon.push({ lat: pn.lat, lon: pn.lon });
        instUv.push(pn.crop.uv); instAsp.push(pn.w / pn.h); instBirth.push(birth);
        aUv.set(pn.crop.uv, i * 4);
        aAsp[i] = pn.w / pn.h;
        aBirth[i] = birth;
        instProj[i] = pn.crop.project;
      });
      const dyn = (arr) => { const a = new THREE.InstancedBufferAttribute(arr, 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
      geo.setAttribute('aUv', new THREE.InstancedBufferAttribute(aUv, 4));
      geo.setAttribute('aAspect', new THREE.InstancedBufferAttribute(aAsp, 1));
      geo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(aBirth, 1));
      geo.setAttribute('aHover', dyn(hoverArr));
      geo.setAttribute('aPick', dyn(pickArr));
      geo.setAttribute('aHide', dyn(hideArr));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      world.add(mesh);
      hoverAnim.clear(); hoverId = -1; hoverKey = ''; pickAnim = null;
      pooled = new Set();
      poolMeshes.forEach((pm) => { pm.visible = false; });
    }

    /* ---------------- 카메라가 통과하는 화면 (고해상도) */
    function buildTarget() {
      const img = atlas.loaded[FEAT] && atlas.loaded[FEAT].d;
      const mat = singleMaterial({ uTex: { value: atlas.tex }, uHole: { value: 0 }, uLift: { value: 1 } }, FS_TARGET);
      mat.depthWrite = true;
      if (img) {
        // 아틀라스 셀과 같은 구성(주소창 + 첫 화면)을 고해상도로
        const cw = 1280, chh = 800, bh = Math.round(chh * BAR);
        const c = doc.createElement('canvas');
        c.width = cw; c.height = chh;
        const g = c.getContext('2d');
        g.imageSmoothingQuality = 'high';
        browserBar(g, 0, 0, cw, bh, '');
        const iw = img.naturalWidth;
        const sh = Math.min(img.naturalHeight, iw * ((chh - bh) / cw));
        g.drawImage(img, 0, 0, iw, sh, 0, bh, cw, chh - bh);
        mat.uniforms.uTex.value = makeCanvasTexture(c);
      }
      target = new THREE.Mesh(panelGeo, mat);
      target.matrixAutoUpdate = false;
      target.visible = false;
      target.userData.hiRes = !!img;
      world.add(target);
    }

    /* ---------------- 구 안에서 떠오르는 PROJECT 01 */
    function buildFeature() {
      const img = atlas.loaded[FEAT] && atlas.loaded[FEAT].d;
      const aspect = 1.6, barFrac = 0.058;
      const bc = doc.createElement('canvas');
      bc.height = 64; bc.width = Math.round((64 * aspect) / barFrac);
      browserBar(bc.getContext('2d'), 0, 0, bc.width, bc.height, fp.host || fp.title);
      let pageTex, vis = 1;
      if (img) {
        pageTex = new THREE.Texture(img);
        pageTex.generateMipmaps = true;
        pageTex.minFilter = THREE.LinearMipmapLinearFilter;
        pageTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        pageTex.needsUpdate = true;
        vis = Math.min(1, ((1 - barFrac) / aspect) / (img.naturalHeight / img.naturalWidth));
      } else {
        const pc = doc.createElement('canvas');
        pc.width = 1200; pc.height = Math.round((1200 * (1 - barFrac)) / aspect);
        typeCell(pc.getContext('2d'), fp, 0, 0, pc.width, pc.height);
        pageTex = makeCanvasTexture(pc);
      }
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uBar: { value: makeCanvasTexture(bc) }, uPage: { value: pageTex }, uBarFrac: { value: barFrac },
          uVis: { value: vis }, uScroll: { value: 0 }, uOpacity: { value: 0 }, uAspect: { value: aspect },
        },
        vertexShader: FEAT_VS, fragmentShader: FEAT_FS, transparent: true, side: THREE.DoubleSide,
      });
      feature = new THREE.Mesh(panelGeo, mat);
      feature.userData.aspect = aspect;
      feature.visible = false;
      scene.add(feature);
    }

    /* ---------------- 구 안 바닥의 빛 (소개 섹션의 종이색) */
    function buildFloor() {
      const c = doc.createElement('canvas');
      c.width = c.height = 512;
      const g = c.getContext('2d');
      const grd = g.createRadialGradient(256, 256, 0, 256, 256, 256);
      grd.addColorStop(0, 'rgba(244,244,241,1)');
      grd.addColorStop(0.42, 'rgba(244,244,241,1)');
      grd.addColorStop(0.62, 'rgba(244,244,241,0.55)');
      grd.addColorStop(0.82, 'rgba(244,244,241,0.12)');
      grd.addColorStop(1, 'rgba(244,244,241,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 512, 512);
      const mat = new THREE.MeshBasicMaterial({ map: makeCanvasTexture(c), transparent: true, depthWrite: false, opacity: 0, side: THREE.DoubleSide });
      floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), mat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = FLOOR_Y;
      floor.visible = false;
      scene.add(floor);
    }

    /* ---------------- 카메라 경로 */
    function startDistance() {
      // 처음 화면에서 구의 지름이 화면 높이의 약 50% (세로 화면은 너비의 약 80%)
      const half = (camera.fov * Math.PI) / 360;
      const rPx = Math.min(H * 0.25, W * 0.4);
      const tanT = (rPx * Math.tan(half)) / (H / 2);
      return R / Math.sin(Math.atan(tanT));
    }
    function buildPath() {
      const Rt = lock ? instCenters[lock.id].length() : R;
      D0 = startDistance();
      const ax = mobile ? 0.55 : 1;
      path = {
        // 옆으로 살짝 호를 그리며 다가가 PROJECT 01 화면 정면으로 들어갑니다
        x: monotone([[0, 0], [0.12, 0], [0.28, -1.5 * ax], [0.46, -0.35 * ax], [0.6, 0], [1, 0]]),
        y: monotone([[0, 0], [0.12, 0.15 * ax], [0.28, 1.3 * ax], [0.46, 0.35 * ax], [0.62, 0.04], [0.7, 0], [0.86, -1.25], [1, -2.6]]),
        // 초반 아주 느리게 → 중반 빠르게 → 구 앞에서 감속 → 표면 통과는 일정하게 → 안에서 정착
        z: monotone([[0, D0], [0.12, D0 - 0.09 * (D0 - Rt)], [0.4, Rt + 4.4], [0.56, Rt + 2.0], [0.66, Rt + 0.5], [0.74, Rt - 1.0], [0.86, Rt - 4.8], [1, 2.4]]),
        lx: monotone([[0, 0], [0.7, 0], [0.8, 0.9], [0.92, 0.2], [1, 0]]),
        ly: monotone([[0, 0], [0.66, 0], [0.74, -0.8], [0.86, -3.4], [1, -4.4]]),
        lz: monotone([[0, 0], [0.3, 0], [0.42, Rt - 0.2], [0.56, Rt - 3], [0.66, Rt - 7], [0.74, Rt - 10.5], [0.86, -2.2], [1, -3.6]]),
        roll: monotone([[0, 0], [0.14, 0], [0.3, -0.022 * ax], [0.46, 0.005], [0.6, 0], [1, 0]]),
      };
      // 착지: 바닥의 빛 쪽으로 내려가며 고개를 숙입니다
      land = {
        y: monotone([[0, path.y(1)], [0.56, -6.8], [1, -6.8]]),
        z: monotone([[0, path.z(1)], [0.56, 0.9], [1, 0.9]]),
        ly: monotone([[0, path.ly(1)], [0.56, -8.2], [1, -8.2]]),
        lz: monotone([[0, path.lz(1)], [0.56, -0.5], [1, -0.5]]),
      };
      placeFeature();
    }
    function placeFeature() {
      if (!feature || !path) return;
      const cam = new THREE.Vector3(0, path.y(1), path.z(1));
      const f = new THREE.Vector3(0, path.ly(1), path.lz(1)).sub(cam).normalize();
      const r = new THREE.Vector3().crossVectors(f, UP).normalize();
      const u = new THREE.Vector3().crossVectors(r, f);
      const cfg = mobile ? { d: 5.0, x: 0, y: 0.9, w: 2.1, turn: 0 } : { d: 6.0, x: -1.45, y: 0.12, w: 3.05, turn: 0.14 };
      const pos = cam.clone().addScaledVector(f, cfg.d).addScaledVector(r, cfg.x).addScaledVector(u, cfg.y);
      featRest = { pos, from: pos.clone().addScaledVector(f, 2.2).addScaledVector(u, -1.1), cam, turn: cfg.turn };
      feature.scale.set(cfg.w, cfg.w / feature.userData.aspect, 1);
    }

    /* ---------------- 목적지 화면 고정 / 해제 */
    function chooseTarget() {
      let best = -1, bestZ = -2;
      candidates.forEach((id) => {
        tmpV.copy(instNormals[id]).applyEuler(world.rotation);
        if (tmpV.z > bestZ) { bestZ = tmpV.z; best = id; }
      });
      if (best < 0) return;
      const ll = instLatLon[best];
      let yaw = -ll.lon;
      yaw += Math.round((world.rotation.y - yaw) / (Math.PI * 2)) * Math.PI * 2;
      lock = { id: best, yaw, pitch: ll.lat };
      if (target) {
        target.matrix.copy(instMats[best]);
        target.matrixWorldNeedsUpdate = true;
        const u = target.material.uniforms;
        u.uAspect.value = instAsp[best];
        u.uBirth.value = instBirth[best];
        if (!target.userData.hiRes) u.uUv.value.set(instUv[best][0], instUv[best][1], instUv[best][2], instUv[best][3]);
        u.uHole.value = 0;
        target.visible = true;
      }
      hideArr[best] = 1;
      mesh.geometry.attributes.aHide.needsUpdate = true;
      buildPath();
    }
    function releaseLock() {
      if (!lock) return;
      if (hideArr && mesh) { hideArr[lock.id] = 0; mesh.geometry.attributes.aHide.needsUpdate = true; }
      if (target) target.visible = false;
      lock = null;
      buildPath();
    }

    /* ---------------- 표면 통과: 가까운 화면만 투명하게 */
    const nearList = [];
    function updatePool() {
      if (!mesh) return;
      nearList.length = 0;
      const cp = camera.position;
      if (cp.length() < R + FADE_START + 1.5) {
        for (let i = 0; i < instCenters.length; i++) {
          if (lock && i === lock.id) continue;
          tmpV.copy(instCenters[i]).applyMatrix4(world.matrixWorld);
          const d = tmpV.distanceTo(cp);
          if (d < FADE_START + 0.5) nearList.push([d, i]);
        }
        nearList.sort((a, b) => a[0] - b[0]);
      }
      const next = new Set();
      for (let k = 0; k < POOL; k++) {
        const pm = poolMeshes[k];
        const item = nearList[k];
        if (!item) { pm.visible = false; continue; }
        const [d, i] = item;
        next.add(i);
        pm.visible = true;
        pm.matrix.multiplyMatrices(world.matrixWorld, instMats[i]);
        pm.matrixWorldNeedsUpdate = true;
        const u = pm.material.uniforms;
        u.uUv.value.set(instUv[i][0], instUv[i][1], instUv[i][2], instUv[i][3]);
        u.uAspect.value = instAsp[i];
        u.uBirth.value = instBirth[i];
        u.uAlpha.value = smooth(FADE_END, FADE_START, d);
      }
      let changed = false;
      pooled.forEach((i) => { if (!next.has(i)) { hideArr[i] = 0; changed = true; } });
      next.forEach((i) => { if (!pooled.has(i)) { hideArr[i] = 1; changed = true; } });
      pooled = next;
      if (changed) mesh.geometry.attributes.aHide.needsUpdate = true;
    }

    function updateTarget(S) {
      if (!target || !lock) return;
      tmpV.copy(instCenters[lock.id]).applyMatrix4(world.matrixWorld);
      tmpN.copy(instNormals[lock.id]).transformDirection(world.matrixWorld);
      const delta = tmpD.subVectors(camera.position, tmpV).dot(tmpN); // 화면 앞 거리 (음수면 통과)
      const u = target.material.uniforms;
      u.uHole.value = smooth(1.05, 0.0, delta) * 1.45;
      u.uLift.value = 1 + 0.45 * smooth(0.3, 0.58, S);
      target.visible = delta > -0.25;
    }

    function updateFeature(S, now) {
      if (!feature || !featRest) return;
      const fa = smoother(0.82, 0.96, S);
      feature.visible = fa > 0.001;
      if (!feature.visible) { featT0 = 0; return; }
      if (!featT0) featT0 = now;
      feature.position.lerpVectors(featRest.from, featRest.pos, fa);
      feature.lookAt(featRest.cam);
      feature.rotateY(featRest.turn);
      const u = feature.material.uniforms;
      u.uOpacity.value = smooth(0, 0.65, fa);
      const ph = (((now - featT0) / 1000) % 15) / 15;
      u.uScroll.value = u.uVis.value < 0.999 ? smoother(0.2, 0.46, ph) - smoother(0.7, 0.96, ph) : 0;
    }

    /* ---------------- 크기와 스크롤 위치 */
    function measure() {
      heroTop = hero.getBoundingClientRect().top + window.scrollY;
      heroH = hero.offsetHeight; stageH = stage.offsetHeight;
    }
    function resize() {
      const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight);
      const m = !mq.desk.matches;
      measure();
      if (w === W && h === H && m === mobile && path) { wake(); return; }
      W = w; H = h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, m ? 1.5 : 1.75));
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      // 가로 화각 약 60° 기준, 세로 화면에서는 너무 좁아지지 않게
      camera.fov = clamp((2 * Math.atan(Math.tan(Math.PI / 6) / camera.aspect) * 180) / Math.PI, 34, 58);
      camera.updateProjectionMatrix();
      if (m !== mobile) { mobile = m; if (atlas) buildPanels(); }
      buildPath();
      wake();
    }
    function readScroll() {
      if (!film) { sT = 0; cT = 0; return; }
      const y = window.scrollY - heroTop;
      const len = Math.max(1, heroH - 2 * stageH);
      sT = clamp(y / len, 0, 1);
      cT = clamp((y - len) / stageH, 0, 1);
    }

    /* ---------------- 호버 / 선택 */
    function setHover(hit) {
      const key = hit ? `${hit.kind}:${hit.id == null ? '' : hit.id}` : '';
      if (key === hoverKey) return;
      if (hoverId >= 0) hoverAnim.set(hoverId, 0);
      hoverKey = key;
      hoverId = hit && hit.kind === 'inst' ? hit.id : -1;
      if (hoverId >= 0) hoverAnim.set(hoverId, 1);
      if (hit) host.setAttribute('data-cursor', 'view');
      else if (!film || sCur < 0.06) host.setAttribute('data-cursor', 'drag');
      else host.removeAttribute('data-cursor');
      if (ui.hover) {
        ui.hover.innerHTML = hit
          ? `<span>${pad2(hit.project + 1)}</span><b>${esc(P[hit.project].title)}</b> ${esc(P[hit.project].categoryKo)}`
          : hoverDefault;
      }
    }
    function pickAt() {
      if (!mesh) return null;
      ray.setFromCamera(ndc, camera);
      if (feature && feature.visible && feature.material.uniforms.uOpacity.value > 0.6 && ray.intersectObject(feature).length) {
        return { kind: 'feature', project: FEAT };
      }
      if (film && sCur > 0.3) return null;
      if (target && target.visible && ray.intersectObject(target).length) return { kind: 'target', project: FEAT };
      const hits = ray.intersectObject(mesh);
      for (const h of hits) {
        if (h.instanceId == null || (lock && h.instanceId === lock.id)) continue;
        // 구 뒤쪽(바깥을 보지 않는) 화면은 제외
        tmpV.copy(instNormals[h.instanceId]).transformDirection(world.matrixWorld);
        if (tmpV.dot(ray.ray.direction) > -0.05) continue;
        return { kind: 'inst', id: h.instanceId, project: instProj[h.instanceId] };
      }
      return null;
    }
    function select(id) {
      pickAnim = { id, t: 0 };
      const pi = instProj[id];
      setTimeout(() => onOpen(pi, host), 300);
    }

    /* ---------------- 입력: 마우스 / 드래그(관성) / 터치 */
    const setNdc = (e) => {
      const r = cv.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    cv.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      setNdc(e);
      drag = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, lt: performance.now(), moved: false, id: e.pointerId, vx: 0, vy: 0, can: !film || sCur < 0.06 };
      wake();
    });
    cv.addEventListener('pointermove', (e) => {
      setNdc(e);
      pointerDirty = true;
      if (e.pointerType === 'mouse' && !reduced()) { tmx = clamp(ndc.x, -1, 1); tmy = clamp(-ndc.y, -1, 1); }
      if (drag && e.pointerId === drag.id && drag.can) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 6) {
          drag.moved = true;
          try { cv.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
          host.classList.add('is-dragging');
        }
        if (drag.moved) {
          const now = performance.now();
          const dts = Math.max(0.008, (now - drag.lt) / 1000);
          const ax = (e.clientX - drag.lx) * 0.0048, ay = (e.clientY - drag.ly) * 0.003;
          spin += ax; tilt = clamp(tilt + ay, -0.45, 0.45);
          drag.vx = 0.7 * drag.vx + 0.3 * (ax / dts);
          drag.vy = 0.7 * drag.vy + 0.3 * (ay / dts);
          drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now;
        }
      }
      wake();
    });
    const endDrag = (e, cancelled) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      host.classList.remove('is-dragging');
      if (d.moved) {
        spinVel = clamp(d.vx, -2.4, 2.4);
        tiltVel = clamp(d.vy, -1.6, 1.6);
      } else if (!cancelled) {
        const hit = pickAt();
        if (hit) {
          if (hit.kind === 'inst') select(hit.id);
          else onOpen(hit.project, host);
        }
      }
      wake();
    };
    cv.addEventListener('pointerup', (e) => endDrag(e, false));
    cv.addEventListener('pointercancel', (e) => endDrag(e, true));
    cv.addEventListener('pointerleave', () => { tmx = 0; tmy = 0; ndc.set(-9, -9); setHover(null); wake(); });

    /* ---------------- Scroll to enter: 누르면 구 안까지 천천히 데려갑니다 */
    function autopilot() {
      measure();
      const len = Math.max(1, heroH - 2 * stageH);
      const y0 = window.scrollY, y1 = heroTop + len * 0.997;
      if (y1 <= y0 + 4) return;
      const dur = clamp(((y1 - y0) / len) * 6400, 1800, 6400);
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      const start = performance.now();
      let stopped = false;
      const evs = ['wheel', 'touchstart', 'keydown', 'mousedown'];
      const stop = () => { stopped = true; };
      evs.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
      const done = () => { evs.forEach((ev) => window.removeEventListener(ev, stop)); root.style.scrollBehavior = prev; };
      const step = (now) => {
        if (stopped) { done(); return; }
        const t = clamp((now - start) / dur, 0, 1);
        const k = -(Math.cos(Math.PI * t) - 1) / 2;
        window.scrollTo(0, y0 + (y1 - y0) * k);
        if (t < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    }
    if (ui.cue) ui.cue.addEventListener('click', (e) => { e.preventDefault(); if (film) autopilot(); });

    /* ---------------- 글자 */
    function style(el, key, opacity, transform, extra) {
      if (!el) return;
      const sig = `${opacity >= 0 ? opacity.toFixed(3) : ''}|${transform}`;
      if (uiCache[key] === sig) return;
      uiCache[key] = sig;
      if (opacity >= 0) {
        el.style.opacity = opacity.toFixed(3);
        el.style.visibility = opacity < 0.005 ? 'hidden' : '';
      }
      if (transform) el.style.transform = transform;
      if (extra) extra(el, opacity);
    }
    function updateDom(S, C) {
      // 처음 문구는 구가 가까워지기 시작하면 조용히 물러납니다
      const ia = 1 - smooth(0.025, 0.14, S);
      style(ui.intro, 'intro', ia, `translate3d(0,${((1 - ia) * -26).toFixed(1)}px,0)`);
      style(ui.meta, 'meta', ia, '');
      style(ui.cue, 'cue', 1 - smooth(0, 0.045, S), '');
      // 구 안: 프로젝트 설명이 떠오르고, 착지하면서 위로 지나갑니다
      const fIn = smooth(0.88, 0.975, S), fv = fIn * (1 - smooth(0.03, 0.28, C));
      const ty = (1 - fIn) * 24 - C * 0.32 * H;
      if (featIn) style(featIn, 'featIn', -1, mobile ? `translate3d(0,${ty.toFixed(1)}px,0)` : `translate3d(0,calc(-50% + ${ty.toFixed(1)}px),0)`);
      style(ui.feat, 'feat', fv, '', (el, v) => {
        el.classList.toggle('is-on', v > 0.001);
        const live = v > 0.6;
        el.classList.toggle('is-live', live);
        el.setAttribute('aria-hidden', String(!live));
        fBtns.forEach((b) => b.setAttribute('tabindex', live ? '0' : '-1'));
      });
      style(ui.vignette, 'vig', 1 - smooth(0.25, 0.7, C), '');
    }

    /* ---------------- 프레임 */
    function update(dt, now) {
      readScroll();
      if (snap) { sCur = sT; sVel = 0; cCur = cT; cVel = 0; snap = false; }
      // 스크롤 → 스프링(임계 감쇠, 정확해) → 카메라
      // 스크롤한 만큼 바로 움직이지 않고 관성 있게 따라가며, 프레임이 느린 기기에서도 시간에 맞춰 따라갑니다.
      const w = 6.2, ex = Math.exp(-w * dt);
      { const e = sCur - sT, q = sVel + w * e; sCur = sT + (e + q * dt) * ex; sVel = (sVel - w * q * dt) * ex; }
      { const e = cCur - cT, q = cVel + w * e; cCur = cT + (e + q * dt) * ex; cVel = (cVel - w * q * dt) * ex; }
      if (Math.abs(sT - sCur) < 1e-5 && Math.abs(sVel) < 1e-4) { sCur = sT; sVel = 0; }
      if (Math.abs(cT - cCur) < 1e-5 && Math.abs(cVel) < 1e-4) { cCur = cT; cVel = 0; }
      const S = clamp(sCur, 0, 1), C = clamp(cCur, 0, 1);

      if (film && candidates.length && mesh) {
        if (!lock && S > 0.012) chooseTarget();
        else if (lock && S < 0.004 && sT < 0.004) releaseLock();
      }

      // 구의 회전: 자동(스크롤을 시작하면 멈춤) + 드래그 관성 + 마우스(미세)
      if (!drag) {
        spin += spinVel * dt; spinVel *= Math.exp(-dt * 2.4);
        tilt += tiltVel * dt; tiltVel *= Math.exp(-dt * 2.4);
        tilt *= Math.exp(-dt * 0.5);
      }
      spin += AUTO * (1 - smooth(0, 0.05, S)) * dt;
      const km = 1 - Math.exp(-dt / 0.6);
      mx += (tmx - mx) * km; my += (tmy - my) * km;
      const mOut = 1 - smooth(0.2, 0.5, S);
      const yawFree = spin + mx * 0.06 * mOut;
      const pitchFree = BASE_TILT + tilt + my * 0.035 * mOut;
      const k = lock ? smoother(0.012, 0.42, S) : 0; // 목적지 화면을 정면으로
      world.rotation.y = lock ? lerp(yawFree, lock.yaw, k) : yawFree;
      world.rotation.x = lock ? lerp(pitchFree, lock.pitch, k) : pitchFree;
      world.updateMatrixWorld(true);

      // 카메라: 스크롤 경로 + 착지 + 첫 등장 때 숨 쉬듯 다가옴
      const breath = D0 * 0.1 * (1 - easeOut(t0 ? clamp((now - t0) / 3800, 0, 1) : 0)) * (1 - smooth(0, 0.1, S));
      camPos.set(path.x(S), path.y(S) + land.y(C) - land.y(0), path.z(S) + land.z(C) - land.z(0) + breath);
      camLook.set(path.lx(S), path.ly(S) + land.ly(C) - land.ly(0), path.lz(S) + land.lz(C) - land.lz(0));
      const dist = camPos.length();
      const inside = smooth(R + 2.5, R - 1.5, dist);
      tmpF.subVectors(camLook, camPos).normalize();
      tmpR.crossVectors(tmpF, UP).normalize();
      tmpU.crossVectors(tmpR, tmpF);
      // 마우스: 카메라 시점만 아주 조금 (스크롤 경로와 따로 더해짐)
      const par = lerp(0.12, 0.85 * Math.min(1, dist / 30), 1 - inside);
      camPos.addScaledVector(tmpR, -mx * par).addScaledVector(tmpU, my * par * 0.7);
      camera.position.copy(camPos);
      camera.up.copy(UP).applyAxisAngle(tmpF, path.roll(S));
      camera.lookAt(camLook);
      // 처음 화면에서 구를 아주 조금 위로 — 아래쪽 글과 겹치지 않게 (날아가기 시작하면 정중앙으로)
      camera.setViewOffset(W, H, 0, H * (mobile ? 0.1 : 0.035) * (1 - smooth(0.04, 0.32, S)), W, H);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      updateTarget(S);
      // 구 안의 빛: 카메라가 안에 있거나, 목적지 화면이 열리기 시작하면 켜집니다 (열린 틈으로 안쪽 세계가 보이도록)
      const open = target && lock ? smooth(0, 0.3, target.material.uniforms.uHole.value) : 0;
      const inner = Math.max(inside, open);
      uniforms.uInside.value = inner;
      uniforms.uOutside.value = 1 - inside;
      uniforms.uFogA.value = lerp(dist - R * 0.2, 7, inner);
      uniforms.uFogB.value = lerp(dist + R * 1.05, 34, inner);
      uniforms.uInLight.value = lerp(0.42, 0.62, smooth(0.7, 0.88, S));
      uniforms.uFocus.value = 1 - 0.3 * smooth(0.84, 0.96, S);
      const floorA = 0.5 * smooth(0.8, 1, S) + 0.5 * smooth(0.02, 0.45, C);
      uniforms.uFloorGlow.value = floorA;
      if (floor) { floor.visible = floorA > 0.002; floor.material.opacity = floorA; }
      uniforms.uReveal.value = t0 ? clamp((now - t0) / 2600, 0, 1) : 0;

      updatePool();
      updateFeature(S, now);

      if (pointerDirty && !drag && mesh) { pointerDirty = false; setHover(pickAt()); }
      if (hoverArr && hoverAnim.size) {
        hoverAnim.forEach((tg, id) => {
          const v = hoverArr[id] + (tg - hoverArr[id]) * (1 - Math.exp(-dt / 0.09));
          hoverArr[id] = Math.abs(tg - v) < 0.002 ? tg : v;
          if (hoverArr[id] === tg && tg === 0) hoverAnim.delete(id);
        });
        mesh.geometry.attributes.aHover.needsUpdate = true;
      }
      if (pickAnim && pickArr) {
        pickAnim.t += dt;
        const t = pickAnim.t;
        pickArr[pickAnim.id] = t < 0.3 ? easeOut(t / 0.3) : 1 - easeInOut(clamp((t - 0.3) / 0.9, 0, 1));
        mesh.geometry.attributes.aPick.needsUpdate = true;
        if (t > 1.2) { pickArr[pickAnim.id] = 0; pickAnim = null; }
      }
      updateDom(S, C);
    }
    function shouldRun() {
      return inView && !doc.hidden && !dialogOpen() && !lost && (cCur < 0.999 || cT < 0.999);
    }
    function idle() {
      // 동작 줄이기 설정: 사용자가 움직일 때만 그립니다
      return reduced() && !drag && Math.abs(spinVel) < 1e-3 && Math.abs(tiltVel) < 1e-3
        && (!t0 || performance.now() - t0 > 2700) && !hoverAnim.size && !pickAnim;
    }
    function frame(now) {
      raf = 0;
      const dt = Math.min(0.25, Math.max(0.001, (now - last) / 1000));
      last = now;
      update(dt, now);
      renderer.render(scene, camera);
      if (shouldRun() && !idle()) raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (lost) return;
      readScroll(); // 아래에서 다시 올라올 때 이전 스크롤 값으로 멈춰 있지 않도록 먼저 현재 위치를 읽습니다
      if (!raf && shouldRun()) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }

    new IntersectionObserver((en) => {
      const v = en[0].isIntersecting;
      if (v && !inView) snap = true;
      inView = v;
      wake();
    }).observe(hero);
    doc.addEventListener('visibilitychange', wake);
    window.addEventListener('scroll', () => { pointerDirty = true; wake(); }, { passive: true });
    if (dlg) dlg.addEventListener('close', wake);
    let rzT = 0;
    window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(resize, 100); });
    window.addEventListener('load', () => { measure(); wake(); });
    resize();

    buildAtlas().then((a) => {
      if (lost) return;
      atlas = a;
      uniforms.uAtlas.value = a.tex;
      buildPanels();
      buildTarget();
      buildFeature();
      buildFloor();
      buildPath();
      t0 = performance.now();
      wake();
    }).catch((err) => { console.error('[PAPERTOV] sphere', err); fallback(); });

    function fallback() {
      // WebGL 을 쓸 수 없을 때: 화면들을 원 안에 모은 정지 이미지
      root.classList.remove('film');
      if (renderer) { try { renderer.dispose(); } catch (_) { /* noop */ } }
      if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
      cv = null;
      [ui.intro, ui.meta, ui.cue].forEach((el) => { if (el) { el.style.opacity = ''; el.style.transform = ''; el.style.visibility = ''; } });
      const imgs = P.map((p) => projectSources(p).d).filter(Boolean);
      if (!imgs.length) return;
      const list = [];
      while (list.length < 16) list.push(...imgs);
      host.innerHTML = `<div class="sphere-fallback">${list.slice(0, 16).map((src) => `<img src="${esc(src)}" alt="" loading="lazy">`).join('')}</div>`;
    }
  }

  /* ================================================================ SCROLL SCENES */
  const scenes = [];
  let scrollQueued = false;
  function addScene(el, fn) {
    const s = { el, fn, on: false };
    scenes.push(s);
    sceneIO.observe(el);
    return s;
  }
  const sceneIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      const s = scenes.find((x) => x.el === en.target);
      if (s) s.on = en.isIntersecting;
    });
    requestScroll();
  }, { rootMargin: '25% 0px 25% 0px' });
  function requestScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(runScroll);
  }
  const scrollHooks = [];
  function runScroll() {
    scrollQueued = false;
    const vh = window.innerHeight;
    for (const s of scenes) {
      if (!s.on) continue;
      const r = s.el.getBoundingClientRect();
      s.fn(clamp((vh - r.top) / (vh + r.height), 0, 1), r, vh);
    }
    scrollHooks.forEach((h) => h());
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);

  /* ---------------------------------------------------------------- header, mobile CTA, current section */
  function setupHeader() {
    const header = $('[data-header]');
    const mcta = $('[data-mcta]');
    const intro = $('[data-intro]');
    const contact = $('#contact');
    let lastY = window.scrollY;
    let contactVisible = false;
    if (contact) new IntersectionObserver((e) => { contactVisible = e[0].isIntersecting; requestScroll(); }, { threshold: 0.05 }).observe(contact);

    scrollHooks.push(() => {
      const y = window.scrollY;
      const menuOpen = root.classList.contains('menu-open');
      header.classList.toggle('is-solid', y > 8 || menuOpen);
      const down = y > lastY + 2, up = y < lastY - 2;
      if (!menuOpen) {
        if (down && y > 480) header.classList.add('is-hidden');
        else if (up || y < 120) header.classList.remove('is-hidden');
      }
      lastY = y;
      // 어두운 구 위에서는 밝은 헤더, 종이(소개 섹션)가 올라오면 원래 헤더
      const introTop = intro ? intro.getBoundingClientRect().top : 0;
      const darkUntil = root.classList.contains('film') ? window.innerHeight * 0.2 : 72;
      header.classList.toggle('on-dark', introTop > darkUntil && !menuOpen);
      if (mcta) mcta.classList.toggle('is-on', introTop < window.innerHeight * 0.4 && !contactVisible);
    });

    const links = $$('.gnb a');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        const a = map.get(en.target.id);
        if (a && en.isIntersecting) { links.forEach((l) => l.classList.remove('is-current')); a.classList.add('is-current'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = doc.getElementById(id); if (s) io.observe(s); });
    requestScroll();
  }

  function setupMobileNav() {
    const btn = $('[data-menu-btn]');
    const nav = $('[data-mnav]');
    if (!btn || !nav) return;
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      root.classList.toggle('menu-open', open);
      root.style.overflow = open ? 'hidden' : '';
      $('.sr-only', btn).textContent = open ? '메뉴 닫기' : '메뉴 열기';
      $('[data-header]').classList.remove('is-hidden');
      requestScroll();
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) set(false); });
    mq.desk.addEventListener && mq.desk.addEventListener('change', () => set(false));
  }

  /* ---------------------------------------------------------------- intro words */
  function setupWords() {
    const el = $('[data-words]');
    if (!el) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
    const spans = $$('.w', el);
    let lit = -1;
    const paint = (n) => {
      if (n === lit) return;
      lit = n;
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    };
    if (reduced()) { paint(spans.length); return; }
    addScene(el, (p) => paint(Math.round(clamp((p - 0.18) / 0.42, 0, 1) * spans.length)));
  }

  /* ---------------------------------------------------------------- chapters + hero scroll */
  function setupChapters() {

    const items = $$('[data-chapter]').map((ch) => {
      const dScreen = $('.chapter__desktop .screen', ch);
      const pScreen = $('.chapter__phone .screen', ch);
      return {
        ch,
        d: dScreen && { screen: dScreen, inner: $('.screen__inner', dScreen), max: 0 },
        ph: pScreen && { screen: pScreen, inner: $('.screen__inner', pScreen), max: 0 },
      };
    });
    const measure = () => items.forEach((it) => {
      [it.d, it.ph].forEach((m) => { if (m) m.max = Math.max(0, m.inner.offsetHeight - m.screen.clientHeight); });
    });
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', () => { measure(); requestScroll(); });
    $$('[data-chapter] img').forEach((im) => im.addEventListener('load', () => { measure(); requestScroll(); }));

    if (reduced()) return;
    items.forEach((it) => {
      addScene(it.ch, (p) => {
        const k = easeOut(clamp((p - 0.04) / 0.32, 0, 1));
        it.ch.style.setProperty('--k', k.toFixed(4));
        it.ch.style.setProperty('--q', p.toFixed(4));
        const pan = easeInOut(clamp((p - 0.3) / 0.5, 0, 1));
        if (it.d) it.d.inner.style.setProperty('--pan', (-pan * it.d.max * 0.7).toFixed(1) + 'px');
        if (it.ph) it.ph.inner.style.setProperty('--pan', (-pan * it.ph.max * 0.55).toFixed(1) + 'px');
      });
    });
  }

  /* ---------------------------------------------------------------- index: filters + floating preview */
  function setupIndex(P) {
    const filters = $('[data-filters]');
    const items = $$('.index__item');
    if (filters) {
      filters.addEventListener('click', (e) => {
        const b = e.target.closest('[data-filter]');
        if (!b) return;
        const v = b.getAttribute('data-filter');
        $$('[data-filter]', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        items.forEach((li) => { li.hidden = !!v && li.getAttribute('data-cat') !== v; });
      });
    }

    const float = $('[data-float]');
    const list = $('[data-index-list]');
    if (!float || !list) return;
    const frames = $$('[data-float-i]', float);
    let on = false, x = 0, y = 0, tx = 0, ty = 0, vx = 0, raf = 0, cur = -1;
    const loop = () => {
      const px = x;
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      vx = vx * 0.8 + (x - px) * 0.2;
      float.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${clamp(vx * 0.35, -7, 7).toFixed(2)}deg)`;
      if (on || Math.abs(tx - x) > 0.5) raf = requestAnimationFrame(loop); else raf = 0;
    };
    list.addEventListener('pointermove', (e) => {
      if (!mq.fine.matches || !mq.desk.matches) return;
      const row = e.target.closest('[data-fi]');
      if (!row) return;
      const i = +row.getAttribute('data-fi');
      if (i !== cur) { cur = i; frames.forEach((f, k) => f.classList.toggle('is-on', k === i)); }
      const w = float.offsetWidth, h = float.offsetHeight;
      tx = clamp(e.clientX + 36, 16, window.innerWidth - w - 16);
      ty = clamp(e.clientY - h / 2, 16, window.innerHeight - h - 16);
      if (!on) { on = true; x = tx; y = ty; float.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.addEventListener('pointerleave', () => { on = false; cur = -1; float.classList.remove('is-on'); });
    window.addEventListener('scroll', () => { if (on) { on = false; cur = -1; float.classList.remove('is-on'); } }, { passive: true });
  }

  /* ---------------------------------------------------------------- process */
  function setupProcess() {
    const build = $('[data-build]');
    const steps = $$('.step');
    const list = $('[data-steps]');
    if (!build || !steps.length) return;
    const page = $('.b-page', build);
    if (page) {
      const wire = page.cloneNode(true);
      wire.classList.add('b-page--wire');
      page.parentNode.insertBefore(wire, page);
    }
    const no = $('[data-build-no]');
    const title = $('[data-build-title]');
    const url = $('[data-build-url]');
    let active = 0;
    const set = (n) => {
      if (n === active) return;
      active = n;
      build.setAttribute('data-step', String(n));
      steps.forEach((s, i) => { s.classList.toggle('is-active', i === n - 1); s.classList.toggle('is-done', i < n - 1); });
      if (no) no.textContent = pad2(n);
      if (title) title.textContent = $('h3', steps[n - 1]).lastChild.textContent;
      if (url) url.textContent = n === 6 ? '오픈 완료' : n === 5 ? '휴대폰 화면' : '새 홈페이지';
    };
    set(1);
    // 단계를 바꾸는 기준선: 데스크톱은 화면 가운데, 휴대폰은 위에 고정된 캔버스 아래쪽
    let io = null;
    const watch = () => {
      if (io) io.disconnect();
      io = new IntersectionObserver((ents) => {
        ents.forEach((en) => { if (en.isIntersecting) set(+en.target.getAttribute('data-step-i')); });
      }, { rootMargin: mq.desk.matches ? '-42% 0px -52% 0px' : '-60% 0px -34% 0px' });
      steps.forEach((s) => io.observe(s));
    };
    watch();
    mq.desk.addEventListener && mq.desk.addEventListener('change', watch);
    if (list) addScene(list, () => {
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      list.style.setProperty('--pf', clamp((vh * 0.5 - r.top) / r.height, 0, 1).toFixed(4));
    });
  }

  /* ================================================================ DETAIL (dialog) */
  function setupDetail(P, D) {
    const dlg = $('[data-detail]');
    const api = { open() {}, close() {} };
    if (!dlg || !P.length) return api;
    const el = {
      scroll: $('[data-detail-scroll]', dlg), no: $('[data-d-no]', dlg), cat: $('[data-d-cat]', dlg), title: $('[data-d-title]', dlg),
      summary: $('[data-d-summary]', dlg), overview: $('[data-d-overview]', dlg), palette: $('[data-d-palette]', dlg),
      fonts: $('[data-d-fonts]', dlg), stack: $('[data-d-stack]', dlg), actions: $('[data-d-actions]', dlg), device: $('[data-d-device]', dlg),
      prevT: $('[data-d-prev-title]', dlg), nextT: $('[data-d-next-title]', dlg), toggles: $$('[data-view]', dlg),
    };
    let cur = 0, view = 'desktop', opener = null;

    const renderDevice = () => {
      const p = P[cur];
      const phone = view === 'phone' && hasPhoneView(p);
      el.device.classList.toggle('is-phone', phone);
      el.device.innerHTML = phone ? phoneFrame(p) : desktopFrame(p);
      el.toggles.forEach((b) => {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === (phone ? 'phone' : 'desktop')));
        if (b.getAttribute('data-view') === 'phone') b.disabled = !hasPhoneView(p);
      });
    };
    const fill = () => {
      const p = P[cur];
      el.no.textContent = `PROJECT ${pad2(cur + 1)} / ${p.category || ''}`;
      el.cat.textContent = [p.categoryKo, p.subtitle].filter(Boolean).join(', ');
      el.title.textContent = p.title;
      el.summary.textContent = p.summary || '';
      el.overview.innerHTML = overviewHTML(p, true);
      el.palette.innerHTML = (p.palette || []).map((c) => `<i style="--c:${esc(c.hex)}" title="${esc(c.name)} ${esc(c.hex)}"></i>`).join('');
      el.fonts.textContent = (p.fonts || []).join(', ') || '-';
      el.stack.textContent = (p.stack || []).join(', ') || '-';
      const viewBtn = p.url
        ? `<a class="btn btn--ink" href="${esc(p.url)}" target="_blank" rel="noopener">VIEW WEBSITE ${ICON.ext}</a>`
        : (p.privateNote ? `<p class="detail__private">${esc(p.privateNote)}</p>` : '');
      el.actions.innerHTML = `${viewBtn}<button class="btn btn--line" type="button" data-similar="${cur}">비슷한 홈페이지 상담하기</button>`;
      el.prevT.textContent = P[mod(cur - 1, P.length)].title;
      el.nextT.textContent = P[mod(cur + 1, P.length)].title;
      renderDevice();
      el.scroll.scrollTop = 0;
    };

    api.open = (i, from) => {
      cur = mod(i, P.length);
      if (!dlg.open) {
        opener = from || doc.activeElement;
        view = mq.desk.matches ? 'desktop' : 'phone';
      }
      fill();
      if (!dlg.open) {
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
        root.style.overflow = 'hidden';
      }
    };
    api.close = () => {
      if (dlg.open) dlg.close();
      root.style.overflow = '';
    };
    dlg.addEventListener('close', () => {
      root.style.overflow = '';
      if (opener && opener.focus && doc.contains(opener)) opener.focus({ preventScroll: true });
    });
    $('[data-d-close]', dlg).addEventListener('click', api.close);
    $('[data-d-prev]', dlg).addEventListener('click', () => api.open(cur - 1));
    $('[data-d-next]', dlg).addEventListener('click', () => api.open(cur + 1));
    el.toggles.forEach((b) => b.addEventListener('click', () => { view = b.getAttribute('data-view'); renderDevice(); }));
    dlg.addEventListener('keydown', (e) => {
      if (e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowRight') api.open(cur + 1);
      if (e.key === 'ArrowLeft') api.open(cur - 1);
    });
    return api;
  }

  /* ================================================================ CONTACT FORM */
  function setupForm(D) {
    const C = D.contact || {};
    const form = $('[data-form]');
    const sent = $('[data-sent]');
    const status = $('[data-form-status]');
    const submit = $('[data-submit]');
    const sel = { industry: '', plan: '' };
    const api = { prefill() {} };
    if (!form) return api;
    const f = {
      name: $('#f-name', form), phone: $('#f-phone', form), ref: $('#f-ref', form), msg: $('#f-msg', form),
      consent: $('#f-consent', form), hp: $('[name="botcheck"]', form),
    };

    const pick = (attr, value, toggle) => {
      $$(`[${attr}]`, form).forEach((b) => {
        const on = b.getAttribute(attr) === value && !(toggle && b.getAttribute('aria-pressed') === 'true');
        b.setAttribute('aria-pressed', String(on));
      });
      const chosen = $(`[${attr}][aria-pressed="true"]`, form);
      return chosen ? chosen.getAttribute(attr) : '';
    };
    form.addEventListener('click', (e) => {
      const ib = e.target.closest('[data-industry]');
      if (ib) { sel.industry = pick('data-industry', ib.getAttribute('data-industry'), true); clearError('industry'); return; }
      const pb = e.target.closest('[data-plan-chip]');
      if (pb) sel.plan = pick('data-plan-chip', pb.getAttribute('data-plan-chip'), true);
    });

    const formatPhone = (v) => {
      const d = v.replace(/\D/g, '').slice(0, 11);
      if (d.startsWith('02')) {
        if (d.length <= 2) return d;
        if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
        if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
        return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
      }
      if (d.length <= 3) return d;
      if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
      if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
      return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    };
    f.phone.addEventListener('input', () => { f.phone.value = formatPhone(f.phone.value); clearError('phone'); });
    f.name.addEventListener('input', () => clearError('name'));
    f.consent.addEventListener('change', () => clearError('consent'));

    function setError(key, msg) {
      const p = $(`[data-error="${key}"]`, form);
      if (p) { p.textContent = msg; const fld = p.closest('.field'); if (fld) fld.classList.add('has-error'); }
    }
    function clearError(key) {
      const p = $(`[data-error="${key}"]`, form);
      if (p) { p.textContent = ''; const fld = p.closest('.field'); if (fld) fld.classList.remove('has-error'); }
    }
    function setStatus(msg, isError) {
      status.textContent = msg;
      status.classList.toggle('is-error', !!isError);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      setStatus('');
      let firstBad = null;
      if (!sel.industry) { setError('industry', '업종을 하나 골라 주세요.'); firstBad = firstBad || $('[data-industry]', form); }
      if (!f.name.value.trim()) { setError('name', '이름을 입력해 주세요.'); firstBad = firstBad || f.name; }
      if (f.phone.value.replace(/\D/g, '').length < 9) { setError('phone', '연락 가능한 번호를 입력해 주세요.'); firstBad = firstBad || f.phone; }
      if (!f.consent.checked) { setError('consent', '상담을 위해 개인정보 수집에 동의해 주세요.'); firstBad = firstBad || f.consent; }
      if (firstBad) { firstBad.focus(); return; }
      if (f.hp && f.hp.checked) return;

      if (!C.web3formsKey) {
        setStatus('문의 접수가 아직 연결되지 않아 전송되지 않았습니다. (운영자: site-data.js 의 contact.web3formsKey 에 Web3Forms 키를 입력하세요.)', true);
        return;
      }
      submit.disabled = true;
      const label = submit.textContent;
      submit.textContent = '보내는 중…';
      const payload = {
        access_key: C.web3formsKey,
        subject: C.mailSubject || '홈페이지 제작 문의',
        from_name: '페이퍼토브 홈페이지',
        업종: sel.industry,
        이름: f.name.value.trim(),
        연락처: f.phone.value.trim(),
        원하는_홈페이지: sel.plan || '선택 안 함',
        참고_사이트: f.ref.value.trim() || '-',
        문의_내용: f.msg.value.trim() || '-',
        botcheck: '',
      };
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((j) => {
          if (!j || !j.success) throw new Error((j && j.message) || 'failed');
          form.hidden = true;
          $('[data-sent-desc]', sent).textContent = C.responseNote || '';
          sent.hidden = false;
          sent.focus();
        })
        .catch(() => {
          const alt = [C.phone, C.email].filter(Boolean).join(' 또는 ');
          setStatus(`전송하지 못했습니다. 잠시 후 다시 시도해 주세요.${alt ? ` 급하시면 ${alt}로 연락해 주세요.` : ''}`, true);
        })
        .finally(() => { submit.disabled = false; submit.textContent = label; });
    });

    const reset = $('[data-sent-reset]');
    if (reset) reset.addEventListener('click', () => {
      form.reset();
      sel.industry = pick('data-industry', '');
      sel.plan = pick('data-plan-chip', '');
      sent.hidden = true; form.hidden = false; setStatus('');
      f.name.focus();
    });

    api.prefill = (o) => {
      if (o.industry) { sel.industry = pick('data-industry', o.industry); clearError('industry'); }
      if (o.plan) sel.plan = pick('data-plan-chip', o.plan);
      if (o.message && !f.msg.value.trim()) f.msg.value = o.message;
      const target = $('#contact');
      if (target) target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => { try { f.name.focus({ preventScroll: true }); } catch (_) { f.name.focus(); } }, reduced() ? 0 : 700);
    };
    return api;
  }

  /* ================================================================ CURSOR (mouse only) */
  function setupCursor() {
    const cur = $('[data-cursor-el]');
    const label = $('[data-cursor-label]');
    if (!cur || !mq.fine.matches || reduced()) return;
    root.classList.add('has-cursor');
    const names = { view: 'VIEW', drag: 'DRAG' };
    let x = -200, y = -200, tx = -200, ty = -200, raf = 0, on = false, scale = 0.3, ts = 0.3;
    const loop = () => {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22; scale += (ts - scale) * 0.18;
      cur.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
      if (on || Math.abs(ts - scale) > 0.01) raf = requestAnimationFrame(loop); else raf = 0;
    };
    doc.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const host = e.target.closest('[data-cursor]');
      tx = e.clientX; ty = e.clientY;
      if (host) {
        const kind = host.getAttribute('data-cursor');
        cur.classList.toggle('on-dark', !!host.closest('.hero'));
        label.textContent = names[kind] || '';
        ts = kind === 'drag' ? 0.82 : 1;
        if (!on) { on = true; x = tx; y = ty; cur.classList.add('is-on'); }
      } else if (on) {
        on = false; ts = 0.3; cur.classList.remove('is-on');
      }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    doc.addEventListener('pointerleave', () => { on = false; cur.classList.remove('is-on'); });
  }
})();
