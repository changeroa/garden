# 좌표계 변환 마스터 가이드

이 가이드는 그래픽 렌더링, 지도, 게임 개발 등에서 필수적인 좌표계 변환의 원리를 `CoordinateTransform` 클래스 예제를 통해 학습합니다.

## 🎯 학습 로드맵
1.  **개념 이해**: [.[01-core-concepts/understanding-coordinate-systems]] → [.[01-core-concepts/matrix-transformation-basics]]
2.  **기본 구성**: [.[02-data-structures/02-data-structures]] → [.[03-transform-engine/coordinate-transform-class]]
3.  **핵심 API**: [.[04-api-and-usage/coordinate-transform-api]] → [.[04-api-and-usage/delta-transform-api]]
4.  **심화 활용**: [.[05-advanced-topics/browser-integration]] → [.[04-api-and-usage/utility-methods]]

## 📊 개념 의존성 그래프
```
      [좌표계 변환 마스터 가이드]
              │
              ├─> [[01-core-concepts]]
              │   ├─> 좌표계의 이해
              │   └─> 행렬 변환의 기초
              │
              ├─> [[02-data-structures]]
              │   └─> Point, Viewport
              │
              ├─> [[03-transform-engine]]
              │   ├─> CoordinateTransform 클래스
              │   └─> 행렬 업데이트 로직
              │
              ├─> [[04-api-and-usage]]
              │   ├─> screenToWorld/worldToScreen
              │   └─> 유틸리티 메서드
              │
              └─> [[05-advanced-topics]]
                  └─> DevicePixelRatio, DOM 연동
```

## 🔗 핵심 영역 바로가기
-   [.[01-core-concepts/understanding-coordinate-systems]] - 월드, 스크린 좌표계 등 기초 이론
-   [.[02-data-structures/02-data-structures]] - Point, Viewport 등 데이터 구조
-   [.[03-transform-engine/coordinate-transform-class]] - 변환 로직의 중심 클래스
-   [.[04-api-and-usage/coordinate-transform-api]] - 실제 좌표 변환 방법
-   [.[05-advanced-topics/browser-integration]] - 브라우저 환경과의 연동
