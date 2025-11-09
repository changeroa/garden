
# 4. Vertex Shader의 생명주기

Vertex Shader는 렌더링 파이프라인에서 프로그래밍 가능한 첫 번째 스테이지로, 입력되는 모든 정점에 대해 한 번씩 실행되는 작은 프로그램입니다.

---

### 1. 호출 시점

-   `gl.drawArrays()` 또는 `gl.drawElements()`가 호출될 때, GPU는 지정된 정점 데이터(VBO)에 있는 **모든 정점(vertex)에 대해** Vertex Shader를 한 번씩 실행합니다.
-   만약 100개의 정점으로 이루어진 모델이라면, Vertex Shader는 100번 호출됩니다. 이 호출들은 GPU에 의해 병렬로 처리될 수 있습니다.

### 2. 입력 (Inputs)

Vertex Shader는 다음과 같은 데이터를 입력으로 받습니다.

-   **Attributes**: 정점별로 다른 데이터를 전달합니다. `in` 키워드로 선언됩니다.
    -   `in vec3 a_position;` (정점 위치)
    -   `in vec2 a_texcoord;` (텍스처 좌표)
    -   `in vec3 a_normal;` (법선 벡터)
    -   이 데이터는 [[02-canvas-to-gpu-entry/3. GPU 리소스 준비|VAO]]에 설정된 VBO로부터 가져옵니다.

-   **Uniforms**: 렌더링되는 모든 정점에 대해 동일한 값을 갖는 전역 변수입니다.
    -   `uniform mat4 u_modelMatrix;`
    -   `uniform mat4 u_viewMatrix;`
    -   `uniform mat4 u_projectionMatrix;`
    -   `uniform float u_time;`

### 3. 출력 (Outputs)

Vertex Shader는 다음과 같은 데이터를 출력해야 합니다.

-   **`gl_Position` (필수)**: 해당 정점의 최종 변환된 위치를 [[03-vertex-stage-lifecycle/2. Clip Space NDC 변환|Clip Space]] 좌표로 출력하는 내장 변수입니다. 이 값은 이후 클리핑 및 래스터화 단계에서 사용됩니다.
    -   `gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);`

-   **Varyings (선택)**: Vertex Shader에서 계산된 값을 Fragment Shader로 전달하기 위한 변수입니다. `out` 키워드로 선언됩니다.
    -   `out vec2 v_texcoord;`
    -   `out vec3 v_normal;`

### 4. Varying과 Attribute Interpolation

-   Vertex Shader에서 출력된 `varying` 변수들은 그대로 Fragment Shader로 전달되지 않습니다.
-   **Attribute Interpolation (속성 보간)**: [[04-rasterization-lifecycle/1. Triangle Coverage Calculation|Rasterizer]]는 삼각형 내부의 각 픽셀에 대해, 그 픽셀이 삼각형의 각 정점으로부터 얼마나 떨어져 있는지를 계산합니다. 그리고 이 거리에 따라 각 정점의 `varying` 값들을 **선형 보간(linearly interpolated)**합니다.
-   예를 들어, 한 정점의 `v_color`가 빨간색이고 다른 정점의 `v_color`가 파란색이라면, 두 정점 사이의 픽셀들은 보라색 계열의 그라데이션 색상을 갖게 됩니다.
-   이 보간된 값이 Fragment Shader의 `in` 변수로 입력됩니다. 이것이 바로 텍스처 매핑과 Gouraud 셰이딩이 작동하는 핵심 원리입니다.
