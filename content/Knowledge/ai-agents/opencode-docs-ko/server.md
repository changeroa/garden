# 서버

HTTP를 통해 opencode 서버와 상호 작용.

`opencode serve` 명령은 opencode 클라이언트가 사용할 수 있는 OpenAPI 엔드포인트를 노출하는 헤드리스 HTTP 서버를 실행합니다.

---

## 사용법

```bash
opencode serve [--port <number>] [--hostname <string>]
```

### 옵션

| 플래그 | 설명 | 기본값 |
|--------|------|--------|
| `--port` | 수신 대기할 포트 | `4096` |
| `--hostname` | 수신 대기할 호스트 이름 | `127.0.0.1` |
| `--mdns` | mDNS 검색 활성화 | `false` |

---

## 작동 방식

`opencode`를 실행하면 TUI와 서버가 시작됩니다. TUI는 서버와 통신하는 클라이언트입니다. 서버는 OpenAPI 3.1 사양 엔드포인트를 노출합니다. 이 엔드포인트는 [SDK](/docs/sdk) 생성에도 사용됩니다.

> **Tip**: opencode 서버를 사용하여 프로그래밍 방식으로 opencode와 상호 작용하세요.

이 아키텍처를 통해 opencode는 여러 클라이언트를 지원하고 프로그래밍 방식으로 opencode와 상호 작용할 수 있습니다.

`opencode serve`를 실행하여 독립 실행형 서버를 시작할 수 있습니다. opencode TUI가 실행 중인 경우 `opencode serve`는 새 서버를 시작합니다.

### 기존 서버에 연결

TUI를 시작하면 포트와 호스트 이름이 무작위로 할당됩니다. 대신 `--hostname`과 `--port` [플래그](/docs/cli)를 전달할 수 있습니다. 그런 다음 이를 사용하여 서버에 연결합니다.

[`/tui`](#tui) 엔드포인트를 사용하여 서버를 통해 TUI를 구동할 수 있습니다. 예를 들어, 프롬프트를 미리 채우거나 실행할 수 있습니다. 이 설정은 OpenCode [IDE](/docs/ide) 플러그인에서 사용됩니다.

---

## 사양

서버는 다음에서 볼 수 있는 OpenAPI 3.1 사양을 게시합니다:

```
http://<hostname>:<port>/doc
```

예를 들어, `http://localhost:4096/doc`. 사양을 사용하여 클라이언트를 생성하거나 요청 및 응답 타입을 검사합니다. 또는 Swagger 탐색기에서 볼 수 있습니다.

---

## API

opencode 서버는 다음 API를 노출합니다.

### Global

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/global/health` | 서버 상태 및 버전 가져오기 |
| `GET` | `/global/event` | 전역 이벤트 가져오기 (SSE 스트림) |

### Sessions

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/session` | 모든 세션 나열 |
| `POST` | `/session` | 새 세션 생성 |
| `GET` | `/session/:id` | 세션 세부 정보 가져오기 |
| `DELETE` | `/session/:id` | 세션 및 모든 데이터 삭제 |
| `PATCH` | `/session/:id` | 세션 속성 업데이트 |
| `POST` | `/session/:id/abort` | 실행 중인 세션 중단 |
| `POST` | `/session/:id/share` | 세션 공유 |
| `DELETE` | `/session/:id/share` | 세션 공유 해제 |

### Messages

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/session/:id/message` | 세션의 메시지 나열 |
| `POST` | `/session/:id/message` | 메시지 보내고 응답 대기 |
| `GET` | `/session/:id/message/:messageID` | 메시지 세부 정보 가져오기 |
| `POST` | `/session/:id/prompt_async` | 비동기로 메시지 보내기 (대기 없음) |
| `POST` | `/session/:id/command` | 슬래시 명령 실행 |
| `POST` | `/session/:id/shell` | 셸 명령 실행 |

### Files

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/find?pattern=<pat>` | 파일에서 텍스트 검색 |
| `GET` | `/find/file?query=<q>` | 이름으로 파일 및 디렉토리 찾기 |
| `GET` | `/file?path=<path>` | 파일 및 디렉토리 나열 |
| `GET` | `/file/content?path=<p>` | 파일 읽기 |
| `GET` | `/file/status` | 추적된 파일의 상태 가져오기 |

### TUI

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/tui/append-prompt` | 프롬프트에 텍스트 추가 |
| `POST` | `/tui/open-help` | 도움말 대화 상자 열기 |
| `POST` | `/tui/open-sessions` | 세션 선택기 열기 |
| `POST` | `/tui/open-themes` | 테마 선택기 열기 |
| `POST` | `/tui/open-models` | 모델 선택기 열기 |
| `POST` | `/tui/submit-prompt` | 현재 프롬프트 제출 |
| `POST` | `/tui/clear-prompt` | 프롬프트 지우기 |
| `POST` | `/tui/execute-command` | 명령 실행 |
| `POST` | `/tui/show-toast` | 토스트 알림 표시 |

### Events

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/event` | Server-sent events 스트림 |
