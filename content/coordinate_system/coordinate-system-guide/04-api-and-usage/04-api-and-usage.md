# 04. API 및 활용

## 🎯 이 개념의 위치
-   **상위:** [.[../coordinate-transform-master-guide]]
-   **하위:** [.[04-api-and-usage/coordinate-transform-api]], [.[04-api-and-usage/delta-transform-api]], [.[04-api-and-usage/utility-methods]]

## 📖 개념 설명
`CoordinateTransform` 클래스를 실제로 사용하는 방법을 배웁니다. 개발자가 외부에서 호출할 수 있는 공개 메서드(Public API)들의 종류와 각각의 사용법을 익힙니다.

## 🗺️ 하위 구성요소
-   [.[04-api-and-usage/coordinate-transform-api]]: `screenToWorld`와 `worldToScreen` 같이 가장 핵심적인 좌표 변환 함수들입니다.
-   [.[04-api-and-usage/delta-transform-api]]: 좌표의 절대 위치가 아닌, 변화량(delta)을 변환하는 방법을 다룹니다. (예: 마우스 드래그 거리)
-   [.[04-api-and-usage/utility-methods]]: 특정 좌표가 화면에 보이는지 확인하거나, 특정 영역을 화면에 꽉 채우는 줌 값을 계산하는 등 유용한 보조 함수들입니다.