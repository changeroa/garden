
# 2. 좌표계 정렬

WebGL 렌더링은 여러 단계의 좌표계 변환을 거쳐 3D 공간의 점을 2D 화면의 픽셀로 옮기는 과정입니다. 각 좌표계의 계층 관계를 이해하는 것이 중요합니다.

---

### 1. 좌표계 변환의 계층

1.  **Local Space (모델 좌표계)**
    -   개별 모델(Object)을 기준으로 하는 좌표계입니다. 모델링 소프트웨어에서 작업할 때의 원점(0,0,0)이 기준이 됩니다.

2.  **World Space (월드 좌표계)**
    -   씬(Scene) 안의 모든 객체들을 배치하기 위한 공통의 전역 좌표계입니다.
    -   `Local -> World` 변환은 [[03-vertex-stage-lifecycle/1. Local → World → View 변환|모델 행렬(Model Matrix)]]을 통해 이루어집니다.

3.  **View Space (뷰 / 카메라 좌표계)**
    -   카메라의 시점을 기준으로 하는 좌표계입니다. 카메라가 원점(0,0,0)이 되고, 카메라가 바라보는 방향이 보통 -Z 축이 됩니다.
    -   `World -> View` 변환은 [[03-vertex-stage-lifecycle/1. Local → World → View 변환|뷰 행렬(View Matrix)]]을 통해 이루어집니다.

4.  **Clip Space**
    -   카메라의 절두체(Frustum)에 보이는 영역을 -1에서 +1 사이의 값으로 정규화하기 전의 동차 좌표계입니다. 이 공간에서 [[03-vertex-stage-lifecycle/2. Clip Space NDC 변환|Clipping]]이 수행됩니다.
    -   `View -> Clip` 변환은 [[03-vertex-stage-lifecycle/1. Local → World → View 변환|투영 행렬(Projection Matrix)]]을 통해 이루어집니다.

5.  **NDC (Normalized Device Coordinates)**
    -   Clip Space의 좌표를 w 값으로 나누어 정규화한 좌표계입니다. X, Y, Z 모두 `-1`에서 `+1` 사이의 값을 가집니다.
    -   이 좌표계는 최종 화면 비율과 무관한 정육면체 공간입니다.

6.  **Screen Space (Window / Pixel Coordinates)**
    -   NDC 좌표를 `gl.viewport` 설정에 따라 실제 화면의 픽셀 좌표로 변환한 것입니다.
    -   이 변환을 [[03-vertex-stage-lifecycle/3. Viewport Transform|Viewport Transform]]이라고 합니다.

### 2. Pixel Snapping

-   **정의**: 정점의 좌표가 픽셀 격자의 경계에 걸쳐 있을 때, 이를 가장 가까운 픽셀의 중심으로 정렬하여 [[09-rendering-lifecycle-debugging/Rendering Lifecycle 디버깅 체계|경계선이 깜빡이거나 흐려지는 현상]]을 방지하는 기법입니다.
-   **원리**: 최종 픽셀 좌표를 계산할 때, 소수점 이하 값을 버리거나 반올림하는 간단한 수학적 조작을 통해 이루어집니다.
    -   예: `final_x = floor(x + 0.5)`
-   **Sub-pixel Misalignment**: 픽셀 스냅핑이 제대로 이루어지지 않으면, 매 프레임마다 정점의 위치가 미세하게 다른 픽셀에 걸쳐 렌더링되면서 떨림(Jitter)이나 흐림(Blur) 현상이 발생합니다. 이는 특히 정적인 UI나 2D 그래픽에서 두드러집니다.
