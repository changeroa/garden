# Phase 3: React Hooks - 선언적 API 구현

> **목표**: React Hooks로 선언적이고 사용하기 쉬운 API 제공

---

## 📋 목차

1. [Phase 3 개요](#phase-3-개요)
2. [기본 Hooks](#기본-hooks)
3. [고급 Hooks](#고급-hooks)
4. [ScopeProvider 컴포넌트](#scopeprovider-컴포넌트)
5. [실제 사용 예시](#실제-사용-예시)
6. [성능 최적화](#성능-최적화)
7. [테스트](#테스트)

---

## Phase 3 개요

### 왜 React Hooks가 필요한가?

```
현재 (Phase 2):
  const activeScopes = useSelector(selectActiveScopes);

  useEffect(() => {
    const manager = GlobalKeyboardManager.getInstance().getScopeManager();
    const unsubscribe = manager.addEventListener((event) => {
      // ...
    });
    return unsubscribe;
  }, []);

React Hooks 후:
  const activeScopes = useActiveScopes();
  const isEditorActive = useScopeCheck('editor');

  useScopeTransition((prev, current) => {
    // 스코프 전환 시 자동 실행
  });
```

### 목표

- 7개의 핵심 Hooks 구현
- ScopeProvider 컴포넌트로 선언적 등록
- TypeScript 완벽 지원
- 성능 최적화 (메모이제이션)
- 테스트 커버리지 85%+

### 예상 기간

**Week 5-6** (2주)

---

## 기본 Hooks

### useActiveScopes

**목적**: 현재 활성화된 모든 스코프 조회

```typescript
// src/hooks/useActiveScopes.ts

import { useSelector } from 'react-redux';
import { selectActiveScopes } from '@/store/selectors/scopeSelectors';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 현재 활성화된 모든 스코프를 반환합니다.
 *
 * @returns 우선순위 순으로 정렬된 스코프 배열
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const activeScopes = useActiveScopes();
 *   return <div>Active: {activeScopes.join(', ')}</div>;
 * }
 * ```
 */
export function useActiveScopes(): Scope[] {
  return useSelector(selectActiveScopes);
}
```

**사용 예시**:
```tsx
function ScopeIndicator() {
  const activeScopes = useActiveScopes();

  return (
    <div className="scope-indicator">
      {activeScopes.map((scope) => (
        <span key={scope} className={`badge ${scope}`}>
          {scope}
        </span>
      ))}
    </div>
  );
}
```

---

### useScopeCheck

**목적**: 특정 스코프가 활성화되어 있는지 확인

```typescript
// src/hooks/useScopeCheck.ts

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectIsScopeActive } from '@/store/selectors/scopeSelectors';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 특정 스코프가 활성화되어 있는지 확인합니다.
 *
 * @param scope - 확인할 스코프
 * @returns 활성화 여부
 *
 * @example
 * ```tsx
 * function EditorToolbar() {
 *   const isEditorActive = useScopeCheck('editor');
 *
 *   if (!isEditorActive) return null;
 *   return <Toolbar />;
 * }
 * ```
 */
export function useScopeCheck(scope: Scope): boolean {
  const selector = useMemo(() => selectIsScopeActive(scope), [scope]);
  return useSelector(selector);
}
```

**사용 예시**:
```tsx
function ContextualButton() {
  const isCanvasActive = useScopeCheck('canvas');
  const isModalActive = useScopeCheck('modal');

  return (
    <button
      disabled={isModalActive}
      className={isCanvasActive ? 'primary' : 'secondary'}
    >
      {isCanvasActive ? 'Canvas Action' : 'Default Action'}
    </button>
  );
}
```

---

### usePrimaryScope

**목적**: 가장 우선순위가 높은 스코프 조회

```typescript
// src/hooks/usePrimaryScope.ts

import { useSelector } from 'react-redux';
import { selectPrimaryScope } from '@/store/selectors/scopeSelectors';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 현재 가장 우선순위가 높은 스코프를 반환합니다.
 *
 * @returns 주 스코프
 *
 * @example
 * ```tsx
 * function StatusBar() {
 *   const primaryScope = usePrimaryScope();
 *   return <div>Mode: {primaryScope}</div>;
 * }
 * ```
 */
export function usePrimaryScope(): Scope {
  return useSelector(selectPrimaryScope);
}
```

**사용 예시**:
```tsx
function ModeIndicator() {
  const primaryScope = usePrimaryScope();

  const modeLabels: Record<Scope, string> = {
    global: 'Default',
    canvas: 'Canvas Mode',
    editor: 'Editing',
    modal: 'Dialog',
    sidebar: 'Sidebar',
    overlay: 'Overlay',
    tooltip: 'Tooltip',
  };

  return (
    <div className="mode-indicator">
      <span className="mode-label">{modeLabels[primaryScope]}</span>
    </div>
  );
}
```

---

### useScopeMultiCheck

**목적**: 여러 스코프 조건 체크

```typescript
// src/hooks/useScopeMultiCheck.ts

import { useMemo } from 'react';
import { useActiveScopes } from './useActiveScopes';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 여러 스코프 조건을 체크합니다.
 *
 * @param scopes - 확인할 스코프 배열
 * @param mode - 'some' (하나라도) 또는 'every' (모두)
 * @returns 조건 만족 여부
 *
 * @example
 * ```tsx
 * function EditButton() {
 *   const canEdit = useScopeMultiCheck(['editor', 'canvas'], 'some');
 *   return <button disabled={!canEdit}>Edit</button>;
 * }
 * ```
 */
export function useScopeMultiCheck(
  scopes: Scope[],
  mode: 'some' | 'every' = 'some'
): boolean {
  const activeScopes = useActiveScopes();

  return useMemo(() => {
    if (mode === 'some') {
      return scopes.some((scope) => activeScopes.includes(scope));
    } else {
      return scopes.every((scope) => activeScopes.includes(scope));
    }
  }, [activeScopes, scopes, mode]);
}
```

**사용 예시**:
```tsx
function AdvancedFeature() {
  // Canvas와 Editor 모두 활성화되어야 함
  const canUse = useScopeMultiCheck(['canvas', 'editor'], 'every');

  // Modal이나 Overlay 중 하나라도 있으면 비활성화
  const isBlocked = useScopeMultiCheck(['modal', 'overlay'], 'some');

  return (
    <button disabled={!canUse || isBlocked}>
      Advanced Action
    </button>
  );
}
```

---

## 고급 Hooks

### useScopeTransition

**목적**: 스코프 전환 시 콜백 실행

```typescript
// src/hooks/useScopeTransition.ts

import { useEffect, useRef } from 'react';
import { useActiveScopes } from './useActiveScopes';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 스코프 전환 시 콜백을 실행합니다.
 *
 * @param callback - 전환 시 실행할 함수
 * @param deps - 의존성 배열
 *
 * @example
 * ```tsx
 * function AutoSaveEditor() {
 *   const [content, setContent] = useState('');
 *
 *   useScopeTransition((prev, current) => {
 *     if (prev.includes('editor') && !current.includes('editor')) {
 *       saveContent(content);
 *     }
 *   }, [content]);
 *
 *   return <Editor value={content} onChange={setContent} />;
 * }
 * ```
 */
export function useScopeTransition(
  callback: (previousScopes: Scope[], currentScopes: Scope[]) => void,
  deps: React.DependencyList = []
): void {
  const activeScopes = useActiveScopes();
  const previousScopesRef = useRef<Scope[]>(activeScopes);

  useEffect(() => {
    const previous = previousScopesRef.current;
    const current = activeScopes;

    // 변경이 있을 때만 콜백 실행
    if (JSON.stringify(previous) !== JSON.stringify(current)) {
      callback(previous, current);
      previousScopesRef.current = current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScopes, ...deps]);
}
```

**사용 예시**:
```tsx
function AnalyticsTracker() {
  useScopeTransition((prev, current) => {
    // 스코프 전환 추적
    analytics.track('scope_transition', {
      from: prev.join(','),
      to: current.join(','),
      timestamp: Date.now(),
    });
  });

  return null;
}

function UnsavedChangesWarning() {
  const [hasChanges, setHasChanges] = useState(false);

  useScopeTransition((prev, current) => {
    // 에디터를 떠날 때 경고
    if (prev.includes('editor') && !current.includes('editor')) {
      if (hasChanges) {
        const confirmed = window.confirm('Unsaved changes. Continue?');
        if (!confirmed) {
          // 스코프 복원 로직 (필요시)
        }
      }
    }
  }, [hasChanges]);

  return null;
}
```

---

### useScopeHistory

**목적**: 스코프 전환 히스토리 조회

```typescript
// src/hooks/useScopeHistory.ts

import { useSelector } from 'react-redux';
import { selectRecentScopeTransitions } from '@/store/selectors/scopeSelectors';
import type { ScopeTransition } from '@/store/slices/scopeSlice';

/**
 * 최근 스코프 전환 히스토리를 조회합니다.
 *
 * @param count - 조회할 개수 (기본: 10)
 * @returns 스코프 전환 배열
 *
 * @example
 * ```tsx
 * function ScopeDebugPanel() {
 *   const history = useScopeHistory(20);
 *
 *   return (
 *     <ul>
 *       {history.map((t, i) => (
 *         <li key={i}>
 *           {t.from.join(',')} → {t.to.join(',')}
 *           <small>{new Date(t.timestamp).toLocaleTimeString()}</small>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useScopeHistory(count = 10): ScopeTransition[] {
  return useSelector(selectRecentScopeTransitions(count));
}
```

**사용 예시**:
```tsx
function ScopeTimeline() {
  const history = useScopeHistory(50);

  return (
    <div className="scope-timeline">
      {history.map((transition, index) => (
        <div key={index} className="timeline-item">
          <div className="timestamp">
            {new Date(transition.timestamp).toLocaleTimeString()}
          </div>
          <div className="transition">
            <span className="from">{transition.from.join(', ')}</span>
            <span className="arrow">→</span>
            <span className="to">{transition.to.join(', ')}</span>
          </div>
          <div className="trigger">{transition.trigger}</div>
        </div>
      ))}
    </div>
  );
}
```

---

### useScopeRegistration

**목적**: Hook 방식으로 스코프 등록

```typescript
// src/hooks/useScopeRegistration.ts

import { useEffect, useId } from 'react';
import { useDispatch } from 'react-redux';
import {
  registerComponentScope,
  unregisterComponentScope,
} from '@/store/slices/scopeSlice';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 컴포넌트가 마운트될 때 스코프를 등록하고, 언마운트 시 해제합니다.
 *
 * @param scope - 등록할 스코프
 * @param options - 등록 옵션
 *
 * @example
 * ```tsx
 * function FloatingToolbar() {
 *   const [isVisible, setIsVisible] = useState(true);
 *
 *   useScopeRegistration('overlay', {
 *     enabled: isVisible,
 *     debugId: 'floating-toolbar'
 *   });
 *
 *   if (!isVisible) return null;
 *   return <div>Toolbar</div>;
 * }
 * ```
 */
export function useScopeRegistration(
  scope: Scope,
  options: {
    enabled?: boolean;
    debugId?: string;
  } = {}
): void {
  const { enabled = true, debugId } = options;
  const autoId = useId();
  const componentId = debugId || autoId;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    // 등록
    dispatch(
      registerComponentScope({
        componentId,
        scope,
      })
    );

    // 해제
    return () => {
      dispatch(unregisterComponentScope(componentId));
    };
  }, [dispatch, componentId, scope, enabled]);
}
```

**사용 예시**:
```tsx
function DynamicModal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  useScopeRegistration('modal', {
    enabled: isOpen,
    debugId: 'settings-modal',
  });

  if (!isOpen) return null;

  return (
    <div className="modal">
      {children}
    </div>
  );
}
```

---

### useMemoizedScopeCheck

**목적**: 메모이제이션된 복잡한 스코프 조건 체크

```typescript
// src/hooks/useMemoizedScopeCheck.ts

import { useMemo } from 'react';
import { useActiveScopes } from './useActiveScopes';
import type { Scope } from '@/engine/utils/KeyboardTypes';

/**
 * 복잡한 스코프 조건을 메모이제이션하여 체크합니다.
 *
 * @param predicate - 스코프 배열을 받아 boolean을 반환하는 함수
 * @returns 조건 만족 여부
 *
 * @example
 * ```tsx
 * function ComplexButton() {
 *   const canPerform = useMemoizedScopeCheck((scopes) => {
 *     const hasEditor = scopes.includes('editor');
 *     const noModal = !scopes.includes('modal');
 *     const canvasActive = scopes.includes('canvas');
 *     return hasEditor && noModal && canvasActive;
 *   });
 *
 *   return <button disabled={!canPerform}>Perform</button>;
 * }
 * ```
 */
export function useMemoizedScopeCheck(
  predicate: (scopes: Scope[]) => boolean
): boolean {
  const activeScopes = useActiveScopes();

  return useMemo(() => {
    return predicate(activeScopes);
  }, [activeScopes, predicate]);
}
```

**사용 예시**:
```tsx
function SmartActionButton() {
  const canExecute = useMemoizedScopeCheck((scopes) => {
    // 복잡한 비즈니스 로직
    const isEditMode = scopes.includes('editor') || scopes.includes('canvas');
    const noBlockingUI = !scopes.includes('modal') && !scopes.includes('overlay');
    const hasSidebar = scopes.includes('sidebar');

    return isEditMode && noBlockingUI && hasSidebar;
  });

  return (
    <button
      disabled={!canExecute}
      onClick={() => {
        /* 복잡한 액션 */
      }}
    >
      Execute Smart Action
    </button>
  );
}
```

---

## ScopeProvider 컴포넌트

### 구현

```typescript
// src/components/Common/ScopeProvider/ScopeProvider.tsx

import { ReactNode } from 'react';
import { useScopeRegistration } from '@/hooks/useScopeRegistration';
import type { Scope } from '@/engine/utils/KeyboardTypes';

export interface ScopeProviderProps {
  /**
   * 제공할 스코프
   */
  scope: Scope;

  /**
   * 자식 컴포넌트
   */
  children: ReactNode;

  /**
   * 조건부 활성화 (기본: true)
   */
  when?: boolean;

  /**
   * 디버그 ID (선택적)
   */
  debugId?: string;
}

/**
 * 선언적으로 스코프를 등록하는 컴포넌트
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, children }) {
 *   return (
 *     <ScopeProvider scope="modal" when={isOpen}>
 *       <div className="modal">
 *         {children}
 *       </div>
 *     </ScopeProvider>
 *   );
 * }
 * ```
 */
export function ScopeProvider({
  scope,
  children,
  when = true,
  debugId,
}: ScopeProviderProps): JSX.Element {
  useScopeRegistration(scope, {
    enabled: when,
    debugId,
  });

  return <>{children}</>;
}
```

### 사용 예시

```tsx
// 모달
function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ScopeProvider scope="modal" when={isOpen} debugId="settings-modal">
      <div className="modal">
        <h2>Settings</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </ScopeProvider>
  );
}

// 사이드바
function Sidebar() {
  return (
    <ScopeProvider scope="sidebar" debugId="main-sidebar">
      <div className="sidebar">
        {/* 사이드바 콘텐츠 */}
      </div>
    </ScopeProvider>
  );
}

// 중첩 스코프
function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <ScopeProvider scope="canvas" debugId="main-canvas">
        <Canvas />

        <ScopeProvider scope="sidebar">
          <Sidebar />
        </ScopeProvider>

        {modalOpen && (
          <ScopeProvider scope="modal" when={modalOpen}>
            <Modal onClose={() => setModalOpen(false)} />
          </ScopeProvider>
        )}
      </ScopeProvider>
    </div>
  );
}
```

---

## 실제 사용 예시

### 예시 1: Context-Aware Toolbar

```tsx
function ContextualToolbar() {
  const isCanvasActive = useScopeCheck('canvas');
  const isEditorActive = useScopeCheck('editor');
  const isModalActive = useScopeCheck('modal');

  // 모달이 열려있으면 툴바 숨김
  if (isModalActive) return null;

  return (
    <div className="toolbar">
      {isCanvasActive && <CanvasTools />}
      {isEditorActive && <EditorTools />}
      {!isCanvasActive && !isEditorActive && <DefaultTools />}
    </div>
  );
}
```

### 예시 2: Auto-Save on Scope Exit

```tsx
function Editor() {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useScopeTransition((prev, current) => {
    // 에디터를 떠날 때 자동 저장
    if (prev.includes('editor') && !current.includes('editor')) {
      if (isDirty) {
        saveContent(content);
        setIsDirty(false);
      }
    }
  }, [content, isDirty]);

  return (
    <ScopeProvider scope="editor">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsDirty(true);
        }}
      />
    </ScopeProvider>
  );
}
```

### 예시 3: Scope-Aware Shortcuts

```tsx
function ShortcutHandler() {
  const activeScopes = useActiveScopes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: 스코프에 따라 다른 동작
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();

        if (activeScopes.includes('editor')) {
          saveDocument();
        } else if (activeScopes.includes('canvas')) {
          saveCanvas();
        } else {
          saveProject();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScopes]);

  return null;
}
```

---

## 성능 최적화

### 1. Memoization

```tsx
// ❌ 매번 재계산
function MyComponent() {
  const activeScopes = useActiveScopes();
  const isEditor = activeScopes.includes('editor');
  // ...
}

// ✅ 메모이제이션
function MyComponent() {
  const isEditor = useScopeCheck('editor');
  // ...
}
```

### 2. 조건부 Hook 사용

```tsx
// ✅ 필요할 때만 히스토리 조회
function DebugPanel({ isOpen }: { isOpen: boolean }) {
  const history = isOpen ? useScopeHistory(50) : [];

  if (!isOpen) return null;
  return <Timeline history={history} />;
}
```

### 3. Selector 재사용

```typescript
// ✅ Selector를 캐싱
const selectIsEditorActive = selectIsScopeActive('editor');

function Component1() {
  const isEditor = useSelector(selectIsEditorActive);
}

function Component2() {
  const isEditor = useSelector(selectIsEditorActive); // 같은 selector
}
```

---

## 테스트

### Hook 테스트

```typescript
// tests/hooks/useActiveScopes.test.tsx

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useActiveScopes } from '@/hooks/useActiveScopes';
import { store } from '@/store';

describe('useActiveScopes', () => {
  it('should return active scopes from Redux', () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useActiveScopes(), { wrapper });

    expect(result.current).toEqual(['global']);
  });
});
```

### ScopeProvider 테스트

```typescript
// tests/components/ScopeProvider.test.tsx

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ScopeProvider } from '@/components/Common/ScopeProvider';
import { store } from '@/store';
import { selectComponentScopes } from '@/store/selectors/scopeSelectors';

describe('ScopeProvider', () => {
  it('should register scope on mount', () => {
    render(
      <Provider store={store}>
        <ScopeProvider scope="modal" debugId="test-modal">
          <div>Content</div>
        </ScopeProvider>
      </Provider>
    );

    const componentScopes = selectComponentScopes(store.getState());
    expect(componentScopes['test-modal']).toBeDefined();
    expect(componentScopes['test-modal'].scope).toBe('modal');
  });
});
```

---

## 마이그레이션 체크리스트

- [ ] 모든 기본 Hooks 구현 (useActiveScopes, useScopeCheck, usePrimaryScope)
- [ ] 고급 Hooks 구현 (useScopeTransition, useScopeHistory, etc.)
- [ ] ScopeProvider 컴포넌트 구현
- [ ] TypeScript 타입 정의 완료
- [ ] 각 Hook별 단위 테스트 작성
- [ ] ScopeProvider 통합 테스트
- [ ] 성능 테스트 (메모이제이션 확인)
- [ ] 실제 컴포넌트에 적용 (최소 3개)
- [ ] 문서화 및 예시 코드 작성
- [ ] 코드 리뷰 및 피드백 반영

---

## 다음 단계

Phase 3 완료 후 **Phase 4: Advanced Features**로 진행:
- 동적 스코프 시스템
- 스코프 분석 대시보드
- AI 통합
- 플러그인 시스템

---

**관련 문서**:
- [03-phase2-redux-integration.md](./03-phase2-redux-integration) - 이전 단계
- [05-phase4-advanced-features.md](./05-phase4-advanced-features) - 다음 단계
- [08-api-reference.md](./08-api-reference) - API 문서
