# 키바인드

키바인드 커스터마이징.

OpenCode에는 OpenCode 설정을 통해 커스터마이징할 수 있는 키바인드 목록이 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {
    "leader": "ctrl+x",
    "app_exit": "ctrl+c,ctrl+d,<leader>q",
    "editor_open": "<leader>e",
    "theme_list": "<leader>t",
    "sidebar_toggle": "<leader>b",
    "session_new": "<leader>n",
    "session_list": "<leader>l",
    "session_share": "none",
    "session_interrupt": "escape",
    "session_compact": "<leader>c",
    "messages_undo": "<leader>u",
    "messages_redo": "<leader>r",
    "model_list": "<leader>m",
    "agent_cycle": "tab",
    "agent_cycle_reverse": "shift+tab",
    "input_clear": "ctrl+c",
    "input_paste": "ctrl+v",
    "input_submit": "return",
    "input_newline": "shift+return,ctrl+return,alt+return,ctrl+j"
  }
}
```

---

## 리더 키

OpenCode는 대부분의 키바인드에 `leader` 키를 사용합니다. 이렇게 하면 터미널에서 충돌이 방지됩니다.

기본적으로 `ctrl+x`가 리더 키이며 대부분의 작업에서는 먼저 리더 키를 누른 다음 단축키를 눌러야 합니다. 예를 들어, 새 세션을 시작하려면 먼저 `ctrl+x`를 누른 다음 `n`을 누릅니다.

키바인드에 리더 키를 사용할 필요는 없지만 사용하는 것이 좋습니다.

---

## 키바인드 비활성화

설정에 값이 "none"인 키를 추가하여 키바인드를 비활성화할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {
    "session_compact": "none"
  }
}
```

---

## 데스크톱 프롬프트 단축키

OpenCode 데스크톱 앱 프롬프트 입력은 텍스트 편집을 위한 일반적인 Readline/Emacs 스타일 단축키를 지원합니다. 이것은 내장되어 있으며 현재 `opencode.json`을 통해 구성할 수 없습니다.

| 단축키 | 동작 |
|--------|------|
| `ctrl+a` | 현재 줄의 시작으로 이동 |
| `ctrl+e` | 현재 줄의 끝으로 이동 |
| `ctrl+b` | 커서를 한 문자 뒤로 이동 |
| `ctrl+f` | 커서를 한 문자 앞으로 이동 |
| `alt+b` | 커서를 한 단어 뒤로 이동 |
| `alt+f` | 커서를 한 단어 앞으로 이동 |
| `ctrl+d` | 커서 아래의 문자 삭제 |
| `ctrl+k` | 줄 끝까지 삭제 |
| `ctrl+u` | 줄 시작까지 삭제 |
| `ctrl+w` | 이전 단어 삭제 |
| `alt+d` | 다음 단어 삭제 |
| `ctrl+y` | 마지막으로 삭제한 텍스트 붙여넣기 |
| `ctrl+t` | 문자 바꾸기 |
| `ctrl+g` | 팝오버 취소 / 실행 중인 응답 중단 |

---

## Shift+Enter

일부 터미널은 기본적으로 Enter와 함께 수정자 키를 보내지 않습니다. `Shift+Enter`를 이스케이프 시퀀스로 보내도록 터미널을 구성해야 할 수 있습니다.

### Windows Terminal

다음 위치에서 `settings.json`을 엽니다:

```
%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json
```

루트 수준 `actions` 배열에 다음을 추가합니다:

```json
"actions": [
  {
    "command": {
      "action": "sendInput",
      "input": "\u001b[13;2u"
    },
    "id": "User.sendInput.ShiftEnterCustom"
  }
]
```

루트 수준 `keybindings` 배열에 다음을 추가합니다:

```json
"keybindings": [
  {
    "keys": "shift+enter",
    "id": "User.sendInput.ShiftEnterCustom"
  }
]
```

파일을 저장하고 Windows Terminal을 다시 시작하거나 새 탭을 엽니다.
