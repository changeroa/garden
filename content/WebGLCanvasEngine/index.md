---
title: WebGL Canvas Engine
---

# ⚡ WebGL Canvas Engine

고성능 WebGL 렌더링 엔진 구현을 위한 기술 문서입니다.

## 📚 [Ubershader 마스터 가이드](Ubershader-Docs/Ubershader_마스터_가이드)

WebGL 셰이더 관리 시스템의 핵심인 Ubershader 아키텍처에 대한 포괄적인 문서입니다.

## 📖 주요 섹션

### 01. Core Concepts
- [Ubershader란 무엇인가](Ubershader-Docs/01-Core-Concepts/Ubershader란-무엇인가)
- [핵심 철학](Ubershader-Docs/01-Core-Concepts/핵심-철학)
- [주요 기술](Ubershader-Docs/01-Core-Concepts/주요-기술)

### 02. API Reference
- [UberShader 클래스](Ubershader-Docs/02-API-Reference/UberShader-클래스)
- [GLSL 셰이더](Ubershader-Docs/02-API-Reference/GLSL-셰이더)
- [인터페이스](Ubershader-Docs/02-API-Reference/인터페이스)

### 03. Functions
- [compile](Ubershader-Docs/03-Functions/compile) - 셰이더 컴파일
- [use](Ubershader-Docs/03-Functions/use) - 셰이더 활성화
- [setUniforms](Ubershader-Docs/03-Functions/setUniforms) - Uniform 값 설정
- [getUniformLocation](Ubershader-Docs/03-Functions/getUniformLocation) - Uniform 위치 조회
- [getAttributeLocation](Ubershader-Docs/03-Functions/getAttributeLocation) - Attribute 위치 조회
- [isReady](Ubershader-Docs/03-Functions/isReady) - 셰이더 준비 상태 확인
- [dispose](Ubershader-Docs/03-Functions/dispose) - 리소스 정리

### 04. Internal Helpers
- [compileShader](Ubershader-Docs/04-Internal-Helpers/compileShader) - 셰이더 컴파일 헬퍼
- [setupUniformsAndAttributes](Ubershader-Docs/04-Internal-Helpers/setupUniformsAndAttributes) - Uniform/Attribute 설정

## 💻 소스 코드
- [Ubershader.ts](Ubershader.ts) - TypeScript 구현체

## 💡 핵심 포인트
- [GEMINI 아키텍처 분석](GEMINI) - AI 관점에서 본 Ubershader 시스템 설계

## 🎓 학습 경로

### 초급자
1. Ubershader란 무엇인가 → 핵심 철학 이해
2. 기본 API 함수 활용 (compile, use, dispose)
3. 간단한 셰이더 작성 및 테스트

### 중급자
1. GLSL 셰이더 작성법
2. Uniform과 Attribute 관리
3. 셰이더 성능 최적화

### 고급자
1. 복잡한 셰이더 파이프라인 구축
2. 동적 셰이더 생성 및 관리
3. GPU 리소스 최적화

## 🚀 주요 특징

- **통합 셰이더 관리**: 하나의 클래스로 모든 셰이더 프로그램 관리
- **타입 안정성**: TypeScript를 통한 강력한 타입 체크
- **자동 리소스 관리**: 메모리 누수 방지를 위한 자동 정리
- **에러 처리**: 상세한 컴파일 에러 메시지
- **성능 최적화**: 캐싱과 지연 로딩을 통한 최적화

## 🔗 관련 프로젝트
- [좌표계 시스템](/coordinate_system/)
- [WebGL Rendering Pipeline](/realtime-rendering/)