# Whale Rider

고래를 타고 1,500m 바다 코스를 달리는 레이싱 게임입니다.

## 웹 배포

`npm run build:pages`는 게임과 이미지를 `docs/`에 복사합니다. GitHub Pages 게시 소스는 `main` 브랜치의 `/docs` 폴더입니다. 변경 후 이 명령을 다시 실행하고 소스와 `docs/`를 함께 커밋하세요.

GitHub 저장소의 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, **main**, **/docs**를 선택해 저장하면 게시됩니다.

## 바로 플레이

`whale-rider-play.zip`을 다운로드하고 압축을 푼 뒤 `Whale Rider/Play.html`을 웹 브라우저로 열어 주세요. 인터넷 연결과 설치가 필요 없습니다. 코드 편집기로 열린다면 파일의 '연결 프로그램'을 Chrome, Edge, Safari 또는 Firefox로 선택하세요. 이 대화의 소스 코드 보기에서는 게임이 실행되지 않습니다.

`npm run package`를 실행하면 최신 게임과 이미지가 모두 내장된 ZIP을 다시 만듭니다.

## 개발 서버

```sh
cd /workspace/newgame
npm start
```

Node.js 기본 모듈만 사용하며 별도 패키지 설치가 필요 없습니다. 기본 포트는 3000이며 `PORT`로 변경할 수 있습니다. 서버는 `0.0.0.0`에 바인딩합니다. 이 환경 설정 UI 자체에는 웹 미리보기 기능이 없습니다.

## 조작

- ↑ ↓ / W S: 위아래 이동 (← → / A D도 지원)
- Space: 부스트
- P / Ⅱ: 일시 정지 및 계속하기
- 모바일: 화면의 ↑ ↓ 및 부스트 버튼
- SOUND: 효과음 켜기/끄기

진주를 모으면 부스트가 충전되고 산호에 충돌하면 감속합니다. 완주 시 기록을 확인하고 다시 시작할 수 있습니다.

오른쪽으로 전진하는 횡스크롤 게임입니다. 첨부 이미지를 참고해 생성한 고래와 수중 배경이 기본으로 포함됩니다. 게임 아래의 사진 선택 버튼으로 사용자 원본을 적용할 수 있습니다. 선택한 사진은 브라우저 로컬 저장소에만 보관됩니다.

`index.html`, `style.css`, `game.js`, `assets/`가 원본입니다. `npm run build`를 실행하면 이미지까지 내장한 단일 `whale-rider.html`을 다시 만듭니다.
