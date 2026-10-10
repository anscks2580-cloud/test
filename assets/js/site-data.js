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
     공개(public: true)된 프로젝트만 순서대로 PROJECT 01, 02 … 번호가 붙고,
     첫 번째 프로젝트가 첫 화면 구를 통과하는 PROJECT 01 이 됩니다.
     첫 화면의 'Projects / Industries' 숫자와 '전체 작업' 업종 필터는 공개 프로젝트에서 자동으로 계산됩니다.

     ── 항목별 설명 ──────────────────────────────────────────────
     id         : 영문 고유값 (스크린샷 폴더 이름과 같게: assets/img/portfolio/<id>/)
     public     : 공개 여부. false 면 데이터만 남고 홈페이지 어디에도 보이지 않습니다
     featured   : true → '제작 사례'에 큰 챕터로 소개 (false 면 '전체 작업' 목록에만)
     industry   : 업종. 필터·업종 수 계산·'비슷한 홈페이지 상담하기' 문의 폼 업종에 쓰입니다 (contact.industries 중 하나)
     category   : 영문 업종 라벨 / categoryKo : 목록에 보이는 한글 업종명
     title      : 프로젝트명 (고객 상호 대신 업종 중심 이름)
     subtitle   : 한 줄 소개
     summary    : 프로젝트 상세 설명 (2~3문장)
     client     : 고객 동의를 받은 경우에만 상호 입력 (비우면 노출 안 함)
     url        : 실제 홈페이지 주소. 확인되고 공개해도 되는 경우에만 넣으세요.
                  넣으면 'VIEW WEBSITE' 버튼이 생기고, 비워 두면 버튼 없이 스크린샷으로만 보여줍니다
     host       : 목업 주소창에 보일 글자. 비우면 프로젝트 이름이 보입니다
     screen     : 'real'   → 실제 화면 그대로
                  'masked' → 실제 디자인이지만 고객 정보(상호·연락처 등)를 가린 화면
                  (images 가 비어 있으면 자동으로 '가안 미리보기 · 실제 화면 준비 중' 으로 표시)
     screenNote : 상세 보기에서 화면 아래에 보이는 짧은 안내 (선택)
     images     : desktop = 대표 이미지이자 데스크톱 전체 화면 캡처 (가로 1280px 이상, 위에서부터 길게)
                  mobile  = 휴대폰 전체 화면 캡처 (가로 390px × 2배)
                  screens = 상세 보기에서 고를 수 있는 다른 페이지 [{ label, desktop, mobile }]
                  → 비어 있으면 preview(가안 미리보기 디자인, previews.js)를 대신 보여줍니다
     overview   : brand(브랜드/업종), purpose(제작 목적), features(주요 구현 내용), design(디자인 방향)
     palette    : 실제 사이트 CSS 에서 가져온 컬러 / fonts : 실제 사용 서체 / stack : 실제 사용 기술
     ------------------------------------------------------------------------ */
  portfolio: [
    {
      id: 'bmw-dealer',
      public: true,
      featured: true,
      industry: '자동차 딜러',
      category: 'AUTOMOTIVE',
      categoryKo: '수입차 딜러',
      title: 'BMW Dealer Platform',
      subtitle: '공식 딜러 개인 홈페이지와 관리자 시스템',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'bmw',
      screen: 'masked',
      screenNote: '딜러 이름·연락처·주소를 바꾼 데모 화면입니다. 실차 사진 자리는 딜러가 관리자 모드에서 직접 올리는 영역이라 비워 두었습니다.',
      images: {
        desktop: 'assets/img/portfolio/bmw-dealer/desktop.webp',
        mobile: 'assets/img/portfolio/bmw-dealer/mobile.webp',
        screens: [],
      },
      summary: '차를 고르기 전에 딜러를 먼저 믿게 만드는 홈페이지입니다. 트림별 실차 사진, 즉시 출고 재고, 전기차 보조금, 출고 후기처럼 구매 전에 궁금한 정보를 한 페이지에 모으고, 딜러가 관리자 모드에서 직접 바꾸도록 만들었습니다.',
      overview: {
        brand: '수입차 공식 딜러, 개인 세일즈 컨설턴트',
        purpose: '견적·시승 상담 전에 필요한 정보를 먼저 보여주고 상담 신청으로 연결',
        features: [
          '딜러 프로필 카드와 유튜브 채널 영상 연동',
          '이달의 프로모션 배너, 트림별 실차 사진 갤러리',
          '엑셀 재고 파일을 올리면 즉시 출고 차량표로 자동 정리, 모델명 검색',
          '지역별 전기차 보조금 표 (엑셀 업로드로 갱신)',
          '서비스센터 입고 신청, 견적·상담 신청 접수',
          '출고 후기, 카카오톡·전화 바로 연결',
          '관리자 모드에서 사진·문구·프로모션 직접 수정',
        ],
        design: '네이비 바탕에 블루 포인트. 정보가 많은 업종이라 표·검색·카드 중심으로 정돈',
      },
      palette: [
        { name: 'Navy', hex: '#0A1628' },
        { name: 'Paper', hex: '#F5F4F0' },
        { name: 'Blue', hex: '#5AA9E6' },
      ],
      fonts: ['Pretendard 계열 고딕', '세리프 영문 타이틀'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Firebase Auth', 'Firestore', 'SheetJS'],
    },
    {
      id: 'pilates-arch',
      public: true,
      featured: true,
      industry: '필라테스·피트니스',
      category: 'FITNESS',
      categoryKo: '필라테스',
      title: 'Arch Pilates Studio',
      subtitle: '소규모 프라이빗·그룹 필라테스 스튜디오',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'arch',
      screen: 'masked',
      screenNote: '상호·지역·강사 이름·리뷰 아이디를 가린 데모 화면입니다.',
      images: {
        desktop: 'assets/img/portfolio/pilates-arch/desktop.webp',
        mobile: 'assets/img/portfolio/pilates-arch/mobile.webp',
        screens: [],
      },
      summary: '아치형 도어와 베이지 톤 인테리어를 그대로 화면으로 옮긴 스튜디오 홈페이지입니다. 공간, 티칭 원칙, 프로그램, 시간표, 예약 안내를 차례로 보여주고 상담으로 자연스럽게 이어지도록 구성했습니다.',
      overview: {
        brand: '소규모 프라이빗·그룹 필라테스 스튜디오',
        purpose: '공간의 분위기와 수업의 전문성을 먼저 보여주고 체험·상담 문의로 연결',
        features: [
          '실제 스튜디오 사진과 아치형 프레임으로 프라이빗룸·그룹룸 소개',
          '티칭 원칙과 목적별 추천 (재활, 산전산후, 체력증진, 다이어트)',
          '개인 1:1, 듀엣 2:1, 그룹 3:1 수업 구성 안내',
          '관·강사별 그룹레슨 주간 시간표',
          '개인·그룹 예약 안내와 카카오톡 상담 연결',
          '네이버 리뷰 카드, 관리자 모드에서 리뷰 직접 추가·수정',
        ],
        design: '크림·베이지 바탕에 골드 라인, 명조 제목과 아치 형태를 반복한 차분한 구성',
      },
      palette: [
        { name: 'Cream', hex: '#F7F2E7' },
        { name: 'Gold', hex: '#B7935F' },
        { name: 'Ink', hex: '#3E3529' },
      ],
      fonts: ['Noto Serif KR', 'Pretendard'],
      stack: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 'wedding-snap',
      public: true,
      featured: true,
      industry: '웨딩·스냅',
      category: 'WEDDING',
      categoryKo: '웨딩 스냅',
      title: 'Wedding Snap Studio',
      subtitle: '웨딩 서브스냅 촬영 브랜드',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'snap',
      screen: 'real',
      screenNote: '',
      images: {
        label: '갤러리',
        desktop: 'assets/img/portfolio/wedding-snap/desktop.webp',
        mobile: 'assets/img/portfolio/wedding-snap/mobile.webp',
        screens: [
          { label: '첫 화면', desktop: 'assets/img/portfolio/wedding-snap/home-desktop.webp', mobile: 'assets/img/portfolio/wedding-snap/home-mobile.webp' },
          { label: '상품 안내', desktop: 'assets/img/portfolio/wedding-snap/package-desktop.webp', mobile: 'assets/img/portfolio/wedding-snap/package-mobile.webp' },
        ],
      },
      summary: '사진이 먼저 보이도록 장식을 덜어낸 촬영 브랜드 사이트입니다. 웨딩홀별 실제 촬영 사진을 갤러리로 정리하고, 상품·예약·이용 규정은 사이트 안에서 바로 확인할 수 있게 했습니다.',
      overview: {
        brand: '웨딩 서브스냅(아이폰, 폴라로이드) 촬영 브랜드',
        purpose: '예비 부부가 자신이 예식할 홀의 실제 사진을 바로 찾아보고 예약 문의까지',
        features: [
          '심볼과 로고가 천천히 드러나는 한 화면 첫 페이지, 햄버거 메뉴',
          '웨딩홀별 갤러리와 카테고리 탭 (호텔, 웨딩홀, 스튜디오, Baby)',
          '가로·세로 사진이 섞여도 잘리지 않는 컬럼 레이아웃',
          '상품 안내, 카메라, 예약 안내, 이용 규정 페이지',
          '촬영 원본에 같은 규격의 워터마크를 일괄로 넣는 작업 도구',
          '비밀번호로 보호된 계약서 페이지 (상품 선택 시 자동 작성, 이미지 저장)',
        ],
        design: '클래식 세리프와 기하학 산세리프 조합, 사진을 방해하지 않는 낮은 채도의 종이색',
      },
      palette: [
        { name: 'Paper', hex: '#FBFAF7' },
        { name: 'Taupe', hex: '#9B8E7A' },
        { name: 'Ink', hex: '#1C1A17' },
      ],
      fonts: ['Cormorant Garamond', 'Jost', 'Noto Sans KR'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Python', 'GoatCounter'],
    },
    {
      id: 'dog-bakery',
      public: true,
      featured: true,
      industry: '식품·반려동물',
      category: 'PET BAKERY',
      categoryKo: '수제간식 브랜드',
      title: 'Handmade Dog Bakery',
      subtitle: '강아지 케이크·수제간식 브랜드',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'bakery',
      screen: 'masked',
      screenNote: '상호·대표자·연락처를 바꾼 데모 화면입니다.',
      images: {
        label: '첫 화면',
        desktop: 'assets/img/portfolio/dog-bakery/desktop.webp',
        mobile: 'assets/img/portfolio/dog-bakery/mobile.webp',
        screens: [
          { label: '수제간식', desktop: 'assets/img/portfolio/dog-bakery/menu-desktop.webp', mobile: 'assets/img/portfolio/dog-bakery/menu-mobile.webp' },
          { label: '케이크 크기', desktop: 'assets/img/portfolio/dog-bakery/cakes-desktop.webp', mobile: 'assets/img/portfolio/dog-bakery/cakes-mobile.webp' },
          { label: '리뷰', desktop: 'assets/img/portfolio/dog-bakery/reviews-desktop.webp', mobile: 'assets/img/portfolio/dog-bakery/reviews-mobile.webp' },
        ],
      },
      summary: '직접 만든다는 걸 믿게 하는 것이 핵심이었습니다. 브랜드 컬러인 노랑과 우드 브라운으로 밝고 둥근 화면을 만들고, 수제 이야기·케이크·수제간식·리뷰를 페이지별로 나눠 쉽게 찾아보게 했습니다.',
      overview: {
        brand: '강아지 케이크·수제간식 공방',
        purpose: '수제 간식을 만드는 원칙을 보여주고 케이크 주문·상품 구매 문의로 연결',
        features: [
          '수제 이야기, 케이크, 수제간식, 리뷰, 클래스, 오시는 길 페이지',
          '반려견 실루엣으로 비교하는 케이크 크기 안내',
          '수제간식 메뉴와 스마트스토어 연결',
          '네이버 리뷰 키워드 그래프와 후기 카드',
          '카카오톡·인스타그램·스마트스토어 플로팅 버튼',
        ],
        design: '브랜드 컬러 노랑과 우드 브라운, 어둡지 않고 밝은 톤의 둥근 형태',
      },
      palette: [
        { name: 'Yellow', hex: '#FFD900' },
        { name: 'Wood', hex: '#804C37' },
        { name: 'Butter', hex: '#FFF6CC' },
      ],
      fonts: ['Gowun Batang', 'Gowun Dodum', 'Cormorant Garamond'],
      stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    },
    {
      id: 'bridal-atelier',
      public: true,
      featured: true,
      industry: '패션·뷰티',
      category: 'BRIDAL',
      categoryKo: '웨딩드레스',
      title: 'Bridal Couture Atelier',
      subtitle: '웨딩드레스 쇼룸',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'atelier',
      screen: 'masked',
      screenNote: '상호와 로고를 가린 데모 화면입니다. 화보 사진은 아직 받기 전이라 사진 자리가 비어 있습니다.',
      images: {
        label: '첫 화면',
        desktop: 'assets/img/portfolio/bridal-atelier/desktop.webp',
        mobile: 'assets/img/portfolio/bridal-atelier/mobile.webp',
        screens: [
          { label: '메뉴 열림', desktop: 'assets/img/portfolio/bridal-atelier/menu-desktop.webp', mobile: 'assets/img/portfolio/bridal-atelier/menu-mobile.webp' },
        ],
      },
      summary: '첫 화면에는 로고 하나만 둡니다. 드레스를 보러 온 사람에게 가장 먼저 필요한 건 고요함이라는 판단에서 출발했고, 타이포그래피와 여백만으로 브랜드의 결을 전하도록 장식을 덜어냈습니다.',
      overview: {
        brand: '웨딩드레스 쇼룸',
        purpose: '과하지 않으면서 어느 화면에서나 은은하게 느껴지는 고급스러움, 방문 상담으로 연결',
        features: [
          '로고만 천천히 드러나는 첫 화면',
          '오른쪽 메뉴를 열면 컬렉션·에디토리얼 목록이 펼쳐지는 구조',
          '시즌별 룩북 갤러리 (가로 사진은 한 줄 전체, 사진은 잘리지 않음)',
          '사진 크게 보기',
          '쇼룸 위치·상담 예약 안내',
          '컬렉션·시즌·사진을 한 곳에서 고치는 콘텐츠 구조',
        ],
        design: '실크빛 아이보리 바탕과 가는 세리프, 사진이 주인공이 되도록 장식을 덜어낸 구성',
      },
      palette: [
        { name: 'Silk', hex: '#F7F5F1' },
        { name: 'Taupe', hex: '#A59D93' },
        { name: 'Ink', hex: '#2A2724' },
      ],
      fonts: ['Cormorant Garamond', 'Noto Sans KR'],
      stack: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 'math-academy',
      public: true,
      featured: true,
      industry: '교육·학원',
      category: 'EDUCATION',
      categoryKo: '수학학원',
      title: 'Math Academy Platform',
      subtitle: '수학학원 홈페이지와 학원 운영 시스템',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'academy',
      screen: 'real',
      screenNote: '',
      images: {
        label: '첫 화면',
        desktop: 'assets/img/portfolio/math-academy/desktop.webp',
        mobile: 'assets/img/portfolio/math-academy/mobile.webp',
        screens: [
          { label: '학원 소개', desktop: 'assets/img/portfolio/math-academy/about-desktop.webp', mobile: 'assets/img/portfolio/math-academy/about-mobile.webp' },
        ],
      },
      summary: '학부모와 학생이 찾는 정보(학원 소개, 입학 안내, 커리큘럼, 교재, 동영상 강의, 상담 신청)를 첫 화면에서 바로 찾게 했습니다. 로그인하면 관리자·선생님·조교·학생이 각자의 화면으로 들어가는 운영 시스템과 이어집니다.',
      overview: {
        brand: '중등·고등 수학 전문 학원 (직접 운영 중)',
        purpose: '학원의 교육 철학과 관리 방식을 보여주고, 상담 신청과 학습 관리를 한곳에서',
        features: [
          '학원 소개, 입학 안내, 커리큘럼, 교재 소개, 졸업생 인터뷰, 언론 보도 페이지',
          '시험 대비 페이지와 셀프체크 바로가기',
          '명예의 전당 합격 소식',
          '전화·카카오톡·온라인 상담 신청서',
          '역할별 로그인 (관리자, 선생님, 조교, 학생)',
          '강의 영상 배정과 시청 진행률 관리',
        ],
        design: '깊은 보라 바탕에 골드 포인트, 정보를 카드로 나눠 학부모가 빠르게 찾도록',
      },
      palette: [
        { name: 'Night', hex: '#1A1230' },
        { name: 'Gold', hex: '#F0C040' },
        { name: 'Lavender', hex: '#F0EDF8' },
      ],
      fonts: ['Pretendard'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Firebase Auth', 'Firestore', 'Vimeo API', 'GitHub Pages'],
    },

    /* ----- 비공개: 데이터만 남겨 둔 프로젝트. public 을 true 로 바꾸면 바로 나타납니다 ----- */
    {
      id: 'benz-dealer',
      public: false,
      featured: true,
      industry: '자동차 딜러',
      category: 'AUTOMOTIVE',
      categoryKo: '수입차 딜러',
      title: 'Mercedes-Benz Dealer',
      subtitle: '공식 딜러 세일즈 컨설턴트 홈페이지',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'benz',
      screen: 'masked',
      screenNote: '딜러 이름·연락처·주소를 바꾼 데모 화면입니다.',
      images: {
        desktop: 'assets/img/portfolio/benz-dealer/desktop.webp',
        mobile: 'assets/img/portfolio/benz-dealer/mobile.webp',
        screens: [],
      },
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
      fonts: ['Fraunces', 'Noto Serif KR', 'Work Sans'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Web3Forms', 'GitHub Pages'],
    },
    {
      id: 'pilates-line',
      public: false,
      featured: true,
      industry: '필라테스·피트니스',
      category: 'FITNESS',
      categoryKo: '필라테스',
      title: 'Line Pilates Studio',
      subtitle: '필라테스 스튜디오',
      year: 2026,
      client: '',
      url: '',
      host: '',
      preview: 'line',
      screen: 'masked',
      screenNote: '',
      // 실제 화면 캡처 전 (공개하면 가안 미리보기로 표시됩니다)
      images: { desktop: '', mobile: '', screens: [] },
      summary: '로고의 세로선 하나를 화면 전체의 중심축으로 삼았습니다. 흰 여백과 검은 선만으로 정렬과 균형을 이야기하는 홈페이지입니다.',
      overview: {
        brand: '필라테스 스튜디오',
        purpose: '스튜디오의 정돈된 분위기를 첫 화면에서 전하고 체험 수업 문의로 연결',
        features: [
          '서로 다른 디자인 시안 3개를 제안해 선택',
          '성인 개인·듀엣 레슨, 키즈 정규반 구성과 수강료 안내',
          '강사 소개, 키즈 시간표, 체험 수업 신청 폼',
          '휴대폰에서는 중심선이 왼쪽으로 옮겨 가는 레이아웃',
        ],
        design: '흰 바탕과 검정 포인트. 세로 중심선을 따라 글과 사진이 교차하는 흑백 여백형',
      },
      palette: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#141414' },
        { name: 'Gray', hex: '#8A8A8A' },
      ],
      fonts: ['Jost', 'Nanum Myeongjo', 'Noto Sans KR'],
      stack: ['HTML', 'CSS', 'JavaScript'],
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
     예: { quote: '후기 내용', name: '필라테스 스튜디오 원장님', project: 'Arch Pilates Studio' },
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
