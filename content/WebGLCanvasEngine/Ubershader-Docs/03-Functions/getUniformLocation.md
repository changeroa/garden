# getUniformLocation

## 🔗 연결
- **상위:** [[ubershader-class]]
- **관련:** [[setupUniformsAndAttributes]], [[setUniforms]]

## 📖 설명
`getUniformLocation()` 메서드는 `compile()` 과정에서 캐싱된 셰이더 유니폼(uniform)의 위치(location) 객체를 조회하는 유틸리티 함수입니다.

유니폼은 모든 정점에 동일하게 적용되는 전역 변수(예: `u_viewMatrix`, `u_time`)입니다. `setUniforms` 메서드를 사용하는 것이 일반적이지만, 경우에 따라 특정 유니폼의 위치만 직접 알아내어 `gl.uniform...` 계열 함수를 개별적으로 호출해야 할 때가 있습니다. 이 메서드는 `gl.getUniformLocation()`을 직접 호출하는 대신, 내부적으로 캐싱된 `this.uniforms` `Map`에서 미리 찾아둔 `WebGLUniformLocation` 객체를 빠르게 반환하여 성능을 향상시킵니다.

`setUniforms` 메서드가 대부분의 경우에 더 편리하지만, 이 함수는 특정 유니폼만 매우 빈번하게 업데이트해야 하는 최적화 시나리오나, `setUniforms`의 추상화를 벗어나고 싶을 때 유용할 수 있습니다.

---

## TypeScript 서명
```typescript
getUniformLocation(name: string): WebGLUniformLocation | null;
```

## 📥 매개변수
- **`name`**:
  - **타입**: `string`
  - **설명**: 위치를 조회할 유니폼의 이름입니다. (예: `'u_viewMatrix'`, `'u_time'`)

## 📤 반환값
- **타입**: `WebGLUniformLocation | null`
- **설명**:
  - 유니폼을 찾은 경우, WebGL 컨텍스트에서 사용하는 `WebGLUniformLocation` 객체를 반환합니다.
  - 유니폼이 셰이더 내에서 사용되지 않거나 존재하지 않는 경우, `null`을 반환합니다.

---

## 💻 사용 예시
```typescript
// 셰이더가 활성화되었다고 가정
uberShader.use();

// 'u_time' 유니폼의 위치를 직접 가져오기
const timeLocation = uberShader.getUniformLocation('u_time');

if (timeLocation) {
  // 렌더링 루프에서 'u_time'만 직접 업데이트
  function render(time) {
    // gl.uniform1f를 직접 호출
    gl.uniform1f(timeLocation, time / 1000);

    // 다른 유니폼들은 setUniforms를 통해 업데이트 가능
    // uberShader.setUniforms({ ... });

    // ... 그리기 호출 ...
    requestAnimationFrame(render);
  }
  render(0);
}
```