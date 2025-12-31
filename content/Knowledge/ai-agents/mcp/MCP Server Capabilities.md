# MCP Server Capabilities

Created: 2025-12-30 14:12
Modified: 2025-12-30 14:12
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #server #capabilities
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> MCP 서버의 기능 목록과 요청 핸들러 설정에 대한 설명입니다. 도구 제공 및 요청 처리 방식을 상세히 다루고 있습니다.
> 
> ## Key Points
> - MCP 서버는 도구, 리소스, 프롬프트 템플릿의 세 가지 기능을 제공하며, 현재는 도구만 지원합니다.
> - 도구 목록은 요청 시 반환되며, 각 도구에 대한 세부정보가 포함됩니다.
> - 요청 처리 과정에서 TypeScript의 타입 단언 및 구조 분해 할당을 활용하여 코드의 가독성을 높입니다.
> 
> ## Details
> 
> ### 1. Capabilities 정의
> MCP 서버에서 제공하는 기능 목록은 다음과 같습니다:
> 
> | Capability    | 의미                    |
> |---------------|-------------------------|
> | tools: {}     | 도구(함수) 제공         |
> | resources: {} | 파일/데이터 리소스 제공 |
> | prompts: {}   | 프롬프트 템플릿 제공    |
> 
> 현재 서버는 `tools: {}`만 제공합니다. 빈 객체 `{}`는 해당 기능이 존재함을 나타내며, 세부 옵션이 필요한 경우 객체 안에 포함됩니다.
> 
> ### 2. 도구 목록 정의
> 도구 목록은 다음과 같이 정의됩니다:
> 
> ```javascript
> const tools: Tool[] = [
>   {
>     name: listCategoriesTool.name,
>     description: listCategoriesTool.description,
>     inputSchema: listCategoriesTool.inputSchema as Tool['inputSchema'],
>   },
>   // ... 나머지 도구들
> ];
> ```
> 
> 이 배열은 Claude가 "어떤 도구가 있어?"라고 물었을 때 반환됩니다. `as Tool['inputSchema']`는 [[타입 단언(Type Assertion)]]으로, TypeScript가 기대하는 타입과 호환됨을 명시합니다.
> 
> [[MCP SDK 공식 Tool 타입 정의]]
> 
> ### 3. 요청 핸들러 등록
> 
> #### 도구 목록 요청 핸들러
> ```javascript
> server.setRequestHandler(ListToolsRequestSchema, async () => {
>   return { tools };
> });
> ```
> - 동작 흐름:
>   - Claude: "도구 목록 줘" (ListToolsRequest)
>   - 서버: `{ tools: [...] }` 반환
>   - Claude: "아, list_categories, get_moc, create_inbox_note, create_knowledge_note가 있구나"
> 
> #### 도구 실행 요청 핸들러
> ```javascript
> server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
>   const { name, arguments: args = {} } = request.params;
> 
>   try {
>     switch (name) {
>       case 'list_categories':
>         const result = await handleListCategories(args as Record<string, unknown>, DEFAULT_VAULT_CONFIG);
>         return createTextResult(JSON.stringify(result, null, 2));
>       // ... 다른 case들
> 
>       default:
>         return createErrorResult(`Unknown tool: ${name}`);
>     }
>   } catch (error) {
>     // 에러 처리
>   }
> });
> ```
> 
> ##### 코드 설명:
> - 구조 분해 할당으로 `name`과 `arguments`를 추출합니다. 여기서 `arguments`는 JavaScript 예약어와 비슷하여 `args`로 이름이 변경되었습니다.
> - 각 case마다 중괄호 `{}`를 사용하여 변수 스코프를 관리합니다.
> 
> ##### JSON 포맷팅:
> ```javascript
> JSON.stringify(result, null, 2)
> ```
> - 결과를 보기 좋게 포맷팅된 JSON 문자열로 변환합니다.
> 
> ## Related
> - [[TypeScript]]
> - [[MCP SDK]]

---

MCP Server Capabilities는 서버가 클라이언트에게 제공할 수 있는 기능(tools, resources, prompts)을 선언하는 설정 객체이다.

---

## Core Idea
Capabilities 객체는 서버가 어떤 기능을 제공하는지 클라이언트에게 알려주며, tools는 도구, resources는 파일/데이터, prompts는 프롬프트 템플릿을 의미한다.
capabilities에 선언된 기능만 클라이언트가 사용할 수 있으므로, 서버가 제공하는 모든 기능을 여기에 명시해야 한다.

## Why It Matters
- 서버가 도구를 제공하더라도 capabilities에 tools를 선언하지 않으면 클라이언트는 해당 도구를 사용할 수 없다.

## Explanation
- tools: {}: 도구(함수)를 제공함을 선언
- resources: {}: 파일이나 데이터 리소스를 제공함을 선언
- prompts: {}: 프롬프트 템플릿을 제공함을 선언
- 빈 객체 {}는 '해당 기능이 존재한다'는 의미이며, 세부 옵션은 나중에 추가 가능

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP 서버에서 도구와 파일 리소스를 모두 제공하려면 capabilities를 어떻게 설정해야 하는가?
- A: capabilities: { tools: {}, resources: {} }로 설정한다.
