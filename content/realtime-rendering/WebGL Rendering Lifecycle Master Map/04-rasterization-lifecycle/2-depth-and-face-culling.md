
# 2. Depth & Face Culling

래스터화 단계에서는 불필요한 픽셀 그리기를 방지하여 성능을 최적화하는 두 가지 중요한 기술이 적용됩니다: Depth Test와 Face Culling입니다.

---

### 1. Z-Buffer와 Depth Test

-   **Z-Buffer (Depth Buffer)**: [[08-framebuffer-to-display-lifecycle/1. Framebuffer 구조|Framebuffer]]의 각 픽셀에 대한 깊이(Z 값) 정보를 저장하는 2D 버퍼입니다. 화면에 가까울수록 작은 값, 멀수록 큰 값을 가집니다 (일반적으로 0.0 ~ 1.0 사이).

-   **Depth Test (깊이 테스트)**:
    1.  [[04-rasterization-lifecycle/1. Triangle Coverage Calculation|래스터화]]를 통해 생성된 프래그먼트는 자신의 깊이 값(Z)을 가집니다.
    2.  이 프래그먼트가 그려질 픽셀 위치에 해당하는 Z-Buffer의 현재 값을 읽어옵니다.
    3.  **프래그먼트의 Z 값 < Z-Buffer의 값** 이면, 이 프래그먼트가 기존에 그려진 것보다 앞에 있는 것으로 간주합니다.
        -   **Test Pass**: 해당 픽셀의 색상을 프래그먼트의 색상으로 갱신하고, Z-Buffer의 값도 이 프래그먼트의 Z 값으로 업데이트합니다.
        -   **Test Fail**: 프래그먼트가 기존 픽셀보다 뒤에 있으므로, 이 프래그먼트를 버리고 아무 작업도 하지 않습니다. (Overdraw 방지)

-   **순서**: 깊이 테스트는 일반적으로 [[05-fragment-stage-lifecycle/1. Fragment Shader 호출 시점|Fragment Shader]]가 실행되기 **전(Early-Z)**에 수행되어, 가려지는 픽셀에 대한 비싼 셰이더 연산을 미리 방지합니다.
-   `gl.enable(gl.DEPTH_TEST)`로 활성화하고, `gl.depthFunc(gl.LEQUAL)` 등으로 테스트 조건을 설정할 수 있습니다.

### 2. Back-face Culling (후면 제거)

-   **원리**: 3D 모델은 보통 닫힌 표면으로 이루어져 있어, 카메라를 등지고 있는 면(back-face)은 어차피 보이지 않습니다. 이 보이지 않는 삼각형들을 래스터화 단계 이전에 미리 제거하여 성능을 향상시키는 기법입니다.

-   **판단 기준**: 삼각형을 구성하는 정점들의 순서(Winding Order)를 사용합니다.
    -   WebGL에서는 기본적으로 **반시계 방향(Counter-Clockwise, CCW)**으로 정의된 정점 순서를 앞면(front-face)으로 간주합니다.
    -   Vertex Shader를 거쳐 변환된 삼각형의 정점들이 화면 공간에서 시계 방향(Clockwise, CW)으로 보이면, 이는 우리를 등지고 있는 뒷면으로 판단하여 버립니다.

-   `gl.enable(gl.CULL_FACE)`로 활성화하고, `gl.cullFace(gl.BACK)`을 호출하여 뒷면을 제거하도록 설정합니다. (기본값)

-   **주의**: 반투명 객체나 양면이 모두 보여야 하는 얇은 평면 같은 경우에는 Back-face Culling을 비활성화해야 합니다.
