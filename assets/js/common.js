/* =========================================================
   안양시학원연합회 공통 스크립트
   - 헤더, 푸터, 서브 상단, 게시판 목록·상세, 팝업
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 메뉴 ---------- */
  var NAV = [
    { title: "연합회소개", items: [
      ["회장인사말", "greeting.html"],
      ["역대회장", "presidents.html"],
      ["설립목적", "purpose.html"],
      ["조직", "organization.html"],
      ["오시는길", "location.html"]
    ]},
    { title: "소통마당", items: [
      ["분과 소식", "divisions.html"],
      ["정회원전용", "members-only.html"]
    ]},
    { title: "교육관리", items: [
      ["학원자율정화위원회", "committee.html"],
      ["법정의무교육", "legal-education.html"],
      ["설립·운영자 연수", "training.html"]
    ]},
    { title: "알림마당", items: [
      ["공지사항", "notice.html"],
      ["행사 소식", "events.html"],
      ["협력업체", "partners.html"]
    ]},
    { title: "AMC 경시대회", items: [
      ["시험 안내", "amc.html"],
      ["접수확인·수험표", "amc-ticket.html"],
      ["성적조회", "amc-score.html"],
      ["기출문제", "amc-past.html"],
      ["지정 접수처", "amc-centers.html"]
    ]}
  ];

  /* 게시판 상세에서 목록으로 돌아갈 페이지 */
  var BOARD_PAGE = {
    notice: "notice.html",
    events: "events.html",
    divisions: "divisions.html",
    training: "training.html",
    legal: "legal-education.html",
    amcPast: "amc-past.html"
  };

  var S = window.SITE || {};
  var here = location.pathname.split("/").pop() || "index.html";
  if (here.indexOf(".") === -1) here += ".html"; /* GitHub Pages 의 확장자 없는 주소 대응 */

  /* ---------- 도우미 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmtDate(d) { return d ? d.replace(/-/g, ".") : ""; }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function telHref(t) { return "tel:" + String(t).replace(/[^0-9]/g, ""); }
  function sortPosts(posts) {
    return posts.slice().sort(function (a, b) {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return b.date.localeCompare(a.date) || b.id - a.id;
    });
  }
  function findSection(page) {
    for (var i = 0; i < NAV.length; i++) {
      for (var j = 0; j < NAV[i].items.length; j++) {
        if (NAV[i].items[j][1] === page) return { sec: NAV[i], item: NAV[i].items[j] };
      }
    }
    return null;
  }
  function divisionLabel(key) {
    var d = (window.DIVISIONS || []).filter(function (x) { return x.key === key; })[0];
    return d ? d.label : key;
  }

  /* ---------- 헤더 ---------- */
  function renderHeader() {
    var gnb = NAV.map(function (sec) {
      var active = sec.items.some(function (it) { return it[1] === here; });
      return '<li class="gnb-item' + (active ? " is-active" : "") + '">' +
        '<a class="gnb-link" href="' + sec.items[0][1] + '">' + esc(sec.title) + '</a>' +
        '<ul class="gnb-sub">' + sec.items.map(function (it) {
          return '<li><a href="' + it[1] + '"' + (it[1] === here ? ' aria-current="page"' : "") + '>' + esc(it[0]) + '</a></li>';
        }).join("") + '</ul></li>';
    }).join("");

    var drawer = NAV.map(function (sec, i) {
      return '<div class="drawer-sec">' +
        '<button class="drawer-toggle" type="button" aria-expanded="false" aria-controls="dsub' + i + '">' + esc(sec.title) + '</button>' +
        '<ul class="drawer-sub" id="dsub' + i + '" hidden>' + sec.items.map(function (it) {
          return '<li><a href="' + it[1] + '">' + esc(it[0]) + '</a></li>';
        }).join("") + '</ul></div>';
    }).join("");

    var header = el(
      '<div class="site-top">' +
        '<a class="skip" href="#main">본문 바로가기</a>' +
        '<div class="utilbar"><div class="wrap">' +
          '<a href="join.html">정회원 입회 신청</a>' +
          '<a href="login.html">로그인</a>' +
        '</div></div>' +
        '<header class="site-header"><div class="wrap">' +
          '<a class="brand" href="index.html" aria-label="' + esc(S.name) + ' 홈">' +
            '<span class="brand-seal" aria-hidden="true">安</span>' +
            '<span class="brand-text"><span class="brand-pre">사단법인</span><span class="brand-name">' + esc(S.shortName) + '</span></span>' +
          '</a>' +
          '<nav class="gnb" aria-label="주 메뉴"><ul>' + gnb + '</ul></nav>' +
          '<button class="menu-btn" type="button" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>' +
        '</div></header>' +
        '<div class="drawer" id="drawer" hidden>' +
          '<div class="drawer-panel" role="dialog" aria-label="전체 메뉴">' +
            '<div class="drawer-head"><strong>' + esc(S.shortName) + '</strong>' +
            '<button class="drawer-close" type="button" aria-label="메뉴 닫기">닫기</button></div>' +
            drawer +
            '<div class="drawer-util"><a href="join.html">정회원 입회 신청</a><a href="login.html">로그인</a></div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    document.body.insertBefore(header, document.body.firstChild);

    var btn = header.querySelector(".menu-btn");
    var drawerEl = header.querySelector(".drawer");
    function openDrawer(open) {
      drawerEl.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("no-scroll", open);
      if (open) header.querySelector(".drawer-close").focus();
      else btn.focus();
    }
    btn.addEventListener("click", function () { openDrawer(true); });
    header.querySelector(".drawer-close").addEventListener("click", function () { openDrawer(false); });
    drawerEl.addEventListener("click", function (e) { if (e.target === drawerEl) openDrawer(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawerEl.hidden) openDrawer(false); });
    header.querySelectorAll(".drawer-toggle").forEach(function (t) {
      t.addEventListener("click", function () {
        var sub = document.getElementById(t.getAttribute("aria-controls"));
        var open = t.getAttribute("aria-expanded") !== "true";
        t.setAttribute("aria-expanded", String(open));
        sub.hidden = !open;
      });
    });
  }

  /* ---------- 서브 페이지 상단 ---------- */
  function renderPageHead() {
    var main = document.getElementById("main");
    if (!main || document.body.dataset.page === "home") return;
    var page = document.body.dataset.nav || here;
    var found = findSection(page);
    var title = document.body.dataset.title || (found ? found.item[0] : document.title.split("|")[0].trim());
    var secTitle = found ? found.sec.title : (document.body.dataset.section || "");
    var tabs = found ? '<nav class="tabs" aria-label="' + esc(secTitle) + ' 하위 메뉴"><div class="wrap"><ul>' +
      found.sec.items.map(function (it) {
        return '<li><a href="' + it[1] + '"' + (it[1] === page ? ' aria-current="page"' : "") + '>' + esc(it[0]) + '</a></li>';
      }).join("") + '</ul></div></nav>' : "";
    var head = el(
      '<div class="page-head">' +
        '<div class="wrap page-head-inner">' +
          (secTitle ? '<p class="page-sec">' + esc(secTitle) + '</p>' : "") +
          '<h1 class="page-title">' + esc(title) + '</h1>' +
        '</div>' + tabs +
      '</div>'
    );
    main.insertBefore(head, main.firstChild);
    /* 모바일에서 현재 탭이 화면 밖에 있으면 보이도록 스크롤 */
    var cur = head.querySelector(".tabs a[aria-current]");
    if (cur) {
      var ul = cur.closest("ul");
      ul.scrollLeft = cur.offsetLeft - (ul.clientWidth - cur.offsetWidth) / 2;
    }
  }

  /* ---------- 푸터 ---------- */
  function renderFooter() {
    var banners = (S.banners || []).map(function (b) {
      return '<a href="' + esc(b.url) + '" target="_blank" rel="noopener">' + esc(b.name) + '</a>';
    }).join("");
    var footer = el(
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="footer-brand">' +
          '<span class="brand-seal" aria-hidden="true">安</span>' +
          '<p><strong>' + esc(S.name) + '</strong><br>' + esc(S.address) + '</p>' +
        '</div>' +
        '<dl class="footer-info">' +
          '<div><dt>전화</dt><dd><a href="' + telHref(S.tel) + '">' + esc(S.tel) + '</a></dd></div>' +
          '<div><dt>이메일</dt><dd><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a></dd></div>' +
          '<div><dt>사무국</dt><dd>' + esc(S.hours) + '</dd></div>' +
          '<div><dt>개인정보보호책임자</dt><dd>' + esc(S.privacyOfficer) + '</dd></div>' +
        '</dl>' +
        '<div class="footer-links">' +
          '<a href="privacy.html"><strong>개인정보처리방침</strong></a>' +
          '<a href="terms.html">이용약관</a>' +
          '<a href="terms.html#email">이메일무단수집거부</a>' +
          (banners ? '<span class="footer-sep" aria-hidden="true"></span>' + banners : "") +
        '</div>' +
        '<p class="copy">© ' + new Date().getFullYear() + ' ' + esc(S.name) + '</p>' +
      '</div></footer>'
    );
    document.body.appendChild(footer);
  }

  /* ---------- 팝업 ---------- */
  function renderPopup() {
    var p = S.popup;
    if (!p || !p.enabled || document.body.dataset.page !== "home") return;
    var key = "aaoh-popup-" + p.id;
    try { if (localStorage.getItem(key) && Number(localStorage.getItem(key)) > Date.now()) return; } catch (e) {}
    var box = el(
      '<div class="popup" role="dialog" aria-labelledby="popup-title">' +
        '<div class="popup-body">' +
          '<h2 id="popup-title">' + esc(p.title) + '</h2>' +
          '<p>' + esc(p.text) + '</p>' +
          (p.link ? '<a class="btn btn-primary" href="' + esc(p.link) + '">' + esc(p.linkText || "자세히 보기") + '</a>' : "") +
        '</div>' +
        '<div class="popup-foot">' +
          '<label><input type="checkbox" class="popup-hide"> 오늘 하루 보지 않기</label>' +
          '<button type="button" class="popup-close">닫기</button>' +
        '</div>' +
      '</div>'
    );
    document.body.appendChild(box);
    box.querySelector(".popup-close").addEventListener("click", function () {
      if (box.querySelector(".popup-hide").checked) {
        try { localStorage.setItem(key, String(Date.now() + 864e5)); } catch (e) {}
      }
      box.remove();
    });
  }

  /* ---------- 게시판 목록 ---------- */
  function renderBoard(boardKey, target, opts) {
    opts = opts || {};
    var board = window.BOARDS[boardKey];
    var root = typeof target === "string" ? document.querySelector(target) : target;
    if (!board || !root) return;
    var size = opts.pageSize || 15;
    var cat = qs("cat") || "";
    var q = (qs("q") || "").trim();
    var page = Math.max(1, parseInt(qs("page") || "1", 10));

    var posts = sortPosts(board.posts).filter(function (p) {
      return (!cat || p.cat === cat) && (!q || p.title.indexOf(q) > -1);
    });
    var total = posts.length;
    var pages = Math.max(1, Math.ceil(total / size));
    page = Math.min(page, pages);
    var slice = posts.slice((page - 1) * size, page * size);

    function link(params) {
      var u = new URLSearchParams(location.search);
      Object.keys(params).forEach(function (k) {
        if (params[k] === "" || params[k] == null) u.delete(k); else u.set(k, params[k]);
      });
      var s = u.toString();
      return here + (s ? "?" + s : "");
    }

    var html = "";
    if (opts.categories) {
      html += '<div class="chips" role="list">' +
        '<a role="listitem" class="chip' + (!cat ? " is-on" : "") + '" href="' + link({ cat: "", page: "" }) + '">전체</a>' +
        opts.categories.map(function (c) {
          return '<a role="listitem" class="chip' + (cat === c.key ? " is-on" : "") + '" href="' + link({ cat: c.key, page: "" }) + '">' + esc(c.label) + '</a>';
        }).join("") + '</div>';
    }

    html += '<div class="board-bar"><p class="board-count">전체 <strong>' + total + '</strong>건</p>' +
      '<form class="board-search" role="search" action="' + here + '">' +
        (cat ? '<input type="hidden" name="cat" value="' + esc(cat) + '">' : "") +
        '<label class="sr-only" for="bq">제목 검색</label>' +
        '<input id="bq" name="q" type="search" placeholder="제목으로 찾기" value="' + esc(q) + '">' +
        '<button type="submit" class="btn btn-line">검색</button>' +
      '</form></div>';

    if (!slice.length) {
      html += '<p class="empty">' + (q ? "‘" + esc(q) + "’이(가) 들어간 글이 없습니다. 다른 낱말로 찾아보세요." : "아직 등록된 글이 없습니다.") + '</p>';
    } else if (opts.gallery) {
      html += '<ul class="gallery">' + slice.map(function (p) {
        var d = p.date.split("-");
        var thumb = p.thumb
          ? '<img src="' + esc(p.thumb) + '" alt="" loading="lazy">'
          : '<span class="plate" aria-hidden="true"><span class="plate-y">' + d[0] + '</span><span class="plate-md">' + Number(d[1]) + '.' + Number(d[2]) + '</span></span>';
        return '<li><a href="post.html?b=' + boardKey + '&id=' + p.id + '">' +
          '<span class="gallery-thumb">' + thumb + '</span>' +
          '<span class="gallery-title">' + esc(p.title) + '</span>' +
          '<time datetime="' + p.date + '">' + fmtDate(p.date) + '</time></a></li>';
      }).join("") + '</ul>';
    } else if (board.course) {
      html += '<div class="table-wrap"><table class="table course"><caption class="sr-only">' + esc(board.title) + ' 과정 목록</caption>' +
        '<thead><tr><th scope="col">과정명</th><th scope="col">신청기간</th><th scope="col">교육기간</th><th scope="col">교육장소</th></tr></thead><tbody>' +
        slice.map(function (p) {
          return '<tr' + (p.pinned ? ' class="is-pinned"' : "") + '><td class="t-title"><a href="post.html?b=' + boardKey + '&id=' + p.id + '">' +
            (p.pinned ? '<span class="tag">진행</span>' : "") + esc(p.title) + '</a></td>' +
            '<td data-label="신청기간">' + esc(p.apply) + '</td><td data-label="교육기간">' + esc(p.period) + '</td><td data-label="교육장소">' + esc(p.place) + '</td></tr>';
        }).join("") + '</tbody></table></div>';
    } else {
      html += '<ul class="list">' + slice.map(function (p) {
        return '<li' + (p.pinned ? ' class="is-pinned"' : "") + '><a href="post.html?b=' + boardKey + '&id=' + p.id + '">' +
          (p.pinned ? '<span class="tag">공지</span>' : "") +
          (p.cat && opts.showCat ? '<span class="list-cat">' + esc(divisionLabel(p.cat)) + '</span>' : "") +
          '<span class="list-title">' + esc(p.title) + '</span>' +
          '<time datetime="' + p.date + '">' + fmtDate(p.date) + '</time></a></li>';
      }).join("") + '</ul>';
    }

    if (pages > 1) {
      html += '<nav class="pager" aria-label="페이지">';
      for (var i = 1; i <= pages; i++) {
        html += i === page
          ? '<span aria-current="page">' + i + '</span>'
          : '<a href="' + link({ page: i }) + '">' + i + '</a>';
      }
      html += '</nav>';
    }
    root.innerHTML = html;
  }

  /* ---------- 게시글 상세 ---------- */
  function renderPost(target) {
    var root = document.querySelector(target);
    var key = qs("b");
    var id = Number(qs("id"));
    var board = window.BOARDS[key];
    var post = board && board.posts.filter(function (p) { return p.id === id; })[0];
    if (!post) {
      root.innerHTML = '<p class="empty">찾는 글이 없습니다. 주소가 바뀌었거나 삭제된 글일 수 있습니다.</p><p class="center"><a class="btn btn-line" href="notice.html">공지사항으로 가기</a></p>';
      return;
    }
    document.body.dataset.nav = BOARD_PAGE[key];
    document.title = post.title + " | " + S.shortName;

    var list = sortPosts(board.posts).filter(function (p) { return !p.pinned; });
    var idx = list.indexOf(post);
    var newer = idx > 0 ? list[idx - 1] : null;
    var older = idx > -1 && idx < list.length - 1 ? list[idx + 1] : null;

    var meta = '<time datetime="' + post.date + '">' + fmtDate(post.date) + '</time>';
    if (post.cat) meta = '<span>' + esc(divisionLabel(post.cat)) + '</span>' + meta;
    var course = board.course
      ? '<dl class="course-meta"><div><dt>신청기간</dt><dd>' + esc(post.apply) + '</dd></div><div><dt>교육기간</dt><dd>' + esc(post.period) + '</dd></div><div><dt>교육장소</dt><dd>' + esc(post.place) + '</dd></div></dl>'
      : "";
    var body = post.body
      ? post.body
      : '<p class="pending">본문은 기존 홈페이지 자료를 옮기는 대로 올라옵니다.</p>';

    root.innerHTML =
      '<article class="post">' +
        '<header class="post-head"><p class="post-board">' + esc(board.title) + '</p>' +
        '<h2 class="post-title">' + esc(post.title) + '</h2><p class="post-meta">' + meta + '</p></header>' +
        course +
        '<div class="post-body">' + body + '</div>' +
        (post.files && post.files.length ? '<ul class="post-files">' + post.files.map(function (f) {
          return '<li><a href="' + esc(f.url) + '" download>' + esc(f.name) + '</a></li>';
        }).join("") + '</ul>' : "") +
      '</article>' +
      '<nav class="post-nav" aria-label="이전 글, 다음 글">' +
        (newer ? '<a href="post.html?b=' + key + '&id=' + newer.id + '"><span>다음 글</span>' + esc(newer.title) + '</a>' : "") +
        (older ? '<a href="post.html?b=' + key + '&id=' + older.id + '"><span>이전 글</span>' + esc(older.title) + '</a>' : "") +
      '</nav>' +
      '<p class="center"><a class="btn btn-line" href="' + BOARD_PAGE[key] + '">목록으로</a></p>';
  }

  /* ---------- 메인 최신글 ---------- */
  function renderLatest(boardKey, target, count) {
    var root = document.querySelector(target);
    if (!root) return;
    var posts = window.BOARDS[boardKey].posts.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date) || b.id - a.id;
    }).slice(0, count || 5);
    root.innerHTML = posts.map(function (p) {
      return '<li><a href="post.html?b=' + boardKey + '&id=' + p.id + '"><span class="list-title">' + esc(p.title) + '</span>' +
        '<time datetime="' + p.date + '">' + fmtDate(p.date) + '</time></a></li>';
    }).join("");
  }

  window.AAOH = {
    NAV: NAV, esc: esc, fmtDate: fmtDate, qs: qs,
    renderBoard: renderBoard, renderPost: renderPost, renderLatest: renderLatest,
    divisionLabel: divisionLabel
  };

  /* 게시글 상세는 헤더를 그리기 전에 현재 메뉴를 정해야 합니다 */
  if (document.body.dataset.page === "post") {
    var k = qs("b");
    if (BOARD_PAGE[k]) { document.body.dataset.nav = BOARD_PAGE[k]; here = BOARD_PAGE[k]; }
  }

  renderHeader();
  renderPageHead();
  renderFooter();
  renderPopup();
})();
