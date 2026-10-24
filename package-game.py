"""Package the self-contained game for download without a source-code viewer."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parent
instructions = """WHALE RIDER — 고래 레이싱

1. ZIP 파일의 압축을 풀어 주세요.
2. Play.html 파일을 Chrome, Edge, Safari 또는 Firefox로 열어 주세요.
3. '레이스 시작' 버튼을 누르면 게임을 플레이할 수 있습니다.

설치, 계정, 인터넷 연결이 필요하지 않습니다.
코드 편집기나 메모장으로 열렸다면 파일을 오른쪽 클릭한 뒤
'연결 프로그램'에서 웹 브라우저를 선택하세요.

위아래 이동: ↑ ↓ 또는 W / S
부스트: Space
일시 정지: P 또는 화면의 Ⅱ 버튼
모바일: 화면의 ↑ ↓ 및 ⚡ 버튼

이 대화의 코드 보기 화면에서는 게임이 실행되지 않습니다.
압축을 풀고 Play.html을 웹 브라우저에서 열어 주세요.
"""

with ZipFile(root / "whale-rider-play.zip", "w", ZIP_DEFLATED) as bundle:
    bundle.write(root / "whale-rider.html", "Whale Rider/Play.html")
    bundle.writestr("Whale Rider/READ ME.txt", instructions.encode("utf-8-sig"))

print("Created whale-rider-play.zip — extract and open Whale Rider/Play.html")
