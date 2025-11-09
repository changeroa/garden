# Migration Guide - 마이그레이션 가이드

> 기존 시스템에서 새로운 Scope Management로 안전하게 전환하기

---

## 📋 목차

1. [마이그레이션 개요](#마이그레이션-개요)
2. [Phase별 마이그레이션](#phase별-마이그레이션)
3. [Breaking Changes](#breaking-changes)
4. [호환성 레이어](#호환성-레이어)
5. [롤백 전략](#롤백-전략)
6. [체크리스트](#체크리스트)

---

## 마이그레이션 개요

### 전략

```
점진적 마이그레이션 (Incremental Migration)

Week 1-2: Phase 1 (하위 호환)
  ✅ 기존 코드 동작 유지
  ✅ 성능만 개선

Week 3-4: Phase 2 (선택적 마이그레이션)
  ⚠️  Redux 통합 (기존 코드 영향 최소)

Week 5-6: Phase 3 (점진적 적용)
  ⚠️  새 컴포넌트만 React Hooks 사용

Week 7-8: Phase 4 (전체 전환)
  ⚠️  레거시 코드 리팩토링
```

### 위험도 평가

| Phase | 위험도 | 롤백 난이도 | 영향 범위 |
|-------|--------|-------------|-----------|
| Phase 1 | 🟢 낮음 | 쉬움 | 내부 구현만 |
| Phase 2 | 🟡 중간 | 보통 | Redux 추가 |
| Phase 3 | 🟡 중간 | 보통 | 신규 컴포넌트 |
| Phase 4 | 🔴 높음 | 어려움 | 전체 시스템 |

---

## Phase별 마이그레이션

### Phase 1: 성능 최적화 (Week 1-2)

**목표**: 100% 하위 호환성 유지하며 성능만 개선

#### Step 1: 인터페이스 추가

```typescript
// 1. 새 파일 생성 (기존 코드 영향 없음)
src/engine/utils/scope/
  ├── IScopeDetector.ts         // 새로 생성
  ├── DOMScopeDetector.ts        // 새로 생성
  └── MockScopeDetector.ts       // 새로 생성
```

#### Step 2: ScopeManager 리팩토링

```typescript
// src/engine/utils/ScopeManager.ts

// ✅ Before (기존 코드)
export class ScopeManager {
  private autoDetectionInterval: number | null = null;

  startAutoDetection(intervalMs = 100): void {
    this.autoDetectionInterval = window.setInterval(() => {
      this.updateActiveScopes('auto-detection');
    }, intervalMs);
  }
}

// ✅ After (하위 호환 유지)
export class ScopeManager {
  constructor(
    private detector?: IEnhancedScopeDetector, // 선택적
    debug = false
  ) {
    // detector가 없으면 기존 방식 사용
    if (!detector) {
      this.detector = new DOMScopeDetector();
    }
  }

  // 기존 메서드는 그대로 유지
  startAutoDetection(intervalMs = 100): void {
    // 새 detector 사용하지만 API는 동일
    this.start(); // 내부적으로 detector.initialize() 호출
  }
}
```

#### Step 3: 점진적 배포

```typescript
// Option A: Feature Flag로 점진적 활성화
const USE_NEW_SCOPE_DETECTOR = process.env.VITE_USE_NEW_DETECTOR === 'true';

const detector = USE_NEW_SCOPE_DETECTOR
  ? new DOMScopeDetector()
  : null; // null이면 기존 방식

const manager = new ScopeManager(detector);

// Option B: 특정 인스턴스만 적용
const canvasManager = new ScopeManager(new DOMScopeDetector()); // 새 방식
const legacyManager = new ScopeManager(); // 기존 방식
```

#### 검증

```bash
# 1. 기존 테스트 모두 통과 확인
npm run test

# 2. 성능 벤치마크
npm run benchmark:scope

# 3. 프로덕션 모니터링
# - DOM 쿼리 감소 확인
# - 에러율 변화 없음 확인
# - CPU/메모리 사용량 감소 확인
```

---

### Phase 2: Redux 통합 (Week 3-4)

**목표**: Redux 추가하되 기존 코드는 동작 유지

#### Step 1: scopeSlice 추가

```typescript
// 1. Redux slice 추가 (기존 store에 영향 없음)
src/store/slices/scopeSlice.ts  // 새로 생성
src/store/selectors/scopeSelectors.ts  // 새로 생성

// 2. Store에 추가
// src/store/index.ts
import scopeReducer from './slices/scopeSlice';

export const store = configureStore({
  reducer: {
    // ... 기존 reducers
    scope: scopeReducer, // ✅ 추가 (기존 코드 영향 없음)
  },
});
```

#### Step 2: 양방향 동기화 (선택적)

```typescript
// src/engine/utils/ScopeManager.ts

export class ScopeManager {
  // Redux 통합은 선택적
  setupReduxSync(store: Store): void {
    // ScopeManager → Redux
    this.addEventListener((event) => {
      store.dispatch(
        scopeChanged({
          scopes: event.currentScopes,
          trigger: event.triggeredBy,
        })
      );
    });

    // Redux → ScopeManager
    store.subscribe(() => {
      const state = store.getState();
      if (state.ui.modals.activeModal) {
        this.detector.forceUpdate();
      }
    });
  }
}

// 사용 (선택적)
const manager = new ScopeManager(new DOMScopeDetector());
manager.setupReduxSync(store); // Redux 통합 활성화
```

#### 검증

```bash
# Redux DevTools에서 확인
# - scopeSlice 상태 확인
# - 스코프 변경 시 action 발생 확인
# - 히스토리 쌓이는지 확인
```

---

### Phase 3: React Hooks (Week 5-6)

**목표**: 새 컴포넌트만 Hooks 사용, 기존 컴포넌트는 유지

#### Step 1: Hooks 추가

```typescript
// 1. Hooks 파일 생성
src/hooks/
  ├── useActiveScopes.ts     // 새로 생성
  ├── useScopeCheck.ts       // 새로 생성
  ├── useScopeTransition.ts  // 새로 생성
  └── index.ts               // export
```

#### Step 2: 점진적 적용

```typescript
// ✅ 신규 컴포넌트: Hooks 사용
function NewModal() {
  const isModalActive = useScopeCheck('modal');

  useScopeRegistration('modal', {
    enabled: true,
  });

  return <div>...</div>;
}

// ✅ 기존 컴포넌트: 그대로 유지
function LegacyModal() {
  // 기존 로직 그대로
  useEffect(() => {
    // 기존 이벤트 핸들링
  }, []);

  return <div>...</div>;
}
```

#### 마이그레이션 우선순위

```
1. 새로 추가되는 컴포넌트 → Hooks 사용
2. 자주 수정되는 컴포넌트 → 리팩토링 시 Hooks 적용
3. 안정적인 레거시 컴포넌트 → 나중에 또는 안 함
```

---

## Breaking Changes

### Phase 1: 없음

Phase 1은 100% 하위 호환성을 유지합니다.

### Phase 2: 최소

**변경 사항**:
```typescript
// Redux store에 scope slice 추가
// - 기존 코드에 영향 없음
// - localStorage persistence 추가 (선택적)
```

### Phase 3: 선택적

**선택적 마이그레이션**:
```typescript
// 기존: GlobalKeyboardManager 직접 사용
const manager = GlobalKeyboardManager.getInstance();

// 신규: React Hooks 사용
const activeScopes = useActiveScopes();
```

### Phase 4: 주의 필요

**Breaking**:
```typescript
// ❌ 제거 예정 (deprecated)
ScopeManager.startAutoDetection()

// ✅ 새 방식
ScopeManager.start()
```

---

## 호환성 레이어

### Adapter Pattern

```typescript
/**
 * 기존 API를 새 API로 변환
 */
class ScopeManagerAdapter {
  private newManager: ScopeManager;

  // 기존 API 유지
  startAutoDetection(intervalMs = 100): void {
    console.warn('startAutoDetection is deprecated. Use start() instead.');
    this.newManager.start();
  }

  stopAutoDetection(): void {
    console.warn('stopAutoDetection is deprecated. Use dispose() instead.');
    this.newManager.dispose();
  }

  // 새 API로 위임
  start(): void {
    this.newManager.start();
  }

  dispose(): void {
    this.newManager.dispose();
  }
}
```

---

## 롤백 전략

### Phase 1 롤백

```typescript
// Feature Flag로 즉시 롤백 가능
const USE_NEW_DETECTOR = false; // true → false로 변경

const manager = USE_NEW_DETECTOR
  ? new ScopeManager(new DOMScopeDetector())
  : new ScopeManager(); // 기존 방식으로 복귀
```

### Phase 2 롤백

```typescript
// Redux 통합 비활성화
const manager = new ScopeManager(new DOMScopeDetector());
// manager.setupReduxSync(store); // 주석 처리

// scopeSlice는 남겨둬도 무방 (사용 안 하면 영향 없음)
```

### Phase 3 롤백

```typescript
// Hooks 사용 컴포넌트만 개별 롤백
function MyComponent() {
  // ❌ Hooks 방식
  // const activeScopes = useActiveScopes();

  // ✅ 기존 방식
  const [activeScopes, setActiveScopes] = useState<Scope[]>(['global']);

  useEffect(() => {
    const manager = GlobalKeyboardManager.getInstance();
    const scopeManager = manager.getScopeManager();

    const unsubscribe = scopeManager.addEventListener((event) => {
      setActiveScopes(event.currentScopes);
    });

    return unsubscribe;
  }, []);

  return <div>{activeScopes.join(', ')}</div>;
}
```

---

## 체크리스트

### Phase 1 완료 기준

- [ ] IScopeDetector 인터페이스 정의
- [ ] DOMScopeDetector 구현
- [ ] ScopeManager 리팩토링 (하위 호환)
- [ ] 단위 테스트 작성 (커버리지 80%+)
- [ ] 성능 벤치마크 통과 (DOM 쿼리 <10/sec)
- [ ] 기존 테스트 모두 통과
- [ ] 프로덕션 모니터링 1주일 (에러 없음)

### Phase 2 완료 기준

- [ ] scopeSlice 생성
- [ ] Selectors 작성
- [ ] Redux 양방향 동기화 구현
- [ ] Redux DevTools 통합 확인
- [ ] 통합 테스트 작성
- [ ] 기존 기능 정상 동작 확인

### Phase 3 완료 기준

- [ ] 모든 React Hooks 구현
- [ ] ScopeProvider 컴포넌트 구현
- [ ] 최소 3개 이상 컴포넌트에 적용
- [ ] Hook 테스트 작성
- [ ] 문서화 완료

### Phase 4 완료 기준

- [ ] 레거시 코드 제거
- [ ] Deprecated API 제거
- [ ] 전체 테스트 커버리지 80%+
- [ ] 성능 목표 달성
- [ ] 프로덕션 배포

---

## 마이그레이션 타임라인

```
Week 1:  IScopeDetector + DOMScopeDetector 구현
Week 2:  테스트 작성 + 프로덕션 배포 (Feature Flag)
Week 3:  Redux 통합
Week 4:  Redux 테스트 + 안정화
Week 5:  React Hooks 구현
Week 6:  신규 컴포넌트 적용
Week 7:  레거시 리팩토링
Week 8:  최종 검증 + 문서화
```

---

**관련 문서**:
- [00-overview.md](./00-overview) - 프로젝트 개요
- [06-testing-strategy.md](./06-testing-strategy) - 테스트 전략
