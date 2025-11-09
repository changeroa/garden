# 03. 변환 엔진

## 🎯 이 개념의 위치
-   **상위:** [[/coordinate-transform-master-guide]]
-   **하위:** [[03-transform-engine/coordinate-transform-class]], [[03-transform-engine/matrix-update-logic]], [[03-transform-engine/inverse-matrix-calculation]]

## 📖 개념 설명
좌표계 변환의 모든 로직을 담고 있는 핵심 `CoordinateTransform` 클래스를 분석합니다. 이 클래스가 어떻게 뷰포트 정보와 행렬을 사용하여 실제 좌표 변환을 수행하는지 알아봅니다.

## 🗺️ 하위 구성요소
-   [[03-transform-engine/coordinate-transform-class]]: 전체 변환 로직을 캡슐화하는 메인 클래스입니다.
-   [[03-transform-engine/matrix-update-logic]]: 뷰포트가 변경될 때마다 변환 행렬을 새로 계산하는 과정입니다.
-   [[03-transform-engine/inverse-matrix-calculation]]: 스크린 좌표를 월드 좌표로 변환하는 데 사용되는 역행렬을 구하는 방법입니다.