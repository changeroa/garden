# isReady

## 🔗 연결
- **상위:** [[UberShader 클래스]]
- **관련:** [[compile]], [[dispose]]

## 📖 설명
`isReady()` 메서드는 `UberShader` 인스턴스가 렌더링에 사용될 준비가 되었는지 여부를 간단하게 확인하는 상태 점검 함수입니다.

내부적으로는 `this.program` 속성이 `null`이 아닌지를 확인합니다. `this.program`은 `compile()` 메서드가 성공적으로 완료되었을 때 `WebGLProgram` 객체로 설정되고, `dispose()`가 호출되거나 컴파일에 실패하면 `null`로 유지됩니다.

따라서 이 메서드는 `compile()`이 성공적으로 호출되었는지를 확인하는 안전장치로 사용될 수 있습니다. 렌더링 루프를 시작하기 전이나 `use()`, `setUniforms()`를 호출하기 전에 이 메서드를 통해 셰이더의 유효성을 검사하는 것이 좋습니다.

---

## TypeScript 서명
```typescript
isReady(): boolean;
```

## 📥 매개변수
이 메서드는 매개변수를 받지 않습니다.

## 📤 반환값
- **타입**: `boolean`
- **설명**:
  - `true`: 셰이더가 성공적으로 컴파일되어 렌더링에 사용할 준비가 된 상태.
  - `false`: 셰이더가 아직 컴파일되지 않았거나, 컴파일에 실패했거나, `dispose()`되어 더 이상 사용할 수 없는 상태.

---

## 💻 사용 예시
```typescript
const uberShader = new UberShader(gl);
console.log('컴파일 전:', uberShader.isReady()); // 출력: 컴파일 전: false

const result = uberShader.compile();

if (result.success) {
  console.log('컴파일 후:', uberShader.isReady()); // 출력: 컴파일 후: true
} else {
  console.log('컴파일 실패 후:', uberShader.isReady()); // 출력: 컴파일 실패 후: false
}

// 렌더링 루프에서 안전하게 사용
function render() {
  if (uberShader.isReady()) {
    uberShader.use();
    // ... 렌더링 로직 ...
  }
}

// 리소스 정리 후
uberShader.dispose();
console.log('dispose 후:', uberShader.isReady()); // 출력: dispose 후: false
```