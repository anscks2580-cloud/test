/* ==========================================================================
   PAPERTOV — 포트폴리오 미리보기 디자인
   --------------------------------------------------------------------------
   실제 스크린샷(site-data.js 의 images)이 없을 때 목업 안에 보여주는
   축소판 화면입니다. 각 화면은 데스크톱 배치가 기본이며, 휴대폰 목업 안에서는
   (.screen.is-phone) 휴대폰 배치로 바뀝니다. 모든 크기는 cqw 단위라
   목업 크기가 달라져도 비율이 그대로 유지됩니다.
   ========================================================================== */

(function () {
  'use strict';

  /* 공통 조각 ------------------------------------------------------------- */
  const burger = '<span class="p-burger" aria-hidden="true"><i></i><i></i></span>';

  // 측면 세단 실루엣 (일반적인 형태의 선화)
  const sedan = (cls) => `
    <svg class="${cls}" viewBox="0 0 400 130" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
      <path d="M386 100 L356 100 A26 26 0 0 0 304 100 L114 100 A26 26 0 0 0 62 100 L14 100 L14 88 C14 82 20 78 30 77 L96 71 C124 50 156 40 196 38 C236 36 268 44 298 62 L352 68 C372 71 384 79 386 88 Z"/>
      <path d="M112 71 C136 54 162 47 196 46 C230 45 256 51 280 64 Z"/>
      <path d="M196 46 L193 70"/>
      <path d="M34 84 L378 82" opacity=".55"/>
      <path d="M366 76 L381 80"/>
      <circle cx="330" cy="100" r="20"/><circle cx="330" cy="100" r="8"/>
      <circle cx="88" cy="100" r="20"/><circle cx="88" cy="100" r="8"/>
    </svg>`;

  const P = {};

  /* 01 · 수입차 딜러 (브론즈·명조) ----------------------------------------- */
  P.benz = () => `
  <div class="pv pv-benz" aria-hidden="true">
    <div class="p-nav">
      <span class="p-logo">PRIVATE SALES</span>
      <span class="p-menu"><span>모델</span><span>프로모션</span><span>출고 후기</span><span class="p-cta">상담 신청</span></span>
      ${burger}
    </div>
    <div class="p-hero">
      <div class="p-copy">
        <span class="p-kicker">OFFICIAL SALES CONSULTANT</span>
        <h4 class="p-h">첫 벤츠의 시작부터<br>출고 이후까지.</h4>
        <p class="p-p">견적과 금융, 출고 뒤의 관리까지<br>한 사람이 끝까지 안내합니다.</p>
        <div class="p-btns"><span class="p-btn">상담 신청하기</span><span class="p-btn o">출고 영상 보기</span></div>
        <div class="p-models"><span>E-CLASS</span><span>S-CLASS</span><span>GLE</span><span>EQE</span></div>
      </div>
      <div class="p-photo">
        ${sedan('p-car')}
        <span class="p-tag">2026 PROMOTION<b>이달의 출고 혜택</b></span>
      </div>
    </div>
    <div class="p-sec">
      <div><span class="p-kicker">YOUTUBE</span><h4 class="p-h2">출고 현장을<br>영상으로 먼저 보세요</h4></div>
      <div class="p-vids">
        <div><div class="p-vid"></div><p class="p-vcap">E300 4MATIC 출고 브이로그<small>조회수 1.2만회</small></p></div>
        <div><div class="p-vid v2"></div><p class="p-vcap">리스와 할부, 무엇이 유리할까<small>조회수 8.4천회</small></p></div>
        <div><div class="p-vid v3"></div><p class="p-vcap">GLE 쿠페 실내 리뷰<small>조회수 6.1천회</small></p></div>
      </div>
    </div>
  </div>`;

  /* 02 · 필라테스 (흑백·세로선) ------------------------------------------- */
  P.line = () => `
  <div class="pv pv-line" aria-hidden="true">
    <span class="p-axis"></span>
    <div class="p-nav">
      <span class="p-logo"><i></i>LINE PILATES</span>
      <span class="p-menu"><span>ABOUT</span><span>CLASS</span><span>TEACHER</span><span>CONTACT</span></span>
      ${burger}
    </div>
    <div class="p-hero">
      <div class="p-left">
        <h4 class="p-h">Find<br>your<br>center.</h4>
        <p class="p-sub">바른 정렬에서 시작하는 움직임</p>
      </div>
      <div class="p-right">
        <div class="p-img"><i></i></div>
        <span class="p-vert">STUDIO, DONGTAN</span>
      </div>
    </div>
    <div class="p-classes">
      <div class="p-row"><span class="p-name">Private</span><span class="p-det">1:1 맞춤 수업 · 50분<br>체형 분석 후 프로그램 설계</span></div>
      <div class="p-row"><span class="p-name">Duet</span><span class="p-det">2인 수업 · 50분<br>함께 시작하는 기구 필라테스</span></div>
      <div class="p-row"><span class="p-name">Group</span><span class="p-det">최대 4인 · 50분<br>리포머, 체어, 바렐</span></div>
    </div>
  </div>`;

  /* 03 · 웨딩드레스 (로고만 있는 첫 화면) ---------------------------------- */
  P.atelier = () => `
  <div class="pv pv-atelier" aria-hidden="true">
    <div class="p-hero">
      ${burger}
      <span class="p-mark">ATELIER</span>
      <span class="p-mark-sub">COUTURE BRIDAL · CHEONGDAM</span>
      <span class="p-scroll"></span>
    </div>
    <div class="p-seasons">
      <div class="p-season"><div><h5>Spring / Summer</h5><small>2026 COLLECTION</small></div>
        <div class="p-strip"><i class="p-dress d1"></i><i class="p-dress d2"></i><i class="p-dress d3"></i><i class="p-dress d4"></i></div></div>
      <div class="p-season"><div><h5>Fall / Winter</h5><small>2025 COLLECTION</small></div>
        <div class="p-strip"><i class="p-dress d3"></i><i class="p-dress d1"></i><i class="p-dress d4"></i><i class="p-dress d2"></i></div></div>
      <div class="p-season"><div><h5>Signature</h5><small>ATELIER LINE</small></div>
        <div class="p-strip"><i class="p-dress d2"></i><i class="p-dress d4"></i><i class="p-dress d1"></i><i class="p-dress d3"></i></div></div>
    </div>
  </div>`;

  /* 04 · 수입차 딜러 플랫폼 (관리자·재고) ----------------------------------- */
  P.bmw = () => `
  <div class="pv pv-bmw" aria-hidden="true">
    <div class="p-nav">
      <span class="p-logo"><i></i>SALES ADVISOR</span>
      <span class="p-menu"><span>즉시 출고</span><span>프로모션</span><span>서비스 예약</span><span>전기차 보조금</span><span class="p-admin">관리자</span></span>
      ${burger}
    </div>
    <div class="p-toolbar"><em>관리자 모드</em><span>사진 변경</span><span>프로모션 수정</span><b>저장</b></div>
    <div class="p-hero">
      <div>
        <h4 class="p-h">즉시 출고 가능한 차량,<br>지금 바로 확인하세요.</h4>
        <p class="p-p">재고는 매일 오전 업데이트됩니다.</p>
      </div>
      <div class="p-photo">${sedan('p-car')}<span class="p-chip">사진 변경</span></div>
    </div>
    <div class="p-inv">
      <div class="p-invhead"><h5>즉시 출고 재고</h5><span class="p-count">340개 조합</span><span class="p-search">모델명, 색상 검색</span><span class="p-upload">엑셀 업로드</span></div>
      <div class="p-group">
        <div class="p-ghead"><span>5 Series</span><em>58 ▾</em></div>
        <div class="p-rowi"><span>520i M Sport</span><span><i class="p-sw" style="background:#f4f4f2"></i>Alpine White</span><span>Black Vernasca</span></div>
        <div class="p-rowi"><span>530e xDrive</span><span><i class="p-sw" style="background:#1d2230"></i>Black Sapphire</span><span>Cognac</span></div>
        <div class="p-rowi"><span>i5 eDrive40</span><span><i class="p-sw" style="background:#6b7079"></i>Brooklyn Grey</span><span>Oyster</span></div>
      </div>
      <div class="p-group"><div class="p-ghead"><span>3 Series</span><em>42 ▸</em></div></div>
      <div class="p-group"><div class="p-ghead"><span>X3</span><em>36 ▸</em></div></div>
      <div class="p-group"><div class="p-ghead"><span>X5</span><em>27 ▸</em></div></div>
    </div>
  </div>`;

  /* 05 · 웨딩 스냅 (갤러리) ---------------------------------------------- */
  P.snap = () => `
  <div class="pv pv-snap" aria-hidden="true">
    <div class="p-hero">
      <div class="p-nav">
        <span class="p-logo">SNAP STUDIO</span>
        <span class="p-menu"><span>ABOUT</span><span>GALLERY</span><span>PACKAGE</span><span>RESERVE</span></span>
        ${burger}
      </div>
      <div class="p-title"><h4>Moments, gently kept.</h4><p>가장 자연스러운 하루를 기록합니다</p></div>
    </div>
    <div class="p-gal">
      <div class="p-galhead"><h5>Gallery</h5><span class="p-tabs"><b>전체</b><span>호텔</span><span>하우스</span><span>채플</span><span>야외</span></span></div>
      <div class="p-cols">
        <div class="p-ph r34 t1"><span>라시따시어터</span><i>SNAP</i></div>
        <div class="p-ph r43 t2"><span>조선팰리스</span><i>SNAP</i></div>
        <div class="p-ph r11 t3"><span>크레스트72</span><i>SNAP</i></div>
        <div class="p-ph r43 t4"><span>락고재</span><i>SNAP</i></div>
        <div class="p-ph r34 t5"><span>드레스가든</span><i>SNAP</i></div>
        <div class="p-ph r11 t6"><span>H스퀘어</span><i>SNAP</i></div>
        <div class="p-ph r34 t2"><span>포어클락</span><i>SNAP</i></div>
        <div class="p-ph r43 t1"><span>그랜드힐</span><i>SNAP</i></div>
      </div>
    </div>
  </div>`;

  /* 06 · 강아지 수제간식 (노랑·우드) --------------------------------------- */
  P.bakery = () => `
  <div class="pv pv-bakery" aria-hidden="true">
    <div class="p-nav">
      <span class="p-logo"><i></i>dog bakery</span>
      <span class="p-menu"><span>수제 이야기</span><span>케이크</span><span>수제간식</span><span>리뷰</span><span>오시는 길</span></span>
      ${burger}
    </div>
    <div class="p-hero">
      <div class="p-copy">
        <h4 class="p-h">오늘 아침 구운<br>우리 아이 케이크</h4>
        <p class="p-p">사람이 먹어도 되는 재료로, 매일 조금씩 굽습니다.</p>
        <span class="p-btn">케이크 주문하기</span>
      </div>
      <div class="p-art">
        <span class="p-sun"></span>
        <span class="p-plate"></span>
        <span class="p-cake">
          <i class="p-candle"></i>
          <i class="p-bone"></i>
          <i class="p-tier2"></i>
          <i class="p-tier1"></i>
        </span>
        <span class="p-dots"><i></i><i></i><i></i></span>
      </div>
    </div>
    <div class="p-best">
      <h5>이번 주 인기 케이크</h5>
      <div class="p-items">
        <div class="p-item"><i class="p-ci c1"></i><b>고구마 생일 케이크</b><span>32,000원</span></div>
        <div class="p-item"><i class="p-ci c2"></i><b>단호박 미니 케이크</b><span>24,000원</span></div>
        <div class="p-item"><i class="p-ci c3"></i><b>닭가슴살 수제 쿠키</b><span>9,000원</span></div>
        <div class="p-item"><i class="p-ci c4"></i><b>연어 져키</b><span>12,000원</span></div>
      </div>
      <div class="p-rev"><span class="p-src">N 리뷰</span><span class="p-stars">★★★★★</span><span class="p-lines"><i style="width:92%"></i><i style="width:64%"></i></span></div>
    </div>
  </div>`;

  /* 07 · 필라테스 (베이지·아치) ------------------------------------------- */
  P.arch = () => `
  <div class="pv pv-arch" aria-hidden="true">
    <div class="p-nav">
      <span class="p-logo">Arch Pilates</span>
      <span class="p-menu"><span>STUDIO</span><span>CLASS</span><span>INSTRUCTOR</span><span class="p-cta">예약하기</span></span>
      ${burger}
    </div>
    <span class="p-light"></span>
    <div class="p-hero">
      <div class="p-copy">
        <h4 class="p-h">빛이 머무는 곳에서,<br>나에게 집중하는 시간</h4>
        <p class="p-p">아치 너머의 프라이빗룸과 그룹룸.<br>오롯이 몸에 집중하는 50분을 준비했습니다.</p>
      </div>
      <div class="p-arches">
        <span class="p-archx a3"></span>
        <span class="p-archx a1"><b>PRIVATE ROOM</b></span>
        <span class="p-archx a2"><b>GROUP ROOM</b></span>
      </div>
    </div>
    <div class="p-floor"></div>
    <div class="p-cls">
      <div class="p-card"><i class="p-top k1"></i><b>Private</b><span>1:1 개인 레슨</span></div>
      <div class="p-card"><i class="p-top k2"></i><b>Duet</b><span>2:1 듀엣 레슨</span></div>
      <div class="p-card"><i class="p-top k3"></i><b>Group</b><span>소규모 그룹 레슨</span></div>
    </div>
  </div>`;

  /* 08 · 학원 운영 시스템 (대시보드 / 학부모 앱) ---------------------------- */
  P.academy = () => `
  <div class="pv pv-academy" aria-hidden="true">
    <div class="p-desk">
      <div class="p-side">
        <span class="p-logo"><i></i>Academy OS</span>
        <span class="p-nv on"><i></i>대시보드</span>
        <span class="p-nv"><i></i>출결</span>
        <span class="p-nv"><i></i>강의 영상</span>
        <span class="p-nv"><i></i>주간 성취도</span>
        <span class="p-nv"><i></i>클리닉실</span>
        <span class="p-nv"><i></i>학부모 앱</span>
      </div>
      <div class="p-main">
        <div class="p-top"><h5>오늘 현황<small>10월 7일 수요일</small></h5><span class="p-srch">학생, 반, 영상 코드 검색</span></div>
        <div class="p-kpis">
          <div class="p-kpi"><span>오늘 출석</span><b>87%</b><span class="p-bar"><i style="width:87%"></i></span></div>
          <div class="p-kpi"><span>영상 평균 시청률</span><b>72%</b><span class="p-bar"><i style="width:72%"></i></span></div>
          <div class="p-kpi"><span>미제출 보고서</span><b>3건</b><span class="p-bar"><i style="width:30%"></i></span></div>
          <div class="p-kpi"><span>클리닉 대기</span><b>5명</b><span class="p-bar"><i style="width:50%"></i></span></div>
        </div>
        <div class="p-grid">
          <div class="p-card"><h6>반별 출결</h6>
            <div class="p-tr"><span>고1 월수금 A</span><span>14 / 15</span><span class="p-st">진행 중</span></div>
            <div class="p-tr"><span>고2 화목 B</span><span>11 / 12</span><span class="p-st">진행 중</span></div>
            <div class="p-tr"><span>고3 화목 S</span><span>8 / 10</span><span class="p-st w">확인 필요</span></div>
            <div class="p-tr"><span>중3 월수금 C</span><span>12 / 12</span><span class="p-st">완료</span></div>
          </div>
          <div class="p-card"><h6>오늘 할 일</h6>
            <div class="p-todo done"><i></i><span>토요 클리닉 보고</span></div>
            <div class="p-todo"><i></i><span>주간 성취도 입력</span><em>금 마감</em></div>
            <div class="p-todo"><i></i><span>월말 보고서 제출</span><em>3일 마감</em></div>
            <div class="p-todo"><i></i><span>신규 영상 배정</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-app">
      <div class="p-ahead"><span>학부모</span><i></i></div>
      <div class="p-child"><b>김*준 학생</b><span>오늘 17:58 출석 완료</span><em>고1 월수금 A</em></div>
      <div class="p-acard"><h6>이번 주 강의 시청</h6>
        <div class="p-arow"><span>공통수학1 12강</span><span class="p-bar"><i style="width:100%"></i></span></div>
        <div class="p-arow"><span>공통수학1 13강</span><span class="p-bar"><i style="width:64%"></i></span></div>
        <div class="p-arow"><span>기출 해설 2학기 중간</span><span class="p-bar"><i style="width:20%"></i></span></div>
      </div>
      <div class="p-push"><b>새 강의가 배정되었습니다</b><span>공통수학1 14강 · 방금 전</span></div>
    </div>
  </div>`;

  window.PAPERTOV_PREVIEWS = P;
})();
