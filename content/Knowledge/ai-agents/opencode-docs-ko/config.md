# 설정

OpenCode JSON 설정 사용하기.

JSON 설정 파일을 사용하여 OpenCode를 구성할 수 있습니다.

---

## 형식

OpenCode는 **JSON**과 **JSONC**(주석이 있는 JSON) 형식을 모두 지원합니다.

```jsonc
// opencode.jsonc
{
  "$schema": "https://opencode.ai/config.json",
  // 테마 설정
  "theme": "opencode",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true,
}
```

---

## 위치

설정을 여러 다른 위치에 배치할 수 있으며, 우선순위가 다릅니다.

> **Note**: 설정 파일은 교체되지 않고 **병합됩니다**.

설정 파일은 교체되지 않고 병합됩니다. 다음 설정 위치의 설정이 결합됩니다. 나중의 설정은 충돌하는 키에 대해서만 이전 설정을 재정의합니다. 충돌하지 않는 설정은 모두 보존됩니다.

예를 들어, 전역 설정에서 `theme: "opencode"`와 `autoupdate: true`를 설정하고, 프로젝트 설정에서 `model: "anthropic/claude-sonnet-4-5"`를 설정하면, 최종 설정에는 세 가지 설정이 모두 포함됩니다.

---

### 전역

전역 OpenCode 설정을 `~/.config/opencode/opencode.json`에 배치합니다. 테마, 제공자 또는 키바인드와 같은 것에 전역 설정을 사용하는 것이 좋습니다.

---

### 프로젝트별

프로젝트에 `opencode.json`을 추가할 수도 있습니다. 이 설정의 설정은 전역 설정과 병합되고 재정의할 수 있습니다. 이것은 프로젝트에 특정한 제공자나 모드를 구성하는 데 유용합니다.

> **Tip**: 프로젝트별 설정을 프로젝트 루트에 배치하세요.

OpenCode가 시작될 때, 현재 디렉토리에서 설정 파일을 찾거나 가장 가까운 Git 디렉토리까지 탐색합니다.

이것은 Git에 체크인해도 안전하며 전역 설정과 동일한 스키마를 사용합니다.

---

### 사용자 정의 경로

`OPENCODE_CONFIG` 환경 변수를 사용하여 사용자 정의 설정 파일 경로를 지정할 수도 있습니다.

```bash
export OPENCODE_CONFIG=/path/to/my/custom-config.json
opencode run "Hello world"
```

이 설정의 설정은 전역 및 프로젝트 설정과 병합되고 **재정의할 수 있습니다**.

---

### 사용자 정의 디렉토리

`OPENCODE_CONFIG_DIR` 환경 변수를 사용하여 사용자 정의 설정 디렉토리를 지정할 수 있습니다. 이 디렉토리는 표준 `.opencode` 디렉토리와 마찬가지로 에이전트, 명령, 모드 및 플러그인을 검색하며, 동일한 구조를 따라야 합니다.

```bash
export OPENCODE_CONFIG_DIR=/path/to/my/config-directory
opencode run "Hello world"
```

사용자 정의 디렉토리는 전역 설정 및 `.opencode` 디렉토리 이후에 로드되므로 해당 설정을 **재정의할 수 있습니다**.

---

## 스키마

설정 파일에는 [**`opencode.ai/config.json`**](https://opencode.ai/config.json)에 정의된 스키마가 있습니다.

편집기가 스키마를 기반으로 유효성 검사 및 자동 완성을 수행할 수 있어야 합니다.

---

### TUI

`tui` 옵션을 통해 TUI 관련 설정을 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": {
      "enabled": true
    },
    "diff_style": "auto"
  }
}
```

사용 가능한 옵션:

- `scroll_acceleration.enabled` - macOS 스타일 스크롤 가속 활성화. **`scroll_speed`보다 우선합니다.**
- `scroll_speed` - 사용자 정의 스크롤 속도 배율(기본값: `1`, 최소값: `1`). `scroll_acceleration.enabled`가 `true`이면 무시됩니다.
- `diff_style` - diff 렌더링 제어. `"auto"`는 터미널 너비에 맞게 조정되고, `"stacked"`는 항상 단일 열을 표시합니다.

[여기에서 TUI 사용에 대해 자세히 알아보세요](/docs/tui).

---

### 서버

`server` 옵션을 통해 `opencode serve` 및 `opencode web` 명령에 대한 서버 설정을 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true
  }
}
```

사용 가능한 옵션:

- `port` - 수신 대기할 포트.
- `hostname` - 수신 대기할 호스트 이름. `mdns`가 활성화되고 호스트 이름이 설정되지 않은 경우 기본값은 `0.0.0.0`입니다.
- `mdns` - mDNS 서비스 검색 활성화. 이를 통해 네트워크의 다른 장치가 OpenCode 서버를 검색할 수 있습니다.

[여기에서 서버에 대해 자세히 알아보세요](/docs/server).

---

### 도구

`tools` 옵션을 통해 LLM이 사용할 수 있는 도구를 관리할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": false,
    "bash": false
  }
}
```

[여기에서 도구에 대해 자세히 알아보세요](/docs/tools).

---

### 모델

`provider`, `model` 및 `small_model` 옵션을 통해 OpenCode 설정에서 사용하려는 제공자와 모델을 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {},
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

`small_model` 옵션은 제목 생성과 같은 경량 작업을 위한 별도의 모델을 구성합니다. 기본적으로 OpenCode는 제공자에서 더 저렴한 모델이 있으면 사용하고, 그렇지 않으면 메인 모델로 대체합니다.

제공자 옵션에는 `timeout`과 `setCacheKey`를 포함할 수 있습니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "setCacheKey": true
      }
    }
  }
}
```

- `timeout` - 밀리초 단위의 요청 타임아웃(기본값: 300000). 비활성화하려면 `false`로 설정.
- `setCacheKey` - 지정된 제공자에 대해 항상 캐시 키가 설정되도록 함.

[로컬 모델](/docs/models#local)도 구성할 수 있습니다. [자세히 알아보기](/docs/models).

---

### 테마

`theme` 옵션을 통해 OpenCode 설정에서 사용하려는 테마를 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": ""
}
```

[여기에서 자세히 알아보세요](/docs/themes).

---

### 에이전트

`agent` 옵션을 통해 특정 작업을 위한 전문 에이전트를 구성할 수 있습니다.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "모범 사례 및 잠재적 문제에 대한 코드 검토",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "당신은 코드 리뷰어입니다. 보안, 성능 및 유지 관리에 중점을 두세요.",
      "tools": {
        // 검토 전용 에이전트에 대해 파일 수정 도구 비활성화
        "write": false,
        "edit": false,
      },
    },
  },
}
```

`~/.config/opencode/agent/` 또는 `.opencode/agent/`의 마크다운 파일을 사용하여 에이전트를 정의할 수도 있습니다. [여기에서 자세히 알아보세요](/docs/agents).

---

### 기본 에이전트

`default_agent` 옵션을 사용하여 기본 에이전트를 설정할 수 있습니다. 이것은 명시적으로 지정되지 않은 경우 사용되는 에이전트를 결정합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "plan"
}
```

기본 에이전트는 기본 에이전트여야 합니다(서브 에이전트가 아님). `"build"` 또는 `"plan"`과 같은 내장 에이전트이거나 정의한 [커스텀 에이전트](/docs/agents)일 수 있습니다. 지정된 에이전트가 존재하지 않거나 서브 에이전트인 경우 OpenCode는 경고와 함께 `"build"`로 대체합니다.

이 설정은 TUI, CLI(`opencode run`), 데스크톱 앱 및 GitHub Action 모든 인터페이스에 적용됩니다.

---

### 공유

`share` 옵션을 통해 [공유](/docs/share) 기능을 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "share": "manual"
}
```

옵션:

- `"manual"` - 명령을 통한 수동 공유 허용(기본값)
- `"auto"` - 새 대화 자동 공유
- `"disabled"` - 공유 완전히 비활성화

기본적으로 공유는 수동 모드로 설정되어 `/share` 명령을 사용하여 명시적으로 대화를 공유해야 합니다.

---

### 명령

`command` 옵션을 통해 반복 작업을 위한 사용자 정의 명령을 구성할 수 있습니다.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "커버리지 보고서와 함께 전체 테스트 스위트를 실행하고 실패를 표시합니다.\n실패한 테스트에 집중하고 수정 사항을 제안합니다.",
      "description": "커버리지와 함께 테스트 실행",
      "agent": "build",
      "model": "anthropic/claude-haiku-4-5",
    },
    "component": {
      "template": "TypeScript 지원이 포함된 $ARGUMENTS라는 새 React 컴포넌트를 만듭니다.\n적절한 타이핑과 기본 구조를 포함합니다.",
      "description": "새 컴포넌트 만들기",
    },
  },
}
```

`~/.config/opencode/command/` 또는 `.opencode/command/`의 마크다운 파일을 사용하여 명령을 정의할 수도 있습니다. [여기에서 자세히 알아보세요](/docs/commands).

---

### 키바인드

`keybinds` 옵션을 통해 키바인드를 사용자 정의할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {}
}
```

[여기에서 자세히 알아보세요](/docs/keybinds).

---

### 자동 업데이트

OpenCode는 시작할 때 자동으로 새 업데이트를 다운로드합니다. `autoupdate` 옵션으로 비활성화할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "autoupdate": false
}
```

업데이트를 원하지 않지만 새 버전을 사용할 수 있을 때 알림을 받으려면 `autoupdate`를 `"notify"`로 설정합니다.

---

### 포매터

`formatter` 옵션을 통해 코드 포매터를 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

[여기에서 포매터에 대해 자세히 알아보세요](/docs/formatters).

---

### 권한

기본적으로 opencode는 명시적인 승인 없이 **모든 작업을 허용합니다**. `permission` 옵션을 사용하여 변경할 수 있습니다.

예를 들어, `edit` 및 `bash` 도구가 사용자 승인을 요구하도록 하려면:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

[여기에서 권한에 대해 자세히 알아보세요](/docs/permissions).

---

### 컴팩션

`compaction` 옵션을 통해 컨텍스트 컴팩션 동작을 제어할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "compaction": {
    "auto": true,
    "prune": true
  }
}
```

- `auto` - 컨텍스트가 꽉 차면 자동으로 세션 컴팩트(기본값: `true`).
- `prune` - 토큰을 절약하기 위해 오래된 도구 출력 제거(기본값: `true`).

---

### 와처

`watcher` 옵션을 통해 파일 와처 무시 패턴을 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```

패턴은 glob 구문을 따릅니다. 파일 감시에서 노이즈가 많은 디렉토리를 제외하는 데 사용합니다.

---

### MCP 서버

`mcp` 옵션을 통해 사용하려는 MCP 서버를 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {}
}
```

[여기에서 자세히 알아보세요](/docs/mcp-servers).

---

### 플러그인

[플러그인](/docs/plugins)은 사용자 정의 도구, 훅 및 통합으로 OpenCode를 확장합니다.

플러그인 파일을 `.opencode/plugin/` 또는 `~/.config/opencode/plugin/`에 배치합니다. `plugin` 옵션을 통해 npm에서 플러그인을 로드할 수도 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

[여기에서 자세히 알아보세요](/docs/plugins).

---

### 지침

`instructions` 옵션을 통해 사용 중인 모델에 대한 지침을 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

이것은 지침 파일에 대한 경로와 glob 패턴의 배열을 받습니다. [여기에서 규칙에 대해 자세히 알아보세요](/docs/rules).

---

### 비활성화된 제공자

`disabled_providers` 옵션을 통해 자동으로 로드되는 제공자를 비활성화할 수 있습니다. 이것은 자격 증명이 있더라도 특정 제공자가 로드되지 않도록 하려는 경우에 유용합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "disabled_providers": ["openai", "gemini"]
}
```

> **Note**: `disabled_providers`는 `enabled_providers`보다 우선합니다.

`disabled_providers` 옵션은 제공자 ID의 배열을 받습니다. 제공자가 비활성화되면:

- 환경 변수가 설정되어 있어도 로드되지 않습니다.
- `/connect` 명령을 통해 API 키가 구성되어 있어도 로드되지 않습니다.
- 제공자의 모델이 모델 선택 목록에 나타나지 않습니다.

---

### 활성화된 제공자

`enabled_providers` 옵션을 통해 제공자의 허용 목록을 지정할 수 있습니다. 설정하면 지정된 제공자만 활성화되고 다른 모든 제공자는 무시됩니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "enabled_providers": ["anthropic", "openai"]
}
```

이것은 하나씩 비활성화하는 대신 OpenCode가 특정 제공자만 사용하도록 제한하려는 경우에 유용합니다.

> **Note**: `disabled_providers`는 `enabled_providers`보다 우선합니다.

제공자가 `enabled_providers`와 `disabled_providers` 모두에 나타나면 하위 호환성을 위해 `disabled_providers`가 우선합니다.

---

### 실험적

`experimental` 키에는 활발히 개발 중인 옵션이 포함됩니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "experimental": {}
}
```

> **Caution**: 실험적 옵션은 안정적이지 않습니다. 예고 없이 변경되거나 제거될 수 있습니다.

---

## 변수

설정 파일에서 변수 치환을 사용하여 환경 변수와 파일 내용을 참조할 수 있습니다.

---

### 환경 변수

환경 변수를 대체하려면 `{env:VARIABLE_NAME}`을 사용합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "models": {},
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

환경 변수가 설정되지 않은 경우 빈 문자열로 대체됩니다.

---

### 파일

파일 내용을 대체하려면 `{file:path/to/file}`을 사용합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["./custom-instructions.md"],
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

파일 경로는 다음일 수 있습니다:

- 설정 파일 디렉토리에 상대적
- 또는 `/` 또는 `~`로 시작하는 절대 경로

이것은 다음에 유용합니다:

- API 키와 같은 민감한 데이터를 별도의 파일에 보관.
- 설정을 복잡하게 만들지 않고 큰 지침 파일 포함.
- 여러 설정 파일에서 공통 설정 스니펫 공유.
