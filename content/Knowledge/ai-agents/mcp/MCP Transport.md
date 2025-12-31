# MCP Transport

Created: 2025-12-30 14:12
Modified: 2025-12-30 14:12
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #transport #communication
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ```typescript
> 
> // Main function to start the server
> 
> async function main() {
> 
> const transport = new StdioServerTransport();
> 
> await server.connect(transport);
> 
> console.error(`${SERVER_NAME} v${SERVER_VERSION} running on stdio`);
> 
> }
> 
>   
> 
> // Start the server
> 
> main().catch((error) => {
> 
> console.error('Failed to start server:', error);
> 
> process.exit(1);
> 
> });
> ```
> ## Summary
> Transport는 데이터 전송 방식을 정의하는 개념으로, 다양한 통신 방법이 존재한다. StdioServerTransport는 같은 컴퓨터 내에서 프로세스 간 통신을 위한 간단하고 빠르며 안전한 방법이다.
> 
> ## Key Points
> - **Transport의 정의**: 데이터 전송 방식을 설명하는 용어로, 일반적으로 IT 분야에서 널리 사용됨.
> - **StdioServerTransport의 장점**: 포트 및 네트워크 설정이 필요 없고, 같은 컴퓨터 내에서 빠르고 안전하게 통신 가능.
> - **MCP 서버와 Claude Code의 연결**: StdioServerTransport를 사용하여 서버와 직접 연결.
> 
> ## Details
> ### Transport란?
> - **정의**: "데이터를 어떻게 주고받을 것인가"를 규명하는 통신 방식.
>   
>   ```
>   ┌─────────┐                    ┌─────────┐
>   │ Claude  │  ←── Transport ──→ │ MCP 서버 │
>   │  Code   │      (통신 방식)    │         │
>   └─────────┘                    └─────────┘
>   ```
> 
> ### 비유적 설명
> | Transport | 비유                                  |
> |--------|---------------------------------------|
> | Stdio     | 직접 손으로 전달 (같은 컴퓨터 안에서) |
> | HTTP      | 택배 회사 이용 (인터넷으로)           |
> | WebSocket | 전화 통화 (실시간 양방향)             |
> 
> ### MCP에서 제공하는 Transport 종류
> 1. **Stdio** - 표준 입출력 (가장 흔함)
>    ```typescript
>    import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
>    ```
> 2. **HTTP** - 웹 서버처럼
>    ```typescript
>    import { HttpServerTransport } from '@modelcontextprotocol/sdk/server/http.js';
>    ```
> 3. **WebSocket** - 실시간 양방향
>    ```typescript
>    import { WebSocketServerTransport } from '@modelcontextprotocol/sdk/server/websocket.js';
>    ```
> 
> ### StdioServerTransport 동작 방식
> ```
> ┌──────────────────┐         ┌──────────────────┐
> │   Claude Code    │         │    MCP Server    │
> │                  │         │                  │
> │  stdout ────────────────→ stdin              │
> │                  │         │                  │
> │  stdin  ←──────────────── stdout             │
> └──────────────────┘         └──────────────────┘
> 
> const transport = new StdioServerTransport();
> // "나는 stdin으로 받고, stdout으로 보낼 거야"
> 
> await server.connect(transport);
> // "서버야, 이 방식으로 통신해"
> ```
> 
> ### Stdio 사용 이유
> 
> | 장점   | 설명                               |
> |--------|------------------------------------|
> | 간단함 | 포트 설정, 네트워크 설정 필요 없음 |
> | 빠름   | 같은 컴퓨터 내에서 직접 통신       |
> | 안전함 | 외부에서 접근 불가                 |
> 
> ### 코드 예시 다시 보기
> 
> ```typescript
> async function main() {
>     const transport = new StdioServerTransport(); // "stdin/stdout으로 통신할 거야"
>     await server.connect(transport); // "서버야, 이 transport 써서 통신해"
>     console.error(`${SERVER_NAME} v${SERVER_VERSION} running on stdio`); // 시작 로그 출력 
> }
> ```
> 
> ## Related 
> - [[HTTP Transport]]
> - [[WebSocket Transport]]

---

MCP Transport는 서버와 클라이언트 간 데이터를 주고받는 통신 방식을 정의하는 객체로, Stdio, HTTP, WebSocket 등의 종류가 있다.

---

## Core Idea
StdioServerTransport는 표준 입출력(stdin/stdout)을 사용하여 같은 컴퓨터 내에서 빠르고 안전하게 통신하며, 포트 설정이 필요 없다.
server.connect(transport)를 호출하여 서버에 특정 Transport 방식을 연결하고, 이후 해당 방식으로 통신이 이루어진다.

## Why It Matters
- 용도에 맞는 Transport를 선택해야 하며, 로컬 MCP 서버는 주로 Stdio를 사용하고 원격 서버는 HTTP나 WebSocket을 사용한다.

## Explanation
- Stdio: 직접 손으로 전달하는 것처럼 같은 컴퓨터 내 통신
- HTTP: 택배 회사를 이용하는 것처럼 인터넷 통신
- WebSocket: 전화 통화처럼 실시간 양방향 통신
- new StdioServerTransport(): stdin으로 받고 stdout으로 보내는 통신 방식 생성

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: Claude Code와 로컬 MCP 서버 간 통신에 주로 사용하는 Transport는 무엇이며, 그 이유는?
- A: StdioServerTransport를 사용한다. 포트 설정이 필요 없고, 같은 컴퓨터 내에서 빠르고 안전하며, 외부 접근이 불가능하기 때문이다.
