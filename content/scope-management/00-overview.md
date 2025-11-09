# Scope Management System - 프로젝트 개요

> **버전**: 1.0.0
> **최종 수정**: 2025-01-09
> **상태**: 설계 단계
> **담당**: Frontend Team

---

## 📋 목차

1. [프로젝트 배경](#프로젝트-배경)
2. [현재 문제점](#현재-문제점)
3. [목표 및 기대효과](#목표-및-기대효과)
4. [전체 로드맵](#전체-로드맵)
5. [핵심 메트릭](#핵심-메트릭)
6. [문서 구조](#문서-구조)

---

## 프로젝트 배경

### IdealLM 프로젝트 특성

**IdealLM Frontend**는 AI 컨텍스트 준비를 위한 대규모 데이터 구조화 도구입니다.

```
핵심 목표:
- 10,000+ 피스 동시 처리
- 복잡한 UI 컨텍스트 (Canvas, Editor, Chat, Sidebar, Modals)
- 멀티 인스턴스 지원 (여러 캔버스 워크스페이스)
- 엔터프라이즈급 안정성 및 성능
```

### 현재 Scope 시스템

현재 프로젝트에는 **키보드 단축키를 위한 Scope 관리 시스템**이 구현되어 있습니다:

```typescript
// 현재 구조
GlobalKeyboardManager (싱글톤)
  └── ScopeManager (내부 전용)
      ├── DOM 폴링 (100ms 간격)
      ├── 7개 스코프 타입
      └── 자동 감지 조건
```

**주요 컴포넌트**:
- `ScopeManager`: DOM 기반 스코프 자동 감지
- `GlobalKeyboardManager`: 전역 키보드 이벤트 라우팅
- `KeyboardManager`: 개별 단축키 관리
- `InstanceManager`: 멀티 인스턴스 조율

**장점**:
- ✅ 중앙 집중식 관리
- ✅ 멀티 인스턴스 지원
- ✅ 확장 가능한 구조
- ✅ 타입 안전성

**단점**:
- ❌ DOM 폴링 (초당 560회 쿼리)
- ❌ React와 통합 부족
- ❌ 테스트 불가능 (전역 의존성)
- ❌ 미사용 기능 다수

---

## 현재 문제점

### 1. 성능 문제 ⚠️ 긴급

**DOM 폴링의 비효율성**:

```typescript
// 현재 코드 (ScopeManager.ts:569)
startAutoDetection(intervalMs = 100): void {
  this.autoDetectionInterval = window.setInterval(() => {
    this.updateActiveScopes('auto-detection');
  }, 100); // 초당 10회 실행
}

// 각 실행마다:
// - 7개 스코프 × 평균 8개 선택자 = 56회 DOM 쿼리
// - 초당 560회 DOM 쿼리 🔥
```

**측정 결과**:
```
┌─────────────────┬──────────────┬──────────────┐
│ 메트릭          │ 현재 상태     │ 목표         │
├─────────────────┼──────────────┼──────────────┤
│ DOM 쿼리/초     │ 560회        │ <10회        │
│ 응답 지연       │ 100ms        │ <16ms        │
│ CPU 사용률      │ ~5%          │ <1%          │
│ 메모리 누수     │ 가능성 있음   │ 없음         │
└─────────────────┴──────────────┴──────────────┘
```

### 2. React 통합 부족 🔶 중요

**현재 상황**:
- Redux에 `ui.modals.activeModal` 등의 상태 존재
- ScopeManager는 DOM만 감지 (Redux 무시)
- React 컴포넌트에서 스코프 정보 접근 불가
- 상태 중복 및 불일치 발생 가능

**예시**:
```typescript
// Redux에는 모달이 열려 있음
store.getState().ui.modals.activeModal === 'settings'

// 하지만 ScopeManager는 모를 수도 있음 (DOM 렌더링 타이밍 차이)
scopeManager.getActiveScopes() // ['canvas', 'global']

// 결과: 단축키가 잘못된 컨텍스트에서 실행됨 ❌
```

### 3. 테스트 불가능 🔶 중요

**전역 의존성 문제**:

```typescript
// ScopeManager.ts:198
private isModalActive(): boolean {
  // ❌ document에 강결합
  const modal = document.querySelector('[role="dialog"]');
  // ...
}

// 테스트하려면:
// 1. JSDOM 설정 필요
// 2. 실제 DOM 구조 생성 필요
// 3. 싱글톤 상태 오염 문제
// 4. 비동기 타이밍 이슈
```

**현재 테스트 커버리지**: **0%**

### 4. 미사용 코드 🟢 낮음

**실제 사용률**:
```typescript
// 7개 스코프 중 2개만 실제 사용
const USED_SCOPES = ['canvas', 'global'];
const UNUSED_SCOPES = ['modal', 'overlay', 'tooltip', 'editor', 'sidebar'];

// 83회 단축키 등록 중 5개만 실제 사용
const REGISTERED_SHORTCUTS = {
  'select-all': 'Ctrl+A',
  'clear-selection': 'Escape',
  'delete-selected': 'Delete',
  'pan-modifier-down': 'Space',
  'pan-modifier-up': 'Space (keyup)',
};
```

**문제**:
- 불필요한 DOM 쿼리 지속 (5개 미사용 스코프)
- 코드 복잡도 증가
- 유지보수 비용

---

## 목표 및 기대효과

### 핵심 목표

```
1. 성능 최적화 (P0 - 최우선)
   - DOM 쿼리: 560회/초 → 5회/초 (99% 감소)
   - 응답 지연: 100ms → <16ms (즉시 반응)
   - 메모리 누수 제거

2. React 통합 (P1 - 중요)
   - Redux와 양방향 동기화
   - React Hook 제공 (useActiveScopes 등)
   - 선언적 API (ScopeProvider)

3. 테스트 가능성 (P1 - 중요)
   - Dependency Injection
   - Mock Detector 제공
   - 테스트 커버리지 80%+

4. 실용성 개선 (P2 - 중간)
   - 미사용 스코프 활성화
   - 컨텍스트별 UX 차별화
   - 스코프 분석 대시보드
```

### 기대 효과

**성능 개선**:
```
┌─────────────────────┬──────────┬──────────┬─────────┐
│ 메트릭              │ Before   │ After    │ 개선율   │
├─────────────────────┼──────────┼──────────┼─────────┤
│ DOM 쿼리/초         │ 560      │ 5        │ 99.1%   │
│ 스코프 변경 지연    │ 100ms    │ <16ms    │ 84%     │
│ CPU 사용률          │ ~5%      │ <1%      │ 80%     │
│ 배터리 영향         │ 중간     │ 낮음     │ -       │
└─────────────────────┴──────────┴──────────┴─────────┘
```

**개발 생산성**:
```typescript
// Before: 스코프 정보 접근 불가
// 😢 어렵고 복잡함

// After: React Hook으로 간단히 접근
function MyComponent() {
  const isEditorActive = useScopeCheck('editor');
  return isEditorActive ? <EditorTools /> : null;
}
```

**코드 품질**:
```
- 타입 안전성: 100% (이미 달성)
- 테스트 커버리지: 0% → 80%
- 순환 복잡도: 감소
- 유지보수성: 향상
```

---

## 전체 로드맵

### Timeline Overview

```
┌────────────────────────────────────────────────────────────┐
│                      6-8주 개발 계획                        │
└────────────────────────────────────────────────────────────┘

Week 1-2: Phase 1 - 성능 최적화
  ├── IScopeDetector 인터페이스 정의
  ├── DOMScopeDetector 구현 (MutationObserver)
  ├── ScopeManager 리팩토링
  └── 성능 벤치마크 추가

Week 3-4: Phase 2 - Redux 통합
  ├── scopeSlice 생성
  ├── Selectors 작성
  ├── ScopeManager ↔ Redux 양방향 동기화
  └── Redux DevTools 연동

Week 5-6: Phase 3 - React Hooks
  ├── 기본 Hooks (useActiveScopes, useScopeCheck)
  ├── 고급 Hooks (useScopeTransition, useScopePerformance)
  ├── ScopeProvider 컴포넌트
  └── 실제 컴포넌트 적용

Week 7-8: Phase 4 - 고급 기능
  ├── 미사용 스코프 활성화
  ├── 스코프 분석 대시보드
  ├── 동적 스코프 시스템
  └── 문서화 완성
```

### 우선순위 매트릭스

| Phase | 작업 | 긴급성 | 영향도 | 복잡도 | 우선순위 | 예상시간 |
|-------|------|--------|--------|--------|----------|----------|
| 1 | DOM 폴링 제거 | 🔴 높음 | 🔴 높음 | 🟡 중간 | **P0** | 1-2주 |
| 2 | Redux 통합 | 🟡 중간 | 🔴 높음 | 🟢 낮음 | **P1** | 1-2주 |
| 2 | 테스트 인프라 | 🟡 중간 | 🔴 높음 | 🟡 중간 | **P1** | 1주 |
| 3 | React Hooks | 🟢 낮음 | 🟡 중간 | 🟢 낮음 | **P2** | 1-2주 |
| 4 | 미사용 스코프 | 🟢 낮음 | 🟡 중간 | 🟡 중간 | **P2** | 1주 |
| 4 | 동적 스코프 | 🟢 낮음 | 🟢 낮음 | 🔴 높음 | **P3** | 2주 |

---

## 핵심 메트릭

### 성능 KPI

```typescript
interface PerformanceKPI {
  // 핵심 성능
  domQueriesPerSecond: number;      // 목표: <10 (현재: 560)
  scopeChangeLatency: number;       // 목표: <16ms (현재: 100ms)
  memoryUsage: number;              // 목표: <100KB

  // 안정성
  errorRate: number;                // 목표: <0.01%
  uptime: number;                   // 목표: 99.9%

  // 사용성
  testCoverage: number;             // 목표: >80% (현재: 0%)
  typeErrors: number;               // 목표: 0
}
```

### 품질 지표

```typescript
interface QualityMetrics {
  // 코드 품질
  cyclomaticComplexity: number;     // 목표: <10
  maintainabilityIndex: number;     // 목표: >70

  // 문서화
  apiDocumentation: number;         // 목표: 100%
  codeComments: number;             // 목표: >20%

  // 사용성
  reactIntegration: boolean;        // 목표: true
  reduxIntegration: boolean;        // 목표: true
  hookSupport: boolean;             // 목표: true
}
```

---

## 문서 구조

### 전체 문서 맵

```
docs/scope-management/
│
├── 00-overview.md (현재 파일)
│   └── 프로젝트 전체 개요, 배경, 목표
│
├── 01-architecture.md
│   ├── 시스템 아키텍처
│   ├── 데이터 흐름
│   ├── 컴포넌트 다이어그램
│   └── 설계 원칙
│
├── 02-phase1-performance.md
│   ├── MutationObserver 구현
│   ├── IScopeDetector 인터페이스
│   ├── DOMScopeDetector 구현
│   └── 성능 벤치마크
│
├── 03-phase2-redux-integration.md
│   ├── scopeSlice 설계
│   ├── Selectors 구현
│   ├── 양방향 동기화
│   └── Redux DevTools 연동
│
├── 04-phase3-react-hooks.md
│   ├── 기본 Hooks
│   ├── 고급 Hooks
│   ├── ScopeProvider
│   └── 실제 사용 예시
│
├── 05-phase4-advanced-features.md
│   ├── 동적 스코프 시스템
│   ├── 스코프 분석
│   ├── AI 통합
│   └── 플러그인 시스템
│
├── 06-testing-strategy.md
│   ├── 단위 테스트
│   ├── 통합 테스트
│   ├── E2E 테스트
│   └── 성능 테스트
│
├── 07-migration-guide.md
│   ├── 단계별 마이그레이션
│   ├── Breaking Changes
│   ├── 호환성 레이어
│   └── 롤백 전략
│
├── 08-api-reference.md
│   ├── Interfaces
│   ├── Classes
│   ├── Hooks
│   └── Utilities
│
├── 09-troubleshooting.md
│   ├── 일반적인 문제
│   ├── 성능 이슈
│   ├── 통합 문제
│   └── FAQ
│
├── 10-performance-benchmarks.md
│   ├── 벤치마크 방법론
│   ├── 측정 결과
│   ├── 비교 분석
│   └── 최적화 가이드
│
└── examples/
    ├── basic-usage.md
    ├── advanced-patterns.md
    └── integration-examples.md
```

### 문서 읽기 순서

**처음 시작하는 경우**:
```
1. 00-overview.md (현재 파일)
2. 01-architecture.md
3. 해당 Phase 문서 (02~05)
4. 08-api-reference.md
```

**구현하는 경우**:
```
1. 해당 Phase 문서 상세 읽기
2. examples/ 예제 코드 참고
3. 06-testing-strategy.md로 테스트 작성
4. 09-troubleshooting.md로 문제 해결
```

**유지보수하는 경우**:
```
1. 08-api-reference.md
2. 09-troubleshooting.md
3. 10-performance-benchmarks.md
```

---

## 빠른 시작

### 즉시 실행 가능한 작업 (Quick Wins)

**Week 1: 성능 개선 기초**
```bash
# 1. 브랜치 생성
git checkout -b feature/scope-performance-optimization

# 2. 인터페이스 정의
# src/engine/utils/scope/IScopeDetector.ts 생성

# 3. 벤치마크 추가
# src/engine/utils/scope/ScopePerformanceMonitor.ts 생성

# 4. 테스트
npm run test:unit
```

**Week 2: MutationObserver 구현**
```bash
# 1. DOMScopeDetector 구현
# src/engine/utils/scope/DOMScopeDetector.ts 생성

# 2. ScopeManager 리팩토링
# src/engine/utils/ScopeManager.ts 수정

# 3. 통합 테스트
# tests/unit/scope/DOMScopeDetector.test.ts 생성

# 4. 성능 측정
npm run benchmark:scope
```

---

## 성공 기준

### Phase 1 완료 기준

```typescript
✅ DOM 쿼리 <10회/초
✅ 응답 지연 <16ms
✅ 테스트 커버리지 >60%
✅ 성능 벤치마크 통과
✅ 메모리 누수 없음
```

### 전체 프로젝트 완료 기준

```typescript
✅ 모든 Phase 구현 완료
✅ 테스트 커버리지 >80%
✅ 프로덕션 배포 가능
✅ 문서화 100%
✅ 팀 리뷰 통과
```

---

## 참고 자료

### 관련 문서
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 전체 가이드
- [SCOPE_MANAGEMENT_ANALYSIS.md](../UX/SCOPE_MANAGEMENT_ANALYSIS.md) - 현재 시스템 분석
- [GLOBAL_SCOPE_MANAGER_QUESTIONS.md](../UX/GLOBAL_SCOPE_MANAGER_QUESTIONS.md) - 설계 질문서

### 기술 스택
- React 19.1.0
- TypeScript 5.8.3
- Redux Toolkit 2.8.2
- Vitest (테스트)

### 외부 참고
- [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Hooks Best Practices](https://react.dev/reference/react)

---

## 연락처 및 지원

**질문 및 피드백**:
- GitHub Issues: [프로젝트 저장소]
- 팀 채널: [Slack/Discord]
- 이메일: [팀 이메일]

**기여 방법**:
1. 브랜치 생성: `feature/scope-{feature-name}`
2. 구현 및 테스트 작성
3. PR 생성 (리뷰어 지정)
4. 테스트 통과 확인
5. Merge

---

**다음 문서**: [01-architecture.md](./01-architecture.md) - 시스템 아키텍처 상세 설계
