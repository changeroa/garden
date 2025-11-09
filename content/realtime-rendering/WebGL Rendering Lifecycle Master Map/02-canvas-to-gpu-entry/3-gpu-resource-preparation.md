
# 3. GPU 리소스 준비

렌더링을 시작하기 전, CPU는 렌더링에 필요한 모든 데이터를 GPU 메모리에 업로드해야 합니다. 이 데이터는 크게 정점 데이터(Attributes)와 전역 상태 데이터(Uniforms)로 나뉩니다.

---

### 1. VBO (Vertex Buffer Object)

-   **역할**: 정점의 위치, 색상, 텍스처 좌표(UV), 노멀(Normal) 등 대량의 정점 속성(Attribute) 데이터를 담는 GPU 메모리 버퍼입니다.
-   **흐름**:
    1.  `gl.createBuffer()`: 버퍼 객체 생성
    2.  `gl.bindBuffer(gl.ARRAY_BUFFER, vbo)`: 생성된 버퍼를 현재 작업 대상으로 바인딩
    3.  `gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)`: CPU의 자바스크립트 배열(`vertices`)을 GPU 메모리로 복사
-   **타이밍**: VBO 데이터는 보통 초기화 시 한 번 업로드하고, 모델의 형태가 변하지 않는 한 다시 업데이트하지 않습니다. (gl.STATIC_DRAW)

### 2. EBO / IBO (Element Buffer Object / Index Buffer Object)

-   **역할**: 정점을 그리는 순서(인덱스)를 저장하는 버퍼입니다. VBO의 정점 데이터를 재사용하여 메모리를 절약할 수 있습니다. (예: 사각형은 4개의 정점, 6개의 인덱스)
-   **흐름**:
    1.  `gl.createBuffer()`
    2.  `gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)`
    3.  `gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)`
-   `gl.drawElements()`를 사용하여 렌더링합니다.

### 3. VAO (Vertex Array Object)

-   **역할**: **상태 머신(State Machine)**. VBO와 EBO, 그리고 정점 속성 포인터(`gl.vertexAttribPointer`, `gl.enableVertexAttribArray`) 설정들을 하나의 객체에 캡슐화하여 저장합니다.
-   **흐름**:
    1.  `gl.createVertexArray()`: VAO 생성
    2.  `gl.bindVertexArray(vao)`: VAO 바인딩. **이 시점부터의 모든 VBO, EBO, 속성 포인터 설정이 이 VAO에 기록됩니다.**
    3.  (VBO, EBO, 속성 포인터 설정...)
    4.  `gl.bindVertexArray(null)`: VAO 바인딩 해제. 상태 저장이 완료됩니다.
-   **장점**: 렌더링 루프에서는 `gl.bindVertexArray(vao)` 하나만 호출하면 모든 정점 관련 상태가 한 번에 복원되므로, 코드가 깔끔해지고 성능이 향상됩니다.

### 4. Uniform / Attribute 업데이트 타이밍

-   **CPU → GPU 데이터 전송 시점**

| 구분 | 데이터 종류 | WebGL API | 업데이트 주기 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **Attribute** | 정점별 데이터 (위치, 색상 등) | `gl.bufferData` | 주로 초기화 시 | 모델의 기본 모양을 정의. VBO를 통해 전달. |
| **Uniform** | 전체 도형에 동일하게 적용되는 데이터 | `gl.uniform*` | 매 프레임 또는 매 객체 | 모델의 변환 행렬, 시간, 조명 색상 등. Draw Call 직전에 설정. |
