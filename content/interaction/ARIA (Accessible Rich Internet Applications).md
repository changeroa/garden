# ARIA (Accessible Rich Internet Applications)

태그: #Fundamental #Accessibility

ARIA는 "접근성 있는 리치 인터넷 애플리케이션"의 약자로, 동적인 콘텐츠와 복잡한 UI를 가진 웹 앱의 접근성을 향상시키기 위한 W3C 명세입니다. 스크린 리더와 같은 보조 기술이 웹 앱의 구조와 상태를 더 잘 이해할 수 있도록 도와줍니다.

ARIA는 HTML에 추가적인 의미를 부여하는 `role`과 `aria-*` 속성들을 제공합니다.

-   `role`: 요소의 역할을 정의합니다. (예: `role="dialog"`, `role="menu"`, `role="tooltip"`)
-   `aria-modal="true"`: 이 요소가 모달 대화상자임을 알립니다.
-   `aria-hidden="true"`: 이 요소가 현재 보조 기술에 노출되지 않아야 함을 알립니다.

## 왜 중요한가?

Phase 2의 목표 중 하나는 **동적 오버레이(팝오버, 드롭다운, 메뉴)를 감지**하는 것입니다. 많은 현대적인 UI 라이브러리들은 접근성을 위해 이러한 ARIA 속성을 잘 적용해두었습니다.

따라서 우리는 순수하게 DOM 구조나 CSS(`z-index`)에만 의존하는 것보다, ARIA 속성을 함께 활용하여 UI 요소의 **의미(semantic)**를 파악할 수 있습니다. 이는 훨씬 더 정확하고 안정적으로 스코프를 감지하는 방법입니다.

```javascript
// 예시: 현재 화면에 떠 있는 모든 모달(대화상자)을 찾는 쿼리
const modals = document.querySelectorAll('[role="dialog"]');

// ARIA 속성을 활용하면 이 요소가 '모달'이라는 것을 명확히 알 수 있습니다.
if (modals.length > 0) {
  // 현재 최상위 스코프는 'modal'일 가능성이 높습니다.
}
```

## 관련 개념

- [[02. Phase 2 - 계층화된 오버레이 스코프]]

---
[맨 위로 돌아가기]([[00. 스코프 관리 시스템 구축 (Scope Management System)]])
