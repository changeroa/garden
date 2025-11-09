# compile

## 🔗 연결
- **상위:** [[ubershader-class]]
- **관련:** [[ShaderCompileResult]], [[isReady]], [[compileShader]]

## 📖 설명
`compile()` 메서드는 `UberShader` 클래스의 핵심 초기화 함수입니다. 내장된 GLSL `vertexShaderSource`와 `fragmentShaderSource`를 가져와 다음 단계를 순차적으로 실행합니다.

1.  **셰이더 객체 생성**: `gl.createShader()`로 버텍스 셰이더와 프래그먼트 셰이더 객체를 각각 생성합니다.
2.  **소스 코드 바인딩**: `gl.shaderSource()`로 각 셰이더 객체에 GLSL 코드를 연결합니다.
3.  **셰이더 컴파일**: `gl.compileShader()`로 각 셰이더를 GPU가 이해할 수 있는 코드로 컴파일합니다.
4.  **컴파일 상태 확인**: `gl.getShaderParameter()`와 `gl.getShaderInfoLog()`를 통해 컴파일 성공 여부를 확인하고, 실패 시 에러 로그를 가져옵니다.
5.  **프로그램 생성 및 링크**:
    - `gl.createProgram()`으로 최종 셰이더 프로그램을 생성합니다.
    - `gl.attachShader()`로 컴파일된 두 셰이더를 프로그램에 붙입니다.
    - `gl.linkProgram()`으로 두 셰이더를 연결하여 실행 가능한 GPU 프로그램을 만듭니다.
    - `gl.getProgramParameter()`와 `gl.getProgramInfoLog()`로 링크 성공 여부를 확인합니다.
6.  **자원 정리 및 캐싱**:
    - 링크가 완료되면 더 이상 필요 없는 개별 셰이더 객체들을 `gl.deleteShader()`로 삭제합니다.
    - 성공적으로 생성된 `WebGLProgram`을 `this.program` 속성에 저장합니다.
    - `setupUniformsAndAttributes()`를 호출하여 모든 유니폼과 어트리뷰트의 위치를 미리 찾아 캐싱합니다.

이 모든 과정의 결과를 [[ShaderCompileResult]] 인터페이스에 맞춰 반환합니다.

---

## TypeScript 서명
```typescript
compile(): ShaderCompileResult;
```

## 📥 매개변수
이 메서드는 매개변수를 받지 않습니다.

## 📤 반환값
- **타입**: `ShaderCompileResult`
- **설명**: 컴파일의 성공 여부(`success`), 성공 시 `WebGLProgram` 객체(`program`), 실패 시 오류 메시지(`error`), 그리고 전체 컴파일 소요 시간(`compileTime`)을 담은 객체를 반환합니다.

---

## 💻 사용 예시
```typescript
const gl = canvas.getContext('webgl2');
const uberShader = new UberShader(gl, true); // 디버그 모드 활성화

const result = uberShader.compile();

if (result.success) {
  console.log("셰이더가 성공적으로 컴파일되었습니다.");
  // 이제 isReady()는 true를 반환하고, use()와 setUniforms()를 호출할 수 있습니다.
} else {
  // 셰이더 코드에 문법 오류가 있거나 링크에 실패한 경우
  console.error("셰이더 컴파일 실패:", result.error);
}
```