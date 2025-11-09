# 웹 이벤트 (Web Events)

태그: #Fundamental

웹 이벤트는 웹 페이지에서 발생하는 모든 상호작용이나 상태 변화를 의미하는 '사건'입니다. 사용자가 마우스를 클릭하거나(`click`), 키보드를 누르거나(`keydown`), 창 크기를 조절하는(`resize`) 등의 모든 행동이 이벤트가 될 수 있습니다.

## 이벤트 처리의 핵심: 이벤트 리스너

자바스크립트를 사용해 특정 이벤트가 발생했을 때 특정 함수(이벤트 핸들러)를 실행하도록 만들 수 있습니다. 이를 '이벤트 리스너를 등록한다'고 말합니다.

```javascript
const myButton = document.getElementById('my-button');

// myButton 요소에서 'click' 이벤트가 발생하면, 화살표 함수가 실행됩니다.
myButton.addEventListener('click', (event) => {
  console.log('버튼이 클릭되었습니다!');
  // 'event' 객체에는 클릭 위치, 누른 키 등 이벤트에 대한 상세 정보가 담겨 있습니다.
  console.log(event);
});
```

## 스코프 관리와 이벤트

우리가 만들 시스템의 심장과도 같습니다. 시스템은 `keydown`, `keyup`, `pointerdown` 같은 핵심 이벤트를 감지하여 작동합니다. 이벤트가 발생하면, 시스템은 다음을 판단합니다.

1.  이 이벤트가 어디서 발생했는가? (스코프 판단)
2.  현재 스코프에서 이 이벤트에 할당된 동작이 있는가?
3.  이 이벤트를 처리해야 하는가, 아니면 무시해야 하는가? (예: IME 입력 중)

이 모든 과정은 이벤트 객체(`event`)에 담긴 정보를 바탕으로 이루어집니다.

## 관련 개념

- [[이벤트 버블링과 캡처링 (Event Bubbling and Capturing)]]
- [[01. Phase 1 - IME 입력 보호 시스템]]
- [[06. Phase 6 - 통합 이벤트 처리 파이프라인]]

---
[맨 위로 돌아가기]([[00. 스코프 관리 시스템 구축 (Scope Management System)]])
