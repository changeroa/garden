# SDK

opencode 서버용 타입 안전 JS 클라이언트.

opencode JS/TS SDK는 서버와 상호 작용하기 위한 타입 안전 클라이언트를 제공합니다. 통합을 구축하고 opencode를 프로그래밍 방식으로 제어하는 데 사용합니다.

[서버 작동 방식에 대해 자세히 알아보기](/docs/server). 예시는 커뮤니티가 구축한 [프로젝트](/docs/ecosystem#projects)를 확인하세요.

---

## 설치

npm에서 SDK를 설치합니다:

```bash
npm install @opencode-ai/sdk
```

---

## 클라이언트 생성

opencode 인스턴스를 생성합니다:

```javascript
import { createOpencode } from "@opencode-ai/sdk"

const { client } = await createOpencode()
```

이렇게 하면 서버와 클라이언트가 모두 시작됩니다.

### 옵션

| 옵션 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `hostname` | `string` | 서버 호스트 이름 | `127.0.0.1` |
| `port` | `number` | 서버 포트 | `4096` |
| `signal` | `AbortSignal` | 취소를 위한 중단 신호 | `undefined` |
| `timeout` | `number` | 서버 시작 타임아웃(ms) | `5000` |
| `config` | `Config` | 설정 객체 | `{}` |

---

## 설정

동작을 사용자 정의하기 위해 설정 객체를 전달할 수 있습니다. 인스턴스는 여전히 `opencode.json`을 선택하지만 설정을 인라인으로 재정의하거나 추가할 수 있습니다:

```javascript
import { createOpencode } from "@opencode-ai/sdk"

const opencode = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022",
  },
})

console.log(`Server running at ${opencode.server.url}`)

opencode.server.close()
```

---

## 클라이언트만

이미 실행 중인 opencode 인스턴스가 있는 경우 클라이언트 인스턴스를 생성하여 연결할 수 있습니다:

```javascript
import { createOpencodeClient } from "@opencode-ai/sdk"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
})
```

### 옵션

| 옵션 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `baseUrl` | `string` | 서버 URL | `http://localhost:4096` |
| `fetch` | `function` | 사용자 정의 fetch 구현 | `globalThis.fetch` |
| `parseAs` | `string` | 응답 파싱 방법 | `auto` |
| `responseStyle` | `string` | 반환 스타일: `data` 또는 `fields` | `fields` |
| `throwOnError` | `boolean` | 반환 대신 오류 throw | `false` |

---

## 타입

SDK에는 모든 API 타입에 대한 TypeScript 정의가 포함되어 있습니다. 직접 가져올 수 있습니다:

```typescript
import type { Session, Message, Part } from "@opencode-ai/sdk"
```

모든 타입은 서버의 OpenAPI 사양에서 생성되며 [타입 파일](https://github.com/sst/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)에서 사용할 수 있습니다.

---

## API

SDK는 타입 안전 클라이언트를 통해 모든 서버 API를 노출합니다.

### Global

| 메서드 | 설명 | 응답 |
|--------|------|------|
| `global.health()` | 서버 상태 및 버전 확인 | `{ healthy: true, version: string }` |

### Sessions

| 메서드 | 설명 |
|--------|------|
| `session.list()` | 세션 나열 |
| `session.get({ path })` | 세션 가져오기 |
| `session.create({ body })` | 세션 생성 |
| `session.delete({ path })` | 세션 삭제 |
| `session.update({ path, body })` | 세션 속성 업데이트 |
| `session.prompt({ path, body })` | 프롬프트 메시지 보내기 |
| `session.share({ path })` | 세션 공유 |
| `session.unshare({ path })` | 세션 공유 해제 |

### 예시

```javascript
// 세션 생성 및 관리
const session = await client.session.create({
  body: { title: "My session" },
})

const sessions = await client.session.list()

// 프롬프트 메시지 보내기
const result = await client.session.prompt({
  path: { id: session.id },
  body: {
    model: { providerID: "anthropic", modelID: "claude-3-5-sonnet-20241022" },
    parts: [{ type: "text", text: "Hello!" }],
  },
})

// AI 응답 트리거 없이 컨텍스트 주입 (플러그인에 유용)
await client.session.prompt({
  path: { id: session.id },
  body: {
    noReply: true,
    parts: [{ type: "text", text: "You are a helpful assistant." }],
  },
})
```

### Events

```javascript
// 실시간 이벤트 수신
const events = await client.event.subscribe()
for await (const event of events.stream) {
  console.log("Event:", event.type, event.properties)
}
```
