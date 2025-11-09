# UberShader 클래스

## 🔗 연결
- **상위:** [[Ubershader 마스터 가이드]]
- **하위:** [[compile]], [[setUniforms]], [[use]] 등 모든 공개 함수
- **관련:** [[인터페이스]], [[GLSL 셰이더]]

## 📖 개념 설명
`UberShader` 클래스는 Ubershader 렌더링 파이프라인의 **중앙 관리자**입니다. 복잡한 WebGL API 호출을 캡슐화하여 사용자가 Ubershader를 쉽게 초기화하고, 설정하며, 렌더링에 사용할 수 있도록 추상화된 인터페이스를 제공하는 것이 이 클래스의 핵심 역할입니다.

### 주요 책임
- **셰이더 생명주기 관리**: GLSL 소스 코드를 가져와 WebGL 셰이더 프로그램을 컴파일, 링크하고, 더 이상 필요 없을 때 메모리에서 해제(`dispose`)합니다.
- **자원 캐싱**: 성능 최적화를 위해 컴파일된 프로그램, 유니폼(Uniform) 변수와 어트리뷰트(Attribute)의 위치(메모리 주소)를 내부 `Map`에 캐싱하여 매번 찾는 비용을 없앱니다.
- **상태 관리**: 셰이더가 현재 사용 준비가 되었는지(`isReady`) 확인하고, 렌더링에 사용(`use`)할 수 있도록 WebGL 컨텍스트에 바인딩합니다.
- **데이터 인터페이스**: 외부(CPU)에서 렌더링에 필요한 데이터(예: 뷰 행렬, 색상, 시간 등)를 받아 셰이더(GPU)로 전달하는 `setUniforms`와 같은 메서드를 제공합니다.

---

## ⚙️ 주요 속성 (Private)
`UberShader` 클래스는 내부적으로 다음과 같은 상태를 가집니다.

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `gl` | `WebGL2RenderingContext` | 생성자에서 주입된 WebGL 2.0 렌더링 컨텍스트입니다. 모든 WebGL API 호출에 사용됩니다. |
| `program` | `WebGLProgram | null` | 컴파일되고 링크된 최종 셰이더 프로그램입니다. `compile()` 성공 전까지는 `null`입니다. |
| `uniforms` | `Map<string, WebGLUniformLocation>` | 유니폼 이름과 GPU 메모리상의 위치(`WebGLUniformLocation`)를 매핑하는 캐시입니다. |
| `attributes` | `Map<string, number>` | 어트리뷰트 이름과 GPU 메모리상의 위치(`location index`)를 매핑하는 캐시입니다. |

---

## 📜 메서드 개요 (Public)

| 메서드 | 설명 |
| --- | --- |
| `compile()` | 버텍스/프래그먼트 셰이더를 컴파일하고 링크하여 사용 가능한 프로그램을 만듭니다. ([[compile]] 참조) |
| `use()` | 현재 셰이더 프로그램을 WebGL 렌더링 상태의 일부로 활성화합니다. ([[use]] 참조) |
| `setUniforms(uniforms)` | 셰이더의 `uniform` 변수들에 데이터를 전달합니다. ([[setUniforms]] 참조) |
| `getAttributeLocation(name)` | 지정된 `attribute`의 위치(인덱스)를 반환합니다. ([[getAttributeLocation]] 참조) |
| `getUniformLocation(name)` | 지정된 `uniform`의 위치를 반환합니다. ([[getUniformLocation]] 참조) |
| `isReady()` | 셰이더가 성공적으로 컴파일되어 렌더링에 사용될 준비가 되었는지 확인합니다. ([[isReady]] 참조) |
| `dispose()` | WebGL 프로그램과 관련된 모든 리소스를 메모리에서 해제합니다. ([[dispose]] 참조) |
