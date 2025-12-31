# MCP Request Handler

Created: 2025-12-30 14:12
Modified: 2025-12-30 14:12
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #server #request-handler
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> 이 노트는 서버에서 도구 목록 요청과 도구 호출 요청을 처리하는 핸들러를 설정하는 과정을 설명합니다. 각 도구에 대한 요청은 특정 기능을 수행하며, 예외 처리 로직도 포함되어 있습니다.
> 
> ## Key Points
> - **도구 목록 요청 핸들러**: 서버는 도구 목록을 반환하여 사용자가 사용할 수 있는 도구를 확인할 수 있게 합니다.
> - **도구 실행 요청 핸들러**: 각 도구에 따라 적절한 함수가 호출되며, 성공적으로 실행되면 결과를 반환합니다.
> - **에러 처리**: 도구 호출 중 발생할 수 있는 오류를 잡아내고, 사용자에게 알맞은 에러 메시지를 제공합니다.
> 
> ## Details
> [[더 친절한 설명]]
> 
> ### 1. 요청 핸들러 등록
> - **도구 목록 요청 핸들러**
>   ```javascript
>   server.setRequestHandler(ListToolsRequestSchema, async () => {
>     return { tools };
>   });
>   ```
>   - 동작 흐름:
>     - 클라이언트가 "도구 목록 줘"라는 요청을 보냄 (ListToolsRequest)
>     - 서버는 `{ tools: [...] }` 형태로 응답함으로써 사용 가능한 도구 리스트를 반환
> 
> ### 2. 도구 실행 요청 핸들러
> ```javascript
> server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
>   const { name, arguments: args = {} } = request.params;
> 
>   try {
>     switch (name) {
>       case 'list_categories': {
>         const result = await handleListCategories(args as Record<string, unknown>, DEFAULT_VAULT_CONFIG);
>         return createTextResult(JSON.stringify(result, null, 2));
>       }
>       case 'get_moc': {
>         const result = await handleGetMoc(args as unknown as GetMocInput, DEFAULT_VAULT_CONFIG);
>         return createTextResult(JSON.stringify(result, null, 2));
>       }
>       case 'create_inbox_note': {
>         const result = await handleCreateInboxNote(args as unknown as InboxNoteInput, DEFAULT_VAULT_CONFIG);
>         if (result.success) {
>           return createTextResult(`Note created successfully at: ${result.path}`);
>         } else {
>           return createErrorResult(result.error || 'Failed to create note');
>         }
>       }
>       case 'create_knowledge_note': {
>         const result = await handleCreateKnowledgeNote(args as unknown as CreateKnowledgeNoteInput, DEFAULT_VAULT_CONFIG);
>         if (result.success) {
>           return createTextResult(`Knowledge Note created successfully at: ${result.path}`);
>         } else {
>           return createErrorResult(result.error || 'Failed to create note');
>         }
>       }
>       default:
>         return createErrorResult(`Unknown tool: ${name}`);
>     }
>   } catch (error) {
>     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
>     console.error(`Error executing tool ${name}:`, error);
>     return createErrorResult(errorMessage);
>   }
> });
> ```
> - 각 도구는 `switch` 문을 통해 호출되며 필요한 인자를 받아 처리됩니다.
> - 중괄호 `{}` 사용으로 변수의 범위를 제한하여 변수 충돌 방지.
> - `JSON.stringify(result, null, 2)`로 결과를 보기 좋게 포맷팅하여 반환.
> 
> ## Related
> - [[요청 및 응답 구조]]
> - [[에러 처리 기법]]

---

MCP Request Handler는 server.setRequestHandler()를 사용하여 클라이언트의 요청(도구 목록, 도구 실행 등)을 처리하는 콜백 함수를 등록하는 메커니즘이다.

---

## Core Idea
ListToolsRequestSchema 핸들러는 '도구 목록 줘' 요청에 { tools: [...] }를 반환하고, CallToolRequestSchema 핸들러는 '도구 실행해줘' 요청을 처리한다.
switch 문을 사용하여 도구 이름(name)에 따라 적절한 핸들러 함수를 호출하고, try-catch로 에러를 처리한다.

## Why It Matters
- 요청 핸들러를 등록하지 않으면 서버는 클라이언트의 요청에 응답할 수 없으므로, 모든 MCP 서버는 최소한 ListToolsRequestSchema와 CallToolRequestSchema 핸들러를 등록해야 한다.

## Explanation
- server.setRequestHandler(Schema, callback): 요청 핸들러 등록 메서드
- ListToolsRequestSchema: '도구 목록 요청'에 대한 응답 등록
- CallToolRequestSchema: '도구 실행 요청'에 대한 응답 등록
- request.params에서 name과 arguments를 구조 분해 할당으로 추출

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP 서버에서 클라이언트가 '도구 목록을 요청'했을 때 어떤 핸들러가 호출되는가?
- A: ListToolsRequestSchema에 등록된 핸들러가 호출되며, { tools: [...] }를 반환한다.
