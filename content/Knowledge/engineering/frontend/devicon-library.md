# Devicon 라이브러리

Created: 2025-12-27 00:17
Modified: 2025-12-27 00:17
TemplateVersion: v1
Status: #status/growing
Tags: #knowledge #devicon #icons #frontend
Up:: 
Related::

---

Devicon은 프로그래밍 언어와 개발 도구 로고를 폰트와 SVG로 제공하는 아이콘 라이브러리이다.

---

## Core Idea
CDN으로 폰트를 불러오면 <i class='devicon-xxx-plain'>으로 아이콘을 사용할 수 있다.
아이콘 타입에는 -original(SVG만), -plain(폰트 지원), -line(선만) 등이 있다.
colored 클래스를 추가하면 브랜드 원본 색상이 적용된다.

## Why It Matters
- 기술 스택을 시각적으로 표현할 때 유용하다.
- 150개 이상의 개발 관련 아이콘을 제공한다.

## Explanation
- CDN 주소는 https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css 이다.
- Font 버전은 -plain만 지원하고 -original은 SVG에서만 동작한다.
- <i class='devicon-react-plain colored'></i>로 React 아이콘을 원본 파란색으로 표시한다.

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: Devicon CDN 폰트에서 -original이 안 보이는 이유는?
- A: Font 버전은 -plain만 지원하고 -original은 SVG에서만 동작
- Q: 아이콘에 브랜드 색상을 적용하려면 어떻게 하는가?
- A: colored 클래스를 추가한다
