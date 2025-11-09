# Scope Management System - 아키텍처 설계

> **버전**: 1.0.0
> **최종 수정**: 2025-01-09

---

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [계층 구조](#계층-구조)
3. [핵심 컴포넌트](#핵심-컴포넌트)
4. [데이터 흐름](#데이터-흐름)
5. [설계 원칙](#설계-원칙)
6. [확장 포인트](#확장-포인트)

---

## 시스템 개요

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   React      │  │   WebGL      │  │   UI         │       │
│  │  Components  │  │   Canvas     │  │  Components  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      Hook Layer                               │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  useActiveScopes                                       │  │
│  │  useScopeCheck                                         │  │
│  │  useScopeTransition                                    │  │
│  │  ScopeProvider                                         │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                     Redux Layer                               │
│                                                               │
│  ┌───────────────────┐   ┌───────────────────┐              │
│  │   scopeSlice      │   │   Selectors       │              │
│  │   - activeScopes  │   │   - memoized      │              │
│  │   - history       │   │   - optimized     │              │
│  │   - components    │   │                   │              │
│  └─────────┬─────────┘   └───────────────────┘              │
│            │                                                  │
└────────────┼──────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│                   Detection Layer                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ScopeManager                             │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │         IScopeDetector (Interface)             │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │                                                 │  │   │
│  │  │  ┌──────────────┐  ┌───────────┐  ┌─────────┐ │  │   │
│  │  │  │ DOM Detector │  │  Redux    │  │  Mock   │ │  │   │
│  │  │  │ (Production) │  │ Detector  │  │Detector │ │  │   │
│  │  │  └──────────────┘  └───────────┘  └─────────┘ │  │   │
│  │  │                                                 │  │   │
│  │  │  ┌──────────────────────────────────────────┐ │  │   │
│  │  │  │ Event Sources:                           │ │  │   │
│  │  │  │ - MutationObserver (DOM changes)        │ │  │   │
│  │  │  │ - FocusIn/FocusOut (focus tracking)     │ │  │   │
│  │  │  │ - Redux Subscribe (UI state)            │ │  │   │
│  │  │  │ - Fallback Polling (safety net)         │ │  │   │
│  │  │  └──────────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│                  Execution Layer                              │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      GlobalKeyboardManager (Singleton)               │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │        Scoped KeyboardManager Instances        │ │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │ │   │
│  │  │  │ Canvas   │  │ Editor   │  │ Sidebar  │    │ │   │
│  │  │  │ Manager  │  │ Manager  │  │ Manager  │    │ │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘    │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | 책임 | 기술 스택 |
|-------|------|-----------|
| **Application** | UI 렌더링, 사용자 인터랙션 | React, WebGL |
| **Hook** | React 통합, 선언적 API | Custom Hooks |
| **Redux** | 상태 저장, 히스토리 관리 | Redux Toolkit |
| **Detection** | 스코프 감지, 이벤트 발생 | MutationObserver, Events |
| **Execution** | 단축키 실행, 라우팅 | 기존 KeyboardManager |

---

## 계층 구조

### 1. Detection Layer (감지 계층)

**핵심 책임**: 현재 UI 상태를 감지하여 활성 스코프 결정

```typescript
/**
 * Detection Layer Architecture
 */

// 1. IScopeDetector Interface (추상화)
interface IScopeDetector {
  isModalActive(): boolean;
  isEditorFocused(): boolean;
  // ... 7가지 스코프 감지 메서드
}

// 2. DOMScopeDetector (프로덕션 구현체)
class DOMScopeDetector implements IScopeDetector {
  private mutationObserver: MutationObserver;
  private focusListeners: EventListener[];

  // 이벤트 기반 감지
  private setupMutationObserver(): void { /* ... */ }
  private setupFocusEvents(): void { /* ... */ }

  // 스코프 계산
  computeActiveScopes(): Scope[] { /* ... */ }
}

// 3. ReduxScopeDetector (Redux 통합)
class ReduxScopeDetector implements IScopeDetector {
  constructor(private store: Store) {}

  isModalActive(): boolean {
    return this.store.getState().ui.modals.activeModal !== null;
  }
}

// 4. MockScopeDetector (테스트용)
class MockScopeDetector implements IScopeDetector {
  private mockState = { modalActive: false };

  setMockModal(active: boolean) {
    this.mockState.modalActive = active;
  }

  isModalActive(): boolean {
    return this.mockState.modalActive;
  }
}
```

**장점**:
- ✅ Dependency Injection으로 테스트 가능
- ✅ 다양한 감지 방법 조합 가능
- ✅ 프로덕션/테스트 환경 분리

### 2. Redux Layer (상태 계층)

**핵심 책임**: 스코프 상태 저장 및 히스토리 관리

```typescript
/**
 * Redux Layer Architecture
 */

// 1. State Shape
interface ScopeState {
  // 현재 활성 스코프 (우선순위 순)
  activeScopes: Scope[];

  // 스코프 전환 히스토리 (최근 50개)
  history: ScopeTransition[];

  // 컴포넌트별 등록 스코프 (선언적 API용)
  componentScopes: Record<string, {
    scope: Scope;
    componentId: string;
    mountedAt: number;
  }>;

  // 시스템 설정
  enabled: boolean;
  debug: boolean;
}

// 2. Actions
const scopeSlice = createSlice({
  name: 'scope',
  reducers: {
    // Detection Layer → Redux
    scopeChanged(state, action: PayloadAction<{
      scopes: Scope[];
      trigger: string;
    }>) { /* ... */ },

    // React Component → Redux
    registerComponentScope(state, action) { /* ... */ },
    unregisterComponentScope(state, action) { /* ... */ },
  }
});

// 3. Selectors (메모이제이션)
export const selectActiveScopes = (state: RootState) =>
  state.scope.activeScopes;

export const selectIsScopeActive = (scope: Scope) =>
  createSelector(
    selectActiveScopes,
    (scopes) => scopes.includes(scope)
  );
```

**장점**:
- ✅ 단일 진실의 원천 (Single Source of Truth)
- ✅ 타임 트래블 디버깅 (Redux DevTools)
- ✅ 영속화 가능 (localStorage)

### 3. Hook Layer (React 통합 계층)

**핵심 책임**: React 컴포넌트에 스코프 정보 제공

```typescript
/**
 * Hook Layer Architecture
 */

// 1. Basic Hooks (Redux Selector 래퍼)
function useActiveScopes(): Scope[] {
  return useSelector(selectActiveScopes);
}

function useScopeCheck(scope: Scope): boolean {
  return useSelector(selectIsScopeActive(scope));
}

// 2. Advanced Hooks (비즈니스 로직)
function useScopeTransition(
  callback: (prev: Scope[], current: Scope[]) => void
): void {
  const activeScopes = useActiveScopes();
  const prevScopesRef = useRef(activeScopes);

  useEffect(() => {
    if (/* changed */) {
      callback(prevScopesRef.current, activeScopes);
      prevScopesRef.current = activeScopes;
    }
  }, [activeScopes]);
}

// 3. Declarative Components
function ScopeProvider({ scope, children }) {
  const dispatch = useDispatch();
  const componentId = useId();

  useEffect(() => {
    dispatch(registerComponentScope({ componentId, scope }));
    return () => dispatch(unregisterComponentScope(componentId));
  }, [scope]);

  return <>{children}</>;
}
```

**장점**:
- ✅ 선언적 API
- ✅ React 생명주기와 통합
- ✅ 타입 안전성

---

## 핵심 컴포넌트

### ScopeManager (중앙 조율자)

```typescript
/**
 * ScopeManager - 중앙 조율 컴포넌트
 *
 * 역할:
 * 1. IScopeDetector로부터 스코프 변경 이벤트 수신
 * 2. Redux scopeSlice로 상태 전파
 * 3. GlobalKeyboardManager에 스코프 업데이트 알림
 */

class ScopeManager {
  constructor(
    private detector: IScopeDetector,
    private store?: Store // Redux 통합 시
  ) {}

  start(): void {
    // 1. Detector 초기화
    this.detector.initialize();

    // 2. Detector 이벤트 구독
    this.detector.onScopeChange((newScopes) => {
      this.handleScopeChange(newScopes);
    });

    // 3. Redux 양방향 동기화 (옵션)
    if (this.store) {
      this.setupReduxSync();
    }
  }

  private handleScopeChange(newScopes: Scope[]): void {
    // 1. 변경 사항 확인
    if (this.scopesEqual(this.activeScopes, newScopes)) return;

    // 2. 리스너 알림 (GlobalKeyboardManager 등)
    this.notifyListeners(newScopes);

    // 3. Redux 업데이트 (옵션)
    if (this.store) {
      this.store.dispatch(scopeChanged({
        scopes: newScopes,
        trigger: 'detector'
      }));
    }
  }

  private setupReduxSync(): void {
    // Redux → ScopeManager
    this.store!.subscribe(() => {
      const state = this.store!.getState();

      // UI 상태 변경 시 detector에 알림
      if (state.ui.modals.activeModal) {
        // Detector가 다시 계산하도록 트리거
        this.detector.forceUpdate();
      }
    });
  }
}
```

### DOMScopeDetector (이벤트 기반 감지)

```typescript
/**
 * DOMScopeDetector - 고성능 이벤트 기반 감지
 *
 * 성능 개선:
 * - Before: 100ms 폴링 (560 queries/sec)
 * - After: 이벤트 기반 (평균 5 queries/sec)
 */

class DOMScopeDetector implements IEnhancedScopeDetector {
  // 이벤트 소스
  private mutationObserver: MutationObserver;
  private focusInHandler: EventListener;
  private focusOutHandler: EventListener;

  // 상태
  private currentScopes: Scope[] = ['global'];
  private listeners: ScopeChangeCallback[] = [];

  initialize(): void {
    // 1. MutationObserver 설정
    this.mutationObserver = new MutationObserver((mutations) => {
      if (this.hasScopeRelevantChanges(mutations)) {
        this.updateScopes('dom-mutation');
      }
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role', 'aria-expanded', 'class']
    });

    // 2. Focus 이벤트 설정
    document.addEventListener('focusin', this.handleFocusIn, true);
    document.addEventListener('focusout', this.handleFocusOut, true);

    // 3. Fallback 폴링 (1초, 안전장치)
    setInterval(() => this.validateScopes(), 1000);
  }

  private hasScopeRelevantChanges(mutations: MutationRecord[]): boolean {
    // 스코프 관련 변경만 필터링
    return mutations.some(m => {
      if (m.type === 'attributes') {
        const attr = m.attributeName;
        return attr === 'role' || attr?.startsWith('aria-') || attr === 'class';
      }
      return m.type === 'childList';
    });
  }

  private updateScopes(trigger: string): void {
    const newScopes = this.computeActiveScopes();

    if (!this.scopesEqual(this.currentScopes, newScopes)) {
      this.currentScopes = newScopes;

      // 모든 리스너에게 알림
      this.listeners.forEach(listener => listener(newScopes));
    }
  }
}
```

---

## 데이터 흐름

### 1. Bottom-Up 흐름 (이벤트 → UI)

```
사용자 액션 (Modal 열기)
         │
         ▼
DOM 변화 (div[role="dialog"] 추가)
         │
         ▼
MutationObserver 트리거
         │
         ▼
DOMScopeDetector.updateScopes()
         │
         ▼
ScopeManager.handleScopeChange()
         │
         ├──────────────────────┬────────────────────┐
         ▼                      ▼                    ▼
Redux scopeChanged()    GlobalKeyboardManager   리스너 알림
         │                      │                    │
         ▼                      ▼                    ▼
React 리렌더링          단축키 라우팅 업데이트   커스텀 로직
         │
         ▼
useActiveScopes() 반환값 변경
         │
         ▼
UI 업데이트 (Toolbar 표시/숨김)
```

### 2. Top-Down 흐름 (컴포넌트 → Scope)

```
React 컴포넌트 마운트 (<Modal />)
         │
         ▼
ScopeProvider useEffect 실행
         │
         ▼
dispatch(registerComponentScope({
  componentId: 'modal-123',
  scope: 'modal'
}))
         │
         ▼
Redux scopeSlice.componentScopes 업데이트
         │
         ▼
ScopeManager Redux 구독 감지
         │
         ▼
detector.forceUpdate() 호출
         │
         ▼
computeActiveScopes() 재계산
         │
         ▼
activeScopes 업데이트: ['modal', 'global']
         │
         ▼
GlobalKeyboardManager 라우팅 변경
(이제 modal scope 단축키만 활성화)
```

### 3. 양방향 동기화

```typescript
/**
 * Redux ↔ ScopeManager 양방향 동기화
 */

// Direction 1: ScopeManager → Redux
detector.onScopeChange((scopes) => {
  store.dispatch(scopeChanged({
    scopes,
    trigger: 'detector'
  }));
});

// Direction 2: Redux → ScopeManager
store.subscribe(() => {
  const state = store.getState();

  // UI 상태 변경 감지
  const uiChanged = (
    state.ui.modals.activeModal ||
    state.ui.editor.isOpen ||
    state.ui.sidebar.isOpen
  );

  if (uiChanged) {
    // Detector 재계산 트리거
    detector.forceUpdate();
  }
});
```

---

## 설계 원칙

### 1. Single Responsibility Principle (SRP)

각 컴포넌트는 하나의 책임만 가집니다:

```typescript
// ✅ Good: 역할 분리
class DOMScopeDetector {
  // 책임: DOM 상태 감지만
}

class ScopeManager {
  // 책임: 조율 및 이벤트 전파만
}

class scopeSlice {
  // 책임: 상태 저장 및 히스토리 관리만
}

// ❌ Bad: 모든 걸 한 곳에
class GodScopeManager {
  // DOM 감지 + 상태 관리 + React 통합 + 단축키 실행
  // → 테스트 불가능, 유지보수 어려움
}
```

### 2. Dependency Inversion Principle (DIP)

고수준 모듈은 추상화에 의존:

```typescript
// ✅ Good: 인터페이스 의존
class ScopeManager {
  constructor(
    private detector: IScopeDetector // 추상화
  ) {}
}

// 테스트 시 Mock 주입 가능
const mockDetector = new MockScopeDetector();
const manager = new ScopeManager(mockDetector);

// ❌ Bad: 구체 클래스 의존
class ScopeManager {
  private detector = new DOMScopeDetector(); // 강결합
  // → 테스트 불가능
}
```

### 3. Event-Driven Architecture

폴링 대신 이벤트 기반:

```typescript
// ✅ Good: 이벤트 기반
mutationObserver.observe(document.body, {
  // 변경 시에만 콜백 실행
});

// ❌ Bad: 폴링
setInterval(() => {
  // 매번 전체 DOM 스캔 (낭비)
}, 100);
```

### 4. Separation of Concerns

UI 로직과 비즈니스 로직 분리:

```typescript
// ✅ Good: 분리
// Detection Layer (비즈니스 로직)
class DOMScopeDetector {
  computeActiveScopes(): Scope[] { /* ... */ }
}

// Hook Layer (UI 로직)
function useActiveScopes() {
  return useSelector(selectActiveScopes);
}

// ❌ Bad: 혼재
function useActiveScopes() {
  // DOM 쿼리 + Redux + 비즈니스 로직 모두 포함
  // → 테스트 어려움, 재사용 불가
}
```

---

## 확장 포인트

### 1. 커스텀 Detector 추가

```typescript
/**
 * 예시: URL 기반 Scope Detector
 */
class URLScopeDetector implements IScopeDetector {
  isModalActive(): boolean {
    // URL에 ?modal=settings 있으면 modal scope
    return new URLSearchParams(location.search).has('modal');
  }

  // 나머지 메서드 구현...
}

// 사용
const detector = new URLScopeDetector();
const manager = new ScopeManager(detector);
```

### 2. Hybrid Detector (여러 감지 방법 조합)

```typescript
/**
 * 여러 Detector를 조합
 */
class HybridScopeDetector implements IScopeDetector {
  constructor(
    private domDetector: DOMScopeDetector,
    private reduxDetector: ReduxScopeDetector
  ) {}

  isModalActive(): boolean {
    // DOM과 Redux 둘 다 체크
    return (
      this.domDetector.isModalActive() ||
      this.reduxDetector.isModalActive()
    );
  }
}
```

### 3. 플러그인 시스템

```typescript
/**
 * 서드파티 확장 지원
 */
interface ScopePlugin {
  name: string;
  priority: number;
  detectScope(): Scope | null;
}

class PluggableScopeManager extends ScopeManager {
  private plugins: ScopePlugin[] = [];

  registerPlugin(plugin: ScopePlugin): void {
    this.plugins.push(plugin);
    this.plugins.sort((a, b) => b.priority - a.priority);
  }

  computeActiveScopes(): Scope[] {
    const baseScopes = super.computeActiveScopes();

    // 플러그인에서 추가 스코프 감지
    for (const plugin of this.plugins) {
      const scope = plugin.detectScope();
      if (scope && !baseScopes.includes(scope)) {
        baseScopes.push(scope);
      }
    }

    return this.sortByPriority(baseScopes);
  }
}
```

### 4. 동적 Scope 등록

```typescript
/**
 * 런타임에 새로운 스코프 타입 추가
 */
class DynamicScopeManager extends ScopeManager {
  private customScopes = new Map<string, {
    priority: number;
    detector: () => boolean;
  }>();

  registerDynamicScope(
    scopeName: string,
    priority: number,
    detector: () => boolean
  ): void {
    this.customScopes.set(scopeName, { priority, detector });
  }

  computeActiveScopes(): Scope[] {
    const scopes = super.computeActiveScopes();

    // 동적 스코프 체크
    for (const [name, config] of this.customScopes) {
      if (config.detector()) {
        scopes.push(name as Scope);
      }
    }

    return scopes;
  }
}

// 사용 예시
manager.registerDynamicScope(
  'custom-workspace',
  550,
  () => document.querySelector('.custom-workspace') !== null
);
```

---

## 성능 고려사항

### 1. 메모이제이션 전략

```typescript
// Redux Selector 메모이제이션
export const selectIsScopeActive = createSelector(
  [selectActiveScopes, (_, scope: Scope) => scope],
  (scopes, scope) => scopes.includes(scope)
  // scopes가 변경되지 않으면 재계산 안 함
);

// React Hook 메모이제이션
function useMemoizedScopeCheck(
  predicate: (scopes: Scope[]) => boolean
): boolean {
  const scopes = useActiveScopes();
  return useMemo(() => predicate(scopes), [scopes]);
}
```

### 2. 배치 업데이트

```typescript
// 여러 스코프 변경을 하나로 묶음
class BatchedScopeManager extends ScopeManager {
  private updateQueue: Scope[][] = [];
  private batchTimer: number | null = null;

  private scheduleUpdate(scopes: Scope[]): void {
    this.updateQueue.push(scopes);

    if (!this.batchTimer) {
      this.batchTimer = window.setTimeout(() => {
        this.processBatch();
      }, 0); // 다음 tick에 일괄 처리
    }
  }

  private processBatch(): void {
    const finalScopes = this.updateQueue[this.updateQueue.length - 1];
    this.updateQueue = [];
    this.batchTimer = null;

    this.notifyListeners(finalScopes);
  }
}
```

### 3. 이벤트 디바운싱

```typescript
class DebouncedScopeDetector extends DOMScopeDetector {
  private debounceTimer: number | null = null;

  private updateScopes(trigger: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      super.updateScopes(trigger);
    }, 16); // 1 frame (60fps)
  }
}
```

---

## 다이어그램

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend App                         │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌─────────────┐ ┌──────────┐ ┌──────────┐
        │   React     │ │  WebGL   │ │  Redux   │
        │ Components  │ │  Canvas  │ │  Store   │
        └──────┬──────┘ └────┬─────┘ └────┬─────┘
               │             │             │
               └─────────────┼─────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ ScopeManager   │
                    │ (Coordinator)  │
                    └────────┬───────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌────────────┐ ┌──────────┐ ┌──────────┐
        │    DOM     │ │  Redux   │ │   Mock   │
        │  Detector  │ │ Detector │ │ Detector │
        └────────────┘ └──────────┘ └──────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Keyboard       │
                    │ Manager        │
                    └────────────────┘
```

---

**다음 문서**: [02-phase1-performance.md](./02-phase1-performance.md) - Phase 1 성능 최적화 상세 가이드
