# setupUniformsAndAttributes (private)

## 🔗 연결
- **상위:** [[compile]]
- **관련:** [[getAttributeLocation]], [[getUniformLocation]]

## 📖 설명
`setupUniformsAndAttributes()`는 `UberShader` 클래스 내부에서 사용되는 비공개(private) 헬퍼 메서드입니다. `compile()` 메서드가 성공적으로 셰이더 프로그램을 링크한 직후에 호출됩니다.

이 메서드의 주된 목적은 **성능 최적화**입니다. `gl.getUniformLocation()`과 `gl.getAttribLocation()`은 런타임에 호출될 때 약간의 비용이 발생할 수 있습니다. 이 메서드는 셰이더가 처음 컴파일될 때 모든 유니폼과 어트리뷰트의 위치를 **미리 조회**하여, 그 결과를 클래스 내부의 `uniforms`와 `attributes` `Map` 객체에 캐싱합니다.

미리 정의된 유니폼 및 어트리뷰트 이름 목록을 순회하며 각 항목의 위치를 찾아 저장합니다.
- **유니폼**: `u_viewMatrix`, `u_resolution` 등
- **어트리뷰트**: `a_position`, `a_instancePos` 등

이렇게 캐싱해두면, 이후 `setUniforms()`, `getAttributeLocation()`, `getUniformLocation()` 같은 메서드들이 WebGL API를 직접 호출하는 대신 내부 `Map`에서 빠르게 값을 조회할 수 있어, 렌더링 루프에서의 부하를 줄여줍니다.

---

## TypeScript 서명
```typescript
private setupUniformsAndAttributes(): void;
```

## 📥 매개변수
이 메서드는 매개변수를 받지 않습니다.

## 📤 반환값
이 메서드는 값을 반환하지 않습니다 (`void`).

---

## 💻 사용 예시 (내부)
이 메서드는 클래스 외부에서 직접 호출할 수 없습니다. `compile()` 메서드 내부의 프로그램 링크가 성공한 직후에 다음과 같이 사용됩니다.

```typescript
// UberShader.ts의 compile() 메서드 내부...

// ... 프로그램 링크 성공 ...

// Clean up shaders (they're now in the program)
this.gl.deleteShader(vertexShader);
this.gl.deleteShader(fragmentShader);

// Store program and get uniform/attribute locations
this.program = program;
this.setupUniformsAndAttributes(); // 바로 여기서 호출됨

const compileTime = performance.now() - startTime;

// ...
```