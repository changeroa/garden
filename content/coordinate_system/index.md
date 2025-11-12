---
title: Coordinate Systems & Transformations
---

# 📐 좌표계 변환 시스템

2D/3D 좌표 변환과 뷰포트 관리를 위한 포괄적인 가이드입니다.

## 📚 [좌표계 변환 마스터 가이드](coordinate-system-guide/coordinate-transform-master-guide)

좌표계 변환의 핵심 개념부터 실제 구현까지 체계적으로 정리한 문서입니다.

## 📖 주요 섹션

### 01. 핵심 개념
- [핵심 개념 개요](coordinate-system-guide/01-core-concepts/01-core-concepts)
- [좌표계의 이해](coordinate-system-guide/01-core-concepts/understanding-coordinate-systems)
- [행렬 변환의 기초](coordinate-system-guide/01-core-concepts/matrix-transformation-basics)

### 02. 자료 구조
- [자료 구조 개요](coordinate-system-guide/02-data-structures/02-data-structures)
- [Point 인터페이스](coordinate-system-guide/02-data-structures/point-interface)
- [TransformMatrix 인터페이스](coordinate-system-guide/02-data-structures/transform-matrix-interface)
- [Viewport 인터페이스](coordinate-system-guide/02-data-structures/viewport-interface)

### 03. 변환 엔진
- [변환 엔진 개요](coordinate-system-guide/03-transform-engine/03-transform-engine)
- [CoordinateTransform 클래스](coordinate-system-guide/03-transform-engine/coordinate-transform-class)
- [생성자 및 초기화](coordinate-system-guide/03-transform-engine/constructor-and-initialization)
- [역행렬 계산](coordinate-system-guide/03-transform-engine/inverse-matrix-calculation)
- [행렬 업데이트 로직](coordinate-system-guide/03-transform-engine/matrix-update-logic)

### 04. API 및 활용
- [API 개요](coordinate-system-guide/04-api-and-usage/04-api-and-usage)

#### 좌표 변환 API
- [screenToWorld](coordinate-system-guide/04-api-and-usage/screenToWorld)
- [worldToScreen](coordinate-system-guide/04-api-and-usage/worldToScreen)
- [screenDeltaToWorld](coordinate-system-guide/04-api-and-usage/screenDeltaToWorld)
- [worldDeltaToScreen](coordinate-system-guide/04-api-and-usage/worldDeltaToScreen)

#### 뷰포트 관리
- [updateViewport](coordinate-system-guide/04-api-and-usage/updateViewport)
- [getViewport](coordinate-system-guide/04-api-and-usage/getViewport)
- [calculateZoomToFit](coordinate-system-guide/04-api-and-usage/calculateZoomToFit)

#### 행렬 연산
- [getViewMatrix](coordinate-system-guide/04-api-and-usage/getViewMatrix)
- [getInverseViewMatrix](coordinate-system-guide/04-api-and-usage/getInverseViewMatrix)

#### 유틸리티
- [isPointVisible](coordinate-system-guide/04-api-and-usage/isPointVisible)
- [getWorldBounds](coordinate-system-guide/04-api-and-usage/getWorldBounds)
- [setDebug](coordinate-system-guide/04-api-and-usage/setDebug)

### 05. 고급 주제
- [고급 주제 개요](coordinate-system-guide/05-advanced-topics/05-advanced-topics)
- [Canvas 경계 관리](coordinate-system-guide/05-advanced-topics/canvas-boundary-management)
- [DOM 이벤트 리스너](coordinate-system-guide/05-advanced-topics/dom-event-listeners)
- [DevicePixelRatio 처리](coordinate-system-guide/05-advanced-topics/device-pixel-ratio-handling)
- [브라우저 통합](coordinate-system-guide/05-advanced-topics/browser-integration)

## 💡 핵심 포인트
- [GEMINI 아키텍처 분석](GEMINI) - AI 관점에서 본 좌표계 시스템 설계

## 🎓 학습 경로

### 초급자
1. 좌표계의 이해 → 행렬 변환의 기초
2. Point, Viewport 인터페이스 이해
3. 기본 좌표 변환 API 활용

### 중급자
1. CoordinateTransform 클래스 구조 이해
2. 행렬 연산과 역행렬 계산
3. 델타 변환 API 활용

### 고급자
1. Canvas 경계 관리와 최적화
2. DevicePixelRatio 처리
3. 브라우저 이벤트 통합

## 🔗 관련 프로젝트
- [WebGL Rendering Pipeline](/realtime-rendering/)
- [WebGL Canvas Engine](/WebGLCanvasEngine/)