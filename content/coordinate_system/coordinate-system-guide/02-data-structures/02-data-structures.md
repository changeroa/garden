# 02. 자료 구조

## 🎯 이 개념의 위치
-   **상위:** [.[../coordinate-transform-master-guide]]
-   **하위:** [.[02-data-structures/point-interface]], [.[02-data-structures/viewport-interface]], [.[02-data-structures/transform-matrix-interface]]

## 📖 개념 설명
좌표계 변환에 사용되는 데이터의 형태를 정의합니다. TypeScript의 인터페이스를 통해 각 데이터 덩어리가 어떤 정보를 담고 있는지 명확하게 알 수 있습니다.

## 🗺️ 하위 구성요소
-   [.[02-data-structures/point-interface]]: 2D 공간의 한 점(x, y)을 나타냅니다.
-   [.[02-data-structures/viewport-interface]]: 현재 화면이 월드의 어느 부분을, 어떤 배율로 보여주는지 정의합니다.
-   [.[02-data-structures/transform-matrix-interface]]: 2D 변환(이동, 크기, 회전)을 표현하는 행렬의 구조를 정의합니다.