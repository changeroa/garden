# setUniforms

## 🔗 연결
- **상위:** [[ubershader-class]]
- **관련:** [[ShaderUniforms]], [[use]]

## 📖 설명
`setUniforms()` 메서드는 CPU의 TypeScript 코드에서 GPU의 셰이더 프로그램으로 데이터를 전송하는 핵심 통로입니다. 셰이더의 `uniform` 변수들은 모든 정점과 픽셀에 동일하게 적용되는 전역 상수 역할을 하며, 이 메서드를 통해 런타임에 값을 변경할 수 있습니다.

내부적으로 이 메서드는 다음과 같이 동작합니다.
1. 전달받은 `uniforms` 객체에 어떤 속성들이 있는지 확인합니다.
2. 각 속성에 대해, `compile()` 시점에 미리 캐싱해 둔 `this.uniforms` `Map`에서 해당 유니폼의 `WebGLUniformLocation`을 조회합니다.
3. 유니폼의 데이터 타입에 맞는 `gl.uniform...()` 함수를 호출하여 GPU로 데이터를 전송합니다.
   - `u_viewMatrix`: `gl.uniformMatrix3fv()`
   - `u_resolution`: `gl.uniform2fv()`
   - `u_time`: `gl.uniform1f()`
   - `u_selectionColor`: `gl.uniform4fv()`
   - 등등...

`use()`를 호출하여 셰이더 프로그램이 활성화된 상태에서만 의미가 있으며, `this.program`이 `null`이면 아무 작업도 수행하지 않습니다.

---

## TypeScript 서명
```typescript
setUniforms(uniforms: Partial<ShaderUniforms>): void;
```

## 📥 매개변수
- **`uniforms`**:
  - **타입**: `Partial<ShaderUniforms>`
  - **설명**: [[ShaderUniforms]] 인터페이스의 부분 집합. `Partial<>` 유틸리티 타입이 적용되어, 업데이트하고자 하는 유니폼 속성만 포함하는 객체를 전달할 수 있습니다. 모든 유니폼을 매번 전달할 필요가 없어 효율적입니다.

## 📤 반환값
이 메서드는 값을 반환하지 않습니다 (`void`).

---

## 💻 사용 예시
```typescript
// 셰이더가 활성화되었다고 가정
uberShader.use();

// 예시 1: 캔버스 크기가 변경될 때 해상도 유니폼 업데이트
function onResize() {
  uberShader.setUniforms({
    u_resolution: new Float32Array([gl.canvas.width, gl.canvas.height])
  });
}

// 예시 2: 렌더링 루프에서 애니메이션 시간과 카메라 행렬 업데이트
function render(time) {
  const cameraMatrix = getCurrentCameraMatrix(); // 현재 카메라 행렬 가져오기
  uberShader.setUniforms({
    u_time: time / 1000,
    u_viewMatrix: cameraMatrix
  });
  // ... 그리기 호출 ...
}

// 예시 3: 사용자가 노드를 선택했을 때 하이라이트 관련 유니폼 변경
function onNodeSelect(node) {
    uberShader.setUniforms({
        u_borderWidth: 3.0,
        u_selectionColor: new Float32Array([0.1, 0.8, 1.0, 1.0]) // 파란색 하이라이트
    });
}
```