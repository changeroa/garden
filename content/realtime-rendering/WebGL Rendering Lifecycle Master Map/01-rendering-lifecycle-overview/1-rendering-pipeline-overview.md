
# 1. Rendering Pipeline Overview

> **렌더링의 “입출력 구조” 이해**

- **입력**: 버텍스 데이터 (정점의 위치, 색상, UV 좌표 등 геометрия, атрибуты)
- **처리**: GPU 파이프라인을 통한 변환 및 계산
    - [[03-vertex-stage-lifecycle/4. Vertex Shader의 생명주기|Vertex Shader]] → [[04-rasterization-lifecycle/1. Triangle Coverage Calculation|Rasterization]] → [[05-fragment-stage-lifecycle/1. Fragment Shader 호출 시점|Fragment Shader]] → [[06-blending-lifecycle/1. Blend Equation & Factors|Blending]]
- **출력**: 최종 이미지
    - [[08-framebuffer-to-display-lifecycle/1. Framebuffer 구조|Framebuffer]] → Display

---

### 각 스테이지의 역할

| 스테이지              | 역할                          | 주요 데이터                                | 대표적 병목 지점             |
| :---------------- | :-------------------------- | :------------------------------------ | :-------------------- |
| **Vertex**        | 3D 모델의 정점을 2D 화면 좌표로 변환     | `vec3` (위치), `vec2` (UV)              | 복잡한 모델, 많은 수의 정점      |
| **Rasterization** | 정점들로 이어진 도형(삼각형)을 픽셀 단위로 분해 | 픽셀 커버리지(Coverage)                     | 고해상도, 오버드로우(Overdraw) |
| **Fragment**      | 각 픽셀의 최종 색상을 계산             | `vec4` (RGBA)                         | 복잡한 조명 계산, 텍스처 샘플링    |
| **Blending**      | 계산된 픽셀 색상을 프레임버퍼의 기존 색상과 혼합 | `vec4` (Source), `vec4` (Destination) | 다수의 반투명 레이어           |

