
# 2. Lifecycle Stages as a Flow

## [CPU 영역]

1.  **App State**: 애플리케이션의 현재 상태 (예: 사용자 입력, 애니메이션 시간)
2.  **Geometry/Uniform Setup**: 렌더링할 객체의 정점 데이터([[02-canvas-to-gpu-entry/3. GPU 리소스 준비|VBO, EBO, VAO]])와 셰이더에 전달할 전역 변수([[02-canvas-to-gpu-entry/3. GPU 리소스 준비|Uniforms]])를 준비합니다.
3.  **Draw Call**: `gl.drawArrays()` 또는 `gl.drawElements()`를 호출하여 GPU에 렌더링 명령을 전달합니다. 이 호출이 CPU에서 GPU로 넘어가는 경계선입니다.

↓

## [GPU 영역]

1.  **[[03-vertex-stage-lifecycle/4. Vertex Shader의 생명주기|Vertex Shader]]**: 각 정점(Vertex)의 위치를 [[03-vertex-stage-lifecycle/2. Clip Space NDC 변환|Clip Space]] 좌표로 변환합니다.
2.  **[[03-vertex-stage-lifecycle/2. Clip Space NDC 변환|Clipping]]**: 화면 바깥의 보이지 않는 도형 일부를 잘라냅니다.
3.  **[[04-rasterization-lifecycle/1. Triangle Coverage Calculation|Rasterization]]**: 변환된 도형을 화면의 픽셀 격자에 맞춰 분해하여 어떤 픽셀을 칠할지 결정합니다.

↓

4.  **[[05-fragment-stage-lifecycle/1. Fragment Shader 호출 시점|Fragment Shader]]**: 래스터화된 각 픽셀 조각(Fragment)의 최종 색상을 계산합니다.
5.  **[[06-blending-lifecycle/1. Blend Equation & Factors|Blending]]**: 계산된 프래그먼트의 색상을 이미 [[08-framebuffer-to-display-lifecycle/1. Framebuffer 구조|Framebuffer]]에 있는 색상과 혼합합니다.
6.  **Framebuffer**: 최종 픽셀 색상이 저장되는 GPU 메모리상의 버퍼입니다.
7.  **Display**: 프레임버퍼의 내용이 화면에 표시됩니다.
