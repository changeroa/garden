# 행렬 업데이트 로직

## 🔗 연결
-   **상위:** [.[03-transform-engine/03-transform-engine]]
-   **이전:** [.[03-transform-engine/constructor-and-initialization]]
-   **다음:** [.[03-transform-engine/inverse-matrix-calculation]]
-   **관련:** [.[02-data-structures/viewport-interface]], [.[01-core-concepts/matrix-transformation-basics]]

## 📝 핵심 정리
`viewport`의 상태(중심점, 줌 레벨, 크기)가 변경되었을 때, 이를 반영하여 `viewMatrix`를 새로 계산하는 핵심 로직입니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 변환 행렬 업데이트
 * ==========================================
 * 
 * 📖 목적: 현재 뷰포트 상태를 기반으로 월드 좌표를 스크린(-1 ~ +1 클립 공간) 좌표로 변환하는 행렬을 계산합니다.
 * 🏗️ 구조: 크기(Scale)와 이동(Translate) 변환을 결합하여 최종 변환 행렬을 만듭니다.
 * 🔄 흐름: 뷰포트 변경 -> matrixNeedsUpdate = true -> updateMatrices() 호출 -> 새 viewMatrix 계산
 * 🎯 학습포인트: 좌표 변환의 핵심 수학 공식을 코드 레벨에서 이해합니다.
 */
private updateMatrices(): void {
  // matrixNeedsUpdate 플래그가 false이면, 변경점이 없으므로 계산을 건너뜁니다.
  if (!this.matrixNeedsUpdate) return;

  const { zoom, center, width, height } = this.viewport;
  
  // 1. 크기 변환 (Scale) 계산
  // 월드 단위를 클립 공간 단위로 변환하기 위한 스케일 팩터를 계산합니다.
  // 화면 너비/높이에 2.0을 곱하고 나누는 것은 클립 공간의 범위가 -1.0에서 +1.0 (총 2.0)이기 때문입니다.
  const scaleX = (2.0 * zoom) / width;
  const scaleY = -(2.0 * zoom) / height; // y축은 위쪽이 양수이므로 부호를 반전합니다.

  // 2. 이동 변환 (Translate) 계산
  // 월드의 중심점(center)이 화면의 중심(width/2, height/2)에 오도록 이동시키는 값을 계산합니다.
  const translateX = (-center.x * scaleX) + (width / 2 * scaleX) - 1.0; // 클립 공간 보정(-1.0)
  const translateY = (-center.y * scaleY) + (height / 2 * scaleY) + 1.0; // 클립 공간 보정(+1.0)

  // 3. viewMatrix에 값 할당 (실제로는 WebGL에 맞춰 더 복잡한 계산이 들어감)
  // 아래는 단순화된 버전의 개념 설명입니다. 실제 코드는 더 복잡합니다.
  // this.viewMatrix[0] = scaleX;
  // this.viewMatrix[4] = scaleY;
  // this.viewMatrix[6] = translateX;
  // this.viewMatrix[7] = translateY;
  // ... (실제 코드는 devicePixelRatio 등을 고려하여 더 복잡함)

  // 실제 코드의 계산 로직
  const finalScaleX = (2.0 * zoom) / width;
  const finalScaleY = -(2.0 * zoom) / height;
  this.viewMatrix[0] = finalScaleX;
  this.viewMatrix[4] = finalScaleY;
  this.viewMatrix[6] = -center.x * finalScaleX - 1.0;
  this.viewMatrix[7] = -center.y * finalScaleY + 1.0;

  // 역행렬도 새로 계산합니다.
  this.calculateInverseMatrix();
  // 행렬 업데이트가 완료되었으므로 플래그를 false로 설정합니다.
  this.matrixNeedsUpdate = false;
}
```

## 🔍 상세 분석

### 로직 포인트
-   **Y축 반전**: `scaleY`가 음수인 이유는 월드 좌표계에서는 보통 Y가 위로 갈수록 증가하지만, 스크린/클립 좌표계에서는 아래로 갈수록 증가하기 때문입니다. 이 부호 반전으로 두 시스템을 일치시킵니다.
-   **클립 공간**: WebGL과 같은 그래픽 API는 최종적으로 모든 좌표를 -1.0에서 +1.0 사이의 정규화된 공간(클립 공간)으로 변환해야 화면에 렌더링할 수 있습니다. 이 메서드의 계산은 월드 좌표를 바로 이 클립 공간 좌표로 매핑하는 과정입니다.
-   **성능 최적화**: `matrixNeedsUpdate` 플래그는 이 복잡한 계산이 꼭 필요할 때만 실행되도록 보장하는 중요한 최적화 장치입니다.

## ⚡ 다음 학습
-   [.[03-transform-engine/inverse-matrix-calculation]]을 통해 반대 방향 변환은 어떻게 이루어지는지 알아보세요.