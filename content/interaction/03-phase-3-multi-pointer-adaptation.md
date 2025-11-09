# 03. Phase 3 - 멀티 포인터 적응 시스템

태그: #Phase3 #PointerEvents #Touch #Pen

## 목표: 터치/펜/마우스별 적절한 단축키 제공

### 문제 상황: 모든 입력은 평등하지 않다

현대의 웹 애플리케이션은 마우스와 키보드뿐만 아니라 터치스크린, 스타일러스 펜 등 다양한 입력 장치로 조작됩니다. 각 입력 방식은 고유한 장점과 상호작용 패턴을 가집니다.

-   **마우스**: 정밀한 포인팅, 클릭, 드래그, 스크롤 휠에 강점. `Ctrl` + 클릭, `Shift` + 드래그 등 키보드 조합 단축키에 익숙.
-   **터치**: 직관적인 제스처(두 손가락으로 확대/축소, 쓸어넘기기)에 강점. 키보드 사용이 제한적이며, `Space` 키를 누른 채 패닝하는 등의 동작은 불가능.
-   **펜**: 마우스와 유사하지만, 필압이나 펜 기울기 같은 추가적인 정보를 제공.

만약 마우스 전용으로 설계된 `Space` + 드래그 패닝 기능을 터치 환경에서 그대로 두면, 사용자가 스페이스바를 누를 때마다 가상 키보드가 나타나거나 공백만 입력되는 등 혼란스러운 경험을 유발합니다.

### 해결 방안: 포인터 타입 감지 및 적응형 단축키

**`PointerEvent` API**를 사용하여 현재 사용자가 어떤 종류의 입력 장치를 사용하고 있는지 감지하고, 그에 맞춰 단축키의 활성화 여부나 동작 방식을 동적으로 변경합니다.

`PointerEvent`는 마우스, 터치, 펜 이벤트를 하나로 통합한 최신 웹 표준입니다. 이 이벤트 객체 안의 **`pointerType`** 속성은 현재 입력의 종류를 알려주는 핵심적인 단서입니다.

-   `event.pointerType`은 `'mouse'`, `'touch'`, `'pen'` 중 하나의 문자열 값을 가집니다.

### 구현 전략

1.  **주 포인터 타입(Primary Pointer Type) 추적**: 시스템 전역에서 현재 사용되고 있는 주된 입력 방식이 무엇인지 기억하는 상태 변수를 관리합니다.

    ```javascript
    let primaryPointerType = 'mouse'; // 기본값

    // 사용자가 화면을 처음 터치/클릭/펜으로 누를 때마다 포인터 타입을 갱신
    window.addEventListener('pointerdown', (event) => {
      primaryPointerType = event.pointerType;
    }, { capture: true }); // 모든 이벤트를 초기에 감지하기 위해 캡처링 사용
    ```

2.  **적응형 단축키 매니저 (Adaptive Shortcut Manager)**: 단축키를 정의할 때, 해당 단축키가 어떤 포인터 타입에서 유효한지를 명시합니다.

    ```javascript
    const shortcuts = {
      'SELECT_ALL': {
        keys: 'Ctrl+A',
        action: () => { /* ... */ },
        // 모든 포인터 타입에서 유효
        pointerTypes: ['mouse', 'touch', 'pen']
      },
      'PAN_WITH_SPACE': {
        keys: 'Space',
        action: () => { /* ... */ },
        // 마우스와 펜에서만 유효
        pointerTypes: ['mouse', 'pen']
      }
    };
    ```

3.  **단축키 실행 전 가용성 체크**: 단축키 핸들러는 키 조합이 일치하더라도, 현재 `primaryPointerType`이 해당 단축키의 `pointerTypes` 목록에 포함되어 있는지 확인하는 절차를 추가합니다.

    ```javascript
    function onKeyDown(event) {
      // ... IME 체크, 스코프 체크 로직 ...

      const shortcut = findShortcutForEvent(event);

      if (shortcut) {
        // 현재 포인터 타입에서 이 단축키가 유효한지 체크!
        if (shortcut.pointerTypes.includes(primaryPointerType)) {
          shortcut.action();
        }
      }
    }
    ```

이 시스템을 통해 터치 사용자에게는 두 손가락 패닝/줌 같은 제스처 기반 상호작용을 우선적으로 제공하고, 마우스 전용 단축키는 비활성화하여 플랫폼에 최적화된 경험을 만들 수 있습니다.

## 관련 개념

- [[web-events]]
- [[06-phase-6-integrated-event-pipeline]]

---
[맨 위로 돌아가기]([[00-scope-management-system]])
