---
title: Coordinate Systems & Transformations
---

# 📐 좌표계 변환 시스템

2D/3D 좌표 변환과 뷰포트 관리를 위한 포괄적인 가이드입니다.

## 📚 [좌표계 변환 마스터 가이드](좌표계-학습-가이드/좌표계%20변환%20마스터%20가이드.md)

좌표계 변환의 핵심 개념부터 실제 구현까지 체계적으로 정리한 문서입니다.

## 📖 주요 섹션

### 01. 핵심 개념
- [핵심 개념 개요](좌표계-학습-가이드/01-핵심-개념/01-핵심-개념.md)
- [좌표계의 이해](좌표계-학습-가이드/01-핵심-개념/좌표계의%20이해.md)
- [행렬 변환의 기초](좌표계-학습-가이드/01-핵심-개념/행렬%20변환의%20기초.md)

### 02. 자료 구조
- [자료 구조 개요](좌표계-학습-가이드/02-자료-구조/02-자료-구조.md)
- [Point 인터페이스](좌표계-학습-가이드/02-자료-구조/Point%20인터페이스.md)
- [TransformMatrix 인터페이스](좌표계-학습-가이드/02-자료-구조/TransformMatrix%20인터페이스.md)
- [Viewport 인터페이스](좌표계-학습-가이드/02-자료-구조/Viewport%20인터페이스.md)

### 03. 변환 엔진
- [변환 엔진 개요](좌표계-학습-가이드/03-변환-엔진/03-변환-엔진.md)
- [CoordinateTransform 클래스](좌표계-학습-가이드/03-변환-엔진/CoordinateTransform%20클래스.md)
- [생성자 및 초기화](좌표계-학습-가이드/03-변환-엔진/생성자%20및%20초기화.md)
- [역행렬 계산](좌표계-학습-가이드/03-변환-엔진/역행렬%20계산.md)
- [행렬 업데이트 로직](좌표계-학습-가이드/03-변환-엔진/행렬%20업데이트%20로직.md)

### 04. API 및 활용
- [API 개요](좌표계-학습-가이드/04-API-및-활용/04-API-및-활용.md)

#### 좌표 변환 API
- [screenToWorld](좌표계-학습-가이드/04-API-및-활용/screenToWorld.md)
- [worldToScreen](좌표계-학습-가이드/04-API-및-활용/worldToScreen.md)
- [screenDeltaToWorld](좌표계-학습-가이드/04-API-및-활용/screenDeltaToWorld.md)
- [worldDeltaToScreen](좌표계-학습-가이드/04-API-및-활용/worldDeltaToScreen.md)

#### 뷰포트 관리
- [updateViewport](좌표계-학습-가이드/04-API-및-활용/updateViewport.md)
- [getViewport](좌표계-학습-가이드/04-API-및-활용/getViewport.md)
- [calculateZoomToFit](좌표계-학습-가이드/04-API-및-활용/calculateZoomToFit.md)

#### 행렬 연산
- [getViewMatrix](좌표계-학습-가이드/04-API-및-활용/getViewMatrix.md)
- [getInverseViewMatrix](좌표계-학습-가이드/04-API-및-활용/getInverseViewMatrix.md)

#### 유틸리티
- [isPointVisible](좌표계-학습-가이드/04-API-및-활용/isPointVisible.md)
- [getWorldBounds](좌표계-학습-가이드/04-API-및-활용/getWorldBounds.md)
- [setDebug](좌표계-학습-가이드/04-API-및-활용/setDebug.md)

### 05. 고급 주제
- [고급 주제 개요](좌표계-학습-가이드/05-고급-주제/05-고급-주제.md)
- [Canvas 경계 관리](좌표계-학습-가이드/05-고급-주제/Canvas%20경계%20관리.md)
- [DOM 이벤트 리스너](좌표계-학습-가이드/05-고급-주제/DOM%20이벤트%20리스너.md)
- [DevicePixelRatio 처리](좌표계-학습-가이드/05-고급-주제/DevicePixelRatio%20처리.md)
- [브라우저 통합](좌표계-학습-가이드/05-고급-주제/브라우저%20통합.md)

## 💡 핵심 포인트
- [GEMINI 아키텍처 분석](GEMINI.md) - AI 관점에서 본 좌표계 시스템 설계

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