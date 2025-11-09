
# 2. Premultiplied Alpha 흐름

Premultiplied Alpha(미리 곱해진 알파, PMA)는 텍스처나 색상의 RGB 채널에 이미 알파 값을 곱해서 저장하는 방식입니다. 이는 일반적인 알파 블렌딩(Straight Alpha) 방식의 여러 문제를 해결하는 우아한 해법입니다.

-   **Straight Alpha (일반)**: `(R, G, B, A)`
-   **Premultiplied Alpha**: `(R*A, G*A, B*A, A)`

---

### 왜 Premultiplied Alpha를 사용하는가?

#### 1. 감마/투명도 왜곡 방지

-   **문제**: 일반적인 알파 블렌딩 `(Src * A) + (Dst * (1-A))`은 [[07-color-and-gamma-lifecycle/1. 선형 vs sRGB|선형(Linear) 색 공간]]에서 수행될 때만 수학적으로 올바릅니다. 하지만 많은 경우 텍스처는 [[07-color-and-gamma-lifecycle/1. 선형 vs sRGB|sRGB(감마 보정된) 공간]]에 저장되어 있습니다. 감마 공간에서 이 연산을 하면, 특히 어두운 색상 주변에 검은색 후광(dark fringe)이나 원치 않는 색상 왜곡이 발생합니다.
-   **PMA의 해결**: PMA 텍스처를 사용하면 블렌딩 방정식이 더 간단해지고, 감마 문제에 더 강건해집니다.

#### 2. 올바른 블렌딩 연산

-   PMA를 사용할 때의 블렌딩 함수는 다음과 같습니다:
    `gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);`

-   **최종 방정식**:
    `FinalColor = (SourceColor * 1) + (DestinationColor * (1.0 - SourceColor.a))`

-   **의미**: SourceColor의 RGB는 이미 알파가 곱해져 있으므로 `gl.ONE`을 곱해 그대로 사용하고, DestinationColor는 평소처럼 `1-A`를 곱해 혼합합니다. 이 연산은 필터링(filtering)과 블렌딩이 결합될 때 발생하는 경계선 아티팩트(artifact)를 줄여줍니다.

#### 3. 덧셈(Additive)과 일반(Normal) 블렌딩의 통합

-   PMA를 사용하면 `gl.blendFunc`를 바꾸지 않고도 덧셈 블렌딩과 일반 블렌딩을 하나의 데이터 흐름으로 처리할 수 있습니다.
    -   **일반 블렌딩**: `(R*A, G*A, B*A, A)` (A < 1.0)
    -   **덧셈 블렌딩**: `(R, G, B, 0)` -> 알파를 0으로 만들면, `Final = Src + Dst * (1-0) = Src + Dst` 가 되어 자연스럽게 덧셈 블렌딩이 됩니다. (실제로는 알파를 0에 가깝게 처리)
-   이는 파티클 시스템 등에서 매우 유용합니다.

### PMA 흐름 설정

1.  **텍스처 로딩 시**: 이미지 데이터를 로드할 때, CPU 또는 GPU에서 RGB 채널에 알파를 미리 곱해줍니다.
    -   WebGL에서는 `gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);` 옵션을 주면 텍스처 업로드 시 GPU가 자동으로 이 작업을 수행합니다.

2.  **Fragment Shader**: 셰이더는 평소처럼 색상을 계산하고, 최종 출력 `fragColor`의 RGB에 `fragColor.a`를 곱해줍니다.
    ```glsl
    vec4 color = texture(u_sampler, v_texcoord);
    // ... 조명 등 계산 ...
    fragColor.rgb *= color.a;
    fragColor.a = color.a;
    ```

3.  **블렌딩 함수 설정**: `gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);` 로 설정합니다.

이 흐름을 따르면 [[09-rendering-lifecycle-debugging/Rendering Lifecycle 디버깅 체계|반투명 경계의 지저분한 문제나 색상 왜곡]]을 크게 줄일 수 있습니다.
