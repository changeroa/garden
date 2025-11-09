# Phase 2: Redux Integration - Redux 통합 가이드

> **목표**: ScopeManager를 Redux와 통합하여 중앙 집중식 상태 관리 구현

---

## 📋 목차

1. [Phase 2 개요](#phase-2-개요)
2. [scopeSlice 설계](#scopeslice-설계)
3. [Selectors 구현](#selectors-구현)
4. [양방향 동기화](#양방향-동기화)
5. [Redux DevTools 연동](#redux-devtools-연동)
6. [성능 최적화](#성능-최적화)
7. [테스트](#테스트)

---

## Phase 2 개요

### 왜 Redux 통합이 필요한가?

```
현재 문제:
  - ScopeManager가 독립적으로 동작
  - React 컴포넌트에서 접근하기 어려움
  - 디버깅 도구 부족
  - 상태 히스토리 추적 불가

Redux 통합 후:
  ✅ 전역 상태로 접근 가능
  ✅ Redux DevTools로 디버깅
  ✅ Time-travel debugging
  ✅ 상태 영속화 (localStorage)
  ✅ 다른 Redux 상태와 통합
```

### 목표

- scopeSlice 생성 및 store 통합
- Selectors로 효율적인 상태 조회
- ScopeManager ↔ Redux 양방향 동기화
- Redux DevTools 완전 지원
- 테스트 커버리지 80%+

### 예상 기간

**Week 3-4** (2주)

---

## scopeSlice 설계

### State Shape

```typescript
// src/store/slices/scopeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 스코프 전환 이벤트
 */
export interface ScopeTransition {
  from: Scope[];
  to: Scope[];
  timestamp: number;
  trigger: string; // 'detector', 'user-action', 'component-mount' 등
}

/**
 * 컴포넌트별 스코프 등록 정보
 */
export interface ComponentScopeData {
  scope: Scope;
  componentId: string;
  mountedAt: number;
}

/**
 * Scope Slice State
 */
export interface ScopeState {
  // 현재 활성 스코프 (우선순위 순)
  activeScopes: Scope[];

  // 스코프 전환 히스토리 (최근 100개)
  history: ScopeTransition[];

  // 컴포넌트별 스코프 등록
  componentScopes: Record<string, ComponentScopeData>;

  // 시스템 활성화 여부
  enabled: boolean;

  // 디버그 모드
  debug: boolean;
}

const initialState: ScopeState = {
  activeScopes: ['global'],
  history: [],
  componentScopes: {},
  enabled: true,
  debug: false,
};
```

### Actions

```typescript
const scopeSlice = createSlice({
  name: 'scope',
  initialState,
  reducers: {
    /**
     * 스코프 변경
     */
    scopeChanged(
      state,
      action: PayloadAction<{
        scopes: Scope[];
        trigger: string;
      }>
    ) {
      const { scopes, trigger } = action.payload;

      // 변경 사항이 없으면 무시
      if (JSON.stringify(state.activeScopes) === JSON.stringify(scopes)) {
        return;
      }

      // 히스토리 추가
      state.history.push({
        from: state.activeScopes,
        to: scopes,
        timestamp: Date.now(),
        trigger,
      });

      // 최근 100개만 유지
      if (state.history.length > 100) {
        state.history = state.history.slice(-100);
      }

      // 스코프 업데이트
      state.activeScopes = scopes;

      // 디버그 로그
      if (state.debug) {
        console.log('[Scope] Changed:', {
          from: state.activeScopes,
          to: scopes,
          trigger,
        });
      }
    },

    /**
     * 컴포넌트 스코프 등록
     */
    registerComponentScope(
      state,
      action: PayloadAction<{
        componentId: string;
        scope: Scope;
      }>
    ) {
      const { componentId, scope } = action.payload;

      state.componentScopes[componentId] = {
        scope,
        componentId,
        mountedAt: Date.now(),
      };

      if (state.debug) {
        console.log('[Scope] Component registered:', componentId, scope);
      }
    },

    /**
     * 컴포넌트 스코프 해제
     */
    unregisterComponentScope(state, action: PayloadAction<string>) {
      const componentId = action.payload;

      delete state.componentScopes[componentId];

      if (state.debug) {
        console.log('[Scope] Component unregistered:', componentId);
      }
    },

    /**
     * 스코프 시스템 활성화/비활성화
     */
    setScopeEnabled(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
    },

    /**
     * 디버그 모드 토글
     */
    setScopeDebug(state, action: PayloadAction<boolean>) {
      state.debug = action.payload;
    },

    /**
     * 히스토리 초기화
     */
    clearScopeHistory(state) {
      state.history = [];
    },

    /**
     * 스코프 강제 설정 (테스트용)
     */
    forceSetScopes(state, action: PayloadAction<Scope[]>) {
      state.activeScopes = action.payload;
    },
  },
});

export const {
  scopeChanged,
  registerComponentScope,
  unregisterComponentScope,
  setScopeEnabled,
  setScopeDebug,
  clearScopeHistory,
  forceSetScopes,
} = scopeSlice.actions;

export default scopeSlice.reducer;
```

### Store 통합

```typescript
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import scopeReducer from './slices/scopeSlice';
// ... 기타 reducers

export const store = configureStore({
  reducer: {
    scope: scopeReducer,
    // ... 기타 reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Selectors 구현

### 기본 Selectors

```typescript
// src/store/selectors/scopeSelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Scope } from '@/engine/utils/KeyboardTypes';
import { SCOPE_PRIORITY } from '@/engine/utils/KeyboardTypes';

/**
 * 현재 활성 스코프 조회
 */
export const selectActiveScopes = (state: RootState): Scope[] =>
  state.scope.activeScopes;

/**
 * 특정 스코프 활성 여부
 */
export const selectIsScopeActive = (scope: Scope) =>
  createSelector([selectActiveScopes], (activeScopes) =>
    activeScopes.includes(scope)
  );

/**
 * 가장 우선순위 높은 스코프
 */
export const selectPrimaryScope = createSelector(
  [selectActiveScopes],
  (activeScopes): Scope => {
    if (activeScopes.length === 0) return 'global';

    return activeScopes.reduce((primary, current) => {
      return SCOPE_PRIORITY[current] > SCOPE_PRIORITY[primary]
        ? current
        : primary;
    });
  }
);

/**
 * 스코프 히스토리
 */
export const selectScopeHistory = (state: RootState) =>
  state.scope.history;

/**
 * 최근 N개 스코프 전환
 */
export const selectRecentScopeTransitions = (count = 10) =>
  createSelector([selectScopeHistory], (history) =>
    history.slice(-count)
  );

/**
 * 컴포넌트별 스코프 등록 현황
 */
export const selectComponentScopes = (state: RootState) =>
  state.scope.componentScopes;

/**
 * 특정 컴포넌트의 스코프
 */
export const selectComponentScope = (componentId: string) =>
  createSelector(
    [selectComponentScopes],
    (componentScopes) => componentScopes[componentId]
  );

/**
 * 스코프 시스템 활성화 여부
 */
export const selectScopeEnabled = (state: RootState): boolean =>
  state.scope.enabled;

/**
 * 디버그 모드 여부
 */
export const selectScopeDebug = (state: RootState): boolean =>
  state.scope.debug;
```

### 고급 Selectors

```typescript
/**
 * 스코프 통계
 */
export const selectScopeStats = createSelector(
  [selectScopeHistory],
  (history) => {
    const transitions = history.length;
    const scopeCounts: Record<Scope, number> = {
      global: 0,
      canvas: 0,
      sidebar: 0,
      editor: 0,
      tooltip: 0,
      overlay: 0,
      modal: 0,
    };

    history.forEach((t) => {
      t.to.forEach((scope) => {
        scopeCounts[scope]++;
      });
    });

    return {
      transitions,
      scopeCounts,
      mostUsedScope: Object.entries(scopeCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] as Scope,
    };
  }
);

/**
 * 마지막 N분간의 스코프 전환 횟수
 */
export const selectRecentTransitionCount = (minutes = 5) =>
  createSelector([selectScopeHistory], (history) => {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return history.filter((t) => t.timestamp >= cutoff).length;
  });
```

---

## 양방향 동기화

### ScopeManager → Redux

```typescript
// src/engine/utils/ScopeManager.ts (확장)

import { store } from '@/store';
import { scopeChanged } from '@/store/slices/scopeSlice';

export class ScopeManager {
  private reduxSyncEnabled = false;

  /**
   * Redux 동기화 활성화
   */
  setupReduxSync(): void {
    if (this.reduxSyncEnabled) {
      console.warn('[ScopeManager] Redux sync already enabled');
      return;
    }

    // ScopeManager 이벤트 → Redux dispatch
    this.addEventListener((event) => {
      store.dispatch(
        scopeChanged({
          scopes: event.currentScopes,
          trigger: event.triggeredBy,
        })
      );
    });

    this.reduxSyncEnabled = true;

    if (this.debug) {
      console.log('[ScopeManager] Redux sync enabled');
    }
  }

  /**
   * Redux 동기화 비활성화
   */
  disableReduxSync(): void {
    this.reduxSyncEnabled = false;
  }
}
```

### Redux → ScopeManager (선택적)

```typescript
// src/App.tsx 또는 초기화 지점

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectScopeEnabled } from '@/store/selectors/scopeSelectors';
import { GlobalKeyboardManager } from '@/engine/utils/GlobalKeyboardManager';

function ScopeSync() {
  const scopeEnabled = useSelector(selectScopeEnabled);

  useEffect(() => {
    const manager = GlobalKeyboardManager.getInstance().getScopeManager();

    if (!scopeEnabled) {
      manager.dispose();
    } else {
      manager.start();
    }
  }, [scopeEnabled]);

  return null;
}

export default ScopeSync;
```

### 초기화 코드

```typescript
// src/main.tsx 또는 App.tsx

import { useEffect } from 'react';
import { GlobalKeyboardManager } from '@/engine/utils/GlobalKeyboardManager';
import { DOMScopeDetector } from '@/engine/utils/scope/DOMScopeDetector';

function App() {
  useEffect(() => {
    // 1. Detector 생성
    const detector = new DOMScopeDetector({ debug: true });

    // 2. ScopeManager 가져오기
    const keyboardManager = GlobalKeyboardManager.getInstance();
    const scopeManager = keyboardManager.getScopeManager();

    // 3. Redux 동기화 활성화
    scopeManager.setupReduxSync();

    // 4. 시작
    scopeManager.start();

    // 5. 정리
    return () => {
      scopeManager.dispose();
      detector.dispose();
    };
  }, []);

  return (
    <div>
      {/* App Content */}
    </div>
  );
}
```

---

## Redux DevTools 연동

### 시간 여행 디버깅

```typescript
// Redux DevTools에서:
// 1. Action 탭에서 scopeChanged 액션 확인
// 2. State 탭에서 scope.activeScopes 확인
// 3. Diff 탭에서 변경 사항 확인
// 4. 타임라인에서 이전 상태로 복원
```

### 커스텀 액션 이름

```typescript
// scopeSlice.ts 개선

reducers: {
  scopeChanged(state, action) {
    // ... 로직
  },
},
// Redux DevTools에서 보기 좋게 표시됨:
// "scope/scopeChanged"
```

### 액션 페이로드 검증

```typescript
// src/store/middleware/scopeLogger.ts

import { Middleware } from '@reduxjs/toolkit';

export const scopeLoggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type.startsWith('scope/')) {
    console.group(`[Redux] ${action.type}`);
    console.log('Payload:', action.payload);
    console.log('State before:', store.getState().scope);
    const result = next(action);
    console.log('State after:', store.getState().scope);
    console.groupEnd();
    return result;
  }

  return next(action);
};

// store.ts에 추가
export const store = configureStore({
  reducer: { /* ... */ },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(scopeLoggerMiddleware),
});
```

---

## 성능 최적화

### Memoized Selectors

```typescript
// ✅ createSelector로 메모이제이션
export const selectIsScopeActive = (scope: Scope) =>
  createSelector(
    [selectActiveScopes],
    (activeScopes) => activeScopes.includes(scope)
  );

// ❌ 매번 새 배열 생성
export const selectIsScopeActive = (state: RootState, scope: Scope) =>
  state.scope.activeScopes.includes(scope);
```

### Shallow Equality Check

```typescript
import { shallowEqual, useSelector } from 'react-redux';

function MyComponent() {
  // ✅ shallowEqual로 불필요한 리렌더링 방지
  const activeScopes = useSelector(selectActiveScopes, shallowEqual);

  return <div>{activeScopes.join(', ')}</div>;
}
```

### History 크기 제한

```typescript
// scopeSlice.ts

scopeChanged(state, action) {
  // ...
  state.history.push(transition);

  // 최근 100개만 유지 (메모리 누수 방지)
  if (state.history.length > 100) {
    state.history = state.history.slice(-100);
  }
}
```

---

## 테스트

### Reducer 테스트

```typescript
// tests/store/scopeSlice.test.ts

import { describe, it, expect } from 'vitest';
import scopeReducer, {
  scopeChanged,
  registerComponentScope,
  ScopeState,
} from '@/store/slices/scopeSlice';

describe('scopeSlice', () => {
  const initialState: ScopeState = {
    activeScopes: ['global'],
    history: [],
    componentScopes: {},
    enabled: true,
    debug: false,
  };

  it('should handle scopeChanged', () => {
    const newState = scopeReducer(
      initialState,
      scopeChanged({
        scopes: ['modal', 'global'],
        trigger: 'test',
      })
    );

    expect(newState.activeScopes).toEqual(['modal', 'global']);
    expect(newState.history).toHaveLength(1);
    expect(newState.history[0].trigger).toBe('test');
  });

  it('should register component scope', () => {
    const newState = scopeReducer(
      initialState,
      registerComponentScope({
        componentId: 'modal-123',
        scope: 'modal',
      })
    );

    expect(newState.componentScopes['modal-123']).toBeDefined();
    expect(newState.componentScopes['modal-123'].scope).toBe('modal');
  });

  it('should limit history to 100 items', () => {
    let state = initialState;

    // 150번 변경
    for (let i = 0; i < 150; i++) {
      state = scopeReducer(
        state,
        scopeChanged({
          scopes: i % 2 === 0 ? ['modal'] : ['global'],
          trigger: 'test',
        })
      );
    }

    expect(state.history.length).toBe(100);
  });
});
```

### Selector 테스트

```typescript
// tests/store/scopeSelectors.test.ts

import { describe, it, expect } from 'vitest';
import {
  selectActiveScopes,
  selectPrimaryScope,
  selectIsScopeActive,
} from '@/store/selectors/scopeSelectors';
import type { RootState } from '@/store';

describe('scopeSelectors', () => {
  const mockState: Partial<RootState> = {
    scope: {
      activeScopes: ['modal', 'canvas', 'global'],
      history: [],
      componentScopes: {},
      enabled: true,
      debug: false,
    },
  };

  it('should select active scopes', () => {
    const scopes = selectActiveScopes(mockState as RootState);
    expect(scopes).toEqual(['modal', 'canvas', 'global']);
  });

  it('should select primary scope', () => {
    const primary = selectPrimaryScope(mockState as RootState);
    expect(primary).toBe('modal'); // 가장 높은 우선순위
  });

  it('should check if scope is active', () => {
    const isModalActive = selectIsScopeActive('modal')(
      mockState as RootState
    );
    expect(isModalActive).toBe(true);

    const isEditorActive = selectIsScopeActive('editor')(
      mockState as RootState
    );
    expect(isEditorActive).toBe(false);
  });
});
```

---

## 마이그레이션 체크리스트

- [ ] scopeSlice 생성 및 타입 정의
- [ ] Actions 구현 (scopeChanged, register/unregister 등)
- [ ] Store에 scopeReducer 추가
- [ ] Selectors 작성 (기본 + 고급)
- [ ] ScopeManager.setupReduxSync() 구현
- [ ] 초기화 코드 추가 (App.tsx)
- [ ] Redux DevTools 동작 확인
- [ ] Reducer 단위 테스트 작성
- [ ] Selector 단위 테스트 작성
- [ ] 통합 테스트 (ScopeManager ↔ Redux)
- [ ] 성능 테스트 (메모이제이션 확인)
- [ ] 문서화 완료

---

## 다음 단계

Phase 2 완료 후 **Phase 3: React Hooks**로 진행:
- useActiveScopes, useScopeCheck 등 구현
- ScopeProvider 컴포넌트 개발
- 선언적 API로 전환

---

**관련 문서**:
- [02-phase1-performance.md](./02-phase1-performance.md) - 이전 단계
- [04-phase3-react-hooks.md](./04-phase3-react-hooks.md) - 다음 단계
- [08-api-reference.md](./08-api-reference.md) - API 문서
