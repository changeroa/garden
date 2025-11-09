# calculateZoomToFit

## 🔗 연결
-   **상위:** `[[04-api-and-usage/utility-methods]]`
-   **이전:** `[[04-api-and-usage/getWorldBounds]]`
-   **관련:** `[[04-api-and-usage/updateViewport]]`

## 📝 핵심 정리
주어진 월드 좌표의 사각형 영역(bounds)이 현재 뷰포트에 꼭 맞게 들어오도록 하는 최적의 줌(zoom) 레벨을 계산합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 딱 맞는 줌 레벨 계산
 * ==========================================
 * 
 * 📖 목적: 특정 콘텐츠(예: 검색 결과, 특정 지역)를 화면에 여백을 포함하여 보기 좋게 표시하고 싶을 때 사용됩니다.
 * 🏗️ 구조: 너비 기준의 필요 줌 레벨과 높이 기준의 필요 줌 레벨을 각각 계산한 후, 더 작은 값을 선택합니다.
 * 🎯 학습포인트: 콘텐츠를 화면에 맞추기 위한 뷰포트 제어 방법을 배웁니다.
 */
public calculateZoomToFit(
  bounds: { x: number; y: number; width: number; height: number }, 
  padding = 50
): number {
  const { width: viewportWidth, height: viewportHeight } = this.viewport;
  
  // 너비 비율: (뷰포트 너비 - 양쪽 여백)을 콘텐츠의 월드 너비로 나눕니다.
  // 이 값이 "월드 1단위를 몇 픽셀로 표시할 것인가" 즉, 줌 레벨이 됩니다.
  const scaleX = (viewportWidth - padding * 2) / bounds.width;
  
  // 높이 비율: (뷰포트 높이 - 위아래 여백)을 콘텐츠의 월드 높이로 나눕니다.
  const scaleY = (viewportHeight - padding * 2) / bounds.height;
  
  // 두 비율 중 더 작은 값을 최종 줌 레벨로 선택합니다.
  // 더 작은 값을 선택해야 콘텐츠 전체가 화면 안에 들어오는 것을 보장할 수 있습니다.
  // (만약 더 큰 값을 선택하면, 한쪽 축은 꽉 차지만 다른 쪽 축은 화면 밖으로 잘려나갑니다.)
  return Math.min(scaleX, scaleY);
}
```

## 🔍 상세 분석

### 로직 포인트
-   `padding`: 픽셀 단위의 여백입니다. 콘텐츠가 화면 가장자리에 너무 딱 붙어 답답해 보이지 않도록 안쪽으로 여유 공간을 줍니다.
-   `Math.min(scaleX, scaleY)`: 이 부분이 핵심입니다. 예를 들어, 가로로 긴 콘텐츠(`bounds.width` > `bounds.height`)를 세로로 긴 화면(`viewportWidth` < `viewportHeight`)에 맞추려면, 너비를 기준으로 계산한 `scaleX`가 `scaleY`보다 작을 것입니다. 이 `scaleX`를 줌 레벨로 사용해야 콘텐츠의 양 옆이 잘리지 않고 모두 화면에 들어오게 됩니다.

### 실무 포인트
-   **검색 결과 표시**: 지도 앱에서 특정 장소를 검색했을 때, 그 장소가 화면 중앙에 적절한 줌 레벨로 표시되도록 하는 데 사용됩니다. `bounds`의 `x`, `y`로 `viewport.center`를 설정하고, 이 함수로 계산한 줌 레벨로 `viewport.zoom`을 설정한 뒤 `updateViewport`를 호출하면 됩니다.
-   **전체 보기**: "모든 마커 보기"와 같은 기능을 구현할 때, 모든 마커를 포함하는 가장 큰 사각형(bounds)을 계산하고, 그 사각형을 기준으로 이 함수를 호출하여 전체 콘텐츠를 한눈에 볼 수 있는 뷰포트를 만들 수 있습니다.
