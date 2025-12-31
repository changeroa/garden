# 권한

실행에 승인이 필요한 작업 제어.

기본적으로 OpenCode는 `doom_loop` 및 `external_directory`를 제외한 대부분의 작업을 승인 없이 허용합니다. 이는 기본값으로 `ask`로 설정됩니다. `permission` 옵션을 사용하여 이를 구성할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow",
    "bash": "ask",
    "skill": "ask",
    "webfetch": "deny",
    "doom_loop": "ask",
    "external_directory": "ask"
  }
}
```

`edit`, `bash`, `skill`, `webfetch`, `doom_loop`, `external_directory` 도구에 대한 세분화된 제어를 구성할 수 있습니다.

- `"ask"` — 도구 실행 전에 승인 요청
- `"allow"` — 승인 없이 모든 작업 허용
- `"deny"` — 도구 비활성화

---

## 도구

현재 `permission` 옵션을 통해 `edit`, `bash`, `skill`, `webfetch`, `doom_loop`, `external_directory` 도구에 대한 권한을 구성할 수 있습니다.

### edit

`permission.edit` 키를 사용하여 파일 편집 작업에 사용자 승인이 필요한지 여부를 제어합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask"
  }
}
```

### bash

`permission.bash` 키를 사용하여 bash 명령 전체에 사용자 승인이 필요한지 여부를 제어할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": "ask"
  }
}
```

또는 특정 명령을 대상으로 하고 `allow`, `ask` 또는 `deny`로 설정할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "git push": "ask",
      "git status": "allow",
      "git diff": "allow",
      "npm run build": "allow",
      "ls": "allow",
      "pwd": "allow"
    }
  }
}
```

#### 와일드카드

와일드카드를 사용하여 특정 bash 명령에 대한 권한을 관리할 수도 있습니다.

예를 들어, 모든 Terraform 명령을 **비활성화**합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "terraform *": "deny"
    }
  }
}
```

`*` 와일드카드를 사용하여 모든 명령에 대한 권한을 관리할 수도 있습니다. 예를 들어, 특정 몇 가지를 제외한 모든 명령을 **거부**합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "*": "deny",
      "pwd": "allow",
      "git status": "ask"
    }
  }
}
```

여기서 특정 규칙이 `*` 와일드카드를 재정의할 수 있습니다.

### webfetch

`permission.webfetch` 키를 사용하여 LLM이 웹 페이지를 가져올 수 있는지 여부를 제어합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "webfetch": "ask"
  }
}
```

### doom_loop

`permission.doom_loop` 키를 사용하여 doom 루프가 감지될 때 승인이 필요한지 여부를 제어합니다. doom 루프는 동일한 도구가 동일한 인수로 연속 3번 호출될 때 발생합니다.

이는 LLM이 진행 없이 동일한 작업을 반복적으로 시도하는 무한 루프를 방지하는 데 도움이 됩니다.

### external_directory

`permission.external_directory` 키를 사용하여 작업 디렉토리 외부의 파일에 액세스할 때 파일 작업에 승인이 필요한지 여부를 제어합니다.

이는 프로젝트 외부의 파일에 대한 의도하지 않은 수정을 방지하기 위한 추가 안전 계층을 제공합니다.

---

## 에이전트

에이전트별 권한을 구성할 수도 있습니다. 에이전트별 설정은 전역 설정을 재정의합니다. [에이전트 권한에 대해 자세히 알아보기](/docs/agents#permissions).

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "git push": "ask"
    }
  },
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "git push": "allow"
        }
      }
    }
  }
}
```

예를 들어, 여기서 `build` 에이전트는 `git push` 명령을 허용하도록 전역 `bash` 권한을 재정의합니다.

Markdown으로도 에이전트에 대한 권한을 구성할 수 있습니다.

```markdown
---
description: 편집 없이 코드 검토
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---

코드를 분석하고 변경 사항만 제안합니다.
```
