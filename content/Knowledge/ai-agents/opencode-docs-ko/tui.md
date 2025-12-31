# TUI

OpenCode 터미널 사용자 인터페이스 사용하기.

OpenCode는 LLM과 함께 프로젝트에서 작업하기 위한 대화형 터미널 인터페이스 또는 TUI를 제공합니다.

OpenCode를 실행하면 현재 디렉토리에 대한 TUI가 시작됩니다.

```bash
opencode
```

또는 특정 작업 디렉토리에 대해 시작할 수 있습니다.

```bash
opencode /path/to/project
```

TUI에 들어가면 메시지로 프롬프트할 수 있습니다.

```
코드베이스에 대한 간략한 요약을 알려주세요.
```

---

## 파일 참조

`@`를 사용하여 메시지에서 파일을 참조할 수 있습니다. 현재 작업 디렉토리에서 퍼지 파일 검색을 수행합니다.

> **Tip**: `@`를 사용하여 메시지에서 파일을 참조할 수도 있습니다.

```
@packages/functions/src/api/index.ts에서 인증이 어떻게 처리되나요?
```

파일 내용이 대화에 자동으로 추가됩니다.

---

## Bash 명령

`!`로 메시지를 시작하면 셸 명령을 실행합니다.

```
!ls -la
```

명령의 출력이 도구 결과로 대화에 추가됩니다.

---

## 명령

OpenCode TUI를 사용할 때 `/` 다음에 명령 이름을 입력하여 작업을 빠르게 실행할 수 있습니다. 예:

```
/help
```

대부분의 명령에는 `ctrl+x`를 리더 키로 사용하는 키바인드도 있습니다. [자세히 알아보기](/docs/keybinds).

사용 가능한 모든 슬래시 명령:

| 명령 | 설명 | 키바인드 |
|------|------|----------|
| `/connect` | OpenCode에 제공자 추가 | - |
| `/compact` | 현재 세션 압축. *별칭*: `/summarize` | `ctrl+x c` |
| `/details` | 도구 실행 세부 정보 토글 | `ctrl+x d` |
| `/editor` | 메시지 작성을 위한 외부 편집기 열기 | `ctrl+x e` |
| `/exit` | OpenCode 종료. *별칭*: `/quit`, `/q` | `ctrl+x q` |
| `/export` | 현재 대화를 Markdown으로 내보내기 | `ctrl+x x` |
| `/help` | 도움말 대화 상자 표시 | `ctrl+x h` |
| `/init` | `AGENTS.md` 파일 생성 또는 업데이트 | `ctrl+x i` |
| `/models` | 사용 가능한 모델 나열 | `ctrl+x m` |
| `/new` | 새 세션 시작. *별칭*: `/clear` | `ctrl+x n` |
| `/redo` | 이전에 취소된 메시지 다시 실행 | `ctrl+x r` |
| `/sessions` | 세션 나열 및 전환. *별칭*: `/resume`, `/continue` | `ctrl+x l` |
| `/share` | 현재 세션 공유 | `ctrl+x s` |
| `/themes` | 사용 가능한 테마 나열 | `ctrl+x t` |
| `/undo` | 대화에서 마지막 메시지 취소 | `ctrl+x u` |
| `/unshare` | 현재 세션 공유 해제 | - |

> **Tip**: 파일 변경 사항도 되돌려집니다. 내부적으로 Git을 사용하여 파일 변경 사항을 관리합니다. 따라서 프로젝트가 **Git 저장소**여야 합니다.

---

## 편집기 설정

`/editor`와 `/export` 명령 모두 `EDITOR` 환경 변수에 지정된 편집기를 사용합니다.

```bash
# nano 또는 vim 예시
export EDITOR=nano
export EDITOR=vim

# GUI 편집기의 경우 --wait 포함
export EDITOR="code --wait"
```

영구적으로 만들려면 셸 프로필(`~/.bashrc`, `~/.zshrc` 등)에 추가합니다.

인기 있는 편집기 옵션:
- `code` - Visual Studio Code
- `cursor` - Cursor
- `windsurf` - Windsurf
- `nvim` - Neovim
- `vim` - Vim
- `nano` - Nano

> **Note**: VS Code와 같은 일부 편집기는 `--wait` 플래그로 시작해야 합니다.

---

## 설정

OpenCode 설정 파일을 통해 TUI 동작을 사용자 정의할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": {
      "enabled": true
    }
  }
}
```

### 옵션

- `scroll_acceleration` - macOS 스타일 스크롤 가속 활성화. **이 설정은 `scroll_speed`보다 우선하며 활성화되면 이를 재정의합니다.**
- `scroll_speed` - 스크롤 명령 사용 시 TUI가 스크롤하는 속도 제어(최소값: `1`). Unix에서는 기본값 `1`, Windows에서는 `3`. **참고: `scroll_acceleration.enabled`가 `true`로 설정되면 무시됩니다.**

---

## 커스터마이징

명령 팔레트(`ctrl+x h` 또는 `/help`)를 사용하여 TUI 보기의 다양한 측면을 사용자 정의할 수 있습니다. 이러한 설정은 다시 시작해도 유지됩니다.

### 사용자 이름 표시

채팅 메시지에 사용자 이름이 표시되는지 여부를 토글합니다. 다음을 통해 액세스:

- 명령 팔레트: "username" 또는 "hide username" 검색
- 설정이 자동으로 저장되며 TUI 세션에서 기억됩니다
