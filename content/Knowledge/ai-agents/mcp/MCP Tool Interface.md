# MCP Tool Interface

Created: 2025-12-30 14:12
Modified: 2025-12-30 14:12
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #typescript #json-schema
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> MCP SDK 공식 Tool 타입 정의는 JSON Schema를 기반으로 하여 입력 파라미터를 명세하는 방법을 제공합니다. 이 정의는 필수 파라미터와 각각의 속성을 포함하고 있습니다.
> 
> ## Key Points
> - **형식**: JSON Schema 표준
> - **type**: 반드시 "object" (MCP 스펙 강제)
> - **properties**: 각 입력 파라미터 정의
> - **required**: 필수 파라미터 이름 배열
> 
> ## Details
> ### Tool 인터페이스 정의
> ```typescript
> interface Tool {
>   name: string;
>   description?: string;
> 
>   /**
>    * A JSON Schema object defining the expected parameters for the tool.
>    */
>   inputSchema: {
>     $schema?: string;           // JSON Schema 버전 (선택)
>     type: "object";             // 반드시 "object"
>     properties?: {
>       [key: string]: object;    // 각 파라미터 정의
>     };
>     required?: string[];        // 필수 파라미터 목록
>   };
> }
> ```
> 
> [[왜 type이 반드시 "object"인가?]]
> -> 한 마디로 이 도구가 받는 입력의 스키마가 형식(타입)이 객체다!
> [[인덱스 시그니처]]
> ### 코드 관계 예시
> | MCP 공식 스펙 (SDK)          | 우리 코드                         |
> |--------------------------|----------------------------------|
> | interface Tool {            | export const getMocTool = {     |
> | inputSchema: {             |   inputSchema: {                 |
> | type: "object",            |     type: 'object',              |
> | properties?: {...},        |     properties: {                 |
> | required?: [...],          |       category: { type: 'string', ... } |
> | }                           |   },                             |
> | }                           |   required: ['category'],        |
> |                             | };                               |
> 
> ## Related
> - [[JSON Schema]]
> - [[TypeScript]]

---

MCP Tool Interface는 도구의 이름, 설명, 입력 스키마(JSON Schema)를 정의하는 TypeScript 인터페이스로, inputSchema의 type은 반드시 "object"여야 한다.

---

## Core Idea
Tool 인터페이스는 name(도구 이름), description(설명), inputSchema(입력 스키마)로 구성되며, Claude에게 도구 정보를 전달한다.
inputSchema는 JSON Schema 표준을 따르며, type은 반드시 'object'여야 하는데 이는 도구 입력이 항상 key-value 쌍의 묶음이기 때문이다.

## Why It Matters
- MCP 스펙에 맞지 않는 Tool 정의는 클라이언트가 도구를 인식하지 못하게 하므로, 정확한 인터페이스 형식을 따라야 한다.

## Explanation
- name: 도구의 고유 식별자
- description: 도구의 기능 설명 (선택사항)
- inputSchema.type: 반드시 'object' (MCP 스펙)
- inputSchema.properties: 각 파라미터 정의 (인덱스 시그니처 사용)
- inputSchema.required: 필수 파라미터 이름 배열

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP Tool의 inputSchema.type이 반드시 'object'여야 하는 이유는?
- A: 도구 입력은 항상 '여러 파라미터의 묶음'이기 때문이다. type이 'string'이면 파라미터 구분이 안 된다.
