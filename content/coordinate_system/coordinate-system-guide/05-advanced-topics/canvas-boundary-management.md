# Canvas 경계 관리

## 🔗 연결
-   **상위:** [.[05-advanced-topics/browser-integration]]
-   **관련:** [.[04-api-and-usage/screenToWorld]], [.[04-api-and-usage/worldToScreen]], [.[05-advanced-topics/dom-event-listeners]]

## 📝 핵심 정리
페이지 내에서 캔버스 요소의 정확한 위치(좌표)와 크기를 가져오고, 이 정보를 캐싱하여 성능을 최적화하는 방법입니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 캔버스 경계(Bounds) 관리
 * ==========================================
 * 
 * 📖 목적: 뷰포트를 기준으로 하는 캔버스의 위치와 크기를 가져와 좌표 변환에 사용합니다.
 * 🏗️ 구조: `getBoundingClientRect()`를 호출하여 정보를 가져오고, 이 값을 `canvasBounds` 속성에 캐싱(저장)합니다.
 * 🔄 흐름: `invalidateCanvasBounds()`로 캐시를 비우면, `updateCanvasBoundsIfNeeded()`가 다시 캐시를 채웁니다.
 * 🎯 학습포인트: 비용이 높은 DOM API 호출을 캐싱으로 최적화하는 방법을 배웁니다.
 */

// 클래스 속성: DOMRect 타입 또는 null로 캐시를 저장할 변수를 선언합니다.
private canvasBounds: DOMRect | null = null;

// 필요할 때만 캔버스 경계를 업데이트하는 메서드
private updateCanvasBoundsIfNeeded(): void {
  // canvasBounds가 null일 때만 (즉, 캐시가 비어있을 때만) getBoundingClientRect를 호출합니다.
  if (!this.canvasBounds) {
    this.canvasBounds = this.canvas.getBoundingClientRect();
  }
}

// 캐시를 무효화하는 메서드
private invalidateCanvasBounds(): void {
  // 캔버스 크기가 변경되었을 때 이 함수를 호출하여 캐시를 지웁니다.
  this.canvasBounds = null;
}
```

## 🔍 상세 분석

### 문법 포인트
-   `getBoundingClientRect()`: 웹 API의 메서드로, 특정 요소의 크기와 뷰포트에 대한 상대적인 위치 정보를 담은 `DOMRect` 객체를 반환합니다. 이 객체는 `left`, `top`, `right`, `bottom`, `width`, `height` 등의 속성을 포함합니다.
-   `DOMRect`: `getBoundingClientRect()`가 반환하는 객체의 타입입니다.

### 로직 포인트
-   **성능 최적화**: `getBoundingClientRect()`는 브라우저의 리플로우(reflow)를 유발할 수 있는, 상대적으로 비용이 비싼 연산입니다. 매 프레임마다 이 함수를 호출하는 대신, 한 번 계산한 값을 `canvasBounds`에 저장해두고 재사용합니다.
-   **캐시 무효화(Cache Invalidation)**: `ResizeObserver`가 캔버스 크기 변경을 감지하면 `invalidateCanvasBounds`를 호출하여 캐시를 `null`로 만듭니다. 그러면 다음에 `updateCanvasBoundsIfNeeded`가 호출되었을 때, `!this.canvasBounds` 조건이 참이 되어 새로운 값으로 캐시를 업데이트하게 됩니다. 이것이 "캐시 무효화"의 핵심 패턴입니다.

### 실무 포인트
-   페이지가 스크롤되거나 다른 요소의 크기가 변해도 캔버스의 상대 위치는 계속 바뀌므로, `getBoundingClientRect`를 적절한 시점에 호출하여 최신 상태를 유지하는 것이 매우 중요합니다.
-   이러한 캐싱 전략은 렌더링 루프와 같이 반복적으로 실행되는 코드의 성능을 최적화하는 데 널리 사용됩니다.