# Scope Management System - Documentation Index

> **프로젝트**: IdealLM Frontend Scope Management Refactoring
> **버전**: 1.0.0
> **상태**: 설계 단계
> **예상 기간**: 6-8주

---

## 📚 문서 목록

### 🎯 시작하기

- **[00-overview.md](./00-overview)** - 프로젝트 전체 개요
  - 배경 및 현재 문제점
  - 목표 및 기대효과
  - 전체 로드맵
  - 핵심 메트릭

- **[01-architecture.md](./01-architecture)** - 시스템 아키텍처
  - 전체 아키텍처 다이어그램
  - 계층 구조 설명
  - 데이터 흐름
  - 설계 원칙

### 🚀 Phase별 구현 가이드

- **[02-phase1-performance.md](./02-phase1-performance)** - Phase 1: 성능 최적화
  - IScopeDetector 인터페이스
  - DOMScopeDetector 구현
  - MutationObserver 적용
  - 성능 벤치마크

- **[03-phase2-redux-integration.md](./03-phase2-redux-integration)** - Phase 2: Redux 통합
  - scopeSlice 설계
  - Selectors 구현
  - 양방향 동기화
  - Redux DevTools 연동

- **[04-phase3-react-hooks.md](./04-phase3-react-hooks)** - Phase 3: React Hooks
  - 기본 Hooks (useActiveScopes 등)
  - 고급 Hooks (useScopeTransition 등)
  - ScopeProvider 컴포넌트
  - 실제 사용 예시

- **[05-phase4-advanced-features.md](./05-phase4-advanced-features)** - Phase 4: 고급 기능
  - 동적 스코프 시스템
  - 스코프 분석 대시보드
  - AI 통합
  - 플러그인 시스템

### 🧪 테스트 및 품질

- **[06-testing-strategy.md](./06-testing-strategy)** - 테스트 전략
  - 단위 테스트
  - 통합 테스트
  - E2E 테스트
  - 성능 테스트

### 🔧 실무 적용

- **[07-migration-guide.md](./07-migration-guide)** - 마이그레이션 가이드
  - 단계별 마이그레이션
  - Breaking Changes
  - 호환성 레이어
  - 롤백 전략

- **[08-api-reference.md](./08-api-reference)** - API 레퍼런스
  - Interfaces 완전 문서화
  - Classes 상세 설명
  - React Hooks API
  - Redux Actions/Selectors
  - 사용 예시

### 📊 부가 자료

- **[09-troubleshooting.md](./09-troubleshooting)** - 트러블슈팅
  - 일반적인 문제
  - 성능 이슈
  - 통합 문제
  - FAQ

- **[10-performance-benchmarks.md](./10-performance-benchmarks)** - 성능 벤치마크
  - 벤치마크 방법론
  - 측정 결과
  - 비교 분석
  - 최적화 가이드

### 💡 예제 코드

- **[examples/basic-usage.md](./examples/basic-usage)** - 기본 사용법
- **[examples/advanced-patterns.md](./examples/advanced-patterns)** - 고급 패턴
- **[examples/integration-examples.md](./examples/integration-examples)** - 통합 예시

---

## 🗺️ 읽기 가이드

### 처음 시작하는 경우

```
1. 00-overview.md          ← 프로젝트 이해
2. 01-architecture.md      ← 구조 파악
3. 08-api-reference.md     ← API 학습
4. examples/basic-usage.md ← 실습
```

### 구현하는 경우

```
Phase 1 (Week 1-2):
  1. 02-phase1-performance.md
  2. 06-testing-strategy.md
  3. examples/basic-usage.md

Phase 2 (Week 3-4):
  1. 03-phase2-redux-integration.md
  2. 08-api-reference.md (Redux 섹션)
  3. examples/integration-examples.md

Phase 3 (Week 5-6):
  1. 04-phase3-react-hooks.md
  2. 08-api-reference.md (Hooks 섹션)
  3. examples/advanced-patterns.md

Phase 4 (Week 7-8):
  1. 05-phase4-advanced-features.md
  2. 10-performance-benchmarks.md
```

### 문제 해결이 필요한 경우

```
1. 09-troubleshooting.md   ← 일반적인 문제
2. 08-api-reference.md     ← API 확인
3. GitHub Issues           ← 커뮤니티 지원
```

---

## 📊 프로젝트 상태

### 현재 진행 상황

| Phase | 상태 | 진행률 | 예상 완료 |
|-------|------|--------|-----------|
| Phase 0: 문서화 | ✅ 완료 | 100% | 2025-01-09 |
| Phase 1: 성능 최적화 | 📝 설계 | 0% | Week 1-2 |
| Phase 2: Redux 통합 | 📝 설계 | 0% | Week 3-4 |
| Phase 3: React Hooks | 📝 설계 | 0% | Week 5-6 |
| Phase 4: 고급 기능 | 📝 설계 | 0% | Week 7-8 |

### 핵심 메트릭 목표

```
✅ DOM 쿼리: 560/sec → <10/sec (99% 감소)
✅ 응답 지연: 100ms → <16ms
✅ 테스트 커버리지: 0% → 80%
✅ 타입 안전성: 100% (유지)
```

---

## 🚀 Quick Start

### 1분 요약

```bash
# 1. 문서 읽기
cat docs/scope-management/00-overview.md

# 2. 아키텍처 이해
cat docs/scope-management/01-architecture.md

# 3. Phase 1 시작
cat docs/scope-management/02-phase1-performance.md

# 4. API 참조
cat docs/scope-management/08-api-reference.md
```

### 5분 실습

```typescript
// 1. Detector 생성 (Phase 1)
import { DOMScopeDetector } from '@/engine/utils/scope';

const detector = new DOMScopeDetector({ debug: true });
detector.initialize();

// 2. Manager 생성
import { ScopeManager } from '@/engine/utils/ScopeManager';

const manager = new ScopeManager(detector);
manager.start();

// 3. 리스너 등록
manager.addEventListener((event) => {
  console.log('Scope changed:', event.currentScopes);
});

// 4. React에서 사용 (Phase 3)
import { useActiveScopes } from '@/hooks';

function MyComponent() {
  const activeScopes = useActiveScopes();
  return <div>{activeScopes.join(', ')}</div>;
}
```

---

## 🎯 핵심 개념

### Scope란?

```
Scope = 현재 UI 컨텍스트

예시:
- modal: 모달이 열려 있음
- editor: 에디터가 포커스됨
- canvas: 캔버스가 활성화됨
- global: 항상 활성 (기본)

용도:
- 컨텍스트별 단축키 활성화
- UI 표시/숨김 제어
- 기능 활성화/비활성화
```

### 왜 리팩토링이 필요한가?

```
Before:
  - DOM 폴링 (100ms)
  - 560 queries/sec
  - CPU 5%
  - 테스트 불가능

After:
  - 이벤트 기반
  - ~5 queries/sec
  - CPU <1%
  - 테스트 가능
```

### 주요 변경사항

```
1. DOM 폴링 → MutationObserver
2. 전역 의존성 → Dependency Injection
3. 독립적 시스템 → Redux 통합
4. 명령형 API → React Hooks
```

---

## 📖 용어집

| 용어 | 설명 |
|------|------|
| **Scope** | UI 컨텍스트 (modal, editor, canvas 등) |
| **Detector** | 스코프를 감지하는 컴포넌트 |
| **Manager** | 스코프를 관리하는 중앙 조율자 |
| **Transition** | 스코프 전환 이벤트 |
| **DI** | Dependency Injection (의존성 주입) |
| **MutationObserver** | DOM 변화 감지 Web API |

---

## 🔗 관련 리소스

### 내부 문서
- [CLAUDE.md](../../CLAUDE) - 프로젝트 전체 가이드
- [SCOPE_MANAGEMENT_ANALYSIS.md](../UX/SCOPE_MANAGEMENT_ANALYSIS) - 현재 시스템 분석

### 외부 참고
- [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hooks](https://react.dev/reference/react)

---

## 🤝 기여하기

### 문서 개선

```bash
# 1. 브랜치 생성
git checkout -b docs/scope-improve-{topic}

# 2. 문서 수정
vim docs/scope-management/{file}.md

# 3. 커밋 및 PR
git add docs/
git commit -m "docs(scope): improve {topic} documentation"
git push origin docs/scope-improve-{topic}
```

### 피드백

- GitHub Issues: 버그 리포트, 기능 제안
- Pull Requests: 코드 기여
- Discussions: 질문, 아이디어 공유

---

## ❓ FAQ

**Q: 어떤 문서부터 읽어야 하나요?**
A: `00-overview.md` → `01-architecture.md` → 해당 Phase 문서 순서로 읽으세요.

**Q: Phase별 예상 시간은?**
A: 각 Phase 1-2주씩, 총 6-8주 예상입니다.

**Q: 기존 코드와 호환되나요?**
A: Phase 1은 하위 호환성 유지, 이후 점진적 마이그레이션입니다.

**Q: 테스트는 어떻게 하나요?**
A: `06-testing-strategy.md` 참조하세요.

**Q: 성능이 얼마나 개선되나요?**
A: DOM 쿼리 99% 감소, 응답 지연 84% 감소 예상입니다.

---

## 📝 업데이트 로그

### 2025-01-09
- ✅ 전체 문서 구조 생성
- ✅ Phase 1-4 가이드 작성
- ✅ API Reference 완성
- ✅ 예제 코드 추가

---

**시작**: [00-overview.md](./00-overview) - 프로젝트 개요부터 시작하세요!
