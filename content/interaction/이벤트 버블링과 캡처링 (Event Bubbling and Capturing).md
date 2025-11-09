# 이벤트 버블링과 캡처링 (Event Bubbling and Capturing)

태그: #Fundamental #Advanced

하나의 요소에서 이벤트가 발생하면, 그 이벤트는 단순히 해당 요소에서만 끝나는 것이 아니라 DOM 트리를 따라 전파됩니다. 이 전파 방식에는 두 가지 단계가 있습니다.

1.  **캡처링 단계 (Capturing Phase)**: 이벤트가 최상위 `window` 객체에서 시작하여 실제 이벤트가 발생한 타겟 요소까지 내려가는 과정입니다.
2.  **버블링 단계 (Bubbling Phase)**: 이벤트가 타겟 요소에서 시작하여 다시 최상위 `window` 객체까지 올라가는 과정입니다.

![Event Flow](https://www.w3.org/TR/DOM-Level-3-Events/images/eventflow.svg)
*(이미지: W3C)*

대부분의 이벤트 핸들러는 기본적으로 **버블링 단계**에서 작동합니다. 즉, 자식 요소에서 발생한 이벤트는 부모 요소, 그 부모의 부모 요소 순으로 전달되어 각 요소에 등록된 리스너를 모두 실행시킬 수 있습니다.

## 왜 중요한가?

이벤트 전파를 이해하는 것은 스코프 관리에 매우 중요합니다. 예를 들어, `<body>` 태그에 `keydown` 이벤트를 감지하는 글로벌 리스너 하나만 등록해도, 페이지 내의 어떤 요소에서 키보드를 누르든 이 리스너가 모든 이벤트를 감지할 수 있습니다. (버블링 덕분이죠!)

또한, 이벤트 전파를 의도적으로 막아야 할 때도 있습니다. 예를 들어, 모달 창의 단축키가 그 뒤의 캔버스 단축키와 동시에 실행되면 안 됩니다. 이때 `event.stopPropagation()`을 사용하여 이벤트가 더 이상 부모 요소로 전파(버블링)되는 것을 막을 수 있습니다.

```javascript
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    // 이 이벤트가 body나 window까지 전파되어 다른 동작을 일으키는 것을 막습니다.
    event.stopPropagation();
  }
});
```

## 관련 개념

- [[웹 이벤트 (Web Events)]]
- [[02. Phase 2 - 계층화된 오버레이 스코프]]

---
[맨 위로 돌아가기]([[00. 스코프 관리 시스템 구축 (Scope Management System)]])
