# screenToWorld

## 🔗 연결
-   **상위:** [.[04-api-and-usage/coordinate-transform-api]]
-   **다음:** [.[04-api-and-usage/worldToScreen]]
-   **관련:** [.[03-transform-engine/inverse-matrix-calculation]], [.[02-data-structures/point-interface]], [.[02-data-structures/viewport-interface]]

## 📝 핵심 정리
스크린(화면)의 픽셀 좌표를 월드(논리) 공간의 좌표로 변환합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 스크린 좌표 -> 월드 좌표 변환
 * ==========================================
 * 
 * 📖 목적: 사용자의 마우스 클릭 위치(스크린 좌표)를 월드 공간의 좌표로 변환합니다.
 * 🏗️ 구조: 스크린 좌표를 정규화된 클립 공간 좌표로 변환한 후, 역행렬을 곱하여 월드 좌표를 얻습니다.
 * 🔄 흐름: screenPoint -> clipSpace -> (곱하기 inverseViewMatrix) -> worldPoint
 * 🎯 학습포인트: 역행렬이 실제로 어떻게 사용되는지, 그리고 좌표계 변환의 전체 과정을 이해합니다.
 */
public screenToWorld(screenPoint: Point): Point {
  // 필요 시 캔버스의 실제 크기와 위치 정보를 업데이트합니다.
  this.updateCanvasBoundsIfNeeded();
  // 필요 시 뷰포트 변경에 따라 행렬을 업데이트합니다.
  this.updateMatrices();

  if (!this.canvasBounds) return screenPoint; // 캔버스 정보가 없으면 변환 불가

  // 캔버스의 CSS 크기와 실제 렌더링 크기가 다를 경우 뷰포트를 동기화합니다.
  if (this.viewport.width !== this.canvasBounds.width || this.viewport.height !== this.canvasBounds.height) {
    this.viewport.width = this.canvasBounds.width;
    this.viewport.height = this.canvasBounds.height;
    this.matrixNeedsUpdate = true;
    this.updateMatrices();
  }

  // 1. 스크린 좌표를 캔버스 기준 좌표로 변환 (0 ~ canvas.width)
  const canvasX = screenPoint.x - this.canvasBounds.left;
  const canvasY = screenPoint.y - this.canvasBounds.top;

  // 2. 캔버스 좌표를 클립 공간 좌표로 변환 (-1 ~ +1)
  const clipX = (canvasX / this.canvasBounds.width) * 2 - 1;
  const clipY = -( (canvasY / this.canvasBounds.height) * 2 - 1 ); // Y축은 방향이 반대

  // 3. 역행렬(inverseViewMatrix)을 사용하여 클립 좌표를 월드 좌표로 변환
  const invM = this.inverseViewMatrix;
  const worldX = clipX * invM[0] + clipY * invM[3] + invM[6];
  const worldY = clipX * invM[1] + clipY * invM[4] + invM[7];

  return { x: worldX, y: worldY };
}
```

## 🔍 상세 분석

### 로직 포인트
1.  **`update...IfNeeded()`**: `getBoundingClientRect()`는 비용이 높은 연산일 수 있으므로, 필요할 때만 호출하기 위해 캐싱(`canvasBounds`)하고 업데이트하는 로직을 사용합니다.
2.  **좌표계 변환 단계**: `스크린(전체 화면) → 캔버스(HTML 요소) → 클립 공간(-1~1) → 월드 공간`의 명확한 단계를 거칩니다.
3.  **클립 공간으로 정규화**: 어떤 크기의 캔버스든 일관된 처리를 위해, 모든 좌표를 -1에서 +1 사이의 "클립 공간"으로 정규화하는 과정이 필수적입니다. `(x / width) * 2 - 1` 공식이 바로 그 역할을 합니다.
4.  **행렬 곱셈**: 마지막 단계에서 `[clipX, clipY, 1]` 벡터와 `inverseViewMatrix` 행렬을 곱하여 최종 `worldX`, `worldY`를 얻습니다.

### 실무 포인트
-   이 함수는 사용자의 입력에 반응하는 모든 인터랙티브 기능의 기초입니다. (예: 지도에서 핀 추가, 게임에서 유닛 선택, 드로잉 앱에서 그림 그리기)