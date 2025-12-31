# MCP 서버

로컬 및 원격 MCP 도구 추가.

*Model Context Protocol*, 또는 MCP를 사용하여 OpenCode에 외부 도구를 추가할 수 있습니다. OpenCode는 로컬 및 원격 서버를 모두 지원합니다.

추가되면 MCP 도구는 내장 도구와 함께 LLM에 자동으로 사용 가능합니다.

---

## 주의사항

MCP 서버를 사용하면 컨텍스트에 추가됩니다. 도구가 많으면 빠르게 누적될 수 있습니다. 따라서 사용하는 MCP 서버를 신중하게 선택하는 것이 좋습니다.

> **Tip**: MCP 서버는 컨텍스트에 추가되므로 활성화할 서버를 신중하게 선택해야 합니다.

GitHub MCP 서버와 같은 특정 MCP 서버는 많은 토큰을 추가하는 경향이 있으며 컨텍스트 한도를 쉽게 초과할 수 있습니다.

---

## 활성화

OpenCode 설정의 `mcp` 아래에 MCP 서버를 정의할 수 있습니다. 고유한 이름으로 각 MCP를 추가합니다. LLM에 프롬프트할 때 해당 이름으로 MCP를 참조할 수 있습니다.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "name-of-mcp-server": {
      // ...
      "enabled": true,
    },
    "name-of-other-mcp-server": {
      // ...
    },
  },
}
```

`enabled`를 `false`로 설정하여 서버를 비활성화할 수도 있습니다. 설정에서 제거하지 않고 서버를 일시적으로 비활성화하려는 경우에 유용합니다.

---

## 로컬

MCP 객체 내에서 `type`을 `"local"`로 설정하여 로컬 MCP 서버를 추가합니다.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-local-mcp-server": {
      "type": "local",
      "command": ["npx", "-y", "my-mcp-command"],
      "enabled": true,
      "environment": {
        "MY_ENV_VAR": "my_env_var_value",
      },
    },
  },
}
```

명령은 로컬 MCP 서버가 시작되는 방법입니다. 환경 변수 목록도 전달할 수 있습니다.

### 옵션

| 옵션 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | String | Y | MCP 서버 연결 유형, `"local"`이어야 함 |
| `command` | Array | Y | MCP 서버를 실행하는 명령 및 인수 |
| `environment` | Object | - | 서버 실행 시 설정할 환경 변수 |
| `enabled` | Boolean | - | 시작 시 MCP 서버 활성화 또는 비활성화 |
| `timeout` | Number | - | MCP 서버에서 도구를 가져오기 위한 타임아웃(밀리초). 기본값 5000(5초) |

---

## 원격

`type`을 `"remote"`로 설정하여 원격 MCP 서버를 추가합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://my-mcp-server.com",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer MY_API_KEY"
      }
    }
  }
}
```

`url`은 원격 MCP 서버의 URL이고 `headers` 옵션으로 헤더 목록을 전달할 수 있습니다.

### 옵션

| 옵션 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | String | Y | MCP 서버 연결 유형, `"remote"`이어야 함 |
| `url` | String | Y | 원격 MCP 서버의 URL |
| `enabled` | Boolean | - | 시작 시 MCP 서버 활성화 또는 비활성화 |
| `headers` | Object | - | 요청과 함께 보낼 헤더 |
| `oauth` | Object | - | OAuth 인증 설정 |
| `timeout` | Number | - | MCP 서버에서 도구를 가져오기 위한 타임아웃(밀리초) |

---

## OAuth

OpenCode는 원격 MCP 서버에 대한 OAuth 인증을 자동으로 처리합니다. 서버가 인증을 요구하면 OpenCode는:

1. 401 응답을 감지하고 OAuth 흐름을 시작합니다
2. 서버가 지원하는 경우 **Dynamic Client Registration (RFC 7591)**을 사용합니다
3. 향후 요청을 위해 토큰을 안전하게 저장합니다

### 자동

대부분의 OAuth 지원 MCP 서버의 경우 특별한 설정이 필요하지 않습니다. 원격 서버만 구성하면 됩니다.

### 인증

인증을 수동으로 트리거하거나 자격 증명을 관리할 수 있습니다.

특정 MCP 서버로 인증:

```bash
opencode mcp auth my-oauth-server
```

모든 MCP 서버 및 인증 상태 나열:

```bash
opencode mcp list
```

저장된 자격 증명 제거:

```bash
opencode mcp logout my-oauth-server
```

---

## 관리

MCP는 OpenCode에서 내장 도구와 함께 도구로 사용 가능합니다. 따라서 다른 도구와 마찬가지로 OpenCode 설정을 통해 관리할 수 있습니다.

### 전역

전역적으로 활성화하거나 비활성화할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    }
  },
  "tools": {
    "my-mcp-foo": false
  }
}
```

### 에이전트별

많은 MCP 서버가 있는 경우 전역적으로 비활성화하고 에이전트별로만 활성화할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-mcp": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command"],
      "enabled": true
    }
  },
  "tools": {
    "my-mcp*": false
  },
  "agent": {
    "my-agent": {
      "tools": {
        "my-mcp*": true
      }
    }
  }
}
```

---

## 예제

### Sentry

[Sentry MCP 서버](https://mcp.sentry.dev)를 추가하여 Sentry 프로젝트 및 이슈와 상호 작용합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

### Context7

[Context7 MCP 서버](https://github.com/upstash/context7)를 추가하여 문서를 검색합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### Grep by Vercel

[Grep by Vercel](https://grep.app) MCP 서버를 추가하여 GitHub의 코드 스니펫을 검색합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```
