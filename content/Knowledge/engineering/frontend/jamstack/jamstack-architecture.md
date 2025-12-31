# JAMstack 아키텍처

Created: 2025-12-27 00:14
Modified: 2025-12-27 00:14
TemplateVersion: v1
Status: #status/growing
Tags: #knowledge #jamstack #static-site #web-architecture
Up:: 
Related::

---

JAMstack은 JavaScript, API, Markup의 약자로 빌드 타임에 정적 파일을 사전 생성하는 웹 개발 아키텍처이다.

---

## Core Idea
빌드 타임에 가능한 모든 것을 미리 생성하고 런타임에서는 정적 파일만 서빙한다.
클라이언트 사이드 렌더링 대신 사전 렌더링(pre-rendering)을 통해 성능과 보안을 향상시킨다.
데이터와 템플릿을 분리하여 빌드 스크립트로 HTML을 생성한다.

## Why It Matters
- 빠른 로딩 속도를 제공한다. 정적 파일은 CDN에서 바로 서빙 가능하기 때문이다.
- 보안성이 향상된다. 서버 사이드 로직이 없어 공격 표면이 감소한다.

## Explanation
- 전통적인 SSR은 요청 시점에 HTML을 생성하지만 JAMstack은 빌드 시점에 미리 생성한다.
- 예시 구조는 data/icons.json(데이터) + templates/index.html(템플릿) + build.js(빌드 스크립트) = dist/index.html(결과물)이다.

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: JAMstack에서 J, A, M은 무엇을 의미하는가?
- A: JavaScript, API, Markup
- Q: JAMstack에서 HTML은 언제 생성되는가?
- A: 빌드 타임에 미리 생성된다 (런타임이 아님)
