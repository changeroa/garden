# CSS Animation과 Keyframes

Created: 2025-12-27 00:17
Modified: 2025-12-27 00:17
TemplateVersion: v1
Status: #status/growing
Tags: #knowledge #css #animation #keyframes
Up:: 
Related::

---

CSS Animation은 @keyframes로 정의한 애니메이션 단계를 요소에 적용하여 움직임을 만드는 기술이다.

---

## Core Idea
@keyframes는 애니메이션의 각 단계(0%, 50%, 100% 등)에서의 스타일을 정의한다.
animation 속성으로 keyframes를 요소에 적용하고 duration, timing-function, iteration-count 등을 설정한다.
animation-delay로 시작 시점을 다르게 하면 여러 요소가 자연스럽게 움직인다.

## Why It Matters
- JavaScript 없이 부드러운 애니메이션을 구현할 수 있다.
- GPU 가속을 활용하여 성능이 좋다.

## Explanation
- @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } - 위아래로 둥둥 뜨는 효과를 만든다.
- animation: float 4s ease-in-out infinite; - 4초 주기로 부드럽게 무한 반복한다.
- timing-function 종류로는 linear(일정), ease(기본), ease-in-out(시작/끝 느리게)이 있다.

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: @keyframes에서 0%와 100%를 같게 설정하는 이유는?
- A: 애니메이션이 끊김 없이 자연스럽게 반복되도록 하기 위해
- Q: animation-duration과 animation-delay의 차이는?
- A: duration은 한 사이클 시간, delay는 시작 전 대기 시간
