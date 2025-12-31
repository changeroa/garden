# 커스텀 도구

opencode에서 LLM이 호출할 수 있는 도구 만들기.

커스텀 도구는 대화 중에 LLM이 호출할 수 있는 함수입니다. `read`, `write`, `bash`와 같은 opencode의 [내장 도구](/docs/tools)와 함께 작동합니다.

---

## 도구 만들기

도구는 **TypeScript** 또는 **JavaScript** 파일로 정의됩니다. 그러나 도구 정의는 **어떤 언어**로든 작성된 스크립트를 호출할 수 있습니다. TypeScript 또는 JavaScript는 도구 정의 자체에만 사용됩니다.

### 위치

다음 위치에 정의할 수 있습니다:

- 프로젝트의 `.opencode/tool/` 디렉토리에 로컬로 배치
- 또는 `~/.config/opencode/tool/`에 전역으로 배치

### 구조

타입 안전성과 유효성 검사를 제공하는 `tool()` 헬퍼를 사용하여 도구를 만드는 것이 가장 쉽습니다.

```typescript
// .opencode/tool/database.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "프로젝트 데이터베이스 쿼리",
  args: {
    query: tool.schema.string().describe("실행할 SQL 쿼리"),
  },
  async execute(args) {
    // 데이터베이스 로직
    return `쿼리 실행됨: ${args.query}`
  },
})
```

**파일 이름**이 **도구 이름**이 됩니다. 위의 예는 `database` 도구를 만듭니다.

### 파일당 여러 도구

단일 파일에서 여러 도구를 내보낼 수도 있습니다. 각 내보내기는 **`<filename>_<exportname>`** 이름의 **별도 도구**가 됩니다:

```typescript
// .opencode/tool/math.ts
import { tool } from "@opencode-ai/plugin"

export const add = tool({
  description: "두 숫자 더하기",
  args: {
    a: tool.schema.number().describe("첫 번째 숫자"),
    b: tool.schema.number().describe("두 번째 숫자"),
  },
  async execute(args) {
    return args.a + args.b
  },
})

export const multiply = tool({
  description: "두 숫자 곱하기",
  args: {
    a: tool.schema.number().describe("첫 번째 숫자"),
    b: tool.schema.number().describe("두 번째 숫자"),
  },
  async execute(args) {
    return args.a * args.b
  },
})
```

이렇게 하면 `math_add`와 `math_multiply` 두 개의 도구가 만들어집니다.

### 인수

`tool.schema`([Zod](https://zod.dev))를 사용하여 인수 타입을 정의할 수 있습니다.

```typescript
args: {
  query: tool.schema.string().describe("실행할 SQL 쿼리")
}
```

[Zod](https://zod.dev)를 직접 가져와서 일반 객체를 반환할 수도 있습니다:

```typescript
import { z } from "zod"

export default {
  description: "도구 설명",
  args: {
    param: z.string().describe("매개변수 설명"),
  },
  async execute(args, context) {
    // 도구 구현
    return "result"
  },
}
```

### 컨텍스트

도구는 현재 세션에 대한 컨텍스트를 받습니다:

```typescript
// .opencode/tool/project.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "프로젝트 정보 가져오기",
  args: {},
  async execute(args, context) {
    // 컨텍스트 정보에 액세스
    const { agent, sessionID, messageID } = context
    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}`
  },
})
```

---

## 예시

### Python으로 도구 작성

원하는 언어로 도구를 작성할 수 있습니다. Python을 사용하여 두 숫자를 더하는 예시입니다.

먼저 Python 스크립트로 도구를 만듭니다:

```python
# .opencode/tool/add.py
import sys

a = int(sys.argv[1])
b = int(sys.argv[2])
print(a + b)
```

그런 다음 이를 호출하는 도구 정의를 만듭니다:

```typescript
// .opencode/tool/python-add.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Python을 사용하여 두 숫자 더하기",
  args: {
    a: tool.schema.number().describe("첫 번째 숫자"),
    b: tool.schema.number().describe("두 번째 숫자"),
  },
  async execute(args) {
    const result = await Bun.$`python3 .opencode/tool/add.py ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

여기서 Python 스크립트를 실행하기 위해 [`Bun.$`](https://bun.com/docs/runtime/shell) 유틸리티를 사용하고 있습니다.
