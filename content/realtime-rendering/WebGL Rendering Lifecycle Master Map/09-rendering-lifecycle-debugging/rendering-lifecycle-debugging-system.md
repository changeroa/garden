
# Rendering Lifecycle 디버깅 체계

> **핵심: 각 단계가 실패할 때 어떤 시각적 증상이 나타나는가.**

렌더링 시 발생하는 시각적 문제는 파이프라인의 특정 단계에서 발생한 오류와 직접적으로 연결됩니다. 일반적인 증상과 예상되는 실패 지점, 그리고 원인을 정리하면 체계적인 디버깅이 가능합니다.

---

| 증상 | 실패 지점 (Lifecycle Stage) | 일반적인 원인 |
| :--- | :--- | :--- |
| **화면 전체가 흐릿함** | [[02-canvas-to-gpu-entry/1. Canvas & Viewport 초기화 흐름|Canvas → GPU 진입]] | CSS 크기와 DrawingBuffer 크기 불일치. ([[08-framebuffer-to-display-lifecycle/3. DPR 반영과 브라우저 OS 색관리|DPR]] 미반영) |
| **경계선이 톱니처럼 깨짐 (Aliasing)** | [[04-rasterization-lifecycle/1. Triangle Coverage Calculation|Rasterization]] | 안티에일리어싱(MSAA 등) 미적용. 픽셀 중심 샘플링의 한계. |
| **경계선이 반짝이거나 떨림** | [[05-fragment-stage-lifecycle/2. Precision Model|Fragment Stage]] | 셰이더 정밀도(`mediump`) 부족으로 인한 부동소수점 오차. `if`문 같은 날카로운 경계 처리. |
| **확대/축소 시 경계선 두께가 변함** | [[05-fragment-stage-lifecycle/3. 파생값 계산 (fwidth, dFdx dFdy)|Fragment Stage]] | `smoothstep`에 고정된 값 사용. [[05-fragment-stage-lifecycle/3. 파생값 계산 (fwidth, dFdx dFdy)|fwidth]]를 사용한 동적 폭 조절 미적용. |
| **반투명 객체 주변에 검은 후광(fringe) 발생** | [[06-blending-lifecycle/2. Premultiplied Alpha 흐름|Blending]] / [[07-color-and-gamma-lifecycle/1. 선형 vs sRGB|Color & Gamma]] | [[06-blending-lifecycle/2. Premultiplied Alpha 흐름|Premultiplied Alpha]] 미사용. sRGB 공간에서 블렌딩 수행. |
| **반투명 객체들이 겹칠 때 뿌옇게 됨 (Haze)** | [[06-blending-lifecycle/3. 누적 투명도의 문제|Blending]] | 알파 채널 누적으로 인한 프레임버퍼 알파 값 문제. 브라우저가 배경과 불필요하게 다시 합성. |
| **반투명 객체가 보이거나 사라짐** | [[06-blending-lifecycle/3. 누적 투명도의 문제|Blending]] | Z-Sorting 실패. 렌더링 순서가 뒤바뀜. (가까운 객체를 먼저 그림) |
| **CSS 색상과 WebGL 색상이 다르게 보임** | [[07-color-and-gamma-lifecycle/3. 시각적 일관성|Color & Gamma]] | 감마 보정 워크플로우 누락. 선형 공간의 색상을 그대로 sRGB 모니터에 출력하여 어둡게 보임. |
| **조명/음영이 부자연스럽고 대비가 강함** | [[07-color-and-gamma-lifecycle/1. 선형 vs sRGB|Color & Gamma]] | 조명 계산을 sRGB 공간에서 수행. (선형 공간에서 수행해야 함) |
| **화면이 찢어지는 현상 (Tearing)** | [[08-framebuffer-to-display-lifecycle/2. VSync Frame pacing|Framebuffer → Display]] | VSync 비활성화. (requestAnimationFrame을 사용하면 대부분 해결됨) |
| **애니메이션이 뚝뚝 끊김 (Stutter / Jitter)** | [[08-framebuffer-to-display-lifecycle/2. VSync Frame pacing|Framebuffer → Display]] | 프레임 페이싱 불안정. 렌더링 시간이 VSync 간격(16.67ms)을 초과하거나 변동 폭이 큼. |
| **미세한 오브젝트 떨림 (Jitter)** | [[03-vertex-stage-lifecycle/1. Local → World → View 변환|Vertex Stage]] | 부동소수점 정밀도 오차 누적. (특히 카메라가 원점에서 멀리 떨어졌을 때) |
| **도형 일부가 잘려나감** | [[03-vertex-stage-lifecycle/2. Clip Space NDC 변환|Vertex Stage]] | 카메라의 Near/Far Plane 설정이 너무 좁거나, 객체가 절두체(Frustum) 밖에 위치. |
