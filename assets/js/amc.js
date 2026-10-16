/* =========================================================
   AMC 수험표·성적 조회
   ---------------------------------------------------------
   학생 개인정보가 들어 있으므로 응시자·성적 데이터는
   이 저장소(GitHub)에 절대 올리지 않습니다.
   조회 데이터베이스(Firebase 등)를 연결할 때 아래처럼
   window.AMC_API 를 정의하면 됩니다.

   window.AMC_API = {
     ticket: function (name, phone) { return Promise.resolve(record 또는 null) },
     score:  function (name, examNo) { return Promise.resolve(record 또는 null) }
   };

   record 예시
   { examNo: "24125020", name: "홍길동", grade: "중1",
     room: "신성중학교 2층 3반", score: 96, award: "금상" }
   ========================================================= */
(function () {
  "use strict";
  var A = window.AMC, S = window.SITE, esc = window.AAOH.esc;

  function show(box, html, tone) {
    box.hidden = false;
    box.dataset.tone = tone || "";
    box.innerHTML = html;
  }

  function closedMsg(kind) {
    return kind === "ticket"
      ? "지금은 수험표 조회 기간이 아닙니다. 수험표 교부 기간: " + esc(A.ticketPeriod)
      : "지금은 성적 조회 기간이 아닙니다. 성적이 공개되면 공지사항으로 알려 드립니다.";
  }

  function notFound() {
    return "입력한 정보와 일치하는 응시 내역이 없습니다. 이름과 번호를 다시 확인하고, 그래도 안 되면 사무국(" +
      '<a href="tel:' + S.tel.replace(/[^0-9]/g, "") + '">' + esc(S.tel) + "</a>)으로 문의해 주세요.";
  }

  function ticketHtml(r) {
    return '<div class="ticket">' +
      '<div class="ticket-head">' + esc(A.round) + ' 수험표</div>' +
      '<dl>' +
        '<dt>수험번호</dt><dd class="ticket-no">' + esc(r.examNo) + '</dd>' +
        '<dt>성명</dt><dd>' + esc(r.name) + '</dd>' +
        '<dt>학년</dt><dd>' + esc(r.grade || "") + '</dd>' +
        '<dt>시험장</dt><dd>' + esc(r.room || A.place) + '</dd>' +
        '<dt>시험일시</dt><dd>' + esc(A.examDate) + '</dd>' +
        '<dt>입실</dt><dd>' + esc(A.checkIn) + '</dd>' +
      '</dl></div>' +
      '<p class="center no-print" style="margin-top:16px"><button type="button" class="btn btn-navy" onclick="window.print()">수험표 인쇄</button></p>';
  }

  function scoreHtml(r) {
    return '<div class="ticket">' +
      '<div class="ticket-head">' + esc(A.round) + ' 성적</div>' +
      '<dl>' +
        '<dt>수험번호</dt><dd>' + esc(r.examNo) + '</dd>' +
        '<dt>성명</dt><dd>' + esc(r.name) + '</dd>' +
        '<dt>학년</dt><dd>' + esc(r.grade || "") + '</dd>' +
        '<dt>점수</dt><dd class="ticket-no">' + esc(r.score) + ' <small style="font-size:15px;color:var(--muted)">/ 120점</small></dd>' +
        (r.award ? '<dt>시상</dt><dd>' + esc(r.award) + '</dd>' : '') +
      '</dl></div>' +
      '<p class="center no-print" style="margin-top:16px"><button type="button" class="btn btn-navy" onclick="window.print()">성적표 인쇄</button></p>';
  }

  window.AMC_LOOKUP = function (kind, form, box) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var key = form.elements.key.value.trim();
      if (!name || !key) {
        show(box, "이름과 " + (kind === "ticket" ? "학부모 휴대폰번호" : "수험번호") + "를 모두 입력해 주세요.");
        return;
      }
      var open = kind === "ticket" ? A.ticketOpen : A.scoreOpen;
      if (!open || !window.AMC_API || !window.AMC_API[kind]) {
        show(box, closedMsg(kind));
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "조회 중";
      window.AMC_API[kind](name, key).then(function (r) {
        if (!r) show(box, notFound());
        else show(box, kind === "ticket" ? ticketHtml(r) : scoreHtml(r), "ok");
      }).catch(function () {
        show(box, "조회 서버에 연결하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      }).then(function () {
        btn.disabled = false;
        btn.textContent = "조회하기";
      });
    });
  };
})();
