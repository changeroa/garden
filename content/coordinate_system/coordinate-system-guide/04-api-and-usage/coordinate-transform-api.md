# 좌표 변환 API

## 🎯 이 개념의 위치
-   **상위:** [.[04-api-and-usage/04-api-and-usage]]
-   **하위:** [.[04-api-and-usage/screenToWorld]], [.[04-api-and-usage/worldToScreen]]
-   **관련:** [.[03-transform-engine/coordinate-transform-class]], [.[01-core-concepts/understanding-coordinate-systems]]

## 📖 개념 설명
`CoordinateTransform` 클래스의 가장 핵심적인 기능인, 두 좌표계 사이를 오가는 변환을 수행하는 메서드 그룹입니다. 이 API들을 통해 개발자는 내부의 복잡한 행렬 계산을 몰라도 쉽게 좌표 변환을 할 수 있습니다.

## 🗺️ 하위 구성요소
-   [.[04-api-and-usage/screenToWorld]]: 스크린(픽셀) 좌표를 월드 좌표로 변환합니다. "사용자가 화면의 여기를 클릭했는데, 이게 월드의 어디쯤일까?"에 대한 답을 줍니다.
-   [.[04-api-and-usage/worldToScreen]]: 월드 좌표를 스크린(픽셀) 좌표로 변환합니다. "월드에 있는 이 객체를 화면의 어디에 그려야 할까?"에 대한 답을 줍니다.

## 💡 실무 연결점
-   **마우스 이벤트 처리**: 사용자의 클릭, 마우스오버 등의 이벤트가 발생한 스크린 좌표를 `screenToWorld`로 변환하여 어떤 객체와 상호작용했는지 파악합니다.
-   **렌더링**: 게임 캐릭터, 지도 아이콘 등 월드 상의 모든 객체들의 위치를 `worldToScreen`으로 변환하여 캔버스 위의 정확한 위치에 그립니다.