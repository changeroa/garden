# MCP Response Format

Created: 2025-12-30 14:09
Modified: 2025-12-30 14:09
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #api #response-format
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> MCP 응답 형식은 다양한 콘텐츠를 포함할 수 있도록 설계되어 있으며, 헬퍼 함수를 사용하여 결과 생성을 간소화할 수 있습니다.
> 
> ## Key Points
> - MCP의 응답 형식은 `content` 배열을 포함하며, 다양한 콘텐츠 유형을 지원합니다.
> - `content` 배열에는 텍스트, 이미지 등 여러 종류의 결과를 동시에 포함할 수 있습니다.
> - 헬퍼 함수를 사용하면 반복적인 코드 작성을 줄이고 결과 생성을 간편하게 할 수 있습니다.
> 
> ## Details
> MCP에서 도구 결과는 다음과 같은 형식을 따라야 합니다:
> 
> ```json
> {
>   content: [
>     { type: 'text', text: '결과 내용' },
>     // 여러 종류의 콘텐츠 가능: 이미지, 파일 등
>   ],
>   isError?: true  // 에러인 경우에만 포함
> }
> ```
> 
> `content`가 배열인 이유는 하나의 결과에 여러 종류의 콘텐츠가 들어갈 수 있기 때문입니다. 예를 들어, 텍스트와 이미지를 함께 반환하는 경우는 다음과 같습니다:
> 
> ```json
> {
>   content: [
>     { type: 'text', text: '차트 생성 완료' },
>     { type: 'image', data: '...base64...' }
>   ]
> }
> ```
> 
> 헬퍼 함수가 필요한 이유는 매번 복잡한 코드를 작성하는 것이 번거롭기 때문입니다. 예를 들어 일반적인 반환 방식은 다음과 같습니다:
> 
> ```javascript
> return { content: [{ type: 'text', text: '...' }] };
> ```
> 
> 하지만 헬퍼 함수를 사용하면 다음과 같이 간단히 결과를 생성할 수 있습니다:
> 
> ```javascript
> return createTextResult('...');
> ```
> 
> ## Related
> - [[MCP 응답 처리]]
> - [[헬퍼 함수 활용]]

---

MCP Response Format은 도구 실행 결과를 content 배열로 반환하는 형식으로, 텍스트, 이미지 등 여러 종류의 콘텐츠를 동시에 포함할 수 있다.

---

## Core Idea
MCP 응답은 { content: [{ type: 'text', text: '...' }], isError?: boolean } 형태로, content가 배열인 이유는 하나의 결과에 텍스트와 이미지 등 여러 콘텐츠가 들어갈 수 있기 때문이다.
헬퍼 함수(createTextResult 등)를 사용하면 반복적인 응답 객체 생성 코드를 줄이고 가독성을 높일 수 있다.

## Why It Matters
- MCP 스펙에 맞지 않는 형식으로 응답하면 클라이언트(Claude)가 결과를 이해하지 못하므로, 정확한 응답 형식을 아는 것이 필수적이다.

## Explanation
- content 배열: 여러 종류의 결과(텍스트, 이미지, 파일 등)를 담을 수 있음
- type 필드: 콘텐츠의 종류를 지정 (text, image 등)
- isError 필드: 에러인 경우에만 true로 설정
- 헬퍼 함수: createTextResult('...') 형태로 간편하게 응답 생성

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP에서 텍스트와 이미지를 함께 반환하려면 어떻게 해야 하는가?
- A: content 배열에 { type: 'text', text: '...' }와 { type: 'image', data: '...' }를 함께 담아 반환한다.
