/* =========================================================
   안양시학원연합회 홈페이지 데이터
   - 연락처, 팝업, 게시물 목록을 여기서 고치면 전 페이지에 반영됩니다.
   - 게시물 사진: thumb(목록 썸네일), images(본문 사진, 순서대로 표시)
     파일은 assets/img/posts/게시판/글번호/ 에 있습니다.
   ========================================================= */

window.SITE = {
  name: "(사)안양시학원연합회",
  shortName: "안양시학원연합회",
  founded: "1976-04-05",
  address: "경기도 안양시 만안구 덕천로152번길 25, 714호 (안양동, 안양아이에스비즈타워센트럴)",
  tel: "031-444-6780",          // 오시는길 페이지에 6790으로 적힌 곳이 있어 연합회 확인 필요
  email: "ayaa5678@kakao.com",  // 기존 사이트에 daum.net / kakao.com 두 가지가 섞여 있음
  hours: "평일 09:00 ~ 17:00 (점심 12:00 ~ 13:00) · 주말·공휴일 휴무",
  privacyOfficer: "회장 김범수",
  formEmail: "ayaa5678@kakao.com", // 정회원 입회 신청서가 도착할 메일 (FormSubmit)
  popup: {
    enabled: true, // 기존 사이트 메인 팝업(AMC 지정 접수처 링크)과 동일하게 노출
    id: "amc-2026",
    image: "assets/img/site/popup-amc.jpg", // 이미지가 있으면 이미지 팝업으로 표시
    title: "AMC 안양시 수학경시대회 지정 접수처 안내",
    text: "가까운 지정 접수처 학원에서 접수할 수 있습니다.",
    link: "amc-centers.html",
    linkText: "접수처 학원 보기"
  },
  banners: [
    { name: "경기도학원안전공제회", url: "https://gg0.hwgj.or.kr/" }
  ],

  /* ---- 디자인용 사진 자리 ----
     연합회에서 받은 사진을 assets/img/ 에 넣고 경로만 적으면 됩니다.
     비워 두면 어두운 단색 바탕으로 보입니다. */
  enName: "Anyang Academy Association",
  logo: "assets/img/site/seal.png", // 연합회 마크 (비우면 '安' 원형 표시)
  slogan: "안양시학원연합회가 최선을 다하고 있습니다.",
  subVisual: { image: "assets/img/site/sub-visual.jpg", caption: "" },   // 서브 상단 사진, 예: caption "안양 3경 평촌중앙공원"
  slides: [                     // 메인 큰 사진 (3장)
    { image: "assets/img/site/slide1.jpg", title: "안양시 학원인의 권익을 위해", text: "안양시학원연합회가 최선을 다하고 있습니다." },
    { image: "assets/img/site/slide2.jpg", title: "안양시 학원인의 권익을 위해", text: "안양시학원연합회가 최선을 다하고 있습니다." },
    { image: "assets/img/site/slide3.jpg", title: "안양시 학원인의 권익을 위해", text: "안양시학원연합회가 최선을 다하고 있습니다." }
  ],
  greetingPhoto: "assets/img/site/greeting.jpg",            // 회장인사말 사진
  purposePhoto: "assets/img/site/purpose.jpg",             // 설립목적 사진
  /* 오른쪽 배너 — 기존 화면의 '학원생 안전' 배너 문구 */
  safetyBanner: { title: "학원생 안전", text: "경기도 학원안전공제회가 지킵니다", tel: "031-232-4343", url: "https://gg0.hwgj.or.kr/" }
};

/* 분과 (소통마당 카테고리) — key 는 기존 사이트 sca 값과 동일 */
window.DIVISIONS = [
  { key: "인문보습분과", label: "보습분과" },
  { key: "외국어분과", label: "외국어분과" },
  { key: "음악분과", label: "음악분과" },
  { key: "미술분과", label: "미술분과" },
  { key: "무용분과", label: "무용분과" },
  { key: "컴퓨터분과", label: "컴퓨터분과" },
  { key: "웅변분과", label: "웅변분과" },
  { key: "독서분과", label: "독서분과" }
];

/* ---------------------------------------------------------
   게시판
   id: 기존 사이트 글 번호(wr_id), 알 수 없으면 목록 번호
   pinned: 상단 고정
   --------------------------------------------------------- */
window.BOARDS = {

  notice: {
    title: "공지사항",
    legacy: "sub4_1",
    posts: [
      { id: 13, pinned: true, date: "2026-03-04", title: "어린이통학차량신고 시청·경찰서 준비서류 안내", thumb: "assets/img/posts/notice/13/thumb.jpg",
        images: ["assets/img/posts/notice/13/01.jpg"] },
      { id: 11, pinned: true, date: "2026-02-01", title: "학원보험 의무가입처 경기도학원안전공제회 혜택", thumb: "assets/img/posts/notice/11/thumb.jpg",
        images: ["assets/img/posts/notice/11/01.jpg"] },
      { id: 32, date: "2026-09-29", title: "학생의 교육권과 학원의 정당한 권익을 위해 총연합회가 적극 대응하고 있습니다." },
      { id: 31, date: "2026-09-23", title: "네이버 플레이스 교습비 게시 단속 안내(과태료 주의)", thumb: "assets/img/posts/notice/31/thumb.jpg",
        images: ["assets/img/posts/notice/31/01.jpg"] },
      { id: 30, date: "2026-09-02", title: "학원은 교육을, 안전은 공제회가 책임집니다", thumb: "assets/img/posts/notice/30/thumb.jpg",
        images: ["assets/img/posts/notice/30/01.jpg"] },
      { id: 29, date: "2026-09-02", title: "프리랜서 계약부터 퇴직금 분쟁까지, 학원 맞춤형 노무 솔루션", thumb: "assets/img/posts/notice/29/thumb.jpg",
        images: ["assets/img/posts/notice/29/01.jpg"] },
      { id: 28, date: "2026-08-08", title: "신고포상금 과대인상 및 과도한 학원 규제 법안 반대 대국민 서명운동 동참 안내", thumb: "assets/img/posts/notice/28/thumb.jpg",
        images: ["assets/img/posts/notice/28/01.jpg"] },
      { id: 27, date: "2026-07-28", title: "나의 학원을 지키는 길! 정회원 가입 안내", thumb: "assets/img/posts/notice/27/thumb.jpg",
        images: ["assets/img/posts/notice/27/01.jpg", "assets/img/posts/notice/27/02.jpg", "assets/img/posts/notice/27/03.jpg"] },
      { id: 26, date: "2026-07-18", title: "각 지역 교육지원청의 학원 및 교습소 대상 집중 지도점검이 9월부터 예정되어 있습니다", thumb: "assets/img/posts/notice/26/thumb.jpg",
        images: ["assets/img/posts/notice/26/01.jpg", "assets/img/posts/notice/26/02.jpg"] },
      { id: 25, date: "2026-06-27", title: "2026년 학원·독서실 설립운영자 온라인 연수 안내", thumb: "assets/img/posts/notice/25/thumb.jpg",
        images: ["assets/img/posts/notice/25/01.jpg", "assets/img/posts/notice/25/02.jpg"] },
      { id: 19, date: "2026-06-11", title: "음악분과 정회원 손녀(한국국제학교 재학 중 이세나) 출연, 안양의 자랑스러운 인재입니다" },
      { id: 18, date: "2026-06-10", title: "제4회 안양시 청소년 음악제", thumb: "assets/img/posts/notice/18/thumb.jpg",
        images: ["assets/img/posts/notice/18/01.jpg", "assets/img/posts/notice/18/02.jpg"] },
      { id: 16, date: "2026-05-21", title: "어린이안전교육 의무교육 안내", thumb: "assets/img/posts/notice/16/thumb.jpg",
        images: ["assets/img/posts/notice/16/01.jpg", "assets/img/posts/notice/16/02.jpg", "assets/img/posts/notice/16/03.jpg"] },
      { id: 15, date: "2026-04-01", title: "안양시학원연합회 정회원 노무교육 안내", thumb: "assets/img/posts/notice/15/thumb.jpg",
        images: ["assets/img/posts/notice/15/01.jpg", "assets/img/posts/notice/15/02.jpg", "assets/img/posts/notice/15/03.jpg"] },
      { id: 14, date: "2026-03-25", title: "2026년 안양시 소상공인 환경개선사업 공고 안내", thumb: "assets/img/posts/notice/14/thumb.jpg",
        images: ["assets/img/posts/notice/14/01.jpg", "assets/img/posts/notice/14/02.jpg"] },
      { id: 12, date: "2026-02-01", title: "2026년 소상공인 경영안정 바우처 안내", thumb: "assets/img/posts/notice/12/thumb.jpg",
        images: ["assets/img/posts/notice/12/01.jpg"] },
      { id: 10, date: "2025-10-16", title: "(사)안양시학원연합회 제24대 회장 선거 공고", thumb: "assets/img/posts/notice/10/thumb.jpg",
        images: ["assets/img/posts/notice/10/01.jpg"] },
      { id: 9, date: "2024-11-27", title: "(사)안양시학원연합회 감사선거 입후보자 공고", thumb: "assets/img/posts/notice/9/thumb.jpg",
        images: ["assets/img/posts/notice/9/01.jpg"] },
      { id: 8, date: "2024-10-28", title: "2025학년도 대학수학능력시험 수험생 유의사항 및 교육자료(동영상)" },
      { id: 7, date: "2024-10-18", title: "2024년 어린이시설종사자 안전교육", thumb: "assets/img/posts/notice/7/thumb.jpg",
        images: ["assets/img/posts/notice/7/01.jpg"] },
      { id: 6, date: "2024-09-05", title: "2024년 학원·독서실 설립운영자 연수 시행 기간 연장" },
      { id: 5, date: "2024-08-24", title: "2024년 외국인강사 연수 안내문" },
      { id: 4, date: "2024-08-24", title: "2024년 학원·독서실 설립운영자 교육" },
      { id: 3, date: "2024-08-22", title: "2024년 9월 시행 안양과천교육지원청 교습비 조정 내용", thumb: "assets/img/posts/notice/3/thumb.jpg",
        images: ["assets/img/posts/notice/3/01.jpg"] },
      { id: 2, date: "2024-07-03", title: "제2회 안양시 청소년 음악제", thumb: "assets/img/posts/notice/2/thumb.jpg",
        images: ["assets/img/posts/notice/2/01.jpg", "assets/img/posts/notice/2/02.jpg"] },
      { id: 1, date: "2024-05-15", title: "(사)안양시학원연합회 개소식", thumb: "assets/img/posts/notice/1/thumb.jpg",
        images: ["assets/img/posts/notice/1/01.jpg"] }
    ]
  },

  events: {
    title: "행사 소식",
    legacy: "sub5_4",
    posts: [
      { id: 63, date: "2026-10-06", title: "2026년 마지막 어린이이용시설 종사자 안전교육 안내", thumb: "assets/img/posts/events/63/thumb.jpg",
        images: ["assets/img/posts/events/63/01.jpg", "assets/img/posts/events/63/02.jpg"] },
      { id: 62, date: "2026-09-20", title: "열기 가득한 2026 안양춤축제 현장", thumb: "assets/img/posts/events/62/thumb.jpg",
        images: ["assets/img/posts/events/62/01.jpg", "assets/img/posts/events/62/02.jpg"] },
      { id: 61, date: "2026-09-07", title: "안양시의 비전 2026: 젊어지는 안양, 학원 교육의 내일을 말하다", thumb: "assets/img/posts/events/61/thumb.jpg",
        images: ["assets/img/posts/events/61/01.jpg"] },
      { id: 60, date: "2026-09-03", title: "안양시와 함께하는 따뜻한 교육 동행, 꿈쑥쑥 학원비 지원사업", thumb: "assets/img/posts/events/60/thumb.jpg",
        images: ["assets/img/posts/events/60/01.jpg", "assets/img/posts/events/60/02.jpg"] },
      { id: 59, date: "2026-08-11", title: "제4회 안양시 청소년음악제 상장수여식 및 시장님과의 간담회", thumb: "assets/img/posts/events/59/thumb.jpg",
        images: ["assets/img/posts/events/59/01.jpg", "assets/img/posts/events/59/02.jpg"] },
      { id: 58, date: "2026-08-09", title: "(사)안양시학원연합회 - (주)안양장례식장 업무협약(MOU) 체결 및 이용 혜택 안내", thumb: "assets/img/posts/events/58/thumb.jpg",
        images: ["assets/img/posts/events/58/01.jpg", "assets/img/posts/events/58/02.jpg"] },
      { id: 57, date: "2026-08-08", title: "신고포상금 과대인상 및 과도한 학원 규제 법안 반대 대국민 서명운동 동참 안내", thumb: "assets/img/posts/events/57/thumb.jpg",
        images: ["assets/img/posts/events/57/01.jpg"] },
      { id: 56, date: "2026-07-18", title: "교육지원청의 학원·교습소 대상 집중 지도점검 9월부터 예정", thumb: "assets/img/posts/events/56/thumb.jpg",
        images: ["assets/img/posts/events/56/01.jpg", "assets/img/posts/events/56/02.jpg"] },
      { id: 55, date: "2026-07-13", title: "제4회 안양시 청소년음악제 성황리에 개최", thumb: "assets/img/posts/events/55/thumb.jpg",
        images: ["assets/img/posts/events/55/01.jpg", "assets/img/posts/events/55/02.jpg", "assets/img/posts/events/55/03.jpg"] },
      { id: 54, date: "2026-07-13", title: "제2회 AMC 안양시 수학경시대회 설명회", thumb: "assets/img/posts/events/54/thumb.jpg",
        images: ["assets/img/posts/events/54/01.jpg", "assets/img/posts/events/54/02.jpg"] },
      { id: 53, date: "2026-07-10", title: "안양시장님과 학원연합회 임원진의 티타임 간담회", thumb: "assets/img/posts/events/53/thumb.jpg",
        images: ["assets/img/posts/events/53/01.jpg", "assets/img/posts/events/53/02.jpg"] },
      { id: 52, date: "2026-07-01", title: "민선 9기 최대호 안양시장 취임식 참석", thumb: "assets/img/posts/events/52/thumb.jpg",
        images: ["assets/img/posts/events/52/01.jpg", "assets/img/posts/events/52/02.jpg"] },
      { id: 51, date: "2026-06-30", title: "우리 아이 스마트폰 속 SNS, 이대로 괜찮을까요? 30초 설문 참여 안내", thumb: "assets/img/posts/events/51/thumb.jpg",
        images: ["assets/img/posts/events/51/01.jpg"] },
      { id: 50, date: "2026-06-27", title: "제4회 안양시 청소년 음악제 - 7월 11일(토) 평촌아트홀", thumb: "assets/img/posts/events/50/thumb.jpg",
        images: ["assets/img/posts/events/50/01.jpg", "assets/img/posts/events/50/02.jpg"] },
      { id: 49, date: "2026-06-27", title: "2026년 학원·독서실 설립운영자 온라인 연수 안내", thumb: "assets/img/posts/events/49/thumb.jpg",
        images: ["assets/img/posts/events/49/01.jpg", "assets/img/posts/events/49/02.jpg"] },
      { id: 48, date: "2026-06-26", title: "학원 사고 보상, 경기도학원안전공제회 안내", thumb: "assets/img/posts/events/48/thumb.jpg",
        images: ["assets/img/posts/events/48/01.jpg", "assets/img/posts/events/48/02.jpg"] },
      { id: 43, date: "2026-06-24", title: "김범수 회장, 경기도지회 수석부지회장 임명", thumb: "assets/img/posts/events/43/thumb.jpg",
        images: ["assets/img/posts/events/43/01.jpg"] },
      { id: 42, date: "2026-06-23", title: "안양시학원연합회 & 메트로병원·장례식장 MOU 안내", thumb: "assets/img/posts/events/42/thumb.jpg",
        images: ["assets/img/posts/events/42/01.jpg", "assets/img/posts/events/42/02.jpg", "assets/img/posts/events/42/03.jpg", "assets/img/posts/events/42/04.jpg"] },
      { id: 41, date: "2026-06-23", title: "노무전문 ABM경영컨설팅 업무협약(MOU) 체결 안내", thumb: "assets/img/posts/events/41/thumb.jpg",
        images: ["assets/img/posts/events/41/01.jpg", "assets/img/posts/events/41/02.jpg", "assets/img/posts/events/41/03.jpg", "assets/img/posts/events/41/04.jpg"] },
      { id: 40, date: "2026-06-21", title: "평촌이생각치과 업무협약(MOU) 체결 안내", thumb: "assets/img/posts/events/40/thumb.jpg",
        images: ["assets/img/posts/events/40/01.jpg", "assets/img/posts/events/40/02.jpg"] },
      { id: 39, date: "2026-06-20", title: "안양시가족센터 2026년 세계인과 함께하는 축제 참여", thumb: "assets/img/posts/events/39/thumb.jpg",
        images: ["assets/img/posts/events/39/01.jpg", "assets/img/posts/events/39/02.jpg"] },
      { id: 38, date: "2026-06-17", title: "어린이 이용시설 종사자 안전교육 실시 (2026년 6월 15일, 안양아트센터)", thumb: "assets/img/posts/events/38/thumb.jpg",
        images: ["assets/img/posts/events/38/01.jpg", "assets/img/posts/events/38/02.jpg", "assets/img/posts/events/38/03.jpg", "assets/img/posts/events/38/04.jpg"] },
      { id: 37, date: "2026-06-09", title: "학생 안전을 위한 평촌학원가 민·경 합동순찰 (동안경찰서) 협조 활동", thumb: "assets/img/posts/events/37/thumb.jpg",
        images: ["assets/img/posts/events/37/01.jpg", "assets/img/posts/events/37/02.jpg"] },
      { id: 36, date: "2026-06-09", title: "동안경찰서 청소년 보호 유관기관 간담회 참석", thumb: "assets/img/posts/events/36/thumb.jpg",
        images: ["assets/img/posts/events/36/01.jpg", "assets/img/posts/events/36/02.jpg"] },
      { id: 35, date: "2026-06-04", title: "안양시 꿈쑥쑥 학원비 지원사업 간담회 개최", thumb: "assets/img/posts/events/35/thumb.jpg",
        images: ["assets/img/posts/events/35/01.jpg", "assets/img/posts/events/35/02.jpg", "assets/img/posts/events/35/03.jpg"] },
      { id: 34, date: "2026-06-04", title: "최대호 안양시장 당선, 사교육 현장의 목소리가 안양 교육의 미래가 됩니다", thumb: "assets/img/posts/events/34/thumb.jpg",
        images: ["assets/img/posts/events/34/01.jpg", "assets/img/posts/events/34/02.jpg", "assets/img/posts/events/34/03.jpg", "assets/img/posts/events/34/04.jpg"] },
      { id: 32, date: "2026-05-22", title: "상반기 어린이이용시설 종사자 안전교육 필수 교육 안내", thumb: "assets/img/posts/events/32/thumb.jpg",
        images: ["assets/img/posts/events/32/01.jpg", "assets/img/posts/events/32/02.jpg"] },
      { id: 31, date: "2026-05-15", title: "동안양세무서 초청 간담회 (5월 종합소득세 정리)", thumb: "assets/img/posts/events/31/thumb.jpg",
        images: ["assets/img/posts/events/31/01.jpg", "assets/img/posts/events/31/02.jpg", "assets/img/posts/events/31/03.jpg", "assets/img/posts/events/31/04.jpg", "assets/img/posts/events/31/05.jpg", "assets/img/posts/events/31/06.jpg"] },
      { id: 30, date: "2026-05-05", title: "세무 공고", thumb: "assets/img/posts/events/30/thumb.jpg",
        images: ["assets/img/posts/events/30/01.jpg", "assets/img/posts/events/30/02.jpg"] },
      { id: 28, date: "2026-04-17", title: "학원장 대상 노무법 역량 강화 교육 성료", thumb: "assets/img/posts/events/28/thumb.jpg",
        images: ["assets/img/posts/events/28/01.jpg", "assets/img/posts/events/28/02.jpg", "assets/img/posts/events/28/03.jpg", "assets/img/posts/events/28/04.jpg", "assets/img/posts/events/28/05.jpg", "assets/img/posts/events/28/06.jpg", "assets/img/posts/events/28/07.jpg", "assets/img/posts/events/28/08.jpg"] },
      { id: 27, date: "2026-03-25", title: "보습분과협의회장 이취임식", thumb: "assets/img/posts/events/27/thumb.jpg",
        images: ["assets/img/posts/events/27/01.jpg"] },
      { id: 26, date: "2026-03-25", title: "안양시 학원연합회 학사모를 소개합니다", thumb: "assets/img/posts/events/26/thumb.jpg",
        images: ["assets/img/posts/events/26/01.jpg"] },
      { id: 25, date: "2026-03-25", title: "2026년 임원 워크숍", thumb: "assets/img/posts/events/25/thumb.jpg",
        images: ["assets/img/posts/events/25/01.jpg"] },
      { id: 24, date: "2026-01-20", title: "정기대의원총회 및 신년회 (2026년 1월 5일)", thumb: "assets/img/posts/events/24/thumb.jpg",
        images: ["assets/img/posts/events/24/01.jpg"] },
      { id: 23, date: "2025-03-25", title: "삼성전자 삼성스토어 업무협약식 (2025년 3월 18일)", thumb: "assets/img/posts/events/23/thumb.jpg",
        images: ["assets/img/posts/events/23/01.jpg", "assets/img/posts/events/23/02.jpg", "assets/img/posts/events/23/03.jpg", "assets/img/posts/events/23/04.jpg", "assets/img/posts/events/23/05.jpg"] },
      { id: 22, date: "2025-02-26", title: "(사)한국학원총연합회 제50차 대의원총회 (2025년 2월 26일)", thumb: "assets/img/posts/events/22/thumb.jpg",
        images: ["assets/img/posts/events/22/01.jpg", "assets/img/posts/events/22/02.jpg", "assets/img/posts/events/22/03.jpg", "assets/img/posts/events/22/04.jpg", "assets/img/posts/events/22/05.jpg"] },
      { id: 14, date: "2025-02-26", title: "(사)학원연합회 경기도지회 정기총회 (2025년 1월 31일)", thumb: "assets/img/posts/events/14/thumb.jpg",
        images: ["assets/img/posts/events/14/01.jpg", "assets/img/posts/events/14/02.jpg", "assets/img/posts/events/14/03.jpg", "assets/img/posts/events/14/04.jpg", "assets/img/posts/events/14/05.jpg", "assets/img/posts/events/14/06.jpg", "assets/img/posts/events/14/07.jpg", "assets/img/posts/events/14/08.jpg", "assets/img/posts/events/14/09.jpg", "assets/img/posts/events/14/10.jpg", "assets/img/posts/events/14/11.jpg", "assets/img/posts/events/14/12.jpg", "assets/img/posts/events/14/13.jpg", "assets/img/posts/events/14/14.jpg", "assets/img/posts/events/14/15.jpg", "assets/img/posts/events/14/16.jpg", "assets/img/posts/events/14/17.jpg", "assets/img/posts/events/14/18.jpg", "assets/img/posts/events/14/19.jpg", "assets/img/posts/events/14/20.jpg", "assets/img/posts/events/14/21.jpg", "assets/img/posts/events/14/22.jpg", "assets/img/posts/events/14/23.jpg", "assets/img/posts/events/14/24.jpg", "assets/img/posts/events/14/25.jpg", "assets/img/posts/events/14/26.jpg", "assets/img/posts/events/14/27.jpg", "assets/img/posts/events/14/28.jpg"] },
      { id: 13, date: "2025-01-07", title: "(사)안양시학원연합회 정기총회 (2024년 12월 26일)", thumb: "assets/img/posts/events/13/thumb.jpg",
        images: ["assets/img/posts/events/13/01.jpg", "assets/img/posts/events/13/02.jpg", "assets/img/posts/events/13/03.jpg"] },
      { id: 12, date: "2024-11-11", title: "어린이이용시설종사자 안전교육 (2024년 10월 31일)", thumb: "assets/img/posts/events/12/thumb.jpg",
        images: ["assets/img/posts/events/12/01.jpg", "assets/img/posts/events/12/02.jpg", "assets/img/posts/events/12/03.jpg"] },
      { id: 11, date: "2024-11-11", title: "2024년 안양시학원연합회 임원 워크숍 (2024년 10월 20일)", thumb: "assets/img/posts/events/11/thumb.jpg",
        images: ["assets/img/posts/events/11/01.jpg", "assets/img/posts/events/11/02.jpg", "assets/img/posts/events/11/03.jpg", "assets/img/posts/events/11/04.jpg"] },
      { id: 10, date: "2024-10-02", title: "2024년 안양시 춤축제 안양시학원연합회 부스 운영 (9월 27일 ~ 29일)", thumb: "assets/img/posts/events/10/thumb.jpg",
        images: ["assets/img/posts/events/10/01.jpg", "assets/img/posts/events/10/02.jpg", "assets/img/posts/events/10/03.jpg", "assets/img/posts/events/10/04.jpg", "assets/img/posts/events/10/05.jpg", "assets/img/posts/events/10/06.jpg"] },
      { id: 9, date: "2024-09-11", title: "안양가족센터 업무협약식 (2024년 6월 25일)", thumb: "assets/img/posts/events/9/thumb.jpg",
        images: ["assets/img/posts/events/9/01.jpg", "assets/img/posts/events/9/02.jpg", "assets/img/posts/events/9/03.jpg"] },
      { id: 8, date: "2024-09-11", title: "메가탑치과 업무협약식 (2024년 7월 30일)", thumb: "assets/img/posts/events/8/thumb.jpg",
        images: ["assets/img/posts/events/8/01.jpg", "assets/img/posts/events/8/02.jpg", "assets/img/posts/events/8/03.jpg"] },
      { id: 7, date: "2024-09-11", title: "제2회 안양시 청소년음악제 (2024년 7월 6일, 평촌아트홀)", thumb: "assets/img/posts/events/7/thumb.jpg",
        images: ["assets/img/posts/events/7/01.jpg", "assets/img/posts/events/7/02.jpg", "assets/img/posts/events/7/03.jpg"] },
      { id: 6, date: "2024-08-13", title: "안양문화예술재단 업무협약식 (2024년 8월 13일)", thumb: "assets/img/posts/events/6/thumb.jpg",
        images: ["assets/img/posts/events/6/01.jpg", "assets/img/posts/events/6/02.jpg"] },
      { id: 5, date: "2024-07-31", title: "동안경찰서 간담회 (2024년 7월 25일)", thumb: "assets/img/posts/events/5/thumb.jpg",
        images: ["assets/img/posts/events/5/01.jpg"] },
      { id: 4, date: "2024-07-16", title: "(사)안양시학원연합회 개소식 (2024년 7월 12일)", thumb: "assets/img/posts/events/4/thumb.jpg",
        images: ["assets/img/posts/events/4/01.jpg", "assets/img/posts/events/4/02.jpg"] },
      { id: 3, date: "2024-06-27", title: "꿈쑥쑥 재협약식 (2024년 6월 7일, 안양시청)", thumb: "assets/img/posts/events/3/thumb.jpg",
        images: ["assets/img/posts/events/3/01.jpg", "assets/img/posts/events/3/02.jpg"] },
      { id: 2, date: "2024-06-27", title: "안양FC 경기 관람 (2024년 6월 22일, 안양종합운동장)", thumb: "assets/img/posts/events/2/thumb.jpg",
        images: ["assets/img/posts/events/2/01.jpg", "assets/img/posts/events/2/02.jpg"] },
      { id: 1, date: "2024-06-18", title: "(사)안양시학원연합회 제23대 회장 이취임식 (2024년 1월 11일)", thumb: "assets/img/posts/events/1/thumb.jpg",
        images: ["assets/img/posts/events/1/01.jpg", "assets/img/posts/events/1/02.jpg"] }
    ]
  },

  divisions: {
    title: "분과 소식",
    legacy: "sub5_6",
    posts: [
      { id: 18, pinned: true, cat: "음악분과", date: "2026-04-12", title: "제4회 안양시 청소년 음악제 대회요강 안내", thumb: "assets/img/posts/divisions/18/thumb.jpg",
        images: ["assets/img/posts/divisions/18/01.jpg", "assets/img/posts/divisions/18/02.jpg"] },
      { id: 16, pinned: true, cat: "음악분과", date: "2026-03-27", title: "제4회 안양시 청소년 음악제 안내", thumb: "assets/img/posts/divisions/16/thumb.jpg",
        images: ["assets/img/posts/divisions/16/01.jpg"] },
      { id: 13, pinned: true, cat: "음악분과", date: "2026-03-25", title: "3월 음악분과 월례회의 이모저모", thumb: "assets/img/posts/divisions/13/thumb.jpg",
        images: ["assets/img/posts/divisions/13/01.jpg", "assets/img/posts/divisions/13/02.jpg", "assets/img/posts/divisions/13/03.jpg"] },
      { id: 10, pinned: true, cat: "음악분과", date: "2026-03-03", title: "2026년 음악분과 상반기 급수시험 안내", thumb: "assets/img/posts/divisions/10/thumb.jpg",
        images: ["assets/img/posts/divisions/10/01.jpg", "assets/img/posts/divisions/10/02.jpg"] },
      { id: 9, pinned: true, cat: "음악분과", date: "2026-02-24", title: "음악분과 정회원에게 드리는 특별한 혜택", thumb: "assets/img/posts/divisions/9/thumb.jpg",
        images: ["assets/img/posts/divisions/9/01.jpg", "assets/img/posts/divisions/9/02.jpg"] },
      { id: 8, pinned: true, cat: "음악분과", date: "2026-01-28", title: "제37회 안양시민과 함께하는 행복한 음악회를 성황리에 마침", thumb: "assets/img/posts/divisions/8/thumb.jpg",
        images: ["assets/img/posts/divisions/8/01.jpg", "assets/img/posts/divisions/8/02.jpg"] },
      { id: 7, pinned: true, cat: "음악분과", date: "2026-01-28", title: "2025년 3회, 2026년 4회차 청소년음악제 소식", thumb: "assets/img/posts/divisions/7/thumb.jpg",
        images: ["assets/img/posts/divisions/7/01.jpg", "assets/img/posts/divisions/7/02.jpg"] },
      { id: 6, pinned: true, cat: "음악분과", date: "2026-01-28", title: "2026년 상반기 급수시험 안내", thumb: "assets/img/posts/divisions/6/thumb.jpg",
        images: ["assets/img/posts/divisions/6/01.jpg", "assets/img/posts/divisions/6/02.jpg"] },
      { id: 5, pinned: true, cat: "음악분과", date: "2026-01-28", title: "2026년 음악분과 사업계획", thumb: "assets/img/posts/divisions/5/thumb.jpg",
        images: ["assets/img/posts/divisions/5/01.jpg", "assets/img/posts/divisions/5/02.jpg"] },
      { id: 33, cat: "음악분과", date: "2026-09-29", title: "9월 월례회의 결과 및 하반기 주요 일정 안내", thumb: "assets/img/posts/divisions/33/thumb.jpg",
        images: ["assets/img/posts/divisions/33/01.jpg", "assets/img/posts/divisions/33/02.jpg"] },
      { id: 32, cat: "음악분과", date: "2026-08-11", title: "제4회 안양시 청소년음악제 상장수여식 및 시장님과의 간담회 소식", thumb: "assets/img/posts/divisions/32/thumb.jpg",
        images: ["assets/img/posts/divisions/32/01.jpg", "assets/img/posts/divisions/32/02.jpg"] },
      { id: 31, cat: "음악분과", date: "2026-07-18", title: "음악으로 하나 된 안양! 제4회 청소년 음악제 현장 스케치", thumb: "assets/img/posts/divisions/31/thumb.jpg",
        images: ["assets/img/posts/divisions/31/01.jpg", "assets/img/posts/divisions/31/02.jpg"] },
      { id: 30, cat: "음악분과", date: "2026-06-25", title: "제4회 청소년음악제 스태프 회의, 평촌아트홀 로비 리모델링 소식", thumb: "assets/img/posts/divisions/30/thumb.jpg",
        images: ["assets/img/posts/divisions/30/01.jpg", "assets/img/posts/divisions/30/02.jpg", "assets/img/posts/divisions/30/03.jpg", "assets/img/posts/divisions/30/04.jpg", "assets/img/posts/divisions/30/05.jpg", "assets/img/posts/divisions/30/06.jpg", "assets/img/posts/divisions/30/07.jpg"] },
      { id: 29, cat: "음악분과", date: "2026-06-23", title: "제4회 안양시 청소년음악제 준비위원회 회의 개최 안내", thumb: "assets/img/posts/divisions/29/thumb.jpg",
        images: ["assets/img/posts/divisions/29/01.jpg"] },
      { id: 20, cat: "음악분과", date: "2026-06-10", title: "5월 월례회의 가정의 달 기념 식사모임", thumb: "assets/img/posts/divisions/20/thumb.jpg",
        images: ["assets/img/posts/divisions/20/01.jpg", "assets/img/posts/divisions/20/02.jpg"] },
      { id: 104, cat: "미술분과", date: "2026-04-02", title: "미술분과 월례회의 주요 안건 공지 및 의결 사항", thumb: "assets/img/posts/divisions/104/thumb.jpg",
        images: ["assets/img/posts/divisions/104/01.jpg"] },
      { id: 103, cat: "인문보습분과", date: "2026-03-27", title: "제23대 안양시학원연합회 보습분과 이취임식", thumb: "assets/img/posts/divisions/103/thumb.jpg",
        images: ["assets/img/posts/divisions/103/01.jpg", "assets/img/posts/divisions/103/02.jpg", "assets/img/posts/divisions/103/03.jpg", "assets/img/posts/divisions/103/04.jpg", "assets/img/posts/divisions/103/05.jpg", "assets/img/posts/divisions/103/06.jpg", "assets/img/posts/divisions/103/07.jpg", "assets/img/posts/divisions/103/08.jpg", "assets/img/posts/divisions/103/09.jpg"] },
      { id: 102, cat: "인문보습분과", date: "2026-03-18", title: "제1회 안양시 수학경시대회 성료, 지역 교육 수준 한 단계 도약", thumb: "assets/img/posts/divisions/102/thumb.jpg",
        images: ["assets/img/posts/divisions/102/01.jpg"] },
      { id: 101, cat: "인문보습분과", date: "2025-04-17", title: "보습분과 4월 월례회 (2025.04.17)", thumb: "assets/img/posts/divisions/101/thumb.jpg",
        images: ["assets/img/posts/divisions/101/01.jpg", "assets/img/posts/divisions/101/02.jpg", "assets/img/posts/divisions/101/03.jpg", "assets/img/posts/divisions/101/04.jpg", "assets/img/posts/divisions/101/05.jpg", "assets/img/posts/divisions/101/06.jpg", "assets/img/posts/divisions/101/07.jpg"] },
      { id: 100, cat: "인문보습분과", date: "2025-03-13", title: "2025년 보습분과 정기총회 (2025.03.13)", thumb: "assets/img/posts/divisions/100/thumb.jpg",
        images: ["assets/img/posts/divisions/100/01.jpg", "assets/img/posts/divisions/100/02.jpg", "assets/img/posts/divisions/100/03.jpg", "assets/img/posts/divisions/100/04.jpg", "assets/img/posts/divisions/100/05.jpg"] }
    ]
  },

  training: {
    title: "학원설립·운영자 연수",
    legacy: "sub3_1",
    course: true,
    posts: [
      { id: 3, pinned: true, date: "2026-06-27", title: "2026년 학원·독서실 설립운영자 연수 및 외국인강사 연수 안내", thumb: "assets/img/posts/training/3/thumb.jpg",
        images: ["assets/img/posts/training/3/01.jpg"],
        apply: "2026-07-06 ~ 2026-07-29", period: "2026-07-06 ~ 2026-07-29", place: "온라인교육 (비대면)",
        link: "http://www.ggdacaedu2026.co.kr",
        body:
          '<p>교육비는 무료이며 온라인(비대면)으로 진행합니다.</p>' +
          '<p><a class="btn btn-navy" href="http://www.ggdacaedu2026.co.kr" target="_blank" rel="noopener">연수 홈페이지 바로가기</a></p>' +
          '<p class="hint">PC는 구글 크롬, 모바일은 크롬 앱으로 접속하세요.</p>' +
          '<h3>지역별 수강 기간</h3>' +
          '<ul><li>1차 지역: 7월 6일 ~ 7월 15일 (10일)</li><li>2차 지역: 7월 16일 ~ 7월 25일 (10일)</li><li>전 지역 추가: 7월 26일 ~ 7월 29일 (4일)</li></ul>' +
          '<p class="hint">시·군별 일정표(붙임1)는 아래 이미지를 확인하세요.</p>' +
          '<h3>강의 내용</h3>' +
          '<ol><li>공지사항, 인사말, 학원 관리법(개정 사항 포함)</li><li>아동학대 신고의무자 교육</li><li>긴급복지지원 신고의무 교육</li><li>장애인 학대 신고의무자 교육 (1차시)</li><li>장애인 학대 신고의무자 교육 (2차시)</li><li>학원장이 알아야 할 노무 교육</li></ol>' +
          '<p class="hint">강의 순서와 명칭은 미리 알리지 않고 바뀔 수 있습니다.</p>' +
          '<h3>꼭 확인하세요</h3>' +
          '<ul><li>1교시부터 6교시까지 모두 수강한 학원·독서실 설립운영자는 3대 법정 의무교육 이수자로 자동 처리됩니다.</li>' +
          '<li>학원 강사와 종사자는 이 연수와 별개로 3대 법정 의무교육을 따로 수강하고, 관할 교육지원청에 직접 통보해야 합니다.</li></ul>' +
          '<p>문의: 안양시학원연합회 031-444-6780</p>' },
      { id: 2, date: "2024-08-12", title: "2024년 학원·독서실 설립운영자 교육", thumb: "assets/img/posts/training/2/thumb.jpg",
        images: ["assets/img/posts/training/2/01.jpg"],
        apply: "2024-08-12 ~ 2024-09-22", period: "2024-08-12 ~ 2024-09-22", place: "온라인교육" }
    ]
  },

  legal: {
    title: "법정의무교육",
    legacy: "sub3_2",
    course: true,
    posts: [
      { id: 4, date: "2024-01-01", title: "2024년 법정의무교육 안내", thumb: "assets/img/posts/legal/4/thumb.jpg",
        images: ["assets/img/posts/legal/4/01.jpg", "assets/img/posts/legal/4/02.jpg"],
        apply: "2024-01-01 ~ 2024-12-31", period: "2024-01-01 ~ 2024-12-31", place: "인터넷 및 현장교육",
        link: "http://www.gseek.kr",
        body:
          '<p>경기도 평생학습포털 GSEEK에서 인터넷으로 수강하거나 현장교육으로 이수할 수 있습니다.</p>' +
          '<p><a class="btn btn-navy" href="http://www.gseek.kr" target="_blank" rel="noopener">GSEEK 바로가기</a></p>' +
          '<p class="hint">교육 안내 이미지는 아래에서 확인하세요.</p>' +
          '<p>문의: 안양시학원연합회 031-444-6780 (평일 09:00 ~ 17:00, 점심 12:00 ~ 13:00, 주말·공휴일 휴무)</p>' }
    ]
  },

  amcPast: {
    title: "AMC 기출문제",
    legacy: "amcv04",
    posts: [
      { id: 9, cat: "중3", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 중학교 3학년" },
      { id: 8, cat: "중2", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 중학교 2학년" },
      { id: 7, cat: "중1", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 중학교 1학년" },
      { id: 6, cat: "초등6", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 초등학교 6학년" },
      { id: 5, cat: "초등5", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 초등학교 5학년" },
      { id: 4, cat: "초등4", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 초등학교 4학년" },
      { id: 3, cat: "초등3", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 초등학교 3학년" },
      { id: 2, cat: "초등2", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 초등학교 2학년" },
      { id: 1, cat: "초등1", date: "2025-11-24", title: "[제1회] 안양시 수학경시대회 초등학교 1학년" }
    ]
  }
};

/* 역대 회장 — photo 에 이미지 경로를 넣으면 사진이 표시됩니다 (assets/img/presidents/...) */
window.PRESIDENTS = [
  { term: "제23·24대", name: "김범수", academy: "수학이 만드는 세상", period: "2024.1 ~ 현재", photo: "assets/img/presidents/01-kim-beomsu.jpg" },
  { term: "제21·22대", name: "김장현", academy: "김장현수학학원", period: "2020.1 ~ 2023.12", photo: "assets/img/presidents/02-kim-janghyun.jpg" },
  { term: "제19·20대", name: "장찬범", academy: "그린섬미술학원", period: "2016.1 ~ 2019.12", photo: "assets/img/presidents/03-jang-chanbeom.jpg" },
  { term: "제16·17·18대", name: "신태남", academy: "만안교연학원, 티앤비학원", period: "2010.1 ~ 2015.12", photo: "assets/img/presidents/04-shin-taenam.jpg" },
  { term: "제14·15대", name: "박인옥", academy: "한맥학원", period: "2006.1 ~ 2009.12", photo: "assets/img/presidents/05-park-inok.jpg" },
  { term: "제13대", name: "신용준", academy: "신사고력학원", period: "2004.1 ~ 2005.12", photo: "" },
  { term: "제12대", name: "임채호", academy: "청송학원", period: "2002.1 ~ 2003.12", photo: "assets/img/presidents/06-lim-chaeho.jpg" },
  { term: "제11대", name: "김종찬", academy: "시사외국어학원", period: "2000.1 ~ 2001.12", photo: "assets/img/presidents/07-kim-jongchan.jpg" },
  { term: "제10대", name: "곽상대", academy: "성문속셈학원", period: "1998.1 ~ 1999.12", photo: "" },
  { term: "제9대", name: "송지영", academy: "한일컴퓨터학원", period: "1996.1 ~ 1997.12", photo: "" },
  { term: "제8대", name: "김재봉", academy: "시번주산웅변학원", period: "1994.1 ~ 1995.12", photo: "" },
  { term: "제7대", name: "문수곤", academy: "남송컴퓨터학원", period: "1992.1 ~ 1993.12", photo: "" },
  { term: "제6대", name: "김상열", academy: "월광음악학원", period: "1990.1 ~ 1991.12", photo: "" },
  { term: "제5대", name: "정관희", academy: "대성학원", period: "1988.1 ~ 1989.12", photo: "" },
  { term: "제4대", name: "채수안", academy: "안양자동차학원", period: "1986.6 ~ 1987.12", photo: "" },
  { term: "제3대", name: "김현경", academy: "종로학원", period: "1984.1 ~ 1986.5", photo: "" },
  { term: "제2대", name: "김현경", academy: "종로학원", period: "1980.1 ~ 1983.12", photo: "" },
  { term: "제1대", name: "김경종", academy: "한림원독서실", period: "1976.4 ~ 1979.12", photo: "" }
];

/* 조직 */
window.ORGANIZATION = [
  { group: "회장", members: [["김범수", "수학이만드는세상"]] },
  { group: "감사", members: [["강주희", "줄리스영수학원"], ["임정신", "고은음악학원"]] },
  { group: "수석부회장", members: [["김익철", "솔로몬단과학원"]] },
  { group: "부회장", members: [["남궁훈", "이지어학원"], ["권호영", "새소망음악학원"], ["김용진", "이상수학학원"]] },
  { group: "명예부회장", members: [["신혜인", "혜인아카데미"]] },
  /* 위원회 — 기존 조직도 화면 표기 그대로 */
  { group: "선거관리위원회", members: [["김용진", "이상수학", "위원장"]] },
  { group: "윤리위원회", members: [["권호영", "새소망음악", "위원장"]] },
  { group: "이사", members: [["조승래", "비아이영어학원", "총무이사"], ["이옥련", "칸타빌레음악학원", "재무이사"], ["김순중", "지엔탑학원", "교육이사"], ["정수연", "하늘소리음악수학", "홍보이사"], ["김민정", "김민정이화발학원", "문화예술이사"]] },
  { group: "분과장", members: [["김도완", "인어스수학학원", "보습분과장"], ["박재홍", "록키영어학원", "외국어분과장"], ["하해영", "소리엘음악학원", "음악분과장"], ["황정숙", "아트프러스미술학원", "미술분과장"]] },
  { group: "보습분과", members: [["송우찬", "송우찬수학학원"], ["이종호", "학림프라임학원"], ["오세중", "과학의정석학원"], ["최홍섭", "킵매쓰수학학원"], ["이윤희", "쉐마영수학원"], ["안상현", "한빛학원"], ["공정원", "대치레몬학원"], ["김민정", "에이펙스영어학원"], ["이서형", "알찬학원"]] },
  { group: "외국어분과", members: [["김도은", "제임스엠어학원"], ["최은숙", "포브스어학원"]] },
  { group: "음악분과", members: [["안설화", "지앤수음악학원"], ["강송희", "작은뜰음악학원"]] },
  { group: "미술분과", members: [["홍성원", "잠수함속토끼미술학원"], ["조하민", "아트스타미술학원"], ["이현수", "구루미술학원"]] }
];

/* 협력업체 — 기존 사이트 '협력업체 및 기관' 게시판(전체 9건 중 목록에 보이는 7건) 기준.
   혜택 상세는 정회원 전용입니다. */
window.PARTNERS = [
  { name: "평촌이생각치과", field: "치과", photo: "assets/img/partners/11.jpg" },
  { name: "안양시 가족센터", field: "협력기관", photo: "assets/img/partners/09.jpg", images: ["assets/img/partners/9-01.jpg"] },
  { name: "(사)안양시학원연합회 세무사", field: "세무 상담", photo: "assets/img/partners/08.jpg" },
  { name: "(사)안양시학원연합회 노무사", field: "노무 상담", photo: "assets/img/partners/07.jpg" },
  { name: "(사)안양시학원연합회 변호사", field: "법률 상담", photo: "assets/img/partners/06.jpg" },
  { name: "메가치과", field: "치과", photo: "assets/img/partners/05.jpg" },
  { name: "365매일한방병원 안양평촌점", field: "한방병원", photo: "assets/img/partners/04.jpg", images: ["assets/img/partners/4-01.jpg", "assets/img/partners/4-02.jpg", "assets/img/partners/4-03.jpg", "assets/img/partners/4-04.jpg"] }
];

/* AMC 수학경시대회 — 회차가 바뀌면 이 부분만 고치면 됩니다 */
window.AMC = {
  round: "2025 AMC 제1회 안양시 수학경시대회",
  examDate: "2025년 11월 16일(일) 오전 10:30",
  checkIn: "오전 10시까지 입실 완료. 당일 1층 현장 배부처에서 수험표를 받으므로 여유 있게 도착해 주세요.",
  place: "신성중학교",
  duration: [
    ["초등 1~2학년", "10:30 ~ 11:30 (60분)"],
    ["초등 3학년 ~ 중학교 3학년", "10:30 ~ 12:00 (90분)"]
  ],
  questions: "기초 5, 기본 10, 교과 실력 5, 심화 5, 실용 5 · 총 30문항 (120점 만점)",
  bring: "컴퓨터용 사인펜(초등 1·2학년 제외), 필기도구, 수정테이프, 개인 텀블러",
  parking: [
    "신성중학교 교내 제1~제5주차장을 이용할 수 있습니다.",
    "현장 주차 봉사자의 안내에 따라 일렬 주차도 가능합니다."
  ],
  notes: [
    "시험이 끝나면 바로 귀가할 수 있습니다.",
    "학부모 대기 시 학교 주변 100m 이내는 금연입니다.",
    "시험 중에는 휴대전화를 사용할 수 없습니다.",
    "학생 안전을 위해 '동행과 돌봄' 간호 봉사자가 함께합니다."
  ],
  award: {
    date: "2025년 11월 28일(금) 오후 5시",
    place: "안양시청 강당",
    target: "안양시장상 수상자 12명 (AMC 위원회에서 개별 통지)",
    etc: "대상을 제외한 기관장상과 인증서는 2025년 12월 8일부터 각 학원 또는 가정으로 발송됩니다."
  },
  ticketPeriod: "2025.11.10(월) 15:00 ~ 2025.11.16(일) 10:00",
  /* 조회 열기/닫기 — 응시자·성적 데이터는 공개 저장소에 넣지 말고
     Firebase 등 외부 DB에서 불러옵니다 (assets/js/amc.js 의 AMC_API 참고) */
  ticketOpen: false,
  scoreOpen: false,
  host: "안양시 학원연합회 보습분과 협의회",
  sponsor: "안양시",
  author: "동아출판 수학평가연구소",
  certify: "동아출판 수학평가연구소, 안양시 학원연합회",
  /* 지정 접수처 학원 — id 는 기존 사이트 글 번호(amc06 wr_id), image 는 학원 소개 이미지 */
  centersIntro: ["assets/img/site/amc-centers-1.jpg", "assets/img/site/amc-centers-2.jpg"],
  centers: [
    { id: 8, name: "바른길 수학", image: "assets/img/centers/08.jpg", address: "경기 안양시 동안구 평촌대로 116 5층", tel: "031-382-4785", blog: "https://blog.naver.com/barungil_edu" },
    { id: 10, name: "백년대계 학림학원", image: "assets/img/centers/10.jpg", address: "경기 안양시 동안구 귀인로 262", tel: "031-387-2229", blog: "https://blog.naver.com/haklimacademy" },
    { id: 1, name: "지엔탑학원", image: "assets/img/centers/01.jpg", address: "경기 안양시 만안구 장내로 63 3-5층", tel: "031-444-0096", blog: "https://blog.naver.com/gntop0096" },
    { id: 2, name: "인어스수학학원", image: "assets/img/centers/02.jpg", address: "경기 안양시 동안구 평촌대로 111 피플스프라자 205호", tel: "031-385-3466", blog: "https://blog.naver.com/inus-math" },
    { id: 13, name: "G1230 안양캠퍼스", image: "assets/img/centers/13.jpg", address: "경기 안양시 만안구 태평로52번길 37 링크오빌딩 304호", tel: "031-442-1230", blog: "https://blog.naver.com/gnbmanan" },
    { id: 3, name: "대시나루국어학원", image: "assets/img/centers/03.jpg", address: "경기 안양시 동안구 평촌대로 109 협성골드 프라자 301호", tel: "031-388-2066", blog: "https://blog.naver.com/theangry" },
    { id: 15, name: "한빛주니어학원", image: "assets/img/centers/15.jpg", address: "경기 안양시 만안구 태평로52번길 21 308호", tel: "031-347-1113", blog: "" },
    { id: 11, name: "강의하는 아이들", image: "assets/img/centers/11.jpg", address: "경기 안양시 동안구 평촌대로 140 205, 206호", tel: "0507-1405-0873", blog: "https://blog.naver.com/kakia0319" },
    { id: 7, name: "유수하 수학학원", image: "assets/img/centers/07.jpg", address: "경기 안양시 동안구 평촌대로 133 3·4·6·7층", tel: "031-386-3340", blog: "https://blog.naver.com/ushacademy", site: "https://www.mathush.co.kr/" },
    { id: 5, name: "수학이 만드는 세상", image: "assets/img/centers/05.jpg", address: "경기 안양시 만안구 안양동 1389-2 3층", tel: "031-444-2223", blog: "https://blog.naver.com/kbsmathlove" },
    { id: 4, name: "송우찬수학학원", image: "assets/img/centers/04.jpg", address: "경기 안양시 동안구 평촌대로 117 맵시프라자 4층", tel: "031-386-8899", blog: "https://blog.naver.com/fanmath" },
    { id: 9, name: "스카이학원", image: "assets/img/centers/09.jpg", address: "경기 안양시 만안구 안양로 399 동양빌딩 4층", tel: "031-443-8902", blog: "" },
    { id: 6, name: "대치레몬", image: "assets/img/centers/06.jpg", address: "경기 안양시 동안구 관악대로 177 401호", tel: "031-388-8734", blog: "https://blog.naver.com/kongti_66" },
    { id: 12, name: "리더스학원", image: "assets/img/centers/12.jpg", address: "경기 안양시 동안구 관악대로 374 홍은빌딩 3층", tel: "031-424-0027", blog: "https://blog.naver.com/leaders3179" },
    { id: 14, name: "한빛학원", image: "assets/img/centers/14.jpg", address: "경기 안양시 만안구 태평로52번길 21 312호", tel: "031-441-4331", blog: "" },
    { id: 16, name: "동일학원", image: "assets/img/centers/16.jpg", address: "경기 안양시 만안구 안양로 483 지구빌딩 3층", tel: "010-3269-0009", blog: "https://blog.naver.com/knam1118" }
  ]
};
