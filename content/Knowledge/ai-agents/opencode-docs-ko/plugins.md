# 플러그인

OpenCode를 확장하기 위한 자체 플러그인 작성.

플러그인을 사용하면 다양한 이벤트에 연결하고 동작을 사용자 정의하여 OpenCode를 확장할 수 있습니다. 플러그인을 만들어 새 기능을 추가하거나, 외부 서비스와 통합하거나, OpenCode의 기본 동작을 수정할 수 있습니다.

예시는 커뮤니티에서 만든 [플러그인](/docs/ecosystem#plugins)을 확인하세요.

---

## 플러그인 사용

플러그인을 로드하는 두 가지 방법이 있습니다.

### 로컬 파일에서

플러그인 디렉토리에 JavaScript 또는 TypeScript 파일을 배치합니다.

- `.opencode/plugin/` - 프로젝트 수준 플러그인
- `~/.config/opencode/plugin/` - 전역 플러그인

이 디렉토리의 파일은 시작 시 자동으로 로드됩니다.

### npm에서

설정 파일에서 npm 패키지를 지정합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-helicone-session", "opencode-wakatime", "@my-org/custom-plugin"]
}
```

일반 및 범위 지정 npm 패키지가 모두 지원됩니다.

[에코시스템](/docs/ecosystem#plugins)에서 사용 가능한 플러그인을 찾아보세요.

### 로드 순서

플러그인은 모든 소스에서 로드되며 모든 훅이 순서대로 실행됩니다. 로드 순서:

1. 전역 설정 (`~/.config/opencode/opencode.json`)
2. 프로젝트 설정 (`opencode.json`)
3. 전역 플러그인 디렉토리 (`~/.config/opencode/plugin/`)
4. 프로젝트 플러그인 디렉토리 (`.opencode/plugin/`)

이름과 버전이 같은 중복 npm 패키지는 한 번만 로드됩니다. 그러나 유사한 이름의 로컬 플러그인과 npm 플러그인은 별도로 로드됩니다.

---

## 플러그인 만들기

플러그인은 하나 이상의 플러그인 함수를 내보내는 **JavaScript/TypeScript 모듈**입니다. 각 함수는 컨텍스트 객체를 받고 훅 객체를 반환합니다.

### 기본 구조

```javascript
// .opencode/plugin/example.js
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Plugin initialized!")

  return {
    // 훅 구현이 여기에 들어감
  }
}
```

플러그인 함수는 다음을 받습니다:

- `project`: 현재 프로젝트 정보
- `directory`: 현재 작업 디렉토리
- `worktree`: git 작업 트리 경로
- `client`: AI와 상호 작용하기 위한 opencode SDK 클라이언트
- `$`: 명령 실행을 위한 Bun의 [shell API](https://bun.com/docs/runtime/shell)

### TypeScript 지원

TypeScript 플러그인의 경우 플러그인 패키지에서 타입을 가져올 수 있습니다:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    // 타입 안전 훅 구현
  }
}
```

---

## 이벤트

플러그인은 아래 예시 섹션에서 볼 수 있듯이 이벤트를 구독할 수 있습니다. 사용 가능한 다양한 이벤트 목록은 다음과 같습니다.

### 세션 이벤트
- `session.created`, `session.compacted`, `session.deleted`, `session.diff`, `session.error`, `session.idle`, `session.status`, `session.updated`

### 메시지 이벤트
- `message.part.removed`, `message.part.updated`, `message.removed`, `message.updated`

### 도구 이벤트
- `tool.execute.after`, `tool.execute.before`

### 파일 이벤트
- `file.edited`, `file.watcher.updated`

### 권한 이벤트
- `permission.replied`, `permission.updated`

---

## 예시

### 알림 보내기

특정 이벤트가 발생할 때 알림을 보냅니다:

```javascript
// .opencode/plugin/notification.js
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      // 세션 완료 시 알림 보내기
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session completed!" with title "opencode"'`
      }
    },
  }
}
```

### .env 보호

opencode가 `.env` 파일을 읽지 못하도록 방지합니다:

```javascript
// .opencode/plugin/env-protection.js
export const EnvProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
```

### 커스텀 도구

플러그인은 opencode에 커스텀 도구를 추가할 수도 있습니다:

```typescript
// .opencode/plugin/custom-tools.ts
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "이것은 커스텀 도구입니다",
        args: {
          foo: tool.schema.string(),
        },
        async execute(args, ctx) {
          return `Hello ${args.foo}!`
        },
      }),
    },
  }
}
```

커스텀 도구는 내장 도구와 함께 opencode에서 사용할 수 있습니다.
