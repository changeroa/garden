# 성능 최적화 기법 (Throttling & Debouncing)

태그: #Fundamental #Performance

`Throttling`(스로틀링)과 `Debouncing`(디바운싱)은 과도한 이벤트 발생으로 인한 성능 저하를 막기 위한 필수적인 기술입니다.

### 스로틀링 (Throttling)

스로틀링은 함수가 **일정 시간당 최대 한 번만** 호출되도록 보장합니다. 예를 들어, 100ms 스로틀링이 적용된 함수는 1초에 최대 10번만 실행됩니다. 중간에 아무리 많은 이벤트가 발생해도 모두 무시됩니다.

-   **사용 사례**: 스크롤, 마우스 이동, 창 크기 조절 등. 이벤트의 중간 과정을 모두 반영해야 하지만(예: 스크롤 위치에 따른 애니메이션), 너무 자주 실행되면 부담이 될 때 사용합니다.
-   **목표**: 실행 횟수에 상한선을 둔다.

```javascript
// 간단한 스로틀링 구현 예시
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// 사용법: 100ms마다 최대 한 번만 실행
window.addEventListener('resize', throttle(() => console.log('Resized!'), 100));
```

### 디바운싱 (Debouncing)

디바운싱은 이벤트가 **연속해서 발생할 때, 마지막 이벤트 이후 일정 시간이 지날 때까지** 함수 호출을 지연시킵니다. 만약 지정된 시간 안에 새로운 이벤트가 또 발생하면, 타이머는 리셋됩니다.

-   **사용 사례**: 검색창 자동 완성, 버튼 중복 클릭 방지. 사용자의 입력이 완전히 끝났을 때 한 번만 실행하면 충분할 때 사용합니다.
-   **목표**: 연쇄적인 호출을 하나로 그룹화한다.

```javascript
// 간단한 디바운싱 구현 예시
function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
}

// 사용법: 마지막 입력 후 500ms가 지나면 실행
searchInput.addEventListener('keyup', debounce(() => console.log('Fetching suggestions...'), 500));
```

## 관련 개념

- [[04. Phase 4 - 성능 최적화]]

---
[맨 위로 돌아가기]([[00. 스코프 관리 시스템 구축 (Scope Management System)]])
