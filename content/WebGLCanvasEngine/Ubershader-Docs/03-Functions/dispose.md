# dispose

## 🔗 연결
- **상위:** [[ubershader-class]]
- **관련:** [[compile]], [[isReady]]

## 📖 설명
`dispose()` 메서드는 `UberShader`가 사용하던 WebGL 리소스를 명시적으로 해제하는 역할을 합니다. WebGL 애플리케이션에서는 GPU 메모리를 직접 관리해야 하므로, 더 이상 사용하지 않는 객체를 명확히 제거해주는 것이 메모리 누수(memory leak)를 방지하는 좋은 습관입니다.

이 메서드는 다음 작업을 수행합니다.
1. `this.program`에 유효한 `WebGLProgram`이 있는지 확인합니다.
2. 프로그램이 있다면, `gl.deleteProgram(this.program)`을 호출하여 GPU 메모리에서 해당 프로그램을 삭제합니다.
3. `this.program`을 `null`로 설정하여 `isReady()`가 `false`를 반환하도록 하고, 더 이상 이 셰이더를 사용할 수 없음을 명시합니다.
4. 내부 캐시인 `this.uniforms`와 `this.attributes` `Map`을 비웁니다.

애플리케이션이 종료되거나, 특정 셰이더가 더 이상 필요 없는 시점에 이 메서드를 호출해야 합니다.

---

## TypeScript 서명
```typescript
dispose(): void;
```

## 📥 매개변수
이 메서드는 매개변수를 받지 않습니다.

## 📤 반환값
이 메서드는 값을 반환하지 않습니다 (`void`).

---

## 💻 사용 예시
```typescript
// 셰이더 생성 및 사용
const uberShader = new UberShader(gl);
uberShader.compile();

// ... 렌더링에 사용 ...

// 애플리케이션 종료 또는 씬 전환 시
function cleanup() {
  console.log('셰이더 사용 가능 여부 (dispose 전): ', uberShader.isReady()); // 출력: true

  uberShader.dispose();

  console.log('셰이더 사용 가능 여부 (dispose 후): ', uberShader.isReady()); // 출력: false

  // 이제 이 uberShader 인스턴스는 더 이상 사용할 수 없습니다.
  // 다시 사용하려면 새로 생성하고 컴파일해야 합니다.
}

// 예를 들어, 페이지를 떠날 때 리소스 정리
window.addEventListener('beforeunload', cleanup);
```