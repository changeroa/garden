# 02. Phase 2 - 계층화된 오버레이 스코프 시스템

태그: #Phase2 #Scope #UI

## 목표: Modal > Overlay > Tooltip > Editor 우선순위 체계 구축

### 문제 상황: "지금 어떤 단축키가 실행되어야 하는가?"

복잡한 웹 애플리케이션은 여러 UI 요소가 겹쳐 있는 경우가 많습니다. 예를 들어, 메인 캔버스 위에 속성 편집 패널이 있고, 그 위에 확인을 위한 모달(modal) 창이 떠 있을 수 있습니다. 이때 사용자가 `Enter` 키를 누르면 어떤 동작이 실행되어야 할까요? 모달 창의 '확인' 버튼? 편집 패널의 값 입력? 아니면 캔버스의 객체 생성?

이처럼 **어떤 UI 요소가 현재 사용자의 입력에 대한 제어권(스코프)을 갖는지** 결정하는 규칙이 없다면, 사용자 경험은 예측 불가능하고 혼란스러워집니다.

### 해결 방안: 스코프 계층(Scope Hierarchy)

이 문제를 해결하기 위해 UI 요소들의 우선순위를 정의한 **스코프 계층**을 도입합니다. 사용자와 가장 가깝고, 가장 긴급한 상호작용을 요구하는 요소가 가장 높은 우선순위를 갖습니다.

제안된 7단계 스코프 계층은 매우 훌륭한 모델입니다:

1.  **Modal**: 모든 상호작용을 차단하는 최상위 창. (가장 높은 우선순위)
2.  **Overlay**: 팝오버, 드롭다운 메뉴 등 특정 작업을 위해 나타나는 임시 UI.
3.  **Tooltip**: 정보 제공을 위한 작은 설명 창.
4.  **Editor**: 텍스트 입력 필드, 숫자 입력 등 구체적인 값을 입력하는 스코프.
5.  **Sidebar/Panel**: 속성 패널, 레이어 목록 등 보조적인 UI 영역.
6.  **Canvas**: 메인 작업 영역.
7.  **Global**: 위 어떤 스코프에도 해당하지 않을 때의 기본 스코프. (가장 낮은 우선순위)

단축키 이벤트가 발생하면, 시스템은 현재 활성화된 가장 높은 우선순위의 스코프를 찾아 그 스코프에 해당하는 동작만을 실행합니다.

### 구현 전략: ScopeManager와 동적 스코프 감지

`ScopeManager`라는 중앙 관리자를 구현하여 현재 스코프를 실시간으로 판단하도록 만듭니다.

**`getActiveScope()` 메서드의 로직:**

1.  **최상위부터 역순으로 확인**: `Modal` 스코프에 해당하는 요소가 화면에 있는지부터 확인합니다. 있으면 현재 스코프는 `modal`이고, 탐색을 즉시 중단합니다.
2.  **DOM 쿼리와 ARIA 활용**: 각 스코프를 어떻게 감지할 것인가?
    -   **Modal**: `document.querySelector('[role="dialog"], .modal-class')` 와 같이 ARIA 속성이나 특정 CSS 클래스로 찾습니다. `aria-modal="true"` 속성이 있다면 더 확실합니다.
    -   **Overlay/Menu**: `[role="menu"]`, `[role="listbox"]` 등을 찾습니다.
    -   **Tooltip**: `[role="tooltip"]`을 찾습니다.
    -   **Editor**: `document.activeElement` (현재 포커스된 요소)가 `input`, `textarea`이거나 `contenteditable="true"` 속성을 가졌는지 확인합니다.
3.  **z-index 기반 감지**: `role` 속성이 없는 커스텀 오버레이의 경우, 페이지의 여러 요소를 샘플링하여 `getComputedStyle(element).zIndex` 값을 비교하는 휴리스틱(heuristic) 방법을 사용할 수 있습니다. 쌓임 맥락([[z-index]])을 고려해야 하므로 복잡도가 높지만, 시각적으로 가장 위에 있는 요소를 찾는 데 도움이 됩니다.

```javascript
class ScopeManager {
  // 제안된 스코프 우선순위 배열
  scopeHierarchy = ['modal', 'overlay', 'tooltip', 'editor', 'sidebar', 'canvas', 'global'];

  getActiveScope() {
    // 1. Modal 스코프 확인
    const modal = document.querySelector('[role="dialog"]');
    if (modal && window.getComputedStyle(modal).display !== 'none') {
      return 'modal';
    }

    // 2. Overlay/Menu 스코프 확인
    const menu = document.querySelector('[role="menu"]');
    if (menu && window.getComputedStyle(menu).display !== 'none') {
      return 'overlay';
    }

    // 3. Editor 스코프 확인
    const activeElement = document.activeElement;
    if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName) || activeElement.isContentEditable) {
      return 'editor';
    }

    // ... (다른 스코프들에 대한 확인 로직) ...

    // 4. 위 모든 조건에 해당하지 않으면 global
    return 'global';
  }
}

// 사용 예시
const scopeManager = new ScopeManager();

function onKeyDown(event) {
  if (event.isComposing) return;

  const currentScope = scopeManager.getActiveScope(); // 현재 스코프 가져오기
  console.log(`Current scope is: ${currentScope}`)

  // currentScope에 따라 다른 단축키 로직을 실행...
}
```

이 `ScopeManager`는 [[06-phase-6-integrated-event-pipeline]]의 핵심 구성 요소가 됩니다.

## 관련 개념

- [[DOM (Document Object Model)]]
- [[ARIA (Accessible Rich Internet Applications)]]
- [[z-index]]
- [[event-bubbling-and-capturing]]

---
[맨 위로 돌아가기]([[00-scope-management-system]])
