# worldToScreen

## 🔗 연결
-   **상위:** [.[04-API-및-활용/좌표 변환 API]]
-   **이전:** [.[04-API-및-활용/screenToWorld]]
-   **관련:** [.[03-변환-엔진/행렬 업데이트 로직]], [.[02-자료-구조/Point 인터페이스]]

## 📝 핵심 정리
월드(논리) 공간의 좌표를 스크린(화면)의 픽셀 좌표로 변환합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 월드 좌표 -> 스크린 좌표 변환
 * ==========================================
 * 
 * 📖 목적: 월드 공간에 있는 객체(예: 캐릭터, 아이콘)를 화면의 어느 위치에 그려야 할지 계산합니다.
 * 🏗️ 구조: 월드 좌표에 viewMatrix를 곱하여 클립 공간 좌표로 변환한 후, 캔버스 크기에 맞게 스케일링하여 최종 스크린 좌표를 얻습니다.
 * 🔄 흐름: worldPoint -> (곱하기 viewMatrix) -> clipSpace -> canvasSpace -> screenSpace
 * 🎯 학습포인트: viewMatrix가 렌더링 파이프라인에서 어떻게 사용되는지 이해합니다.
 */
public worldToScreen(worldPoint: Point): Point {
  // 필요 시 행렬 및 캔버스 정보를 업데이트합니다.
  this.updateMatrices();
  this.updateCanvasBoundsIfNeeded();

  if (!this.canvasBounds) return worldPoint; // 캔버스 정보가 없으면 변환 불가

  const m = this.viewMatrix; // 월드 -> 클립 공간 변환 행렬

  // 1. 월드 좌표를 클립 공간 좌표로 변환 (-1 ~ +1)
  const clipX = worldPoint.x * m[0] + worldPoint.y * m[3] + m[6];
  const clipY = worldPoint.x * m[1] + worldPoint.y * m[4] + m[7];

  // 2. 클립 공간 좌표를 캔버스 좌표로 변환 (0 ~ canvas.width)
  // clipX가 -1일 때 0, +1일 때 canvas.width가 되어야 함
  const canvasX = ((clipX + 1) / 2) * this.canvasBounds.width;
  // clipY가 +1일 때 0, -1일 때 canvas.height가 되어야 함 (Y축 반전)
  const canvasY = ((1 - clipY) / 2) * this.canvasBounds.height;

  // 3. 캔버스 좌표를 스크린(전체 화면) 좌표로 변환
  const screenX = canvasX + this.canvasBounds.left;
  const screenY = canvasY + this.canvasBounds.top;

  return { x: screenX, y: screenY };
}
```

## 🔍 상세 분석

### 로직 포인트
1.  **행렬 곱셈**: `worldPoint` 벡터와 `viewMatrix`를 곱해 클립 공간 좌표를 얻습니다. `screenToWorld`와 정반대의 과정입니다.
2.  **클립 공간에서 캔버스 공간으로**: `(clip + 1) / 2` 공식은 -1~+1 범위를 0~1 범위로 바꾸는 일반적인 방법입니다. 여기에 캔버스의 너비/높이를 곱하면 캔버스 내의 픽셀 좌표를 얻을 수 있습니다.
3.  **Y축 처리**: `(1 - clipY)` 부분에서 `clipY`의 부호를 반전시켜, 클립 공간의 위쪽(y=+1)이 캔버스 좌표의 위쪽(y=0)에 매핑되도록 합니다.
4.  **스크린 좌표로 최종 변환**: 마지막으로 캔버스의 화면상 위치(`canvasBounds.left`, `canvasBounds.top`)를 더해줘서, 전체 스크린 기준의 최종 좌표를 계산합니다.

### 실무 포인트
-   모든 렌더링 루프에서 이 함수는 필수적으로 사용됩니다. 화면에 그려져야 할 모든 객체는 이 함수를 거쳐 자신의 `(x, y)` 위치를 결정합니다.
-   성능이 매우 중요하므로, 이 함수 내부에서는 최대한 무거운 연산을 피하고, 미리 계산된 행렬과 캐시된 `canvasBounds`를 사용해야 합니다.