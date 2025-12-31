# MCP Server Instance 생성

Created: 2025-12-30 14:09
Modified: 2025-12-30 14:09
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #server #configuration
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> 서버 인스턴스를 생성하기 위해 두 개의 설정 객체를 사용하며, 서버의 기능 목록에 대한 설명이 포함되어 있습니다.
> 
> ## Key Points
> - 서버 인스턴스 생성 시 두 개의 설정 객체 필요
> - 첫 번째 객체는 서버 정보(이름, 버전) 포함
> - 두 번째 객체는 서버가 제공하는 기능(capabilities) 정의
> 
> ## Details
> 서버 인스턴스를 생성하는 코드 예시는 다음과 같습니다:
> 
> ```javascript
> const server = new Server(
>   {
>     name: SERVER_NAME,      // 서버 이름
>     version: SERVER_VERSION // 버전
>   },
>   {
>     capabilities: {
>       tools: {},  // "나는 도구를 제공할 수 있어"
>     }
>   }
> );
> ```
> 
> ### 설정 객체 설명
> 1. **첫 번째 객체** (서버 정보)
>    - `name`: 서버 이름 (예: `SERVER_NAME`)
>    - `version`: 서버 버전 (예: `SERVER_VERSION`)
> 
> 2. **두 번째 객체** (서버 기능)
>    - `capabilities`: 서버가 제공할 수 있는 기능 목록을 정의합니다.
>      - `tools`: 도구(함수)를 제공하는 기능 포함
> 
> ### Capabilities 목록 설명
> 
> | Capability    | 의미                    |
> |---------------|-------------------------|
> | tools: {}     | 도구(함수) 제공         |
> | resources: {} | 파일/데이터 리소스 제공 |
> | prompts: {}   | 프롬프트 템플릿 제공    |
> 
> 현재 우리 서버는 도구만 제공하므로 `tools: {}`만 존재합니다. 빈 객체 `{}`는 해당 기능이 존재함을 나타내며, 세부 옵션이 필요할 경우 추가적인 설정을 포함할 수 있습니다.
> 
> ## Related
> - [[서버 인스턴스]]
> - [[기능(capabilities) 정의]]

---

MCP Server Instance 생성은 Server 클래스에 서버 정보(이름, 버전)와 capabilities(제공 기능) 두 개의 설정 객체를 전달하여 서버 인스턴스를 만드는 과정이다.

---

## Core Idea
첫 번째 객체에는 서버 식별 정보(name, version)를 전달하고, 두 번째 객체에는 서버가 제공하는 기능(capabilities)을 정의한다.
capabilities에는 tools(도구), resources(파일/데이터), prompts(프롬프트 템플릿) 등이 있으며, 빈 객체 {}는 해당 기능이 존재함을 나타낸다.

## Why It Matters
- 서버 인스턴스 생성 시 capabilities를 올바르게 설정하지 않으면 클라이언트가 서버의 기능을 인식하지 못해 도구를 사용할 수 없다.

## Explanation
- new Server({ name, version }, { capabilities }): 서버 인스턴스 생성 구문
- tools: {}: 도구(함수) 제공 기능 활성화
- resources: {}: 파일/데이터 리소스 제공 기능
- prompts: {}: 프롬프트 템플릿 제공 기능

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP 서버에서 도구만 제공하려면 capabilities를 어떻게 설정해야 하는가?
- A: capabilities: { tools: {} }로 설정한다. 빈 객체 {}는 해당 기능이 존재함을 나타낸다.
