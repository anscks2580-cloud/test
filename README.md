# (사)안양시학원연합회 홈페이지

GitHub Pages로 올리는 정적 홈페이지입니다. 빌드 과정 없이 파일을 그대로 올리면 됩니다.

## 고칠 곳

| 바꿀 내용 | 파일 |
| --- | --- |
| 전화·이메일·주소·팝업·외부 배너 | `assets/js/data.js` 맨 위 `SITE` |
| 공지사항·행사·분과 소식 글 추가 | `assets/js/data.js` 의 `BOARDS` (본문은 `body`, 첨부는 `files`, 행사 사진은 `thumb`) |
| 역대회장 사진 | `assets/img/presidents/` 에 넣고 `PRESIDENTS` 의 `photo` 에 경로 입력 |
| 조직 | `ORGANIZATION` |
| 협력업체 | `PARTNERS` |
| AMC 회차 정보·지정 접수처(주소·연락처·블로그) | `AMC` |
| 메뉴 | `assets/js/common.js` 맨 위 `NAV` |
| 색상·글꼴 | `assets/css/style.css` 맨 위 `:root` |

## 아직 연결이 필요한 기능

- **회원가입 / 로그인 / 정회원전용**: 약관 동의·로그인 화면만 있음. 회원 시스템(Firebase Auth 등) 연결 필요. 기존 사이트의 가입 양식 항목은 확인하지 못함.
- **AMC 수험표·성적 조회**: 화면과 출력 양식은 완성. 학생 개인정보라 데이터는 이 저장소에 넣지 말고 외부 DB에 두고 `assets/js/amc.js` 의 `AMC_API` 로 연결. 연결 후 `data.js` 에서 `ticketOpen`, `scoreOpen` 을 `true` 로.
- **정회원 입회 신청**: FormSubmit 으로 `SITE.formEmail` 에 메일 발송. 처음 한 번은 FormSubmit 인증 메일을 확인해야 접수가 시작됨.
- **게시물 본문·사진**: 연수·법정의무교육 과정 2건만 본문 입력됨. 나머지는 기존 사이트 DB 받은 뒤 `body`, `thumb`, `files` 채우기. 역대회장 사진 7장, 로고, 행사 사진도 같은 방식.

## 도메인 연결 순서

1. 저장소 Settings → Pages 에서 배포 확인 (github.io 주소로 먼저 점검)
2. 새 사이트 점검이 끝나면 Custom domain 에 `aaoh.or.kr` 입력 (CNAME 파일 자동 생성)
3. 도메인 관리 업체에서 DNS 를 GitHub Pages 로 변경
4. HTTPS 적용 확인 후 기존 임대 계약 해지

기존 주소(`bbs/board.php?bo_table=...`, `sub1-2.php` 등)로 들어오면 `404.html` 이 새 주소로 넘겨 줍니다.
