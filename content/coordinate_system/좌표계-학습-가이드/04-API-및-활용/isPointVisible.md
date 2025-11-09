# isPointVisible

## 🔗 연결
-   **상위:** `[[04-API-및-활용/유틸리티 메서드]]`
-   **다음:** `[[04-API-및-활용/getWorldBounds]]`
-   **관련:** `[[02-자료-구조/Viewport 인터페이스]]`

## 📝 핵심 정리
주어진 월드 좌표의 점이 현재 화면(뷰포트) 내에 보이는지 여부를 확인합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 점의 화면 표시 여부 확인
 * ==========================================
 * 
 * 📖 목적: 렌더링 성능 최적화를 위해, 화면 밖에 있는 객체를 그리지 않도록(culling) 필터링하는 데 사용됩니다.
 * 🏗️ 구조: 현재 뷰포트의 중심과 줌 레벨을 기준으로 화면에 보이는 월드 좌표의 범위를 계산하고, 주어진 점이 그 범위 안에 있는지 확인합니다.
 * 🎯 학습포인트: AABB(Axis-Aligned Bounding Box) 충돌 판정의 가장 기본적인 형태를 이해합니다.
 */
public isPointVisible(worldPoint: Point, margin = 0): boolean {
  const { center, zoom, width, height } = this.viewport;
  
  // 현재 화면에 보이는 월드 좌표의 폭(width)의 절반을 계산합니다.
  // 뷰포트의 픽셀 너비를 줌 레벨로 나누면, 해당 픽셀 너비가 월드 단위에서 얼마만큼의 길이를 나타내는지 알 수 있습니다.
  const halfWidth = (width / zoom + margin) / 2;
  // 화면에 보이는 월드 좌표의 높이(height)의 절반을 계산합니다.
  const halfHeight = (height / zoom + margin) / 2;
  
  // 점의 x좌표가 화면 중심의 x좌표를 기준으로 halfWidth 거리 안에 있는지 확인합니다.
  const withinX = worldPoint.x >= center.x - halfWidth && worldPoint.x <= center.x + halfWidth;
  // 점의 y좌표가 화면 중심의 y좌표를 기준으로 halfHeight 거리 안에 있는지 확인합니다.
  const withinY = worldPoint.y >= center.y - halfHeight && worldPoint.y <= center.y + halfHeight;

  // x와 y 모두 범위 안에 있어야 화면에 보이는 것입니다.
  return withinX && withinY;
}
```

## 🔍 상세 분석

### 로직 포인트
-   **계산 원리**: 이 함수는 점을 스크린 좌표로 변환하여 비교하는 대신, 화면의 경계를 월드 좌표로 변환하여 비교합니다. 이 방식이 더 계산 비용이 저렴하고 직관적일 수 있습니다.
-   `width / zoom`: 뷰포트의 너비(예: 800px)를 현재 줌 레벨(예: 2)로 나누면, 현재 화면이 월드 단위에서 400 유닛의 너비를 보여주고 있다는 것을 의미합니다.
-   `margin`: 화면 경계에 정확히 걸쳐있는 객체들이 렌더링에서 제외되는 것을 방지하거나, 혹은 화면 밖의 객체를 미리 불러오고 싶을 때 추가적인 여백을 줄 수 있는 옵션입니다.

### 실무 포인트
-   수천, 수만 개의 객체를 렌더링해야 하는 경우, 모든 객체를 매 프레임마다 그리는 것은 매우 비효율적입니다. 렌더링 파이프라인의 시작 부분에서 이 함수를 사용해 화면에 보일 객체만 필터링하면 성능을 크게 향상시킬 수 있습니다. 이를 "컬링(Culling)"이라고 합니다.
