# CoordinateTransform 클래스

## 🔗 연결
-   **상위:** [.[03-transform-engine/03-transform-engine]]
-   **다음:** [.[03-transform-engine/constructor-and-initialization]]
-   **관련:** [.[02-data-structures/viewport-interface]], [.[04-api-and-usage/coordinate-transform-api]]

## 📝 핵심 정리
월드 좌표계와 스크린 좌표계 간의 변환을 책임지는 핵심 클래스입니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: 좌표 변환 클래스
 * ==========================================
 * 
 * 📖 목적: 좌표 변환에 필요한 모든 상태(뷰포트, 캔버스, 행렬)와 메서드를 하나로 캡슐화하여 관리합니다.
 * 🏗️ 구조: 뷰포트와 캔버스 정보를 입력받아, 변환 행렬을 내부적으로 계산하고, 이를 사용해 좌표 변환 API를 외부에 제공합니다.
 * 🎯 학습포인트: 객체 지향 프로그래밍(OOP)의 캡슐화 개념을 이해합니다.
 */
export class CoordinateTransform {
  // private: 클래스 내부에서만 접근 가능한 속성들
  private viewport: Viewport; // 현재 뷰포트 상태
  private canvas: HTMLCanvasElement; // 대상 HTML 캔버스 요소
  private viewMatrix: Float32Array; // 월드 -> 스크린 변환 행렬
  private inverseViewMatrix: Float32Array; // 스크린 -> 월드 변환 행렬
  private matrixNeedsUpdate = true; // 행렬을 새로 계산해야 하는지 여부 플래그
  
  private devicePixelRatio: number; // 고해상도 디스플레이 지원용
  private canvasBounds: DOMRect | null = null; // 캔버스의 화면상 위치/크기 캐싱
  private debug = false; // 디버그 모드 플래그
  
  // 생성자: 클래스의 인스턴스가 생성될 때 호출됩니다.
  constructor(canvas: HTMLCanvasElement, viewport: Viewport, debug = false) {
    // ... 초기화 로직 ...
  }
  
  // 공개 메서드 (API)
  public screenToWorld(screenPoint: Point): Point {
    // ... 변환 로직 ...
  }
  
  public worldToScreen(worldPoint: Point): Point {
    // ... 변환 로직 ...
  }
  
  // 비공개 헬퍼 메서드
  private updateMatrices(): void {
    // ... 행렬 계산 로직 ...
  }
}
```

## 🔍 상세 분석

### 문법 포인트
-   `class`: 객체를 생성하기 위한 설계도입니다.
-   `private`: `private`으로 선언된 속성이나 메서드는 클래스 외부에서 직접 접근할 수 없습니다. 이를 통해 내부 구현을 숨기고 외부에는 필요한 API만 노출할 수 있습니다(캡슐화).
-   `public`: (생략 가능) 외부에서 접근 가능한 메서드를 의미합니다. `screenToWorld` 등이 여기에 해당합니다.

### 로직 포인트
-   **상태 관리**: `viewport`, `canvasBounds`, `devicePixelRatio` 등 변화하는 값들을 클래스 속성으로 관리합니다.
-   **지연 계산(Lazy Evaluation)**: `matrixNeedsUpdate` 플래그를 사용하여, 뷰포트가 변경되었을 때만 행렬을 새로 계산합니다. 매 프레임마다 불필요한 계산을 피하여 성능을 최적화하는 기법입니다.

## ⚡ 다음 학습
-   [.[03-transform-engine/constructor-and-initialization]]에서 클래스가 처음 어떻게 설정되는지 알아보세요.