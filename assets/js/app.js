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
     제작한 홈페이지 화면들로 하나의 구를 만듭니다.
     · 화면 소스: site-data.js 의 images(실제 스크린샷) → 없으면 previews.js 를 렌더한
       assets/img/previews/{preview}-desktop|mobile.webp
     · 위도 링을 따라 브라우저 화면(데스크톱)과 휴대폰 화면을 섞어 배치하고, 각 화면은
       구의 곡률에 맞춰 바깥을 향합니다.
     · 스크롤: OUTSIDE → APPROACH → CLOSE → ENTER → INSIDE → PROJECT 01 등장
     · 화면을 누르면 그 프로젝트가 앞으로 나온 뒤 기존 상세 화면이 열립니다. */
  const PREVIEW_DIR = 'assets/img/previews/';
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
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

  function setupSphere(P, onOpen) {
    const hero = $('[data-hero]');
    const stage = $('[data-stage]');
    const host = $('[data-sphere]');
    if (!hero || !stage || !host || !P.length) return;

    const ui = { intro: $('[data-hero-intro]'), meta: $('[data-hero-meta]'), feat: $('[data-hero-feature]'), hover: $('[data-hero-hover]') };
    const hoverDefault = ui.hover ? ui.hover.innerHTML : '';
    const cats = unique(P.map((p) => p.categoryKo));
    const cp = $('[data-count-projects]'); if (cp) cp.textContent = pad2(P.length);
    const ci = $('[data-count-industries]'); if (ci) ci.textContent = pad2(cats.length);

    // 구 안에서 크게 등장하는 작업 = PROJECT 01
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
    let renderer = null, cv = null;
    if (!THREE || !hasWebGL()) { fallback(); return; }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { fallback(); return; }
    const film = !reduced();
    root.classList.toggle('film', film);

    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    cv = renderer.domElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.05, 240);
    const world = new THREE.Group();
    scene.add(world);

    const R = 10;
    const BASE_TILT = 0.2;
    const AUTO = reduced() ? 0 : 0.045; // rad/s — 제품을 천천히 살펴보는 속도
    const startMobile = !mq.desk.matches;
    let mobile = startMobile;
    let W = 1, H = 1;

    /* 카메라 키프레임 (s: 0 → 1) */
    const KEYS = {
      desk: { z: [[0, 64], [0.1, 61], [0.44, 13.6], [0.5, 13.0], [0.82, -0.9], [1, -1.3]], fov: [[0, 28], [0.16, 28], [0.5, 40], [0.82, 50], [1, 50]] },
      mob: { z: [[0, 67], [0.1, 64], [0.44, 14.8], [0.5, 14.1], [0.82, -0.9], [1, -1.3]], fov: [[0, 47], [0.16, 47], [0.5, 54], [0.82, 64], [1, 64]] },
    };
    function track(keys, s) {
      if (s <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) {
        if (s <= keys[i][0]) {
          const t = easeInOut((s - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
          return lerp(keys[i - 1][1], keys[i][1], t);
        }
      }
      return keys[keys.length - 1][1];
    }

    /* ---------------- 패널 셰이더
       구 표면의 패널은 InstancedMesh 한 번의 드로우로 그립니다.
       카메라가 표면을 통과할 때 가까운 몇 장만 따로 꺼내 반투명하게 사라지게 합니다(near pool). */
    const FADE_START = 2.8, FADE_END = 0.9; // 이 거리 안으로 들어온 패널은 투명해지며 사라짐
    const uniforms = {
      uAtlas: { value: null }, uReveal: { value: 0 }, uDim: { value: 1 }, uInside: { value: 0 },
      uFogA: { value: 40 }, uFogB: { value: 80 },
      uLight: { value: new THREE.Vector3(-0.5, 0.62, 0.62).normalize() },
    };
    const SHADE = `
        uniform sampler2D uAtlas;
        uniform float uReveal;
        uniform float uDim;
        uniform float uInside;
        uniform float uFogA;
        uniform float uFogB;
        uniform vec3 uLight;
        varying vec3 vNrm;
        varying vec2 vUv;
        varying vec2 vUvB;
        varying vec2 vLocal;
        varying float vAspect;
        varying float vFacing;
        varying float vDist;
        varying float vHi;
        vec3 panelColor() {
          vec3 col = texture2D(uAtlas, gl_FrontFacing ? vUv : vUvB).rgb;
          // 정면은 밝게, 옆과 뒤는 어둡게. 구 안에서는 안쪽 면이 밝아집니다
          float facing = gl_FrontFacing ? vFacing : mix(-0.75, -vFacing, uInside);
          float shade = mix(0.1, 1.0, smoothstep(-0.12, 0.88, facing));
          float fog = smoothstep(uFogA, uFogB, vDist);
          // 밖에서 볼 때는 왼쪽 위에서 비추는 은은한 빛으로 구의 입체감을 줍니다
          float lam = max(dot(normalize(vNrm), uLight), 0.0);
          float key = mix(mix(0.42, 1.0, lam), 0.92, uInside);
          col *= shade * key * 0.9 * mix(1.0, 0.08, fog);
          // 화면 사이를 가르는 얇은 베젤
          float ty = 0.02;
          float tx = ty / max(vAspect, 0.25);
          float inner = step(tx, vLocal.x) * step(vLocal.x, 1.0 - tx) * step(ty, vLocal.y) * step(vLocal.y, 1.0 - ty);
          col = mix(col * 0.18, col, inner);
          col = mix(col, col * 1.1 + 0.035, vHi);
          return col * uDim * uReveal;
        }`;
    const VARY = `
        varying vec3 vNrm;
        varying vec2 vUv;
        varying vec2 vUvB;
        varying vec2 vLocal;
        varying float vAspect;
        varying float vFacing;
        varying float vDist;
        varying float vHi;`;
    const material = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.DoubleSide,
      vertexShader: `
        attribute vec4 aUv;
        attribute float aAspect;
        attribute float aHover;
        attribute float aPick;
        attribute float aHide;
        ${VARY}
        void main() {
          vLocal = uv;
          vUv = aUv.xy + uv * aUv.zw;
          vUvB = aUv.xy + vec2(1.0 - uv.x, uv.y) * aUv.zw;
          vAspect = aAspect;
          vHi = max(aHover, aPick);
          vec3 pos = position;
          pos.xy *= 1.0 + aPick * 0.32;
          #ifdef USE_INSTANCING
            mat4 m = modelMatrix * instanceMatrix;
          #else
            mat4 m = modelMatrix;
          #endif
          vec3 nrm = normalize((m * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
          vNrm = nrm;
          vec4 world = m * vec4(pos, 1.0);
          world.xyz += nrm * (aHover * 0.3 + aPick * 1.7);
          vec3 toCam = cameraPosition - world.xyz;
          vDist = length(toCam);
          vFacing = dot(nrm, toCam / max(vDist, 0.0001));
          gl_Position = projectionMatrix * viewMatrix * world;
          // near pool 로 옮겨진 패널은 여기서 그리지 않습니다
          if (aHide > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
        }`,
      fragmentShader: `
        ${SHADE}
        void main() {
          if (vDist < 0.3) discard;
          gl_FragColor = vec4(panelColor(), 1.0);
        }`,
    });
    // 표면을 통과하는 순간의 패널: 개별 메시 + 투명도 (three.js 가 앞뒤 순서를 정렬)
    const POOL = 16;
    const poolMeshes = [];
    const poolGeo = new THREE.PlaneGeometry(1, 1);
    function poolMaterial() {
      return new THREE.ShaderMaterial({
        uniforms: {
          uAtlas: uniforms.uAtlas, uReveal: uniforms.uReveal, uDim: uniforms.uDim, uInside: uniforms.uInside,
          uFogA: uniforms.uFogA, uFogB: uniforms.uFogB, uLight: uniforms.uLight,
          uUv: { value: new THREE.Vector4() }, uAspect: { value: 1 }, uAlpha: { value: 1 },
        },
        side: THREE.DoubleSide, transparent: true, depthWrite: false,
        vertexShader: `
          uniform vec4 uUv;
          uniform float uAspect;
          ${VARY}
          void main() {
            vLocal = uv;
            vUv = uUv.xy + uv * uUv.zw;
            vUvB = uUv.xy + vec2(1.0 - uv.x, uv.y) * uUv.zw;
            vAspect = uAspect;
            vHi = 0.0;
            vec3 nrm = normalize((modelMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
            vNrm = nrm;
            vec4 world = modelMatrix * vec4(position, 1.0);
            vec3 toCam = cameraPosition - world.xyz;
            vDist = length(toCam);
            vFacing = dot(nrm, toCam / max(vDist, 0.0001));
            gl_Position = projectionMatrix * viewMatrix * world;
          }`,
        fragmentShader: `
          uniform float uAlpha;
          ${SHADE}
          void main() {
            if (vDist < 0.2 || uAlpha < 0.004) discard;
            gl_FragColor = vec4(panelColor(), uAlpha);
          }`,
      });
    }
    for (let k = 0; k < POOL; k++) {
      const pm = new THREE.Mesh(poolGeo, poolMaterial());
      pm.matrixAutoUpdate = false;
      pm.visible = false;
      pm.frustumCulled = false;
      scene.add(pm);
      poolMeshes.push(pm);
    }

    /* ---------------- 상태 */
    let atlas = null, mesh = null, feat = null;
    let instProj = new Int16Array(0);
    let hoverArr = null, pickArr = null, hideArr = null, instMats = [], instCenters = [], instUv = [], instAsp = [];
    let pooled = new Set();
    let spin = 0, spinVel = 0, tilt = 0, tiltVel = 0, introBoost = reduced() ? 0 : 1;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    let s = 0, sCur = 0, cover = 0, reveal = 0;
    let heroTop = 0, heroH = 1, stageH = 1;
    let raf = 0, last = 0, inView = true;
    let drag = null, pointerDirty = false, hoverId = -1, hoverFeat = false;
    const hoverAnim = new Map(); // instanceId → target
    let pickAnim = null;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2(-9, -9);
    const dlg = $('[data-detail]');
    const dialogOpen = () => !!(dlg && dlg.open);
    const uiCache = {};

    /* ---------------- 텍스처: 모든 화면을 한 장의 아틀라스로 */
    const BAR = 0.075; // 데스크톱 셀 위쪽 브라우저 바 비율
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
        } else items.push({ kind: 'd', project: i, img: null });
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
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      return { tex, items, loaded };
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
      if (mesh) { world.remove(mesh); mesh.geometry.dispose(); mesh = null; }
      const rand = mulberry32(20261007);
      const dList = atlas.items.filter((c) => c.kind === 'd');
      const mList = atlas.items.filter((c) => c.kind === 'm');
      for (let i = dList.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [dList[i], dList[j]] = [dList[j], dList[i]]; }
      for (let i = mList.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [mList[i], mList[j]] = [mList[j], mList[i]]; }
      const cfg = mobile
        ? { rowH: 2.15, gap: 0.2, latMax: 1.2, mShare: 0.2 }
        : { rowH: 1.55, gap: 0.16, latMax: 1.26, mShare: 0.22 };
      const panels = ringLayout(cfg, rand, dList, mList);
      const n = panels.length;
      const geo = new THREE.PlaneGeometry(1, 1);
      const aUv = new Float32Array(n * 4), aAsp = new Float32Array(n);
      hoverArr = new Float32Array(n); pickArr = new Float32Array(n); hideArr = new Float32Array(n);
      instProj = new Int16Array(n);
      instMats = []; instCenters = []; instUv = []; instAsp = [];
      pooled = new Set();
      poolMeshes.forEach((pm) => { pm.visible = false; });
      mesh = new THREE.InstancedMesh(geo, material, n);
      const m4 = new THREE.Matrix4(), e = new THREE.Vector3(), u = new THREE.Vector3(), nn = new THREE.Vector3(), pp = new THREE.Vector3();
      panels.forEach((pn, i) => {
        const cl = Math.cos(pn.lat), sl = Math.sin(pn.lat), cL = Math.cos(pn.lon), sL = Math.sin(pn.lon);
        nn.set(cl * sL, sl, cl * cL);            // 바깥을 향하는 법선
        e.set(cL, 0, -sL).multiplyScalar(pn.w);   // 동쪽(가로)
        u.set(-sl * sL, cl, -sl * cL).multiplyScalar(pn.h); // 북쪽(세로)
        pp.copy(nn).multiplyScalar(R + (rand() - 0.5) * 0.26);
        m4.makeBasis(e, u, nn).setPosition(pp);
        mesh.setMatrixAt(i, m4);
        instMats.push(m4.clone());
        instCenters.push(pp.clone());
        instUv.push(pn.crop.uv);
        instAsp.push(pn.w / pn.h);
        aUv.set(pn.crop.uv, i * 4);
        aAsp[i] = pn.w / pn.h;
        instProj[i] = pn.crop.project;
      });
      geo.setAttribute('aUv', new THREE.InstancedBufferAttribute(aUv, 4));
      geo.setAttribute('aAspect', new THREE.InstancedBufferAttribute(aAsp, 1));
      const hAttr = new THREE.InstancedBufferAttribute(hoverArr, 1); hAttr.setUsage(THREE.DynamicDrawUsage);
      const pAttr = new THREE.InstancedBufferAttribute(pickArr, 1); pAttr.setUsage(THREE.DynamicDrawUsage);
      const xAttr = new THREE.InstancedBufferAttribute(hideArr, 1); xAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aHover', hAttr);
      geo.setAttribute('aPick', pAttr);
      geo.setAttribute('aHide', xAttr);
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      world.add(mesh);
      hoverAnim.clear(); hoverId = -1; pickAnim = null;
    }

    function buildFeature() {
      const img = atlas.loaded[FEAT] && atlas.loaded[FEAT].d;
      const cw = 1200, bar = 46, ch = 750;
      const c = doc.createElement('canvas');
      c.width = cw; c.height = ch + bar;
      const g = c.getContext('2d');
      g.fillStyle = '#111215'; g.fillRect(0, 0, cw, ch + bar);
      browserBar(g, 0, 0, cw, bar, fp.host || fp.title);
      if (img) {
        const iw = img.naturalWidth;
        const sh = Math.min(img.naturalHeight, (iw * ch) / cw);
        g.drawImage(img, 0, 0, iw, sh, 0, bar, cw, (sh * cw) / iw);
      } else typeCell(g, fp, 0, bar, cw, ch);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false });
      feat = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      feat.renderOrder = 10;
      feat.visible = false;
      feat.userData.aspect = cw / (ch + bar);
      scene.add(feat);
    }

    /* ---------------- 표면 통과: 가까운 패널만 투명하게 */
    const tmpV = new THREE.Vector3();
    const nearList = [];
    function updatePool() {
      if (!mesh) return;
      nearList.length = 0;
      const cz = camera.position.z;
      if (cz < R + FADE_START + 1.5 && cz > -R - FADE_START - 1.5) {
        for (let i = 0; i < instCenters.length; i++) {
          tmpV.copy(instCenters[i]).applyMatrix4(world.matrixWorld);
          const d = tmpV.distanceTo(camera.position);
          if (d < FADE_START + 0.5) nearList.push([d, i]);
        }
        nearList.sort((x, y) => x[0] - y[0]);
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
        u.uAlpha.value = smooth(FADE_END, FADE_START, d);
      }
      let changed = false;
      pooled.forEach((i) => { if (!next.has(i)) { hideArr[i] = 0; changed = true; } });
      next.forEach((i) => { if (!pooled.has(i)) { hideArr[i] = 1; changed = true; } });
      pooled = next;
      if (changed) mesh.geometry.attributes.aHide.needsUpdate = true;
    }

    /* ---------------- 크기와 스크롤 위치 */
    function measure() {
      heroTop = hero.getBoundingClientRect().top + window.scrollY;
      heroH = hero.offsetHeight; stageH = stage.offsetHeight;
    }
    function resize() {
      W = Math.max(1, stage.clientWidth); H = Math.max(1, stage.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      measure();
      const m = !mq.desk.matches;
      if (m !== mobile) { mobile = m; buildPanels(); }
      wake();
    }
    function readScroll() {
      const y = window.scrollY - heroTop;
      if (!film) { s = 0; cover = clamp(y / stageH, 0, 1); return; }
      const len = Math.max(1, heroH - 2 * stageH);
      s = clamp(y / len, 0, 1);
      cover = clamp((y - len) / stageH, 0, 1);
    }

    /* ---------------- 호버 / 선택 */
    function setHover(id, isFeat) {
      if (id === hoverId && isFeat === hoverFeat) return;
      if (hoverId >= 0) hoverAnim.set(hoverId, 0);
      hoverId = id; hoverFeat = isFeat;
      if (id >= 0) hoverAnim.set(id, 1);
      host.setAttribute('data-cursor', id >= 0 || isFeat ? 'view' : 'drag');
      if (ui.hover) {
        const pi = isFeat ? FEAT : id >= 0 ? instProj[id] : -1;
        ui.hover.innerHTML = pi >= 0
          ? `<span>${pad2(pi + 1)}</span><b>${esc(P[pi].title)}</b> ${esc(P[pi].categoryKo)}`
          : hoverDefault;
      }
    }
    function pickAt() {
      if (!mesh) return { id: -1, isFeat: false };
      ray.setFromCamera(ndc, camera);
      if (feat && feat.visible && feat.material.opacity > 0.5 && ray.intersectObject(feat).length) return { id: -1, isFeat: true };
      const hits = ray.intersectObject(mesh);
      for (const h of hits) {
        if (h.distance > FADE_START && h.instanceId != null && !pooled.has(h.instanceId)) return { id: h.instanceId, isFeat: false };
      }
      return { id: -1, isFeat: false };
    }
    function select(id) {
      pickAnim = { id, t: 0 };
      const pi = instProj[id];
      setTimeout(() => onOpen(pi, host), 300);
    }

    /* ---------------- 입력: 마우스 / 드래그 (관성) / 터치 */
    const setNdc = (e) => {
      const r = cv.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    cv.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      setNdc(e);
      drag = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, lt: performance.now(), moved: false, id: e.pointerId, vx: 0, vy: 0 };
      wake();
    });
    cv.addEventListener('pointermove', (e) => {
      setNdc(e);
      pointerDirty = true;
      if (e.pointerType === 'mouse' && !reduced()) { tmx = clamp(ndc.x, -1, 1); tmy = clamp(-ndc.y, -1, 1); }
      if (drag && e.pointerId === drag.id) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 6) {
          drag.moved = true;
          try { cv.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
          host.classList.add('is-dragging');
        }
        if (drag.moved) {
          const now = performance.now();
          const dts = Math.max(0.008, (now - drag.lt) / 1000);
          const ax = (e.clientX - drag.lx) * 0.0052, ay = (e.clientY - drag.ly) * 0.0032;
          spin += ax; tilt = clamp(tilt + ay, -0.5, 0.5);
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
        spinVel = clamp(d.vx, -3, 3);
        tiltVel = clamp(d.vy, -2, 2);
      } else if (!cancelled) {
        const hit = pickAt();
        if (hit.isFeat) onOpen(FEAT, host);
        else if (hit.id >= 0) select(hit.id);
      }
      wake();
    };
    cv.addEventListener('pointerup', (e) => endDrag(e, false));
    cv.addEventListener('pointercancel', (e) => endDrag(e, true));
    cv.addEventListener('pointerleave', () => { tmx = 0; tmy = 0; ndc.set(-9, -9); setHover(-1, false); wake(); });

    /* ---------------- 프레임 */
    const setUI = (key, el, val, fn) => {
      if (!el) return;
      if (uiCache[key] !== undefined && Math.abs(uiCache[key] - val) < 0.002) return;
      uiCache[key] = val;
      fn(el, val);
    };
    function update(dt) {
      readScroll();
      if (Math.abs(s - sCur) > 0.45) sCur = s; // 앵커 이동 같은 큰 점프는 바로 맞춤
      sCur += (s - sCur) * (1 - Math.exp(-dt / 0.11));

      const K = mobile ? KEYS.mob : KEYS.desk;
      const camZ = track(K.z, sCur);
      camera.fov = track(K.fov, sCur);
      const inside = smooth(R + 1.2, R - 1.2, camZ);
      const outside = 1 - inside;

      // 회전: 자동 + 드래그 관성 + 마우스
      if (!drag) {
        spin += spinVel * dt; spinVel *= Math.exp(-dt * 2.6);
        tilt += tiltVel * dt; tiltVel *= Math.exp(-dt * 2.6);
        tilt *= Math.exp(-dt * 0.6);
      }
      introBoost *= Math.exp(-dt * 1.6);
      spin += (AUTO + introBoost * 0.55) * dt;
      const km = 1 - Math.exp(-dt / 0.45);
      mx += (tmx - mx) * km; my += (tmy - my) * km;
      world.rotation.x = BASE_TILT * outside + tilt + my * 0.12;
      world.rotation.y = spin + mx * 0.32;

      reveal = atlas ? Math.min(1, reveal + dt / 1.5) : 0;
      const rv = easeOut(reveal);
      world.scale.setScalar(0.9 + 0.1 * rv);

      // 카메라
      const camX = mx * 0.45 * outside, camY = -my * 0.3 * outside;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(camX * 0.4 + mx * 1.4 * inside, camY * 0.4 - my * 0.7 * inside, camZ - 10);
      const off = 1 - smooth(0.08, 0.4, sCur);
      const shiftX = mobile ? 0 : W * 0.12 * off;
      const shiftY = (mobile ? H * 0.13 : H * 0.06) * off;
      camera.setViewOffset(W, H, -shiftX, shiftY, W, H);
      camera.updateProjectionMatrix();

      world.updateMatrixWorld(true);
      updatePool();

      uniforms.uReveal.value = rv;
      uniforms.uInside.value = inside;
      uniforms.uFogA.value = lerp(camZ - R * 0.15, 8, inside);
      uniforms.uFogB.value = lerp(camZ + R * 1.05, 34, inside);
      uniforms.uDim.value = (0.84 + 0.16 * inside) * (1 - 0.76 * smooth(0.8, 0.95, sCur));

      // PROJECT 01 이 안쪽 벽에서 앞으로 나옵니다
      const f = easeInOut(clamp((sCur - 0.8) / 0.17, 0, 1));
      if (feat) {
        feat.visible = f > 0.001;
        if (feat.visible) {
          const a = { x: 0, y: mobile ? 0.5 : 0, z: -8.6, w: 1.9 };
          const b = mobile ? { x: 0, y: 0.82, z: -6.3, w: 2.95 } : { x: -1.62, y: 0.08, z: -5.4, w: 3.95 };
          const w = lerp(a.w, b.w, f);
          feat.position.set(camX + lerp(a.x, b.x, f), camY + lerp(a.y, b.y, f), camZ + lerp(a.z, b.z, f));
          feat.scale.set(w, w / feat.userData.aspect, 1);
          feat.rotation.set(0, (1 - f) * (mobile ? 0 : 0.32), 0);
          feat.material.opacity = clamp(f * 3, 0, 1);
        }
      }

      // 호버 판정 (드래그 중이 아닐 때, 포인터가 움직였을 때만)
      if (pointerDirty && !drag && mesh) {
        pointerDirty = false;
        const hit = pickAt();
        setHover(hit.id, hit.isFeat);
      }
      if (hoverArr && hoverAnim.size) {
        hoverAnim.forEach((target, id) => {
          const v = hoverArr[id] + (target - hoverArr[id]) * (1 - Math.exp(-dt / 0.09));
          hoverArr[id] = Math.abs(target - v) < 0.002 ? target : v;
          if (hoverArr[id] === target && target === 0) hoverAnim.delete(id);
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

      // 글자: 처음 문구는 스크롤을 시작하면 물러나고, 구 안에서는 프로젝트 설명이 나옵니다
      const ia = 1 - smooth(0.015, 0.1, sCur);
      setUI('intro', ui.intro, ia, (el, v) => {
        el.style.opacity = v.toFixed(3);
        el.style.transform = `translate3d(0,${((1 - v) * -40).toFixed(1)}px,0)`;
        el.style.visibility = v < 0.01 ? 'hidden' : '';
      });
      setUI('meta', ui.meta, ia, (el, v) => { el.style.opacity = v.toFixed(3); el.style.visibility = v < 0.01 ? 'hidden' : ''; });
      const fa = smooth(0.87, 0.96, sCur);
      setUI('feat', ui.feat, fa, (el, v) => {
        el.style.opacity = v.toFixed(3);
        el.classList.toggle('is-on', v > 0.001);
        const live = v > 0.6;
        el.classList.toggle('is-live', live);
        el.setAttribute('aria-hidden', String(!live));
        fBtns.forEach((b) => b.setAttribute('tabindex', live ? '0' : '-1'));
        $('.hero__feature-in', el).style.transform = mobile ? `translate3d(0,${((1 - v) * 24).toFixed(1)}px,0)` : `translate3d(0,calc(-50% + ${((1 - v) * 24).toFixed(1)}px),0)`;
      });
    }
    function shouldRun() { return inView && !doc.hidden && !dialogOpen() && cover < 0.999; }
    function idle() {
      // 모션 줄이기 설정에서는 사용자가 움직일 때만 그립니다
      return reduced() && !drag && Math.abs(spinVel) < 1e-3 && Math.abs(tiltVel) < 1e-3 && reveal >= 1 && !hoverAnim.size && !pickAnim;
    }
    function frame(now) {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      update(dt);
      renderer.render(scene, camera);
      if (shouldRun() && !idle()) raf = requestAnimationFrame(frame);
    }
    function wake() {
      readScroll();
      if (!raf && shouldRun()) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }

    new IntersectionObserver((en) => { inView = en[0].isIntersecting; wake(); }).observe(hero);
    doc.addEventListener('visibilitychange', wake);
    window.addEventListener('scroll', wake, { passive: true });
    if (dlg) dlg.addEventListener('close', wake);
    let rzT = 0;
    window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(resize, 100); });
    window.addEventListener('load', () => { measure(); wake(); });
    resize();

    buildAtlas().then((a) => {
      atlas = a;
      uniforms.uAtlas.value = a.tex;
      buildPanels();
      buildFeature();
      wake();
    }).catch((err) => { console.error('[PAPERTOV] sphere', err); fallback(); });

    function fallback() {
      root.classList.remove('film');
      if (renderer) { try { renderer.dispose(); } catch (_) { /* noop */ } if (cv && cv.parentNode) cv.parentNode.removeChild(cv); }
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
      // 어두운 구 위에서는 밝은 헤더, 종이(소개 섹션)가 덮으면 원래 헤더
      const introTop = intro ? intro.getBoundingClientRect().top : 0;
      header.classList.toggle('on-dark', introTop > 40 && !menuOpen);
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
