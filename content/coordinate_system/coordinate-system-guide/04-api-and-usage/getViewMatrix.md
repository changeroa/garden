# getViewMatrix

## 🔗 연결
-   **상위:** `[[03-transform-engine/coordinate-transform-class]]`
-   **다음:** `[[04-api-and-usage/getInverseViewMatrix]]`
-   **관련:** `[[03-transform-engine/matrix-update-logic]]`

## 📝 핵심 정리
현재 뷰포트 상태를 반영하는 최종 변환 행렬(view matrix)을 반환합니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 뷰 매트릭스(View Matrix) 가져오기
 * ==========================================
 * 
 * 📖 목적: WebGL 셰이더 등 외부 렌더링 시스템에 현재의 변환 행렬을 전달하기 위해 사용됩니다.
 * 🏗️ 구조: 행렬을 반환하기 전에, 만약 뷰포트 변경 후 행렬이 업데이트되지 않았다면 최신 상태로 업데이트를 먼저 수행합니다.
 * 🎯 학습포인트: 외부 시스템에 상태를 제공하기 전에 내부 상태가 최신인지 확인하고 동기화하는 패턴을 배웁니다.
 */
public getViewMatrix(): Float32Array {
  // 만약 뷰포트가 변경되어 행렬을 새로 계산해야 한다면, `updateMatrices`를 호출합니다.
  // 이를 통해 항상 최신 상태의 행렬을 반환하는 것을 보장합니다.
  this.updateMatrices();
  
  // 최신 상태의 viewMatrix를 반환합니다.
  return this.viewMatrix;
}
```

## 🔍 상세 분석

### 로직 포인트
-   **일관성 보장**: 이 함수는 단순히 `this.viewMatrix`를 반환하는 것을 넘어, `this.updateMatrices()`를 먼저 호출하는 것이 핵심입니다. `updateMatrices` 내부의 `matrixNeedsUpdate` 플래그 검사 덕분에, 실제 계산은 필요할 때만 수행되면서도 이 함수를 호출하는 측은 항상 최신 행렬을 받을 수 있다는 신뢰를 가질 수 있습니다.
-   **캡슐화**: 외부에서는 `matrixNeedsUpdate` 플래그나 `updateMatrices` 함수의 존재를 알 필요 없이, `getViewMatrix`만 호출하면 알아서 최신 행렬이 반환됩니다. 이는 내부의 복잡한 상태 관리를 숨기는 캡슐화의 좋은 예입니다.

### 실무 포인트
-   WebGL로 직접 렌더링을 할 경우, 버텍스 셰이더(vertex shader)의 유니폼(uniform) 변수(예: `u_viewMatrix`)에 이 행렬 값을 매 프레임 전달해야 합니다. 이 함수는 바로 그 값을 제공하는 역할을 합니다.
-   `Float32Array` 타입을 직접 반환하는 이유는 WebGL과 같은 그래픽 API가 이 타입을 네이티브하게 사용하여, 추가적인 변환 없이 바로 데이터를 전달할 수 있어 성능에 유리하기 때문입니다.
