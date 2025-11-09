
# Lifecycle Mastery Check

> **“한 픽셀이 태어나 화면에 사라질 때까지의 여정”을 다음 단계로 설명할 수 있어야 함.**

이 과정을 순서대로, 각 단계의 입력과 출력이 무엇인지 떠올릴 수 있다면 WebGL 렌더링 라이프사이클의 전체 그림을 이해한 것입니다.

---

### 픽셀의 여정 (The Journey of a Pixel)

1.  **[[🟦 02 - Canvas → GPU 진입 단계/1. Canvas & Viewport 초기화 흐름|1️⃣ CPU가 Canvas 크기와 DPR을 세팅한다]]**
    -   CPU가 캔버스의 CSS 크기와 디스플레이의 DPR을 확인하여, 선명한 렌더링을 위한 실제 버퍼 크기(`canvas.width/height`)를 결정하고 `gl.viewport`를 설정합니다.

2.  **[[🟨 03 - Vertex Stage Lifecycle/1. Local → World → View 변환|2️⃣ GPU가 Vertex 변환으로 월드 좌표를 NDC에 정렬한다]]**
    -   Vertex Shader가 모델의 로컬 좌표를 모델, 뷰, 투영 행렬을 통해 변환하여 최종적으로 `-1`에서 `+1` 범위의 정규화된 장치 좌표(NDC)로 변환합니다.

3.  **[[🟥 04 - Rasterization Lifecycle/1. Triangle Coverage Calculation|3️⃣ Rasterizer가 픽셀 커버리지를 계산한다]]**
    -   GPU 하드웨어가 NDC로 변환된 삼각형이 어떤 픽셀들을 덮는지 계산하여, 픽셀 셰이더를 실행할 대상인 "프래그먼트"들을 생성합니다.

4.  **[[🟩 05 - Fragment Stage Lifecycle/1. Fragment Shader 호출 시점|4️⃣ Fragment Shader가 색·투명도·감마를 결정한다]]**
    -   생성된 모든 프래그먼트에 대해 Fragment Shader가 실행됩니다. 보간된 값, 텍스처, 유니폼 변수 등을 사용하여 최종 색상(RGBA)과 투명도를 계산합니다. 이 계산은 [[🟫 07 - Color & Gamma Lifecycle/1. 선형 vs sRGB|선형 공간]]에서 수행되어야 합니다.

5.  **[[🟧 06 - Blending Lifecycle/1. Blend Equation & Factors|5️⃣ Blending이 이전 색과 혼합한다]]**
    -   계산된 프래그먼트의 색상(Source)이 프레임버퍼에 이미 있는 색상(Destination)과 `gl.blendFunc`에 정의된 규칙에 따라 혼합됩니다.

6.  **[[⚫ 08 - Framebuffer → Display Lifecycle/1. Framebuffer 구조|6️⃣ Framebuffer가 완성된다]]**
    -   블렌딩된 최종 색상 값이 프레임버퍼의 컬러 버퍼에 기록됩니다. 만약 sRGB 프레임버퍼가 활성화되었다면, 이 때 [[🟫 07 - Color & Gamma Lifecycle/2. 감마 보정 타이밍|선형에서 sRGB로의 감마 보정]]이 자동으로 일어납니다.

7.  **[[⚫ 08 - Framebuffer → Display Lifecycle/3. DPR 반영과 브라우저 OS 색관리|7️⃣ 브라우저가 sRGB 보정 후 화면에 출력한다]]**
    -   렌더링이 완료된 프레임버퍼(Back Buffer)가 화면에 표시될 차례가 되면, 브라우저 컴포지터가 이 버퍼를 페이지의 다른 요소들과 함께 최종적으로 합성하여 화면에 표시합니다.

8.  **[[⚫ 08 - Framebuffer → Display Lifecycle/2. VSync Frame pacing|8️⃣ 다음 프레임이 VSync 타이밍에 맞춰 갱신된다]]**
    -   `requestAnimationFrame` 콜백이 다시 호출되고, 모니터의 수직 동기화(VSync) 신호에 맞춰 1번 과정부터 다시 시작하여 다음 프레임을 렌더링합니다.
