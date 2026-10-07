/* ==========================================================================
   PAPERTOV — 사이트 콘텐츠 데이터
   --------------------------------------------------------------------------
   이 파일 하나만 고치면 포트폴리오, 가격, 서비스, 제작 과정, FAQ, 문의 정보가
   모두 바뀝니다. 화면 코드(app.js)는 건드릴 필요가 없습니다.

   · 문자열은 '작은따옴표' 안에 씁니다. 따옴표 안에 ' 를 써야 하면 \' 로 씁니다.
   · 항목을 지우면 화면에서도 사라지고, 비워 두면('') 해당 부분이 표시되지 않습니다.
   · 나중에 관리자 페이지를 붙일 때는 이 객체를 Firestore 등에 그대로 저장하고
     app.js 의 loadSiteData() 한 곳만 바꾸면 됩니다.
   ========================================================================== */

window.PAPERTOV_DATA = {

  /* ------------------------------------------------------------------ 브랜드 */
  brand: {
    name: '페이퍼토브',
    nameEn: 'PAPERTOV',            // 로고 워드마크 (영문 표기가 다르면 여기만 수정)
    owner: '송문찬',                // 푸터 '대표' 표기
    bizNumber: '',                  // 사업자등록번호 예: '000-00-00000'
    address: '',                    // 사업장 주소 (비우면 표시 안 함)
    year: 2026,
  },

  /* ------------------------------------------------------------------ 문의 */
  contact: {
    email: '',                      // 예: 'hello@papertov.kr'
    phone: '',                      // 예: '010-0000-0000'
    kakaoUrl: '',                   // 카카오톡 채널 링크 예: 'https://pf.kakao.com/_xxxx'
    instagram: '',                  // 인스타그램 아이디 (@ 없이)
    hours: '평일 10:00 – 19:00',
    responseNote: '남겨주신 연락처로 영업일 기준 하루 안에 연락드립니다.',

    // 문의 폼 → 이메일 수신: https://web3forms.com 에서 받은 Access Key 를 넣으면 바로 작동합니다.
    web3formsKey: '',
    mailSubject: '[페이퍼토브] 새 홈페이지 제작 문의',

    // 문의 폼 '업종' 선택지 (서비스 섹션의 업종 버튼에도 같이 쓰입니다)
    industries: ['자동차 딜러', '필라테스·피트니스', '웨딩·스냅', '패션·뷰티', '식품·반려동물', '교육·학원', '기타'],
  },

  /* ------------------------------------------------------------- 포트폴리오
     순서대로 PROJECT 01, 02 … 번호가 자동으로 붙습니다.

     featured : true  → 큰 챕터로 소개 (false 면 '전체 작업' 목록에만 표시)
     url      : VIEW WEBSITE 버튼 링크. 비워 두면 '자세히 보기'(상세 미리보기)로 대체
     host     : 목업 주소창에 보일 도메인. 비우면 프로젝트 이름이 보입니다
     client   : 고객 동의를 받은 경우에만 상호 입력 (비우면 노출 안 함)
     images   : 실제 스크린샷 경로. 넣으면 미리보기 디자인 대신 스크린샷이 보입니다
                desktop 은 가로 1440px 이상, 위에서부터 긴 전체 화면 캡처 권장 (비율은 자동 유지)
                mobile  은 가로 390px 기준 세로 캡처
     preview  : 스크린샷이 없을 때 보여줄 미리보기 디자인 이름 (previews.js)
     industry : '비슷한 홈페이지 상담하기'를 누르면 문의 폼에 미리 선택될 업종 (contact.industries 중 하나)
     ------------------------------------------------------------------------ */
  portfolio: [
    {
      id: 'benz-dealer',
      industry: '자동차 딜러',
      featured: true,
      category: 'AUTOMOTIVE',
      categoryKo: '수입차 딜러',
      title: 'Mercedes-Benz Dealer',
      subtitle: '공식 딜러 세일즈 컨설턴트 홈페이지',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'benz',
      images: { desktop: '', mobile: '' },
      summary: '차를 고르기 전에 사람을 먼저 믿게 만드는 딜러 홈페이지입니다. 브론즈 컬러와 명조체로 프리미엄 세단의 무게감을 담았습니다.',
      overview: {
        brand: '수입차 공식 딜러, 개인 세일즈 컨설턴트',
        purpose: '유튜브로 알게 된 고객이 신뢰를 갖고 상담 신청까지 이어지도록',
        features: [
          '좌우로 나뉜 첫 화면과 차량 프로모션 소개',
          '운영 중인 유튜브 채널 영상 연동',
          '상담 신청 폼, 이메일로 바로 접수',
          '전용 도메인 연결과 보안 인증서(HTTPS) 적용',
        ],
        design: '브론즈 포인트와 명조체 헤드라인, 쇼룸처럼 차분한 여백',
      },
      palette: [
        { name: 'Ivory', hex: '#F5F1EA' },
        { name: 'Charcoal', hex: '#23211E' },
        { name: 'Bronze', hex: '#A07A4C' },
      ],
      fonts: ['명조 계열 헤드라인', '고딕 본문'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Web3Forms', 'GitHub Pages'],
    },
    {
      id: 'pilates-line',
      industry: '필라테스·피트니스',
      featured: true,
      category: 'FITNESS',
      categoryKo: '필라테스',
      title: 'Line Pilates Studio',
      subtitle: '동탄 필라테스 스튜디오',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'line',
      images: { desktop: '', mobile: '' },
      summary: '로고의 세로선 하나를 화면 전체의 중심축으로 삼았습니다. 흰 여백과 검은 선만으로 정렬과 균형을 이야기하는 홈페이지입니다.',
      overview: {
        brand: '동탄 필라테스 스튜디오',
        purpose: '스튜디오의 정돈된 분위기를 첫 화면에서 전하고 체험 수업 문의로 연결',
        features: [
          '서로 다른 디자인 시안 3개를 제안해 선택',
          '개인, 듀엣, 그룹 수업 구성 소개',
          '인스타그램, 예약 문의 연결',
          '휴대폰 화면을 먼저 설계한 레이아웃',
        ],
        design: '흰 바탕과 검정 포인트. 세로 중심선을 따라 글과 사진이 교차하는 흑백 여백형',
      },
      palette: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Ink', hex: '#121212' },
        { name: 'Stone', hex: '#BEBDB8' },
      ],
      fonts: ['세리프 영문 타이틀', '고딕 본문'],
      stack: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 'bridal-atelier',
      industry: '패션·뷰티',
      featured: true,
      category: 'BRIDAL',
      categoryKo: '웨딩드레스',
      title: 'Bridal Couture Atelier',
      subtitle: '청담동 웨딩드레스 쇼룸',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'atelier',
      images: { desktop: '', mobile: '' },
      summary: '첫 화면에는 로고 하나만 둡니다. 드레스를 보러 온 사람에게 가장 먼저 필요한 건 고요함이라는 판단에서 출발했습니다.',
      overview: {
        brand: '청담동 웨딩드레스 쇼룸',
        purpose: '과하지 않으면서, 어느 화면에서나 은은하게 느껴지는 고급스러움',
        features: [
          '로고만 남긴 첫 화면',
          '오른쪽 메뉴를 열면 시즌별 컬렉션 목록이 펼쳐지는 구조',
          '시즌별 화보 갤러리',
          '방문 상담 예약 안내',
        ],
        design: '아이보리 바탕과 가는 세리프, 사진이 주인공이 되도록 장식을 덜어낸 구성',
      },
      palette: [
        { name: 'Ivory', hex: '#FAF8F4' },
        { name: 'Taupe', hex: '#8C8178' },
        { name: 'Black', hex: '#1A1918' },
      ],
      fonts: ['라이트 세리프', '고딕 본문'],
      stack: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 'bmw-dealer',
      industry: '자동차 딜러',
      featured: true,
      category: 'AUTOMOTIVE',
      categoryKo: '수입차 딜러',
      title: 'BMW Dealer Platform',
      subtitle: '공식 딜러 홈페이지와 관리자 시스템',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'bmw',
      images: { desktop: '', mobile: '' },
      summary: '딜러가 사진과 프로모션을 직접 바꾸고, 엑셀 재고 파일을 올리면 즉시 출고 재고표가 자동으로 정리되는 홈페이지입니다.',
      overview: {
        brand: '수입차 공식 딜러',
        purpose: '한 번 만들고 끝나는 홈페이지가 아니라, 딜러가 매일 직접 운영하는 홈페이지',
        features: [
          '관리자 모드에서 사진, 프로모션, 유튜브 링크 직접 수정',
          '엑셀 재고 업로드 시 시리즈·모델·색상별로 자동 정리 (885행 → 340개 조합)',
          '재고 실시간 검색',
          '서비스센터 입고 신청 접수',
          '전기차 보조금 안내',
          '여러 딜러가 각자 운영하는 멀티테넌트 구조',
        ],
        design: '정보가 많은 업종이라 표와 검색을 중심에 두고, 화이트 톤으로 군더더기 없이 정리',
      },
      palette: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Graphite', hex: '#262A30' },
        { name: 'Blue', hex: '#1C69D4' },
      ],
      fonts: ['고딕 계열'],
      stack: ['JavaScript', 'Firebase Auth', 'Firestore', 'Storage', 'SheetJS'],
    },
    {
      id: 'wedding-snap',
      industry: '웨딩·스냅',
      featured: true,
      category: 'WEDDING',
      categoryKo: '웨딩 스냅',
      title: 'Wedding Snap Studio',
      subtitle: '웨딩 서브스냅 촬영 브랜드',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'snap',
      images: { desktop: '', mobile: '' },
      summary: '수십 곳의 웨딩홀 갤러리를 장소별로 정리하고, 계약서 작성까지 홈페이지 안에서 끝나도록 만든 촬영 브랜드 사이트입니다.',
      overview: {
        brand: '웨딩 서브스냅(아이폰, 폴라로이드) 촬영 브랜드',
        purpose: '예비 부부가 자신이 예식할 홀의 실제 사진을 바로 찾아보고 예약까지',
        features: [
          '웨딩홀별 갤러리와 카테고리 탭',
          '가로·세로 사진이 섞여도 잘리지 않는 컬럼 레이아웃',
          '사진 워터마크 일괄 처리',
          '비밀번호로 보호된 계약서 페이지 (상품 선택 시 자동 작성, 이미지 저장)',
          '패키지, 예약, 이용 규정 페이지',
        ],
        design: '클래식 세리프와 기하학 산세리프 조합, 사진을 방해하지 않는 낮은 채도',
      },
      palette: [
        { name: 'Paper', hex: '#F7F4EF' },
        { name: 'Sage', hex: '#A9B3A0' },
        { name: 'Ink', hex: '#2B2A28' },
      ],
      fonts: ['Cormorant Garamond', 'Jost'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Python', 'GitHub Pages'],
    },
    {
      id: 'dog-bakery',
      industry: '식품·반려동물',
      featured: true,
      category: 'PET BAKERY',
      categoryKo: '수제간식 브랜드',
      title: 'Handmade Dog Bakery',
      subtitle: '강아지 케이크, 수제간식 브랜드',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'bakery',
      images: { desktop: '', mobile: '' },
      summary: '직접 만든다는 걸 믿게 하는 것이 핵심이었습니다. 밝은 노랑과 우드 컬러로 오븐 앞의 따뜻함을 화면에 옮겼습니다.',
      overview: {
        brand: '안양 강아지 케이크, 수제간식 공방',
        purpose: '수제 간식을 만드는 원칙을 보여주고 케이크 주문 문의로 연결',
        features: [
          '사진 3장이 천천히 바뀌는 첫 화면',
          '수제 이야기, 케이크, 수제간식, 리뷰, 오시는 길 페이지',
          '네이버 리뷰 노출',
          '케이크 사진 갤러리',
        ],
        design: '브랜드 컬러 노랑과 우드, 어둡지 않고 밝은 톤의 둥근 형태',
      },
      palette: [
        { name: 'Yellow', hex: '#FFD900' },
        { name: 'Wood', hex: '#804C37' },
        { name: 'Cream', hex: '#FFF9E8' },
      ],
      fonts: ['둥근 고딕 계열'],
      stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    },
    {
      id: 'pilates-arch',
      industry: '필라테스·피트니스',
      featured: false,
      category: 'FITNESS',
      categoryKo: '필라테스',
      title: 'Arch Pilates Studio',
      subtitle: '베이지 톤 프라이빗 필라테스',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'arch',
      images: { desktop: '', mobile: '' },
      summary: '아치형 도어, 헤링본 바닥, 골드 라인 조명. 스튜디오 인테리어의 언어를 그대로 화면으로 옮겼습니다.',
      overview: {
        brand: '프라이빗, 그룹 필라테스 스튜디오',
        purpose: '공간의 분위기를 보고 찾아오게 만드는 감성형 홈페이지',
        features: [
          '아치 형태를 반복한 사진 프레임',
          '프라이빗룸, 그룹룸 공간 소개',
          '사진을 직접 교체하는 관리자 모드',
          '상담 예약 연결',
        ],
        design: '감성적인 베이지 바탕에 골드 라인과 그린 포인트, 커튼처럼 부드러운 전환',
      },
      palette: [
        { name: 'Beige', hex: '#EDE3D6' },
        { name: 'Gold', hex: '#B89A63' },
        { name: 'Green', hex: '#6F7F5B' },
      ],
      fonts: ['세리프 타이틀', '고딕 본문'],
      stack: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 'academy-system',
      industry: '교육·학원',
      featured: false,
      category: 'SYSTEM',
      categoryKo: '운영 시스템',
      title: 'Academy Operations System',
      subtitle: '학원 운영 관리 시스템',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'academy',
      images: { desktop: '', mobile: '' },
      privateNote: '내부 시스템이라 상담 때 화면으로 시연합니다.',
      summary: '관리자, 선생님, 조교, 학생, 학부모가 각자 다른 화면으로 들어오는 학원 운영 시스템입니다. 출결부터 영상 시청률까지 한곳에서 관리합니다.',
      overview: {
        brand: '학원 (직접 운영 중인 시스템)',
        purpose: '엑셀과 메신저로 흩어져 있던 학원 업무를 하나의 웹 시스템으로',
        features: [
          '역할별 로그인과 권한 (관리자, 선생님, 조교, 학생)',
          '출결 관리와 반별 현황',
          '강의 영상 배정과 시청 진행률 추적',
          '주간 성취도, 월말 보고서 제출 관리',
          '클리닉실 시간표 자동 계산',
          '학부모 앱 (iOS, Android) 패키징',
        ],
        design: '하루 종일 쓰는 화면이라 정보 밀도와 가독성을 우선한 업무용 화면',
      },
      palette: [
        { name: 'Canvas', hex: '#F4F5F7' },
        { name: 'Navy', hex: '#1E2A44' },
        { name: 'Violet', hex: '#5B4BD6' },
      ],
      fonts: ['고딕 계열'],
      stack: ['Firebase Auth', 'Firestore', 'Cloud Functions', 'Vimeo API', 'Capacitor'],
    },
  ],

  /* ------------------------------------------------------------- 제작 과정 */
  process: [
    {
      title: '상담',
      desc: '업종, 고객층, 지금 홈페이지로 해결하고 싶은 문제를 먼저 듣습니다. 필요한 페이지와 기능을 함께 정리합니다.',
      output: '제작 범위와 일정',
    },
    {
      title: '브랜드·자료 분석',
      desc: '로고, 사진, 인스타그램, 참고 사이트를 살펴보고 브랜드에 맞는 컬러와 서체, 사진의 방향을 정합니다.',
      output: '컬러, 서체, 레퍼런스',
    },
    {
      title: '디자인',
      desc: '가장 중요한 첫 화면부터 시안으로 보여드립니다. 직접 보고 고르실 수 있도록 방향이 다른 시안을 함께 준비합니다.',
      output: '첫 화면 시안',
    },
    {
      title: '개발',
      desc: '확정된 디자인을 직접 코드로 옮깁니다. 문의 폼, 예약, 로그인, 관리자 기능도 이 단계에서 연결합니다.',
      output: '작동하는 홈페이지',
    },
    {
      title: '모바일 최적화',
      desc: '방문자 대부분은 휴대폰으로 들어옵니다. 화면을 줄이는 데서 끝내지 않고, 휴대폰 레이아웃을 따로 다듬습니다.',
      output: '휴대폰 전용 레이아웃',
    },
    {
      title: '최종 검수',
      desc: '링크, 버튼, 폼 전송, 로딩 속도, 기기별 화면을 하나씩 확인한 뒤 도메인에 연결해 오픈합니다.',
      output: '도메인 연결, 오픈',
    },
  ],

  /* ------------------------------------------------------------- 서비스 */
  services: [
    {
      title: '브랜드 홈페이지',
      desc: '업체의 분위기와 강점을 첫 화면에서 전하는 소개형 홈페이지입니다.',
      fit: '스튜디오, 쇼룸, 공방',
    },
    {
      title: '상담·예약 연결형 홈페이지',
      desc: '방문자가 망설이지 않고 문의, 예약, 상담 신청을 남기도록 흐름을 설계합니다.',
      fit: '딜러, 클래스, 촬영',
    },
    {
      title: '관리 기능이 있는 웹사이트',
      desc: '사진, 가격, 공지, 재고를 직접 바꿀 수 있는 관리자 페이지와 데이터 저장을 함께 만듭니다.',
      fit: '매일 내용이 바뀌는 업체',
    },
    {
      title: '리뉴얼',
      desc: '오래된 홈페이지의 내용은 살리고, 지금의 브랜드에 맞게 화면을 새로 설계합니다.',
      fit: '기존 홈페이지가 있는 곳',
    },
    {
      title: '오픈 이후 관리',
      desc: '도메인과 보안 인증서 관리, 문구와 사진 교체, 새 페이지 추가를 이어서 맡습니다.',
      fit: '운영을 맡기고 싶은 곳',
    },
  ],

  /* ------------------------------------------------------------- 가격
     price 는 화면에 그대로 보이는 숫자, unit 은 그 뒤에 붙는 단위입니다.
     ※ 아래 금액은 예시입니다. 실제 판매 가격으로 꼭 바꿔 주세요.
     ------------------------------------------------------------------------ */
  pricing: {
    note: 'VAT 별도. 도메인 비용은 별도이며, 정확한 견적은 상담 후 안내드립니다.',
    plans: [
      {
        id: 'basic',
        name: 'BASIC',
        label: '반응형 홈페이지',
        price: '80',
        unit: '만 원부터',
        period: '약 2주',
        fit: '처음 홈페이지를 만드는 1인 매장, 스튜디오, 공방',
        features: [
          '업종에 맞춘 맞춤 디자인',
          '원페이지 또는 5페이지 이내 구성',
          'PC, 태블릿, 휴대폰 반응형',
          '전화, 카카오톡, 인스타그램 연결',
          '검색 등록과 공유 미리보기 설정',
          '도메인 연결',
        ],
        featured: false,
      },
      {
        id: 'standard',
        name: 'STANDARD',
        label: '반응형 + 로그인',
        price: '150',
        unit: '만 원부터',
        period: '약 3주',
        fit: '회원 전용 공간이나 비공개 페이지가 필요한 곳',
        features: [
          'BASIC 구성 전체',
          '로그인 (회원, 관리자)',
          '비공개 페이지 (계약서, 자료실 등)',
          '문의·예약 폼 이메일 접수',
          '갤러리, 공지 게시판',
        ],
        featured: true,
      },
      {
        id: 'premium',
        name: 'PREMIUM',
        label: '데이터 저장 / 관리자 기능',
        price: '250',
        unit: '만 원부터',
        period: '약 4–6주',
        fit: '사진, 가격, 재고를 자주 바꾸고 신청 내역을 데이터로 관리하고 싶은 곳',
        features: [
          'STANDARD 구성 전체',
          '관리자 페이지에서 사진, 문구, 가격 직접 수정',
          '데이터베이스 저장 (Firebase)',
          '예약, 신청 내역 관리',
          '엑셀 업로드 같은 업종 맞춤 기능',
        ],
        featured: false,
      },
    ],
  },

  /* ------------------------------------------------------------- 신뢰 */
  trust: {
    // 실제로 만들어 운영 중인 기능들
    systems: [
      { label: '엑셀 재고 업로드', detail: '딜러가 재고 파일을 올리면 885행이 340개 조합으로 자동 정리됩니다.' },
      { label: '계약서 자동 작성', detail: '상품을 고르면 계약 조건이 채워지고, 서명한 계약서를 이미지로 저장합니다.' },
      { label: '영상 시청률 관리', detail: '학생별 강의 시청 진행률을 기록하고 관리자 화면에서 확인합니다.' },
      { label: '사진 워터마크 일괄 처리', detail: '촬영 원본에 같은 규격의 워터마크를 한 번에 넣어 갤러리로 올립니다.' },
    ],
    promises: [
      { title: '처음부터 직접 만듭니다', desc: '구매한 템플릿에 내용만 바꿔 넣지 않습니다. 화면 구성부터 코드까지 직접 작업합니다.' },
      { title: '만든 사람이 끝까지 답합니다', desc: '상담한 사람이 디자인하고 개발합니다. 중간에 담당자가 바뀌지 않습니다.' },
      { title: '오픈 이후도 책임집니다', desc: '오픈 직후 생기는 문구와 사진 수정은 바로 반영합니다. 도메인과 보안 인증서도 관리합니다.' },
      { title: '직접 고칠 수 있게 만듭니다', desc: '자주 바뀌는 내용은 관리자 화면에서 직접 바꿀 수 있도록 설계하고 사용법을 알려드립니다.' },
    ],
  },

  /* ------------------------------------------------------------- 후기
     실제 고객 후기만 넣어 주세요. 비어 있으면 후기 영역은 표시되지 않습니다.
     예: { quote: '후기 내용', name: '필라테스 스튜디오 원장님', project: 'Line Pilates Studio' },
     ------------------------------------------------------------------------ */
  reviews: [],

  /* ------------------------------------------------------------- FAQ */
  faq: [
    {
      q: '제작 기간은 얼마나 걸리나요?',
      a: '구성에 따라 다릅니다. BASIC은 보통 2주 안팎, 관리자 기능이 들어가면 4주 이상 걸립니다. 사진과 문구가 빨리 준비될수록 일정도 빨라집니다.',
    },
    {
      q: '사진이나 문구가 아직 준비되지 않았어요.',
      a: '괜찮습니다. 가지고 계신 자료를 보고 필요한 사진과 문구 목록을 정리해 드리고, 문구는 함께 다듬습니다.',
    },
    {
      q: '도메인과 호스팅은 어떻게 하나요?',
      a: '원하는 도메인 구매부터 연결, 보안 인증서(HTTPS) 적용까지 진행해 드립니다. 도메인 비용은 별도입니다.',
    },
    {
      q: '오픈한 뒤에도 수정할 수 있나요?',
      a: '관리자 기능이 있는 구성은 직접 수정하실 수 있고, 그 밖의 수정은 요청해 주시면 반영합니다.',
    },
    {
      q: '기존 홈페이지 리뉴얼도 되나요?',
      a: '네. 지금 사이트의 내용과 검색 노출은 살리면서 디자인과 구조를 새로 만듭니다.',
    },
    {
      q: '네이버와 구글 검색에 나오게 할 수 있나요?',
      a: '네이버 서치어드바이저와 구글 서치 콘솔 등록, 검색 결과와 공유 미리보기에 보이는 정보 설정까지 해 드립니다.',
    },
  ],
};
