
# 4. SDF 기반 렌더링

SDF(Signed Distance Field)는 특정 모양의 경계선으로부터 가장 가까운 거리를 저장한 데이터 필드(보통 텍스처)입니다. 경계 안쪽은 음수, 바깥쪽은 양수 값을 가집니다. 이를 이용하면 해상도에 독립적인 고품질 벡터 그래픽(텍스트, 아이콘 등)을 효율적으로 렌더링할 수 있습니다.

---

### 1. 거리 계산 + `smoothstep` = 부드러운 경계

-   Fragment Shader에서 SDF 텍스처를 샘플링하면, 현재 픽셀이 경계선에서 얼마나 떨어져 있는지 알 수 있습니다. (이 값을 `dist`라고 합시다.)
-   경계선은 `dist = 0`인 지점입니다.

-   `step(0.0, dist)` 함수를 사용하면 `dist`가 0보다 클 때 1, 작을 때 0을 반환하여 날카로운 경계를 만들 수 있습니다.

-   여기에 `smoothstep`을 적용하면 부드러운 안티에일리어싱 경계를 만들 수 있습니다.
    ```glsl
    // SDF 텍스처에서 거리 값을 읽어옴
    float dist = texture(u_sdf_texture, v_texcoord).r;

    // 0.0을 경계로, 0.05의 폭을 가진 부드러운 경계를 생성
    // dist가 -0.05보다 작으면 0, 0.05보다 크면 1, 그 사이는 부드럽게 보간
    float alpha = smoothstep(-0.05, 0.05, dist);
    ```

### 2. 경계 폭을 픽셀 크기(fwidth)로 조절하는 기법

-   위 예제의 `-0.05, 0.05`처럼 고정된 폭을 사용하면 [[05-fragment-stage-lifecycle/3. 파생값 계산 (fwidth, dFdx dFdy)|확대/축소 시 경계가 흐려지거나 날카로워지는 문제]]가 발생합니다.

-   이 문제를 해결하기 위해 [[05-fragment-stage-lifecycle/3. 파생값 계산 (fwidth, dFdx dFdy)|fwidth]]를 사용하여 안티에일리어싱의 폭을 항상 1픽셀 크기에 맞게 동적으로 조절합니다.

    ```glsl
    // SDF 텍스처의 값은 보통 0~1 범위로 정규화되어 있음
    // 0.5를 경계선으로 사용한다고 가정
    float dist = texture(u_sdf_texture, v_texcoord).r - 0.5;

    // 현재 픽셀에서 dist 값의 변화량(1픽셀 너비)을 계산
    float width = fwidth(dist);

    // 0을 중심으로 1픽셀 너비의 부드러운 경계를 만듦
    float alpha = smoothstep(-width, width, dist);

    // 최종 색상과 알파 값 출력
    fragColor = vec4(u_color, alpha);
    ```

-   **핵심 원리**: `fwidth(dist)`는 SDF가 화면에 얼마나 확대/축소되었는지를 반영합니다. SDF가 크게 확대되면 `fwidth(dist)` 값은 작아지고, 작게 축소되면 값은 커집니다. `smoothstep`의 경계 구간이 이 변화에 맞춰 자동으로 조절되기 때문에, 결과적으로 항상 일정한 두께의 선명한 경계선이 유지됩니다.

-   이 기법은 Matt DesLauriers의 "Stylized antialiasing" 글에서 대중화되었으며, 현대 UI 및 텍스트 렌더링의 핵심적인 기술입니다.
