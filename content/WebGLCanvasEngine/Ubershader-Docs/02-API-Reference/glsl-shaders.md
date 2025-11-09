# GLSL 셰이더 상세 분석

## 🔗 연결
- **상위:** [[ubershader-class]]
- **관련:** [[key-technologies]]

## 📖 개념 설명
Ubershader의 핵심 로직은 GPU에서 직접 실행되는 두 개의 GLSL(OpenGL Shading Language) 코드로 작성되어 있습니다. 이 코드들은 `UberShader` 클래스 내부에 `private` 문자열 속성(`vertexShaderSource`, `fragmentShaderSource`)으로 저장되어 있습니다.

---

## 1. 버텍스 셰이더 (`vertexShaderSource`)
- **역할**: 각 객체(인스턴스)의 정점(Vertex) 위치를 계산하고, 프래그먼트 셰이더에 필요한 데이터를 전달합니다.

<details>
<summary><b>코드 보기/접기: vertexShaderSource</b></summary>

```glsl
#version 300 es  
precision mediump float; // 중간 정밀도 | 성능과 품질 균형

//--- 입력 (Attributes & Uniforms) ---

// 기본 쿼드 버텍스 (모든 인스턴스가 재사용)
in vec2 a_position; // -0.5~0.5 범위의 정점 좌표 | 6개 정점으로 사각형 구성

// 인스턴스별 속성 (각 노드마다 다른 데이터)
in vec2 a_instancePos;   // 노드 중심 위치 (월드 좌표계)
in vec2 a_instanceSize;  // 노드 크기 (픽셀 단위)
in vec4 a_instanceColor; // 노드 색상 (RGBA, 0.0-1.0)
in float a_nodeType;     // 노드 타입 (향후 확장용)
in float a_selected;     // 선택 상태 (0.0 또는 1.0)

// 전역 변수 (모든 인스턴스에 공통 적용)
uniform mat3 u_viewMatrix;  // 3x3 뷰 변환 행렬 (팬/줌 처리)
uniform vec2 u_resolution;  // 캔버스 해상도 (정규화용)

//--- 출력 (Varyings) ---

// 프래그먼트 셰이더로 전달될 변수들
out vec4 v_color;    // 보간된 색상
out float v_selected; // 보간된 선택 상태
out vec2 v_localPos; // 지역 좌표 (SDF 계산용, 0.0-1.0)

void main() {
  // 1. 월드 좌표 계산
  // 기본 쿼드(-0.5~0.5)를 노드 크기만큼 스케일링하고, 노드 위치로 이동
  vec2 worldPos = a_position * a_instanceSize + a_instancePos;
  
  // 2. 뷰 변환 적용 (월드 -> 클립 공간)
  // 3x3 행렬을 사용하여 2D 변환(이동/회전/스케일)을 동차 좌표계에서 수행
  vec3 viewPos = u_viewMatrix * vec3(worldPos, 1.0);
  
  // 3. 최종 좌표(gl_Position) 계산
  // WebGL의 최종 출력 좌표계인 클립 공간(-1.0 ~ 1.0)으로 변환
  gl_Position = vec4(viewPos.xy, 0.0, 1.0); 
  
  // 4. 프래그먼트 셰이더로 데이터 전달
  v_color = a_instanceColor;
  v_selected = a_selected;
  v_localPos = a_position + 0.5; // -0.5~0.5 범위를 0.0~1.0 범위로 변환
}
```
</details>

### 변수 상세 분석

| 종류 | 이름 | 타입 | 설명 |
| --- | --- | --- | --- |
| `in` | `a_position` | `vec2` | 인스턴스가 공유하는 기본 사각형의 정점 좌표 (-0.5 ~ 0.5) |
| `in` | `a_instancePos` | `vec2` | 인스턴스의 월드 공간 위치 (중심점) |
| `in` | `a_instanceSize` | `vec2` | 인스턴스의 너비와 높이 (픽셀) |
| `in` | `a_instanceColor` | `vec4` | 인스턴스의 RGBA 색상 (0.0 ~ 1.0) |
| `in` | `a_selected` | `float` | 선택 여부 (0.0: 선택 안됨, 1.0: 선택됨) |
| `uniform` | `u_viewMatrix` | `mat3` | 월드 공간을 뷰(카메라) 공간으로 변환하는 3x3 행렬 |
| `uniform` | `u_resolution` | `vec2` | 캔버스의 너비와 높이 (현재는 직접 사용되지 않음) |
| `out` | `v_color` | `vec4` | 프래그먼트 셰이더로 전달될 보간된 색상 |
| `out` | `v_selected` | `float` | 프래그먼트 셰이더로 전달될 보간된 선택 상태 |
| `out` | `v_localPos` | `vec2` | 프래그먼트 셰이더에서 SDF 계산에 사용할 지역 좌표 (0.0 ~ 1.0) |

---

## 2. 프래그먼트 셰이더 (`fragmentShaderSource`)
- **역할**: 각 픽셀(Fragment)의 최종 색상을 결정합니다. SDF 계산을 통해 둥근 사각형과 테두리를 그립니다.

<details>
<summary><b>코드 보기/접기: fragmentShaderSource</b></summary>

```glsl
#version 300 es
precision mediump float; // 중간 정밀도 | 모바일 GPU 호환성

//--- 입력 (Varyings & Uniforms) ---

// 버텍스 셰이더에서 전달받은 보간된 값들
in vec4 v_color;     // 노드 기본 색상
in float v_selected; // 선택 상태 (0.0 또는 1.0)
in vec2 v_localPos;  // 지역 좌표 (0.0-1.0 범위, SDF 계산 기준)

// 스타일링용 전역 변수
uniform float u_borderWidth;    // 테두리 두께 (픽셀 단위)
uniform vec4 u_selectionColor;  // 선택 하이라이트 색상 (RGBA)
uniform float u_cornerRadius;   // 모서리 둥글기 반지름 (0.0-1.0 정규화 값)

//--- 출력 ---
out vec4 fragColor; // 최종 픽셀 색상 출력

void main() {
  // 1. SDF 계산을 위한 좌표 준비
  vec2 center = vec2(0.5, 0.5);
  vec2 size = vec2(0.5 - u_cornerRadius);
  
  // 2. SDF 계산
  // 원본 코드의 계산을 가독성 좋게 표현한 것입니다.
  // 픽셀에서 사각형 경계까지의 거리 벡터
  vec2 d = abs(v_localPos - center) - size;
  // 둥근 모서리를 포함한 최종 거리 계산
  float distance = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - u_cornerRadius;

  // 3. 기본 색상 설정
  vec4 nodeColor = v_color;
  
  // 4. 선택 상태 하이라이트 처리
  if (v_selected > 0.5) {
    // smoothstep: 두 값 사이를 부드럽게 보간. 여기서는 테두리 영역 계산에 사용
    // distance가 -u_borderWidth ~ 0.0 범위일 때 0.0 ~ 1.0 값을 반환
    float selectionMix = smoothstep(-u_borderWidth, 0.0, distance);
    // mix: selectionMix 값에 따라 두 색상을 선형 보간
    nodeColor = mix(u_selectionColor, nodeColor, selectionMix);
  }
  
  // 5. 안티앨리어싱 처리
  // SDF 거리를 이용해 경계선을 부드럽게 처리하여 알파(투명도) 값 계산
  // distance가 -0.002 ~ 0.002 범위일 때 1.0 ~ 0.0 값을 반환 (픽셀의 2배)
  float alpha = 1.0 - smoothstep(-0.001, 0.001, distance);
  
  // 6. 최종 색상 출력
  // 계산된 색상의 RGB는 유지하고, 알파 값만 SDF로 계산된 값으로 적용
  fragColor = vec4(nodeColor.rgb, nodeColor.a * alpha);
}
```
</details>

### 변수 상세 분석

| 종류 | 이름 | 타입 | 설명 |
| --- | --- | --- | --- |
| `in` | `v_color` | `vec4` | 버텍스 셰이더에서 전달된 보간된 색상 |
| `in` | `v_selected` | `float` | 보간된 선택 상태 값 |
| `in` | `v_localPos` | `vec2` | 보간된 지역 좌표 (0.0 ~ 1.0) |
| `uniform` | `u_borderWidth` | `float` | 선택 테두리의 두께 (픽셀 단위) |
| `uniform` | `u_selectionColor` | `vec4` | 선택 테두리의 RGBA 색상 |
| `uniform` | `u_cornerRadius` | `float` | 사각형 모서리의 둥근 정도 (0.0: 직각, 0.5: 원) |
| `out` | `fragColor` | `vec4` | 현재 픽셀에 그려질 최종 RGBA 색상 |
