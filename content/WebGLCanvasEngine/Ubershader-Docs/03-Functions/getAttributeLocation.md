# getAttributeLocation

## 🔗 연결
- **상위:** [[UberShader 클래스]]
- **관련:** [[setupUniformsAndAttributes]]

## 📖 설명
`getAttributeLocation()` 메서드는 `compile()` 과정에서 캐싱된 셰이더 어트리뷰트(attribute)의 위치(location) 인덱스를 조회하는 유틸리티 함수입니다.

어트리뷰트는 버텍스 셰이더에 전달되는 정점별 데이터(예: `a_position`, `a_instancePos`)입니다. WebGL에서 이러한 어트리뷰트에 데이터를 공급하려면, 먼저 해당 어트리뷰트가 GPU에서 사용하는 위치(단순한 정수 인덱스)를 알아야 합니다. 이 메서드는 `gl.getAttribLocation()`을 직접 호출하는 대신, 내부적으로 캐싱된 `this.attributes` `Map`에서 미리 찾아둔 위치 값을 빠르게 반환하여 성능을 향상시킵니다.

이 메서드는 주로 렌더링 파이프라인을 설정할 때, 버퍼(VBO)와 어트리뷰트를 연결하는 `gl.vertexAttribPointer()` 및 `gl.enableVertexAttribArray()`와 함께 사용됩니다.

---

## TypeScript 서명
```typescript
getAttributeLocation(name: string): number;
```

## 📥 매개변수
- **`name`**:
  - **타입**: `string`
  - **설명**: 위치를 조회할 어트리뷰트의 이름입니다. (예: `'a_position'`, `'a_instanceColor'`)

## 📤 반환값
- **타입**: `number`
- **설명**:
  - 어트리뷰트를 찾은 경우, 해당 위치를 나타내는 0 이상의 정수 인덱스를 반환합니다.
  - 어트리뷰트가 셰이더 내에서 사용되지 않거나 존재하지 않는 경우, `-1`을 반환합니다.

---

## 💻 사용 예시
```typescript
// 셰이더 컴파일이 완료되었다고 가정
// 인스턴스별 위치, 크기, 색상 데이터가 담긴 버퍼(instanceBuffer)가 있다고 가정

// 1. 어트리뷰트 위치 가져오기
const posLocation = uberShader.getAttributeLocation('a_instancePos');
const sizeLocation = uberShader.getAttributeLocation('a_instanceSize');
const colorLocation = uberShader.getAttributeLocation('a_instanceColor');

// 2. VAO(Vertex Array Object) 설정 시 어트리뷰트 활성화 및 포인터 설정
gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);

// a_instancePos 어트리뷰트 설정
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, stride, offset_pos);
gl.vertexAttribDivisor(posLocation, 1); // 인스턴스별로 데이터가 바뀜을 명시

// a_instanceSize 어트리뷰트 설정
gl.enableVertexAttribArray(sizeLocation);
gl.vertexAttribPointer(sizeLocation, 2, gl.FLOAT, false, stride, offset_size);
gl.vertexAttribDivisor(sizeLocation, 1);

// a_instanceColor 어트리뷰트 설정
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, stride, offset_color);
gl.vertexAttribDivisor(colorLocation, 1);
```