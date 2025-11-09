# updateViewport

## 🔗 연결
-   **상위:** `[[03-transform-engine/coordinate-transform-class]]`
-   **관련:** `[[02-data-structures/viewport-interface]]`, `[[03-transform-engine/matrix-update-logic]]`

## 📝 핵심 정리
외부에서 새로운 뷰포트(Viewport) 객체를 받아와 클래스의 내부 뷰포트 상태를 갱신합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 뷰포트 업데이트
 * ==========================================
 * 
 * 📖 목적: 사용자의 상호작용(줌, 패닝 등) 결과를 반영하여 뷰포트 상태를 변경합니다.
 * 🏗️ 구조: 새로운 뷰포트 객체를 인자로 받아 내부 상태를 갱신하고, 행렬과 캔버스 경계 정보가 다시 계산되어야 함을 표시합니다.
 * 🔄 흐름: 외부에서 새 뷰포트 전달 -> 내부 뷰포트 갱신 -> matrixNeedsUpdate = true, canvasBounds = null
 * 🎯 학습포인트: 상태 변경이 다른 계산에 미치는 영향을 플래그(flag)로 관리하는 방법을 배웁니다.
 */

public updateViewport(newViewport: Viewport): void {
  // 스프레드 문법(...)을 사용해 newViewport 객체를 복사하여 내부 상태에 할당합니다.
  // 이를 통해 원본 newViewport 객체와의 참조가 끊어져 예기치 않은 수정을 방지합니다.
  this.viewport = { ...newViewport };
  
  // 뷰포트가 변경되었으므로, 다음 렌더링 시 변환 행렬을 반드시 새로 계산해야 함을 표시합니다.
  this.matrixNeedsUpdate = true;
  
  // 뷰포트의 크기(width, height)가 변경되었을 수 있으므로, 캐시된 캔버스 경계 정보를 무효화합니다.
  this.invalidateCanvasBounds();
}

// invalidateCanvasBounds 헬퍼 함수
private invalidateCanvasBounds(): void {
    this.canvasBounds = null;
}
```

## 🔍 상세 분석

### 로직 포인트
-   **상태 변경의 전파**: 이 함수는 단순히 `this.viewport` 값을 바꾸는 것에서 끝나지 않습니다. 이 변경으로 인해 후속적으로 영향을 받는 다른 상태들(`viewMatrix`, `canvasBounds`)을 직접 수정하는 대신, `matrixNeedsUpdate`와 `canvasBounds` 같은 플래그와 캐시를 무효화합니다.
-   **지연 연산(Lazy Evaluation)**: 실제 비싼 연산(행렬 계산, `getBoundingClientRect` 호출)은 당장 실행하지 않고, `updateMatrices`나 `updateCanvasBoundsIfNeeded`가 호출되는 시점까지 미룹니다. 이는 여러 변경 사항을 한 번에 모아 처리할 수 있게 하여 성능을 향상시킵니다.

### 실무 포인트
-   사용자가 줌 인/아웃을 하거나 지도를 드래그할 때마다, 새로운 `center`와 `zoom` 값을 담은 뷰포트 객체를 만들어 이 함수를 호출하게 됩니다.
-   이 함수는 상태 관리 라이브러리(Redux, Zustand 등)와 함께 사용될 때, 상태 변경을 감지하고 화면을 갱신하는 핵심적인 역할을 합니다.
