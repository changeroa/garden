# CSS Position 속성

Created: 2025-12-27 00:17
Modified: 2025-12-27 00:17
TemplateVersion: v1
Status: #status/growing
Tags: #knowledge #css #position #layout
Up:: 
Related::

---

CSS position 속성은 요소의 배치 방식을 결정하며 top, left, right, bottom으로 위치를 지정한다.

---

## Core Idea
position: absolute는 가장 가까운 positioned 부모(relative/absolute)를 기준으로 배치된다.
top, left는 기준점에서의 거리를 지정하며 %, px 등 단위를 사용한다.
%는 부모 크기 기준 비율이라 반응형에 유리하다.

## Why It Matters
- 복잡한 레이아웃과 오버레이 UI 구현에 필수적이다.
- z-index와 함께 사용해 레이어 순서를 제어한다.

## Explanation
- position: relative - 원래 위치 기준으로 이동하며 자식 absolute의 기준점 역할을 한다.
- position: absolute - 부모 기준 배치되며 문서 흐름에서 제외된다.
- top: 50%; left: 50%; transform: translate(-50%, -50%);로 요소를 정중앙에 배치한다.

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: position: absolute 요소의 기준점은 무엇인가?
- A: 가장 가까운 positioned 조상 (position이 static이 아닌 부모)
- Q: top: 50%; left: 50%; transform: translate(-50%, -50%);는 무슨 효과인가?
- A: 요소를 부모의 정중앙에 배치
