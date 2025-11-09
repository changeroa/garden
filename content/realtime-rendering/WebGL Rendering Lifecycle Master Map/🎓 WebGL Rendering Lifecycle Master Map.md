# 🎓 WebGL 렌더링 세계에 오신 것을 환영합니다!

이곳은 WebGL 렌더링의 전 과정을 함께 탐험하는 공간입니다. 우리의 목표는 3D 모델 데이터가 화면에 아름다운 그림으로 탄생하기까지의 여정을 머릿속에 생생하게 그려보는 것입니다.

> **🎯 최종 목표: 렌더링의 전 과정(입력 → GPU 처리 → 출력)을 완전히 ‘그려보듯’ 이해한다.**
> **🔑 핵심 키워드: `구조` / `타이밍` / `상태` / `전환` / `오차`**

복잡해 보이는 용어들에 겁먹지 마세요! 자동차 공장에서 부품이 조립되어 멋진 자동차가 완성되듯, 렌더링의 각 단계를 차근차근 따라가다 보면 어느새 전체 그림을 이해하게 될 거예요.

---

## 🗺️ 전체 라이프사이클 맵 (학습 순서)

아래 지도를 따라 각 단계를 클릭하며 픽셀의 여정을 함께 따라가 봅시다.

### 🩵 I. 렌더링 라이프사이클 개요 (숲 전체 보기)
- [[🩵 01 - 렌더링 라이프사이클 개요/1. Rendering Pipeline Overview|1. 렌더링 공장의 전체 조립 라인]]
- [[🩵 01 - 렌더링 라이프사이클 개요/2. Lifecycle Stages as a Flow|2. CPU와 GPU의 역할 분담]]
- [[🩵 01 - 렌더링 라이프사이클 개요/3. 렌더링 프레임의 의미|3. '한 프레임'이라는 시간 단위]]

### 🟦 II. Canvas → GPU 진입 단계 (재료 준비)
- [[🟦 02 - Canvas → GPU 진입 단계/1. Canvas & Viewport 초기화 흐름|1. 그림을 그릴 캔버스 준비하기]]
- [[🟦 02 - Canvas → GPU 진입 단계/2. 좌표계 정렬|2. 현실 공간을 컴퓨터 공간으로 옮기기]]
- [[🟦 02 - Canvas → GPU 진입 단계/3. GPU 리소스 준비|3. GPU에 데이터 꾸러미 전달하기]]

### 🟨 III. Vertex Stage Lifecycle (형태 다듬기)
- [[🟨 03 - Vertex Stage Lifecycle/1. Local → World → View 변환|1. 모델을 씬에 배치하고 카메라로 바라보기]]
- [[🟨 03 - Vertex Stage Lifecycle/2. Clip Space NDC 변환|2. 카메라에 보이는 영역만 남기기]]
- [[🟨 03 - Vertex Stage Lifecycle/3. Viewport Transform|3. 3D 공간을 2D 화면에 투영하기]]
- [[🟨 03 - Vertex Stage Lifecycle/4. Vertex Shader의 생명주기|4. 정점 처리 전문가, Vertex Shader]]

### 🟥 IV. Rasterization Lifecycle (픽셀로 변환하기)
- [[🟥 04 - Rasterization Lifecycle/1. Triangle Coverage Calculation|1. 도형을 픽셀 격자로 채우기]]
- [[🟥 04 - Rasterization Lifecycle/2. Depth & Face Culling|2. 불필요한 부분은 그리지 않기]]
- [[🟥 04 - Rasterization Lifecycle/3. Anti-Aliasing 준비|3. 계단 현상을 없애 부드럽게 만들기]]

### 🟩 V. Fragment Stage Lifecycle (색칠하기)
- [[🟩 05 - Fragment Stage Lifecycle/1. Fragment Shader 호출 시점|1. 픽셀 색상 전문가, Fragment Shader]]
- [[🟩 05 - Fragment Stage Lifecycle/2. Precision Model|2. 계산의 정밀도와 품질]]
- [[🟩 05 - Fragment Stage Lifecycle/3. 파생값 계산 (fwidth, dFdx dFdy)|3. 해상도에 구애받지 않는 경계선 만들기]]
- [[🟩 05 - Fragment Stage Lifecycle/4. SDF 기반 렌더링|4. 선명한 아이콘과 텍스트의 비밀, SDF]]
- [[🟩 05 - Fragment Stage Lifecycle/5. Alpha Channel 생성|5. 투명도(알파)는 어떻게 만들어질까?]]

### 🟧 VI. Blending Lifecycle (자연스럽게 섞기)
- [[🟧 06 - Blending Lifecycle/1. Blend Equation & Factors|1. 새로운 색과 기존 색을 섞는 공식]]
- [[🟧 06 - Blending Lifecycle/2. Premultiplied Alpha 흐름|2. 더 자연스러운 투명도 표현법, PMA]]
- [[🟧 06 - Blending Lifecycle/3. 누적 투명도의 문제|3. 반투명 객체가 겹칠 때의 문제점]]

### 🟫 VII. Color & Gamma Lifecycle (올바른 색 표현하기)
- [[🟫 07 - Color & Gamma Lifecycle/1. 선형 vs sRGB|1. 컴퓨터가 계산하는 색 vs 우리 눈이 보는 색]]
- [[🟫 07 - Color & Gamma Lifecycle/2. 감마 보정 타이밍|2. 색상 왜곡을 막는 '감마 보정' 타이밍]]
- [[🟫 07 - Color & Gamma Lifecycle/3. 시각적 일관성|3. CSS 색과 WebGL 색이 같아 보이게 하려면?]]

### ⚫ VIII. Framebuffer → Display Lifecycle (화면에 보여주기)
- [[⚫ 08 - Framebuffer → Display Lifecycle/1. Framebuffer 구조|1. 완성된 그림이 담기는 임시 저장소, 프레임버퍼]]
- [[⚫ 08 - Framebuffer → Display Lifecycle/2. VSync Frame pacing|2. 부드러운 애니메이션의 비밀, VSync]]
- [[⚫ 08 - Framebuffer → Display Lifecycle/3. DPR 반영과 브라우저 OS 색관리|3. 레티나 디스플레이와 브라우저 줌의 영향]]

### 🧩 IX. Rendering Lifecycle 디버깅 체계 (문제 해결하기)
- [[🧩 09 - Rendering Lifecycle 디버깅 체계/Rendering Lifecycle 디버깅 체계|자주 발생하는 문제와 원인 찾아가기]]

### 🧠 X. Lifecycle Mastery Check (최종 점검)
- [[🧠 10 - Lifecycle Mastery Check/Lifecycle Mastery Check|한 픽셀의 여정, 처음부터 끝까지 요약하기]]