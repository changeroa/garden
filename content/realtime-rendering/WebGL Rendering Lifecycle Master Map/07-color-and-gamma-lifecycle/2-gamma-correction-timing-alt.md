
# 2. 감마 보정 타이밍

올바른 색상 렌더링을 위해서는 [[07-color-and-gamma-lifecycle/1. 선형 vs sRGB|선형 공간과 sRGB 공간]] 사이의 변환을 파이프라인의 **정확한 타이밍**에 적용해야 합니다. 이 과정을 '감마 워크플로우(Gamma Workflow)'라고 합니다.

---

### 올바른 감마 워크플로우

1.  **입력 단계 (sRGB → Linear)**
    -   **대상**: 색상 정보를 담고 있는 모든 텍스처 (Albedo, Diffuse, Base Color 맵 등).
    -   **타이밍**: Fragment Shader에서 `texture()` 함수로 텍스처를 샘플링한 **직후**.
    -   **방법**:
        -   **자동 (권장)**: `gl.getExtension('EXT_sRGB')`를 사용하여 sRGB 텍스처 포맷(`gl.SRGB8_ALPHA8`)을 활성화합니다. 이렇게 하면 텍스처 샘플링 시 GPU 하드웨어가 자동으로 sRGB에서 선형 공간으로 변환해줍니다. 매우 빠르고 효율적입니다.
        -   **수동**: 셰이더 코드 내에서 직접 변환 공식을 적용합니다.
            ```glsl
            vec4 srgb_color = texture(u_sampler, v_texcoord);
            vec3 linear_color = pow(srgb_color.rgb, vec3(2.2));
            ```

2.  **계산 단계 (Linear Space)**
    -   **대상**: 모든 조명 계산, [[06-blending-lifecycle/1. Blend Equation & Factors|블렌딩]], 색상 보간 등.
    -   **타이밍**: 입력 변환 후, 출력 변환 전.
    -   이 단계의 모든 계산은 선형화된 색상 값을 사용해야 합니다.

3.  **출력 단계 (Linear → sRGB)**
    -   **대상**: 최종 계산된 픽셀 색상.
    -   **타이밍**: 모든 계산이 끝난 후, [[08-framebuffer-to-display-lifecycle/1. Framebuffer 구조|Framebuffer]]에 값을 기록하기 **직전**.
    -   **방법**:
        -   **자동 (권장)**: WebGL2에서는 sRGB 프레임버퍼를 기본으로 사용할 수 있습니다 (`gl.FRAMEBUFFER_SRGB`). 이 프레임버퍼에 쓰기를 하면, GPU가 자동으로 선형 공간의 출력 값을 sRGB 공간으로 변환하여 저장합니다.
        -   **수동**: Fragment Shader의 맨 마지막 줄에서 직접 변환 공식을 적용합니다.
            ```glsl
            vec3 final_linear_color = ...; // 모든 계산이 끝난 색상
            vec3 final_srgb_color = pow(final_linear_color, vec3(1.0/2.2));
            fragColor = vec4(final_srgb_color, final_alpha);
            ```

### sRGB Framebuffer Extension의 의미

-   `EXT_sRGB`나 WebGL2의 내장 sRGB 지원은 감마 보정 과정을 거의 **'공짜'**로 만들어줍니다.
-   개발자는 셰이더 코드에서 복잡한 `pow()` 함수를 사용할 필요 없이, 입력 텍스처와 최종 프레임버퍼의 포맷만 올바르게 지정해주면 됩니다.
-   이를 통해 코드는 깔끔해지고, 모든 계산은 물리적으로 올바른 선형 공간에서 수행되며, 최종 결과물은 표준 디스플레이에서 정확한 색상으로 보이게 됩니다.
-   이 워크플로우를 따르지 않는 것이 [[09-rendering-lifecycle-debugging/Rendering Lifecycle 디버깅 체계|색이 다르게 보이는 문제]]의 가장 흔한 원인입니다.
