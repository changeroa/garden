# compileShader (private)

## 🔗 연결
- **상위:** [[compile]]
- **관련:** [[UberShader 클래스]]

## 📖 설명
`compileShader()`는 `UberShader` 클래스 내부에서 사용되는 비공개(private) 헬퍼 메서드입니다. `compile()` 메서드에 의해 호출되며, 단일 셰이더(버텍스 또는 프래그먼트)를 컴파일하는 역할을 담당합니다.

이 메서드는 다음과 같은 구체적인 WebGL 단계를 캡슐화합니다.
1. `gl.createShader()`: 셰이더 타입(`gl.VERTEX_SHADER` 또는 `gl.FRAGMENT_SHADER`)에 맞는 셰이더 객체를 생성합니다.
2. `gl.shaderSource()`: 셰이더 객체에 GLSL 소스 코드를 제공합니다.
3. `gl.compileShader()`: 소스 코드를 컴파일합니다.
4. `gl.getShaderParameter(shader, gl.COMPILE_STATUS)`: 컴파일 성공 여부를 확인합니다.
5. 만약 컴파일에 실패하면, `gl.getShaderInfoLog()`를 통해 에러 메시지를 가져와 콘솔에 출력하고(`debug` 모드일 경우), 생성된 셰이더 객체를 `gl.deleteShader()`로 삭제하여 리소스를 정리합니다.

성공적으로 컴파일된 `WebGLShader` 객체 또는 실패 시 `null`을 반환하여, 호출자인 `compile()` 메서드가 전체 컴파일 프로세스를 제어할 수 있도록 합니다.

---

## TypeScript 서명
```typescript
private compileShader(type: number, source: string): WebGLShader | null;
```

## 📥 매개변수
- **`type`**:
  - **타입**: `number`
  - **설명**: 컴파일할 셰이더의 종류를 나타내는 WebGL 상수입니다. (`gl.VERTEX_SHADER` 또는 `gl.FRAGMENT_SHADER`)
- **`source`**:
  - **타입**: `string`
  - **설명**: 컴파일할 GLSL 셰이더 소스 코드입니다.

## 📤 반환값
- **타입**: `WebGLShader | null`
- **설명**:
  - 컴파일에 성공한 경우, 생성된 `WebGLShader` 객체를 반환합니다.
  - 컴파일에 실패한 경우, `null`을 반환합니다.

---

## 💻 사용 예시 (내부)
이 메서드는 클래스 외부에서 직접 호출할 수 없습니다. `compile()` 메서드 내부에서 다음과 같이 사용됩니다.

```typescript
// UberShader.ts의 compile() 메서드 내부...

// 버텍스 셰이더 컴파일
const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
if (!vertexShader) {
  // 실패 처리...
  return { success: false, error: 'Failed to compile vertex shader', compileTime: 0 };
}

// 프래그먼트 셰이더 컴파일
const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
if (!fragmentShader) {
  // 실패 처리...
  return { success: false, error: 'Failed to compile fragment shader', compileTime: 0 };
}

// ... 이후 링크 과정 ...
```