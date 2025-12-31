# TypeScript Index Signature

Created: 2025-12-30 14:15
Modified: 2025-12-30 14:15
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #typescript #type-system #index-signature
Up:: [[engineering/frontend/typescript/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ## Summary
> TypeScript의 인덱스 시그니처를 사용하여 객체의 속성을 동적으로 정의하는 방법을 설명합니다. 이를 통해 사전 정의된 키 이름에 제한 없이 다양한 속성을 허용할 수 있습니다.
> 
> ## Key Points
> - **인덱스 시그니처**: `{[key: string]: object}` 형식으로, 키는 임의의 문자열, 값은 객체 타입입니다.
> - **유연한 속성 정의**: 사전 정의된 키만 허용하는 대신, 다양한 키를 가질 수 있도록 설계되었습니다.
> - **실제 예시**: `inputSchema`에서 `title`, `category`, `coreIdea`와 같은 다양한 키를 포함할 수 있습니다.
> 
> ## Details
> TypeScript에서 인덱스 시그니처는 객체의 속성을 정의할 때 유용합니다. 예를 들어, 다음과 같이 사용할 수 있습니다:
> 
> ```typescript
> properties?: {
>   [key: string]: object;
> };
> ```
> 
> 위 구문은 모든 문자열을 키로 사용할 수 있도록 하여, 다음과 같은 형태의 객체를 허용합니다:
> 
> ```typescript
> properties: {
>   "title": { type: "string" },
>   "category": { type: "string" },
>   "아무이름": { type: "number" },
> }
> ```
> 
> 이 방식은 사용자나 개발자가 파라미터 이름을 미리 알지 못할 경우 유용하며, 다음과 같이 제한된 경우와 비교됩니다:
> 
> ```typescript
> properties: {
>   title: object;
>   category: object;
> }
> ```
> 
> 따라서 인덱스 시그니처를 사용하면 다양한 이름의 파라미터를 추가할 수 있는 유연성을 제공합니다.
> 
> ## Related
> - [[TypeScript 인덱스 시그니처]]
> - [[객체 타입 정의]]

---

TypeScript Index Signature는 {[key: string]: Type} 형식으로 객체의 속성 키가 동적으로 정해질 때 사용하는 타입 정의 방식이다.

---

## Core Idea
인덱스 시그니처는 사전에 정의된 키 이름에 제한되지 않고 다양한 키를 가질 수 있는 객체를 정의할 때 사용한다.
[key: string]은 모든 문자열을 키로 사용할 수 있음을 의미하며, JSON Schema의 properties 정의 등에서 자주 사용된다.

## Why It Matters
- 동적인 키를 가진 객체를 다룰 때 인덱스 시그니처 없이는 타입 정의가 불가능하거나 매우 번거로워진다.

## Explanation
- {[key: string]: object}: 모든 문자열 키에 object 값을 허용
- properties: { title: {...}, category: {...} }: 실제 사용 예시
- 사용자나 개발자가 파라미터 이름을 미리 알지 못할 때 유용
- 고정된 키만 허용하는 방식과 비교하면 유연성을 제공

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: TypeScript에서 임의의 문자열 키에 객체 값을 허용하는 타입을 어떻게 정의하는가?
- A: {[key: string]: object} 형식의 인덱스 시그니처를 사용한다.
