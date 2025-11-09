# use

## 🔗 연결
- **상위:** [[UberShader 클래스]]
- **관련:** [[compile]], [[setUniforms]]

## 📖 설명
`use()` 메서드는 WebGL 렌더링 파이프라인에 현재 `UberShader`의 프로그램을 사용하도록 지시하는 역할을 합니다.

이 메서드는 내부적으로 `gl.useProgram(this.program)`을 호출합니다. 이 호출 이후에 실행되는 모든 렌더링 관련 명령어(예: `gl.drawArrays`, `gl.drawElementsInstanced`)는 이 프로그램(컴파일된 버텍스 및 프래그먼트 셰이더)을 사용하여 GPU에서 실행됩니다.

렌더링 루프에서는 일반적으로 다음과 같은 순서로 호출됩니다.
1. `uberShader.use()`를 호출하여 셰이더 프로그램을 활성화합니다.
2. `uberShader.setUniforms()`를 호출하여 현재 프레임에 필요한 유니폼 값(예: 시간, 뷰 행렬)을 업데이트합니다.
3. `gl.draw...()` 계열 함수를 호출하여 실제 그리기를 수행합니다.

셰이더가 성공적으로 컴파일되지 않은 상태(`this.program`이 `null`)에서 호출되면 아무 작업도 수행하지 않고 `false`를 반환합니다.

---

## TypeScript 서명
```typescript
use(): boolean;
```

## 📥 매개변수
이 메서드는 매개변수를 받지 않습니다.

## 📤 반환값
- **타입**: `boolean`
- **설명**:
  - `true`: 셰이더 프로그램이 성공적으로 활성화되었을 경우.
  - `false`: 셰이더가 아직 컴파일되지 않아(`isReady()`가 `false`) 활성화에 실패했을 경우.

---

## 💻 사용 예시
```typescript
// 셰이더가 준비되었다고 가정 (compile() 성공)
if (!uberShader.isReady()) {
  return;
}

// 렌더링 루프 시작
function render() {
  // 1. 이 셰이더 프로그램을 사용하도록 설정
  const success = uberShader.use();

  if (success) {
    // 2. 유니폼 설정
    uberShader.setUniforms({ u_time: performance.now() / 1000 });

    // 3. 버퍼 바인딩 및 어트리뷰트 설정 (별도 코드)
    // ...

    // 4. 그리기
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, numInstances);
  }

  requestAnimationFrame(render);
}

render();
```