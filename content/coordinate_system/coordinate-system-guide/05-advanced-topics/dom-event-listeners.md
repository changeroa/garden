# DOM 이벤트 리스너

## 🔗 연결
-   **상위:** [.[05-advanced-topics/browser-integration]]
-   **관련:** [.[03-transform-engine/constructor-and-initialization]], [.[05-advanced-topics/canvas-boundary-management]]

## 📝 핵심 정리
캔버스의 크기나 `devicePixelRatio`가 변경되는 브라우저 이벤트를 감지하여, 좌표 변환 시스템이 최신 상태를 유지하도록 만듭니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: DOM 이벤트 리스너 설정
 * ==========================================
 * 
 * 📖 목적: 캔버스 크기 변경이나 화면 해상도 변경과 같은 외부 환경 변화에 동적으로 대응합니다.
 * 🏗️ 구조: 생성자에서 `ResizeObserver`와 `resize` 이벤트를 사용하여 관련 변경을 감지하고 콜백 함수를 등록합니다.
 * 🎯 학습포인트: JavaScript의 이벤트 기반 아키텍처를 이해하고, DOM 요소의 변화를 감지하는 방법을 배웁니다.
 */
private setupEventListeners(): void {
  // 1. ResizeObserver: 캔버스 요소의 크기 변경을 감지합니다.
  // CSS나 다른 스크립트에 의해 캔버스 크기가 바뀔 때마다 콜백이 실행됩니다.
  const resizeObserver = new ResizeObserver(() => {
    // 캔버스 경계(bounds) 캐시를 무효화하여 다음 프레임에 다시 계산하도록 합니다.
    this.invalidateCanvasBounds();
  });
  // 관찰할 대상을 캔버스 요소로 지정합니다.
  resizeObserver.observe(this.canvas);

  // 2. window 'resize' 이벤트: 브라우저 창 크기 변경을 감지합니다.
  // 주로 devicePixelRatio의 변경을 감지하기 위해 사용됩니다 (예: 모니터 간 창 이동).
  window.addEventListener('resize', () => {
    const newDpr = window.devicePixelRatio || 1;
    if (newDpr !== this.devicePixelRatio) {
      // dpr 값이 변경되었으면, dpr을 업데이트하고 행렬을 새로 계산하도록 플래그를 설정합니다.
      this.devicePixelRatio = newDpr;
      this.matrixNeedsUpdate = true;
    }
  });
}

// 캔버스 경계 캐시를 무효화하는 헬퍼 메서드
private invalidateCanvasBounds(): void {
  this.canvasBounds = null;
}
```

## 🔍 상세 분석

### 문법 포인트
-   `ResizeObserver`: 특정 요소의 콘텐츠 사각형 크기 변화를 감시하는 최신 API입니다. 기존의 `window.resize` 이벤트보다 더 효율적이고 정확하게 요소의 크기 변경을 감지할 수 있습니다.
-   `window.addEventListener`: 브라우저 창(window 객체)에서 발생하는 이벤트를 수신 대기합니다.

### 로직 포인트
-   **관심사 분리**: `ResizeObserver`는 순수하게 요소의 크기 변경만 담당하고, `resize` 이벤트는 `devicePixelRatio` 변경을 담당하도록 역할을 분리했습니다.
-   **캐시 무효화**: 크기가 변경되면 이전에 저장해 둔 캔버스의 위치/크기 정보(`canvasBounds`)는 더 이상 유효하지 않으므로, `null`로 만들어 다음번 `screenToWorld`나 `worldToScreen` 호출 시 `getBoundingClientRect`를 다시 호출하도록 강제합니다.

### 실무 포인트
-   이러한 이벤트 리스너가 없으면, 사용자가 브라우저 창 크기를 조절했을 때 렌더링이 깨지거나 마우스 클릭 위치가 어긋나는 문제가 발생합니다. 동적인 레이아웃에 대응하기 위해 필수적인 부분입니다.