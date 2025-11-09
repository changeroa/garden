# z-index와 쌓임 맥락(Stacking Context)

태그: #Fundamental #CSS

`z-index`는 CSS 속성으로, 요소가 겹쳐 있을 때 어떤 요소가 더 위에 보일지를 결정하는 Z축 순서를 지정합니다. `z-index` 값이 클수록 사용자에게 더 가까이(더 위에) 보입니다.

## 중요한 규칙: 쌓임 맥락 (Stacking Context)

`z-index`는 간단해 보이지만, **쌓임 맥락(Stacking Context)**이라는 중요한 개념 안에서 동작합니다. 쌓임 맥락은 특정 속성을 가진 요소에 의해 형성되며, 그 안의 자식 요소들은 부모의 쌓임 맥락에 갇히게 됩니다.

-   `position`이 `absolute` 또는 `relative`이면서 `z-index`가 `auto`가 아닌 요소
-   `position`이 `fixed` 또는 `sticky`인 요소
-   `opacity`가 1보다 작은 요소
-   `transform`, `filter` 속성을 사용하는 요소

**핵심:** 부모 요소가 `z-index: 10`을 가진 쌓임 맥락을 형성하면, 그 안의 자식 요소가 `z-index: 9999`를 가져도 `z-index: 11`을 가진 다른 요소보다 위로 올라갈 수 없습니다.

## 왜 중요한가?

Phase 2에서 오버레이의 우선순위를 계산할 때 `z-index`를 활용할 수 있습니다. 시각적으로 가장 위에 있는 요소가 가장 높은 스코프 우선순위를 가질 가능성이 높기 때문입니다.

하지만 단순히 `z-index` 값만 비교해서는 안 됩니다. 쌓임 맥락을 고려하여 어떤 요소가 정말로 다른 요소보다 위에 있는지 정확히 계산해야 합니다. 실제 구현에서는 DOM을 순회하며 각 요소의 `z-index`와 `position` 등의 속성을 종합적으로 분석하여 시각적 우선순위를 판단하는 로직이 필요합니다.

```javascript
// 예시: 특정 요소의 계산된 z-index 값을 가져오는 방법
const element = document.getElementById('my-modal');
const style = window.getComputedStyle(element);
const zIndex = parseInt(style.zIndex, 10) || 0;
```

## 관련 개념

- [[02. Phase 2 - 계층화된 오버레이 스코프]]

---
[맨 위로 돌아가기]([[00. 스코프 관리 시스템 구축 (Scope Management System)]])
