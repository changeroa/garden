---
title: File Explorer Architecture
---

# 🗂️ File Explorer Architecture

파일 시스템 추상화와 상태 관리 아키텍처에 대한 문서입니다.

## 📚 [File Explorer Architecture - Home](🗂️-File-Explorer-Architecture---Home)

모듈화되고 확장 가능한 파일 탐색기 아키텍처의 전체 구조를 설명합니다.

## 📖 핵심 컴포넌트

### 1. [FsProvider - The Universal Adapter](1.-FsProvider---The-Universal-Adapter)
다양한 파일 시스템 백엔드를 통합하는 유니버설 어댑터 패턴
- 파일 시스템 추상화
- 플러그인 아키텍처
- 비동기 작업 처리

### 2. [FsNode & ID Strategy - The Identity Crisis](2.-FsNode-&-ID-Strategy---The-Identity-Crisis)
파일 시스템 노드의 고유 식별자 관리 전략
- ID 생성 및 관리
- 노드 메타데이터 구조
- 계층 구조 표현

### 3. [State Management - The Single Source of Truth](3.-State-Management---The-Single-Source-of-Truth)
중앙 집중식 상태 관리 시스템
- Redux 패턴 적용
- 불변성 보장
- 상태 동기화

### 4. [Services & Selectors - Helpers and Lenses](4.-Services-&-Selectors---Helpers-and-Lenses)
비즈니스 로직과 데이터 접근 레이어
- 서비스 레이어 패턴
- 선택자(Selector) 최적화
- 메모이제이션 전략

### 5. [Indexer - The Heavy Lifter (in the Basement)](5.-Indexer---The-Heavy-Lifter-(in-the-Basement).md)
백그라운드 인덱싱과 검색 시스템
- 비동기 인덱싱
- 검색 최적화
- 캐싱 전략

### 6. [Concurrency & Errors - The Safety Net](6.-Concurrency-&-Errors---The-Safety-Net)
동시성 제어와 에러 처리 메커니즘
- 작업 큐 관리
- 에러 복구 전략
- 트랜잭션 처리

## 🏗️ 아키텍처 특징

### 핵심 원칙
- **모듈성**: 각 컴포넌트가 독립적으로 동작
- **확장성**: 새로운 파일 시스템 쉽게 추가 가능
- **성능**: 지연 로딩과 가상 스크롤링
- **안정성**: 포괄적인 에러 처리

### 디자인 패턴
- Adapter Pattern (FsProvider)
- Repository Pattern (State Management)
- Service Layer Pattern (Services)
- Observer Pattern (Event System)

## 🎓 학습 경로

### 초급자
1. FsProvider 개념 이해
2. FsNode 구조 파악
3. 기본 상태 관리 흐름

### 중급자
1. Services & Selectors 활용
2. 인덱싱 시스템 이해
3. 비동기 작업 처리

### 고급자
1. 동시성 제어 구현
2. 커스텀 Provider 개발
3. 성능 최적화 전략

## 💡 Use Cases

- **웹 기반 파일 매니저**: 클라우드 스토리지 통합
- **코드 에디터**: 프로젝트 탐색기
- **CMS 시스템**: 미디어 라이브러리
- **데이터 브라우저**: 계층적 데이터 탐색

## 🔗 관련 프로젝트
- [Scope Management System](/scope-management/)
- [Interaction System](/interaction/)