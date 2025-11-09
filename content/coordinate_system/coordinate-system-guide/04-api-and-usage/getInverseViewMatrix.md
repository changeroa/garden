# getInverseViewMatrix

## 🔗 연결
-   **상위:** `[[03-transform-engine/coordinate-transform-class]]`
-   **이전:** `[[04-api-and-usage/getViewMatrix]]`
-   **관련:** `[[03-transform-engine/inverse-matrix-calculation]]`

## 📝 핵심 정리
스크린 좌표를 월드 좌표로 변환하는 데 사용되는 역행렬(inverse view matrix)을 반환합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 역 뷰 매트릭스(Inverse View Matrix) 가져오기
 * ==========================================
 * 
 * 📖 목적: `screenToWorld`와 같이 스크린 기준의 계산을 월드 기준으로 변환해야 하는 외부 시스템에 역행렬을 제공합니다.
 * 🏗️ 구조: `getViewMatrix`와 마찬가지로, 반환 전에 필요하다면 행렬 업데이트를 먼저 수행하여 데이터의 일관성을 보장합니다.
 * 🎯 학습포인트: 원본 행렬과 역행렬이 쌍으로 관리되고 사용되는 방식을 이해합니다.
 */
public getInverseViewMatrix(): Float32Array {
  // `getViewMatrix`와 동일하게, 최신 상태의 행렬을 보장하기 위해 업데이트 함수를 먼저 호출합니다.
  this.updateMatrices();
  
  // 최신 상태의 inverseViewMatrix를 반환합니다.
  return this.inverseViewMatrix;
}
```

## 🔍 상세 분석

### 로직 포인트
-   이 함수 역시 `updateMatrices()`를 먼저 호출함으로써, `viewMatrix`가 업데이트될 때 `inverseViewMatrix`도 함께 업데이트되는 것을 보장받아 항상 최신 상태의 역행렬을 반환할 수 있습니다.

### 실무 포인트
-   마우스 피킹(mouse picking)을 GPU에서 셰이더를 이용해 직접 구현하는 고급 기법을 사용할 때, 스크린 좌표를 월드 좌표로 변환하기 위해 이 역행렬을 셰이더로 전달해야 할 수 있습니다.
-   디버깅 목적으로 화면의 특정 픽셀이 월드의 어느 좌표에 해당하는지 역으로 추적하고 싶을 때 이 행렬을 사용할 수 있습니다.
