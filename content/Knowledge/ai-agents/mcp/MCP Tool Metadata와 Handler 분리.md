# MCP Tool Metadata와 Handler 분리

Created: 2025-12-30 14:09
Modified: 2025-12-30 14:09
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #design-pattern #separation-of-concerns
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> 도구의 메타데이터와 실행 로직을 분리하여 관심사 분리 원칙을 적용한 구조에 대해 설명합니다. 
> 
> ## Key Points
> - **이름 패턴**: 도구의 메타데이터와 실행 로직을 구분
> - **메타데이터**: 도구의 기능 및 입력 정보 제공
> - **실행 로직**: 도구가 호출될 때 실제로 수행되는 동작
> 
> ## Details
> | 이름 패턴     | 역할                         | 예시                   |
> | --------- | -------------------------- | -------------------- |
> | xxxTool   | 도구의 메타데이터 (이름, 설명, 입력 스키마) | listCategoriesTool   |
> | handleXxx | 도구의 실행 로직 (실제 동작)          | handleListCategories |
> 
> 메타데이터는 "이 도구는 무엇을 하고, 어떤 입력을 받는지"에 대한 정보를 Claude에게 전달하며, 실행 로직은 "어떻게 실제로 동작하는지"를 나타냅니다. 이러한 구조는 관심사 분리(Separation of Concerns) 원칙에 따라 설계되었습니다.
> 
> ## Related
> - [[관심사 분리(Separation of Concerns)]]
> - [[소프트웨어 설계 원칙]]

---

MCP Tool Metadata와 Handler 분리는 도구의 설명 정보(xxxTool)와 실행 로직(handleXxx)을 분리하여 관심사 분리(Separation of Concerns) 원칙을 적용하는 패턴이다.

---

## Core Idea
xxxTool 객체는 도구의 메타데이터(이름, 설명, 입력 스키마)를 담고 있어 Claude에게 '이 도구는 무엇을 하고, 어떤 입력을 받는지' 알려준다.
handleXxx 함수는 도구가 호출될 때 실제로 수행되는 동작을 정의하며, 메타데이터와 분리되어 독립적으로 테스트하고 수정할 수 있다.

## Why It Matters
- 메타데이터와 로직을 분리하면 도구의 설명을 변경해도 실행 로직에 영향을 주지 않고, 반대의 경우도 마찬가지여서 유지보수가 쉬워진다.

## Explanation
- listCategoriesTool: 도구의 메타데이터 객체 예시
- handleListCategories: 해당 도구의 실행 로직 함수 예시
- 이 패턴은 관심사 분리(Separation of Concerns) 설계 원칙을 따른다

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP 서버에서 도구의 이름과 설명은 어디에 정의하고, 실제 동작은 어디에 정의하는가?
- A: 도구의 이름과 설명은 xxxTool 객체에, 실제 동작은 handleXxx 함수에 정의한다.
