# ACP 지원

ACP 호환 편집기에서 OpenCode 사용.

OpenCode는 [Agent Client Protocol](https://agentclientprotocol.com) 또는 (ACP)를 지원하여 호환 편집기 및 IDE에서 직접 사용할 수 있습니다.

> **Tip**: ACP를 지원하는 편집기 및 도구 목록은 [ACP 진행 보고서](https://zed.dev/blog/acp-progress-report#available-now)를 확인하세요.

ACP는 코드 편집기와 AI 코딩 에이전트 간의 통신을 표준화하는 오픈 프로토콜입니다.

---

## 설정

ACP를 통해 OpenCode를 사용하려면 편집기에서 `opencode acp` 명령을 실행하도록 구성합니다.

이 명령은 stdio를 통해 JSON-RPC로 편집기와 통신하는 ACP 호환 서브프로세스로 OpenCode를 시작합니다.

아래는 ACP를 지원하는 인기 있는 편집기에 대한 예시입니다.

### Zed

[Zed](https://zed.dev) 설정(`~/.config/zed/settings.json`)에 추가합니다:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

열려면 **Command Palette**에서 `agent: new thread` 액션을 사용합니다.

`keymap.json`을 편집하여 키보드 단축키를 바인딩할 수도 있습니다:

```json
[
  {
    "bindings": {
      "cmd-alt-o": [
        "agent::NewExternalAgentThread",
        {
          "agent": {
            "custom": {
              "name": "OpenCode",
              "command": {
                "command": "opencode",
                "args": ["acp"]
              }
            }
          }
        }
      ]
    }
  }
]
```

### JetBrains IDE

[문서](https://www.jetbrains.com/help/ai-assistant/acp.html)에 따라 [JetBrains IDE](https://www.jetbrains.com/)의 acp.json에 추가합니다:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

열려면 AI Chat 에이전트 선택기에서 새 'OpenCode' 에이전트를 사용합니다.

### Avante.nvim

[Avante.nvim](https://github.com/yetone/avante.nvim) 설정에 추가합니다:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

환경 변수를 전달해야 하는 경우:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" },
      env = {
        OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")
      }
    }
  }
}
```

### CodeCompanion.nvim

[CodeCompanion.nvim](https://github.com/olimorris/codecompanion.nvim)에서 OpenCode를 ACP 에이전트로 사용하려면 Neovim 설정에 다음을 추가합니다:

```lua
require("codecompanion").setup({
  strategies = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

---

## 지원

OpenCode는 터미널에서와 동일하게 ACP를 통해 작동합니다. 모든 기능이 지원됩니다:

> **Note**: `/undo` 및 `/redo`와 같은 일부 내장 슬래시 명령은 현재 지원되지 않습니다.

- 내장 도구 (파일 작업, 터미널 명령 등)
- 커스텀 도구 및 슬래시 명령
- OpenCode 설정에 구성된 MCP 서버
- `AGENTS.md`의 프로젝트별 규칙
- 커스텀 포매터 및 린터
- 에이전트 및 권한 시스템
