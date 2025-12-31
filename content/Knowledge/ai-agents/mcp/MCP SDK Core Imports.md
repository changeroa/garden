# MCP SDK Core Imports

Created: 2025-12-30 14:09
Modified: 2025-12-30 14:09
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #sdk #typescript
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> MCP SDK에서 제공하는 주요 구성 요소는 서버와 요청 형식 정의를 포함하며, 도구 실행 및 목록 요청에 대한 구조를 체계적으로 정의하고 있습니다.
> 
> ## Key Points
> - **서버 클래스**: MCP 서버의 핵심 역할을 수행하여 요청을 받고 응답을 전달합니다.
> - **통신 방법**: StdioServerTransport를 통해 표준 입출력 방식으로 데이터를 교환합니다.
> - **요청 및 결과 형식**: 도구 실행 및 목록 요청의 형식과 도구 실행 결과의 데이터 타입을 정의합니다.
> 
> ## Details
> MCP SDK에서 가져오는 구성 요소는 다음과 같습니다:
> 
> | Import                 | 역할                                            |
> |------------------------|-------------------------------------------------|
> | Server                 | MCP 서버 클래스. 요청을 받고 응답을 보내는 핵심 |
> | StdioServerTransport   | 표준 입출력(stdin/stdout)으로 통신하는 방법     |
> | CallToolRequestSchema  | "도구 실행해줘" 요청의 형식 정의                |
> | ListToolsRequestSchema | "도구 목록 줘" 요청의 형식 정의                 |
> | Tool                   | 도구의 타입 정의                                |
> | CallToolResult         | 도구 실행 결과의 타입 정의                     |
> 
> ## Related
> - [[MCP 서버]]
> - [[요청 및 응답 처리]]

---

MCP SDK Core Imports는 MCP 서버 구축에 필요한 핵심 모듈들(Server, Transport, Schema, Types)을 가져오는 import 문들이다.

---

## Core Idea
MCP SDK는 Server 클래스(요청/응답 처리), StdioServerTransport(통신 방식), 그리고 요청 스키마(CallToolRequestSchema, ListToolsRequestSchema)를 제공한다.
Tool과 CallToolResult 타입은 도구의 메타데이터와 실행 결과의 형식을 정의하여 타입 안전성을 보장한다.

## Why It Matters
- MCP 서버의 진입점(entry point)에서 올바른 모듈을 import하지 않으면 서버가 작동하지 않으므로, 각 모듈의 역할을 이해하는 것이 필수적이다.

## Explanation
- Server: MCP 서버의 핵심 클래스로, 요청을 받고 응답을 보내는 역할
- StdioServerTransport: 표준 입출력(stdin/stdout)으로 통신하는 방법
- CallToolRequestSchema: '도구 실행해줘' 요청의 형식 정의
- ListToolsRequestSchema: '도구 목록 줘' 요청의 형식 정의

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP 서버에서 클라이언트와 stdin/stdout으로 통신하려면 어떤 Transport를 사용해야 하는가?
- A: StdioServerTransport를 사용한다. 같은 컴퓨터 내에서 빠르고 안전하게 통신할 수 있다.
