# DevicePixelRatio 처리

## 🔗 연결
-   **상위:** [.[05-advanced-topics/browser-integration]]
-   **관련:** [.[03-transform-engine/constructor-and-initialization]], [.[03-transform-engine/matrix-update-logic]]

## 📝 핵심 정리
고해상도(HiDPI, 레티나) 디스플레이에서 캔버스가 흐릿하게 보이는 것을 방지하고, 선명한 텍스트와 그래픽을 렌더링하기 위한 처리입니다.

## 💻 코드 예제 (완전 주석)

```typescript
/**
 * ==========================================
 * [기능명]: Device Pixel Ratio 처리
 * ==========================================
 * 
 * 📖 목적: CSS 픽셀 1개에 대응하는 실제 물리적 픽셀의 비율을 가져와, 캔버스의 실제 렌더링 버퍼 크기를 조절합니다.
 * 🏗️ 구조: 생성자에서 `window.devicePixelRatio` 값을 가져와 저장하고, 렌더링 시 이 비율을 사용합니다.
 * 🎯 학습포인트: CSS 픽셀과 물리적 픽셀의 차이를 이해하고, 이를 캔버스에 적용하는 방법을 배웁니다.
 */

// 클래스 속성 선언
private devicePixelRatio: number;

// 생성자 내부
constructor(canvas: HTMLCanvasElement, viewport: Viewport, debug = false) {
  this.canvas = canvas;
  this.viewport = { ...viewport };
  
  // window.devicePixelRatio 값을 가져옵니다. 없으면 기본값 1을 사용합니다.
  // dpr이 2라는 것은 CSS 픽셀 1x1이 실제로는 2x2 물리적 픽셀로 이루어져 있다는 의미입니다.
  this.devicePixelRatio = window.devicePixelRatio || 1;
  
  this.debug = debug;
  // ...
}

// 행렬 업데이트 로직 등에서 이 값을 사용합니다.
private updateMatrices(): void {
  // ...
  // 예시: 스케일 계산 시 dpr을 곱해줘서 더 높은 해상도로 렌더링되도록 함
  const scale = zoom * this.devicePixelRatio;
  // ...
}
```

## 🔍 상세 분석

### 로직 포인트
-   **문제점**: `devicePixelRatio`(dpr)가 2인 화면에서 `width=300, height=150`으로 캔버스를 만들면, 브라우저는 300x150 픽셀 버퍼에 그린 후 이를 600x300 물리적 픽셀 공간으로 늘려서 보여줍니다. 이 과정에서 이미지가 흐릿해집니다.
-   **해결책**: 캔버스 엘리먼트의 `width`, `height` 속성을 CSS 크기의 `dpr` 배로 설정해야 합니다. 예를 들어 CSS에서 `style="width: 300px; height: 150px;"`로 크기를 잡았다면, 캔버스 자체의 속성은 `<canvas width="600" height="300">`으로 설정해야 합니다. 이렇게 하면 600x300 버퍼에 직접 렌더링하므로 선명한 결과를 얻을 수 있습니다.
-   `CoordinateTransform` 클래스에서는 `dpr` 값을 행렬 계산에 직접 포함시켜, 렌더링 해상도 자체를 높이는 방식으로 이 문제를 해결합니다.

### 실무 포인트
-   모바일 기기나 최신 노트북은 대부분 dpr이 2 이상이므로, 이 처리는 현대 웹 그래픽 애플리케이션의 필수 요소입니다.
-   dpr 처리를 할 때는 캔버스의 CSS 크기와 `width/height` 속성 크기를 별도로 관리해야 한다는 점을 항상 유의해야 합니다.