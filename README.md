# PAPERTOV 페이퍼토브 — 홈페이지

빌드 과정 없이 바로 올리는 정적 사이트입니다. 폴더 그대로 GitHub Pages, Netlify 등 어디에 올려도 작동합니다.

```
index.html                 페이지 구조
assets/css/style.css       전체 디자인
assets/css/previews.css    포트폴리오 미리보기 화면 디자인
assets/js/site-data.js     ★ 콘텐츠 (여기만 고치면 됩니다)
assets/js/previews.js      스크린샷이 없을 때 보이는 미리보기 화면
assets/js/app.js           첫 화면 3D 구(Three.js), 스크롤, 상세 보기, 문의 폼 동작
assets/img/portfolio/      포트폴리오 스크린샷 넣는 곳
assets/img/previews/       미리보기 화면 렌더 이미지 (구 표면 텍스처)
```

## 1. 내용 수정 — `assets/js/site-data.js`

| 바꿀 것 | 위치 |
|---|---|
| 포트폴리오 추가·삭제·순서 | `portfolio` 배열 (순서대로 PROJECT 01, 02… 자동 번호) |
| 큰 챕터로 보여줄지 | 각 항목 `featured: true / false` |
| VIEW WEBSITE 링크 | 각 항목 `url` (비우면 '자세히 보기'로 대체) |
| 가격 | `pricing.plans` 의 `price`, `unit`, `features` (※ 지금 금액은 예시) |
| 서비스 | `services` |
| 제작 과정 | `process` |
| 문의 정보 | `contact` 의 `phone`, `email`, `kakaoUrl`, `instagram` (비우면 숨김) |
| 후기 | `reviews` (실제 고객 후기만. 비어 있으면 영역 자체가 안 보임) |
| 사업자 정보 | `brand` 의 `bizNumber`, `address` |
| 영문 로고 표기 | `brand.nameEn` |

포트폴리오를 새로 추가할 때는 기존 항목 하나를 통째로 복사해서 값만 바꾸면 됩니다.

## 2. 실제 스크린샷 넣기

지금은 각 사이트의 분위기를 재현한 미리보기 화면이 들어가 있습니다. 스크린샷을 넣으면 자동으로 교체됩니다.

1. `assets/img/portfolio/` 에 이미지 저장
   - 데스크톱: 가로 1440px 기준 **페이지 전체 길이** 캡처 (스크롤에 따라 목업 안에서 페이지가 내려갑니다)
   - 휴대폰: 가로 390px 기준 전체 길이 캡처
2. 해당 프로젝트에 경로 입력
   ```js
   images: { desktop: 'assets/img/portfolio/pilates-desktop.jpg', mobile: 'assets/img/portfolio/pilates-mobile.jpg' },
   ```
3. 이미지는 비율을 유지한 채 위쪽부터 보이므로 잘리거나 찌그러지지 않습니다. 데스크톱만 넣고 휴대폰 캡처가 없으면 휴대폰 목업은 자동으로 숨겨집니다.

고객 이름·전화번호 등 고객을 특정할 수 있는 정보가 지워진 데모 버전으로 캡처하는 걸 권장합니다.

## 3. 첫 화면의 WEBSITE SPHERE

첫 화면의 구는 `portfolio` 데이터로 자동으로 만들어집니다. 따로 관리할 데이터는 없습니다.

- 구 표면의 화면: 각 프로젝트의 `images`(실제 스크린샷)를 쓰고, 없으면 `assets/img/previews/` 의 미리보기 렌더 이미지(`{preview}-desktop.webp`, `{preview}-mobile.webp`)를 씁니다.
- 프로젝트를 추가하면 구에도 자동으로 들어갑니다. 스크린샷도 렌더 이미지도 없으면 프로젝트 이름이 적힌 패널로 대신 표시됩니다.
- 구 안으로 들어갔을 때 크게 나오는 화면은 `portfolio` 의 첫 번째 프로젝트(PROJECT 01)입니다.
- 스크롤 길이(구 밖에서 안으로 들어가는 구간)는 `style.css` 의 `--film` 값으로 조절합니다. (데스크톱 280vh, 휴대폰 230vh)
- 3D(WebGL)를 쓸 수 없는 브라우저에서는 화면들을 원 안에 모은 정지 이미지로, '동작 줄이기' 설정에서는 움직이지 않는 구로 바뀝니다.

## 4. 문의 폼 연결 (Web3Forms)

1. https://web3forms.com 에서 받을 이메일을 입력하고 Access Key 발급
2. `contact.web3formsKey: '발급받은-키'` 입력
3. 이제 문의가 메일로 들어옵니다. (키가 없을 때는 전송되지 않고 안내 문구만 보입니다.)

## 5. GitHub Pages 배포

1. GitHub에 새 저장소를 만들고 이 폴더 안의 파일을 모두 업로드
2. Settings → Pages → Branch `main` / `(root)` → Save
3. 도메인 연결: Pages 설정의 Custom domain 에 도메인 입력, 도메인 업체 DNS에 GitHub Pages 주소 등록 → Enforce HTTPS 체크

## 6. 나중에 관리자 페이지를 붙일 때

모든 화면은 `site-data.js` 의 객체 하나로 그려집니다. 관리자 페이지에서 같은 모양의 데이터를 Firestore 등에 저장하고, `app.js` 맨 위의 `loadSiteData()` 함수만 그 데이터를 불러오도록 바꾸면 나머지 코드는 그대로 씁니다.
