# getWorldBounds

## 🔗 연결
-   **상위:** [[04-api-and-usage/utility-methods]]
-   **이전:** `[[04-api-and-usage/isPointVisible]]`
-   **다음:** `[[04-api-and-usage/calculateZoomToFit]]`
-   **관련:** `[[02-data-structures/viewport-interface]]`

## 📝 핵심 정리
현재 화면(뷰포트)에 보이는 월드 좌표계의 사각형 영역(경계) 정보를 반환합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 월드 경계 정보 가져오기
 * ==========================================
 * 
 * 📖 목적: 현재 화면이 월드 지도의 어느 부분을 보여주고 있는지, 그 범위를 알고 싶을 때 사용합니다.
 * 🏗️ 구조: 뷰포트의 중심, 크기, 줌 레벨을 이용해 월드 좌표계에서의 사각형(x, y, width, height)을 계산합니다.
 * 🎯 학습포인트: 뷰포트 정보로부터 월드 공간의 가시 영역을 계산하는 방법을 배웁니다.
 */
public getWorldBounds(): { x: number; y: number; width: number; height: number } {
  const { center, zoom, width, height } = this.viewport;
  
  // 뷰포트의 픽셀 너비를 줌 레벨로 나누어, 월드 단위에서의 너비를 계산합니다.
  const worldWidth = width / zoom;
  // 뷰포트의 픽셀 높이를 줌 레벨로 나누어, 월드 단위에서의 높이를 계산합니다.
  const worldHeight = height / zoom;
  
  // 월드 경계 사각형을 반환합니다.
  return {
    // 중심점에서 너비의 절반을 빼서 왼쪽 상단의 x좌표를 구합니다.
    x: center.x - worldWidth / 2,
    // 중심점에서 높이의 절반을 빼서 왼쪽 상단의 y좌표를 구합니다.
    y: center.y - worldHeight / 2,
    width: worldWidth,
    height: worldHeight
  };
}
```

## 🔍 상세 분석

### 로직 포인트
-   이 함수는 `isPointVisible`의 계산 과정을 일반화하여, 현재 보이는 월드 영역 전체를 객체로 반환하는 것입니다.
-   `center.x - worldWidth / 2`: 월드 좌표계에서 사각형의 위치는 보통 왼쪽 상단 점으로 표현됩니다. 따라서 중심점(`center.x`)에서 폭의 절반(`worldWidth / 2`)만큼 왼쪽으로 이동하여 `x` 좌표를 계산합니다.

### 실무 포인트
-   **데이터 요청 최적화**: 무한 스크롤 지도나 캔버스에서, 이 함수로 현재 보이는 월드 영역을 계산한 뒤, 이 영역에 포함되는 데이터만 서버에 요청할 수 있습니다. (예: "위도/경도 XX부터 YY까지의 지도 타일 이미지를 주세요.")
-   **미니맵 구현**: 전체 지도 중 현재 화면이 어디를 비추고 있는지 미니맵에 사각형으로 표시해주는 기능을 구현할 때, 이 함수로 그 사각형의 좌표와 크기를 얻을 수 있습니다.
