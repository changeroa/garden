
# 1. Canvas & Viewport 초기화 흐름

> **핵심: CPU에서 GPU로 데이터가 들어가기 전까지의 공간 정렬과 상태 준비.**

프레임이 시작될 때, WebGL은 렌더링할 영역을 설정하고 초기화하는 과정을 거칩니다. 이 단계에서의 설정 오류는 [[09-rendering-lifecycle-debugging/Rendering Lifecycle 디버깅 체계|화면 전체가 흐릿해지는 문제]]의 직접적인 원인이 됩니다.

---

### 1. Canvas 생성 및 크기 설정

-   **HTML `<canvas>` 요소**: WebGL 렌더링이 표시될 DOM 요소입니다.
-   **CSS 크기 vs DrawingBuffer 크기**: 이 둘의 관계가 매우 중요합니다.
    -   **CSS 크기**: `canvas.style.width`와 `canvas.style.height`로 결정되는, 화면에 표시되는 캔버스의 시각적 크기입니다.
    -   **DrawingBuffer 크기**: `canvas.width`와 `canvas.height`로 결정되는, 실제 렌더링이 일어나는 픽셀 버퍼의 해상도입니다. 이 버퍼가 [[08-framebuffer-to-display-lifecycle/1. Framebuffer 구조|Framebuffer]]의 기반이 됩니다.

### 2. DPR (Device Pixel Ratio) 반영

-   고해상도 디스플레이(레티나 등)에서는 하나의 CSS 픽셀을 여러 개의 물리적 픽셀로 표시합니다. 이 비율이 DPR입니다. (예: DPR 2.0)
-   선명한 렌더링을 위해서는 DrawingBuffer 크기를 DPR에 맞춰 설정해야 합니다.
    ```javascript
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ```
-   **만약 DPR을 반영하지 않으면?** 낮은 해상도의 이미지가 CSS 크기로 확대되어 보이므로, [[09-rendering-lifecycle-debugging/Rendering Lifecycle 디버깅 체계|화면 전체가 흐릿하게(blurry) 보입니다]].

### 3. `gl.viewport` 설정

-   `gl.viewport(x, y, width, height)`는 최종 [[03-vertex-stage-lifecycle/2. Clip Space NDC 변환|NDC(Normalized Device Coordinates)]] 좌표 `(-1, +1)`를 DrawingBuffer의 어떤 픽셀 영역으로 매핑할지 결정합니다.
-   일반적으로 DrawingBuffer 전체 영역에 매핑하도록 설정합니다.
    ```javascript
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    ```
-   `gl.viewport` 설정이 잘못되면 렌더링 결과가 캔버스의 일부에만 그려지거나 왜곡될 수 있습니다.

### 4. 프레임 시작 시 버퍼 초기화

-   `gl.clearColor(r, g, b, a)`: `gl.clear()` 호출 시 색상 버퍼를 채울 색상을 지정합니다.
-   `gl.clearDepth(depth)`: `gl.clear()` 호출 시 깊이 버퍼를 채울 값을 지정합니다. (보통 1.0)
-   `gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)`: 지정된 값으로 버퍼들을 초기화하여 이전 프레임의 내용을 지웁니다. 이 과정이 없으면 이전 프레임의 이미지가 잔상처럼 남게 됩니다.
