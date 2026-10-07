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
    const N = P.length;

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
    const gallery = N ? setupGallery(P, (i) => detail.open(i)) : null;

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
    setupChapters(gallery);
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

  /* ================================================================ HERO GALLERY
     데스크톱: 기울어진 궤도 위에 작업이 전시되고, 가장 앞의 작품이 살짝 앞으로 나옵니다.
     휴대폰: 카드가 겹쳐 쌓인 덱. 좌우로 넘깁니다. */
  function setupGallery(P, onOpen) {
    const stage = $('[data-gallery]');
    const scene = $('[data-scene]');
    if (!stage || !scene) return null;
    const N = P.length;
    const AUTO = 5200;

    scene.innerHTML = P.map((p, i) =>
      `<div class="g-card" data-i="${i}" role="button" tabindex="-1" aria-label="${esc(p.title)} 자세히 보기">${desktopFrame(p)}</div>`).join('');
    const cards = $$('.g-card', scene);
    cards.forEach((c) => $$('img', c).forEach((im) => im.setAttribute('loading', 'eager')));

    const cap = {
      box: $('[data-caption]'),
      no: $('[data-cap-no]'), title: $('[data-cap-title]'), meta: $('[data-cap-meta]'), medium: $('[data-cap-medium]'),
      index: $('[data-cap-index]'), total: $('[data-cap-total]'), timer: $('[data-timer]'),
    };
    if (cap.total) cap.total.textContent = pad2(N);
    root.style.setProperty('--auto', AUTO + 'ms');

    let mode = 'orbit', W = 0, H = 0, cw = 0, ch = 0, R = { x: 0, z: 0, f: 0 };
    let t = reduced() ? 0 : -1.15, target = 0, scrollOff = 0, tilt = 0;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    let running = false, last = 0, focus = -1, drag = null;
    let autoTimer = 0, hover = false, inView = true;
    let introDone = reduced(); // 첫 진입 회전 중에는 캡션을 바꾸지 않습니다

    function measure() {
      const r = stage.getBoundingClientRect();
      W = r.width; H = r.height;
      mode = mq.desk.matches ? 'orbit' : 'deck';
      if (mode === 'orbit') {
        cw = clamp(Math.min(W * 0.32, H * 0.82), 260, 560);
        R = { x: W * 0.37, z: W * 0.27, f: W * 0.1 };
        stage.style.perspective = Math.round(Math.max(1400, W * 1.25)) + 'px';
      } else {
        cw = Math.min(W - 56, 440);
        stage.style.perspective = '1000px';
      }
      stage.style.setProperty('--cw', cw + 'px');
      ch = cards[0].offsetHeight || cw * 0.67;
      stage.style.setProperty('--ch', ch + 'px');
      apply();
    }

    function angWrap(a) { a = mod(a + Math.PI, Math.PI * 2) - Math.PI; return a; }

    function orbitSlot(p) {
      const a = (p / N) * Math.PI * 2;
      const c = Math.cos(a), s = Math.sin(a);
      const front = (1 + c) / 2;
      const near = Math.max(0, 1 - Math.abs(angWrap(a)) / ((Math.PI * 2) / N));
      return {
        x: R.x * s,
        y: H * 0.05 * front,
        z: R.f + R.z * (c - 1),
        ry: -s * 26,
        rz: 0,
        s: 1 + 0.08 * easeInOut(near),
        o: clamp(0.2 + front * 2.4, 0, 1),
        fog: (1 - front) * 0.58,
        depth: front,
      };
    }

    function deckSlot(p) {
      if (p > N - 1) p -= N; // (-1, N-1]
      if (p < 0) {
        return { x: p * W * 0.95, y: 0, z: 12, ry: 0, rz: p * 9, s: 1, o: clamp(1 + p * 1.1, 0, 1), fog: 0, depth: 2 + p };
      }
      const k = p;
      return {
        x: 0,
        y: ch * 0.07 - k * ch * 0.1,
        z: -k * 34,
        ry: 0,
        rz: 0,
        s: 1 - k * 0.06,
        o: k <= 2 ? 1 : clamp(3 - k, 0, 1),
        fog: Math.min(k, 3) * 0.13,
        depth: 1 - k * 0.1,
      };
    }

    function apply() {
      const tt = t + scrollOff;
      for (let i = 0; i < N; i++) {
        const p = mod(i - tt, N);
        const S = mode === 'orbit' ? orbitSlot(p) : deckSlot(p);
        const el = cards[i];
        el.style.transform = `translate3d(${S.x.toFixed(1)}px,${S.y.toFixed(1)}px,${S.z.toFixed(1)}px) rotateY(${S.ry.toFixed(2)}deg) rotateZ(${S.rz.toFixed(2)}deg) scale(${S.s.toFixed(4)})`;
        el.style.opacity = S.o.toFixed(3);
        el.style.setProperty('--fog', S.fog.toFixed(3));
        el.style.zIndex = String(Math.round(S.depth * 100) + 100);
        el.style.visibility = S.o < 0.01 ? 'hidden' : 'visible';
      }
      if (mode === 'orbit') {
        const rx = -7 - tilt * 9 + my * -3.2;
        const ry = mx * 5.5;
        scene.style.transform = `translate3d(0,${(-tilt * 24).toFixed(1)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      } else {
        scene.style.transform = 'none';
      }
      const f = mod(Math.round(introDone ? tt : target + scrollOff), N);
      if (f !== focus) setFocus(f);
    }

    function setFocus(f) {
      const first = focus === -1;
      focus = f;
      const p = P[f];
      cards.forEach((c, i) => c.setAttribute('tabindex', i === f ? '0' : '-1'));
      if (!cap.title) return;
      cap.no.textContent = pad2(f + 1);
      cap.index.textContent = pad2(f + 1);
      cap.title.textContent = p.title;
      cap.meta.textContent = [p.categoryKo, p.year].filter(Boolean).join(', ');
      cap.medium.textContent = (p.stack || []).join(', ');
      if (!first) {
        cap.box.classList.remove('is-swap');
        void cap.box.offsetWidth;
        cap.box.classList.add('is-swap');
      }
    }

    function tick(now) {
      const dt = Math.min(64, now - last) / 16.667;
      last = now;
      let moving = !!drag;
      if (!drag) {
        const d = target - t;
        if (Math.abs(d) > 0.0004) { t += d * (1 - Math.pow(1 - 0.075, dt)); moving = true; } else t = target;
        if (!introDone && Math.abs(target - t) < 0.02) introDone = true;
      } else introDone = true;
      const dx = tmx - mx, dy = tmy - my;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        const k = 1 - Math.pow(1 - 0.06, dt);
        mx += dx * k; my += dy * k; moving = true;
      }
      apply();
      if (moving) requestAnimationFrame(tick); else running = false;
    }
    function kick() {
      if (running) return;
      running = true; last = performance.now();
      requestAnimationFrame(tick);
    }

    function go(delta) { target = Math.round(target) + delta; kick(); schedule(); }
    function goTo(i) {
      const base = Math.round(target);
      let diff = i - mod(base, N);
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      target = base + diff; kick(); schedule();
    }

    /* 자동 넘김 */
    function restartTimerBar(run) {
      if (!cap.timer) return;
      cap.timer.classList.remove('is-run', 'is-paused');
      void cap.timer.offsetWidth;
      if (run) cap.timer.classList.add('is-run');
    }
    function schedule() {
      clearTimeout(autoTimer);
      const ok = !reduced() && inView && !doc.hidden && !hover && !drag;
      restartTimerBar(ok);
      if (ok) autoTimer = setTimeout(() => go(1), AUTO);
    }
    function pause() {
      clearTimeout(autoTimer);
      if (cap.timer) cap.timer.classList.add('is-paused');
    }

    /* 드래그 / 스와이프 */
    const unit = () => (mode === 'orbit' ? W * 0.4 : cw * 0.85);
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, t0: t, moved: false, id: e.pointerId, lx: e.clientX, lt: performance.now(), v: 0 };
      pause();
    });
    stage.addEventListener('pointermove', (e) => {
      if (mode === 'orbit' && mq.fine.matches && !reduced()) {
        const r = stage.getBoundingClientRect();
        tmx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
        tmy = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
        kick();
      }
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        drag.moved = true;
        try { stage.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
        stage.classList.add('is-dragging');
      }
      if (drag.moved) {
        t = drag.t0 - dx / unit();
        target = t;
        const now = performance.now();
        const dtm = now - drag.lt;
        if (dtm > 0) drag.v = 0.7 * drag.v + 0.3 * ((e.clientX - drag.lx) / dtm);
        drag.lx = e.clientX; drag.lt = now;
        kick();
      }
    });
    function endDrag(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      stage.classList.remove('is-dragging');
      if (d.moved) {
        const fling = clamp((-d.v * 180) / unit(), -1.6, 1.6);
        target = Math.round(t + fling);
        kick();
      } else if (!cancelled) {
        const card = e.target.closest('.g-card');
        if (card) {
          const i = +card.getAttribute('data-i');
          if (i === focus) onOpen(i, card); else goTo(i);
        }
      }
      schedule();
    }
    stage.addEventListener('pointerup', (e) => endDrag(e, false));
    stage.addEventListener('pointercancel', (e) => endDrag(e, true));
    // 보조기기(가상 클릭) 대응
    stage.addEventListener('click', (e) => {
      if (e.detail !== 0) return;
      const card = e.target.closest('.g-card');
      if (card) onOpen(+card.getAttribute('data-i'), card);
    });
    stage.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; pause(); } });
    stage.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') { hover = false; tmx = 0; tmy = 0; kick(); schedule(); }
    });
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('g-card')) { e.preventDefault(); onOpen(focus, e.target); }
    });
    $('[data-prev]') && $('[data-prev]').addEventListener('click', () => go(-1));
    $('[data-next]') && $('[data-next]').addEventListener('click', () => go(1));

    /* 화면 밖이거나 탭이 숨겨지면 멈춤 */
    new IntersectionObserver((ents) => {
      inView = ents[0].isIntersecting;
      if (inView) schedule(); else pause();
    }, { threshold: 0.15 }).observe(stage);
    doc.addEventListener('visibilitychange', () => (doc.hidden ? pause() : schedule()));

    let rz = 0;
    window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measure, 120); });
    mq.desk.addEventListener && mq.desk.addEventListener('change', measure);

    measure();
    kick();
    schedule();

    return {
      setScroll(s) {
        // 데스크톱에서 첫 화면을 스크롤해 내려갈 때 궤도가 함께 돌아갑니다.
        const ns = mode === 'orbit' && !reduced() ? s : 0;
        if (Math.abs(ns - tilt) < 0.0005) return;
        tilt = ns; scrollOff = ns * 1.2;
        kick();
      },
    };
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
    const hero = $('.hero');
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
      if (mcta && hero) mcta.classList.toggle('is-on', y > hero.offsetHeight * 0.75 && !contactVisible);
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
  function setupChapters(gallery) {
    const hero = $('.hero');
    if (hero && gallery) {
      scrollHooks.push(() => {
        const h = hero.offsetHeight;
        gallery.setScroll(clamp(window.scrollY / Math.max(1, h), 0, 1));
      });
    }

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
        let kind = host.getAttribute('data-cursor');
        if (kind === 'drag' && e.target.closest('.g-card[tabindex="0"]')) kind = 'view';
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
