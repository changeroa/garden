# worldDeltaToScreen

## 🔗 연결
-   **상위:** `[[04-API-및-활용/델타 변환 API]]`
-   **이전:** `[[04-API-및-활용/screenDeltaToWorld]]`
-   **관련:** `[[03-변환-엔진/행렬 업데이트 로직]]`

## 📝 핵심 정리
월드 공간의 단위 이동량을 화면에서의 픽셀 이동량으로 변환합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 월드 델타 -> 스크린 델타 변환
 * ==========================================
 * 
 * 📖 목적: 월드 공간에서 특정 거리만큼 이동하는 것이 화면에서는 몇 픽셀에 해당하는지 계산합니다.
 * 🏗️ 구조: 원본 변환 행렬(viewMatrix)의 크기(scale) 성분만을 사용하여 변환합니다.
 * 🎯 학습포인트: screenDeltaToWorld와 정반대의 계산 과정을 이해합니다.
 */
public worldDeltaToScreen(deltaX: number, deltaY: number): Point {
  // 최신 행렬 정보를 사용하기 위해 업데이트합니다.
  this.updateMatrices();
  
  // viewMatrix에서 x축 스케일 값을 가져옵니다.
  const scale = this.viewMatrix[0];
  
  // 월드 델타에 스케일을 곱하여 스크린 델타를 계산합니다.
  // devicePixelRatio를 나눠주는 이유는, 이 함수가 CSS 픽셀 기준의 델타를 반환해야 하기 때문일 수 있습니다.
  // 렌더링은 dpr을 고려하지만, CSS 이벤트는 dpr을 고려하지 않기 때문입니다.
  return { 
    x: deltaX * scale / this.devicePixelRatio, 
    y: deltaY * scale / this.devicePixelRatio 
  };
}
```

## 🔍 상세 분석

### 로직 포인트
-   이 함수 역시 이동(Translate) 성분은 무시하고 `viewMatrix`의 스케일(`m[0]`) 값만 사용합니다.
-   `devicePixelRatio`로 나누는 이유: `viewMatrix`는 `dpr`을 고려하여 계산되었습니다. 즉, `viewMatrix`를 통해 나온 결과는 물리적 픽셀 단위의 거리입니다. 하지만 일반적으로 웹에서 다루는 거리(예: CSS)는 논리적 픽셀이므로, `dpr`로 다시 나누어주어 단위를 맞추는 과정입니다.

### 실무 포인트
-   월드 공간에서 10 유닛 크기의 그리드(grid)를 그린다고 가정해봅시다. 이 그리드 선의 간격이 화면에서는 몇 픽셀인지를 이 함수로 계산하여 `canvas`에 그릴 수 있습니다.
-   물리 엔진 시뮬레이션에서 객체가 월드 단위로 특정 속도로 움직일 때, 화면상에서는 몇 픽셀씩 움직이는지를 계산하여 애니메이션을 구현하는 데 사용할 수 있습니다.
