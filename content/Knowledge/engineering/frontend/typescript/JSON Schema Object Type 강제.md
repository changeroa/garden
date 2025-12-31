# JSON Schema Object Type 강제

Created: 2025-12-30 14:15
Modified: 2025-12-30 14:15
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #json-schema #typescript
Up:: [[engineering/frontend/typescript/_Overview]]
Related::

---

> [!note]- Original Content
> 
> 도구 입력은 항상 "여러 파라미터의 묶음"이기 때문입니다.
> 
> ``` json
> // 도구 호출 시 Claude가 보내는 것
>   {
>     "name": "create_knowledge_note",
>     "arguments": {                    // ← 이게 항상 객체
>       "title": "Virtual Memory",
>       "category": "Computer Science",
>       "coreIdea": ["...", "..."]
>     }
>   }
> ```
>   
> 
> ## 만약 type이 "string"이면?
> ```json
>   // 이상해짐
>   {
>     "name": "some_tool",
>     "arguments": "그냥 문자열"    // ← 파라미터 구분이 안 됨
>   }
> 
>   MCP 설계 결정:
>   "도구 입력은 무조건 key-value 쌍으로 받자"
>   → type: "object" 강제
>   ```

---

JSON Schema Object Type 강제는 MCP 도구 입력 스키마에서 type을 반드시 "object"로 설정해야 하는 규칙으로, 도구 입력이 항상 key-value 쌍의 묶음이기 때문이다.

---

## Core Idea
도구 호출 시 arguments는 항상 { key: value, ... } 형태의 객체이므로, inputSchema.type은 반드시 'object'여야 한다.
type이 'string'이면 파라미터 구분이 불가능해지므로, MCP 스펙에서는 이를 강제한다.

## Why It Matters
- MCP 스펙을 준수하지 않으면 도구가 제대로 작동하지 않으므로, type: 'object'는 필수적인 요구사항이다.

## Explanation
- arguments: { title: '...', category: '...' }: 도구 호출 시 실제 전달되는 형태
- type: 'object': 입력이 객체임을 명시
- type: 'string'이면: arguments가 '그냥 문자열'이 되어 파라미터 구분 불가
- MCP 설계 결정: '도구 입력은 무조건 key-value 쌍으로 받자'

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP 도구에서 inputSchema.type을 'string'으로 설정하면 어떤 문제가 발생하는가?
- A: arguments가 단순 문자열이 되어 여러 파라미터를 구분할 수 없게 된다.
