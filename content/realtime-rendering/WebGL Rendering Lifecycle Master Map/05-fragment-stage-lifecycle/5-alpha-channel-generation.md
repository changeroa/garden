
# 5. Alpha Channel 생성

Fragment Shader의 최종 출력은 `vec4` 형태의 RGBA 값입니다. 여기서 네 번째 채널인 A(Alpha)는 픽셀의 불투명도(Opacity)를 결정하며, 다음 단계인 [[06-blending-lifecycle/1. Blend Equation & Factors|Blending]] 과정에서 어떻게 다른 픽셀과 혼합될지를 제어하는 핵심적인 역할을 합니다.

---

### 1. SDF 경계 → 투명도(Alpha)

[[05-fragment-stage-lifecycle/4. SDF 기반 렌더링|SDF 기반 렌더링]]에서 `smoothstep` 함수의 결과는 보통 `0.0`에서 `1.0` 사이의 값으로, 이는 모양의 내부(1.0, 불투명)와 외부(0.0, 투명)를 나타냅니다. 이 값을 그대로 알파 채널에 사용하면 자연스러운 안티에일리어싱이 적용된 투명도를 얻을 수 있습니다.

```glsl
// SDF 값과 fwidth를 이용해 알파 값을 계산
float dist = texture(u_sdf_texture, v_texcoord).r - 0.5;
float width = fwidth(dist);
float alpha = smoothstep(-width, width, dist);

// RGB 채널은 지정된 색상으로, A 채널은 계산된 alpha 값으로 설정
vec3 shapeColor = vec3(1.0, 0.0, 0.0); // 빨간색
fragColor = vec4(shapeColor, alpha);
```

-   **결과**: `fragColor`는 경계선에서는 반투명한 값을, 모양의 내부에서는 완전히 불투명한 값을 갖게 됩니다.

### 2. 텍스처의 알파 채널 사용

-   PNG와 같이 알파 채널을 포함하는 이미지를 텍스처로 사용하는 경우, 텍스처에서 샘플링한 알파 값을 그대로 사용할 수 있습니다.

```glsl
// u_texture는 알파 채널이 있는 PNG 이미지
vec4 texColor = texture(u_texture, v_texcoord);

// 텍스처의 색상과 알파 값을 그대로 최종 출력으로 사용
fragColor = texColor;
```

### 3. Alpha가 다음 단계(Blending)로 넘어가는 방식

-   Fragment Shader가 `out vec4 fragColor`에 값을 쓰는 순간, 이 값은 **Source Color**(`gl_FragColor`)가 되어 파이프라인의 다음 단계로 넘어갑니다.
-   이때 `fragColor.a` (알파 값)는 **Source Alpha**가 됩니다.
-   GPU는 이 Source Color와 Source Alpha를 [[08-framebuffer-to-display-lifecycle/1. Framebuffer 구조|Framebuffer]]에 이미 저장되어 있는 **Destination Color**와 혼합하여 최종 픽셀 색상을 결정합니다.
-   이 혼합 과정은 [[06-blending-lifecycle/1. Blend Equation & Factors|Blend Equation]]에 의해 제어되며, `gl.blendFunc()` API를 통해 그 방식을 지정할 수 있습니다.

-   만약 Blending이 비활성화되어 있다면, 알파 값은 무시되고 RGB 값만 프레임버퍼에 덮어써집니다 (알파 값이 0이라도).
-   Blending이 활성화되어 있다면, 알파 값은 Source와 Destination 색상을 어떤 비율로 섞을지를 결정하는 중요한 요소가 됩니다.
