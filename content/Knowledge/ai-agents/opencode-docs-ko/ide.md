# IDE

VS Code, Cursor 및 기타 IDE용 OpenCode 확장 프로그램.

OpenCode는 VS Code, Cursor 또는 터미널을 지원하는 모든 IDE와 통합됩니다. 터미널에서 `opencode`를 실행하기만 하면 시작됩니다.

---

## 사용법

- **빠른 실행**: `Cmd+Esc`(Mac) 또는 `Ctrl+Esc`(Windows/Linux)를 사용하여 분할 터미널 보기에서 OpenCode를 열거나, 이미 실행 중인 터미널 세션이 있으면 포커스합니다.
- **새 세션**: `Cmd+Shift+Esc`(Mac) 또는 `Ctrl+Shift+Esc`(Windows/Linux)를 사용하여 이미 열려 있어도 새 OpenCode 터미널 세션을 시작합니다. UI의 OpenCode 버튼을 클릭할 수도 있습니다.
- **컨텍스트 인식**: 현재 선택 또는 탭을 OpenCode와 자동으로 공유합니다.
- **파일 참조 단축키**: `Cmd+Option+K`(Mac) 또는 `Alt+Ctrl+K`(Linux/Windows)를 사용하여 파일 참조를 삽입합니다. 예: `@File#L37-42`.

---

## 설치

VS Code 및 Cursor, Windsurf, VSCodium과 같은 인기 있는 포크에 OpenCode를 설치하려면:

1. VS Code 열기
2. 통합 터미널 열기
3. `opencode` 실행 - 확장 프로그램이 자동으로 설치됨

TUI에서 `/editor` 또는 `/export`를 실행할 때 자체 IDE를 사용하려면 `export EDITOR="code --wait"`를 설정해야 합니다. [자세히 알아보기](/docs/tui/#editor-setup).

---

### 수동 설치

Extension Marketplace에서 **OpenCode**를 검색하고 **Install**을 클릭합니다.

---

### 문제 해결

확장 프로그램이 자동으로 설치되지 않는 경우:

- 통합 터미널에서 `opencode`를 실행하고 있는지 확인합니다.
- IDE용 CLI가 설치되어 있는지 확인합니다:
  - VS Code: `code` 명령
  - Cursor: `cursor` 명령
  - Windsurf: `windsurf` 명령
  - VSCodium: `codium` 명령
  - 그렇지 않으면 `Cmd+Shift+P`(Mac) 또는 `Ctrl+Shift+P`(Windows/Linux)를 실행하고 "Shell Command: Install 'code' command in PATH"를 검색합니다(또는 IDE에 해당하는 것)
- VS Code에 확장 프로그램을 설치할 권한이 있는지 확인합니다
