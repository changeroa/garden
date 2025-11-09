# API Reference - Complete Documentation

> **버전**: 1.0.0
> **최종 수정**: 2025-01-09

---

## 📋 목차

1. [Interfaces](#interfaces)
2. [Classes](#classes)
3. [React Hooks](#react-hooks)
4. [Redux](#redux)
5. [Utilities](#utilities)
6. [Types](#types)

---

## Interfaces

### IScopeDetector

```typescript
interface IScopeDetector {
  isModalActive(): boolean;
  isOverlayActive(): boolean;
  isTooltipActive(): boolean;
  isEditorFocused(): boolean;
  isTextInputFocused(): boolean;
  isSidebarFocused(): boolean;
  isCanvasFocused(): boolean;
  initialize?(): void;
  dispose?(): void;
}
```

**설명**: 스코프 감지의 기본 인터페이스

**메서드**:
- `isModalActive()`: Modal 스코프 활성 여부
- `isOverlayActive()`: Overlay 스코프 활성 여부
- `isTooltipActive()`: Tooltip 스코프 활성 여부
- `isEditorFocused()`: Editor 스코프 활성 여부
- `isTextInputFocused()`: 텍스트 입력 포커스 여부
- `isSidebarFocused()`: Sidebar 스코프 활성 여부
- `isCanvasFocused()`: Canvas 스코프 활성 여부
- `initialize()`: 감지기 초기화 (선택적)
- `dispose()`: 감지기 정리 (선택적)

---

### IEnhancedScopeDetector

```typescript
interface IEnhancedScopeDetector extends IScopeDetector {
  onScopeChange(callback: ScopeChangeCallback): () => void;
  getActiveScopes(): Scope[];
  forceUpdate(): void;
}
```

**설명**: 이벤트 기반 감지를 위한 확장 인터페이스

**추가 메서드**:
- `onScopeChange(callback)`: 스코프 변경 리스너 등록
  - **Returns**: 언서브스크라이브 함수
- `getActiveScopes()`: 현재 활성 스코프 조회
  - **Returns**: 우선순위 순 스코프 배열
- `forceUpdate()`: 강제 스코프 재계산

**예시**:
```typescript
const detector = new DOMScopeDetector();
const unsubscribe = detector.onScopeChange((scopes) => {
  console.log('Scopes:', scopes);
});
// 나중에: unsubscribe();
```

---

## Classes

### DOMScopeDetector

```typescript
class DOMScopeDetector implements IEnhancedScopeDetector {
  constructor(config?: DetectorConfig);
  initialize(): void;
  dispose(): void;
  // ... IScopeDetector 메서드 구현
  onScopeChange(callback: ScopeChangeCallback): () => void;
  getActiveScopes(): Scope[];
  forceUpdate(): void;
  getDebugInfo(): object;
}
```

**설명**: DOM 기반 이벤트 주도 스코프 감지기

**Constructor**:
```typescript
new DOMScopeDetector({
  useMutationObserver?: boolean;    // 기본: true
  useFocusEvents?: boolean;          // 기본: true
  fallbackPollingInterval?: number;  // 기본: 1000 (ms)
  debug?: boolean;                   // 기본: false
})
```

**성능**:
- DOM 쿼리: ~5회/초 (폴링 대비 99% 감소)
- 응답 지연: <16ms
- 메모리: ~50KB

**사용 예시**:
```typescript
const detector = new DOMScopeDetector({ debug: true });
detector.initialize();

detector.onScopeChange((scopes) => {
  console.log('Active scopes:', scopes);
});

// 정리
detector.dispose();
```

---

### ScopeManager

```typescript
class ScopeManager {
  constructor(
    detector?: IEnhancedScopeDetector,
    debug?: boolean
  );
  start(): void;
  dispose(): void;
  getActiveScopes(): Scope[];
  forceRefreshContext(): boolean;
  addEventListener(listener: ScopeChangeListener): () => void;
  sortScopesByPriority(scopes: Scope[]): Scope[];
  getDebugInfo(): Record<string, unknown>;
}
```

**설명**: 스코프 관리 중앙 조율자

**주요 메서드**:

#### `constructor(detector?, debug?)`
```typescript
const manager = new ScopeManager(
  new DOMScopeDetector(),
  true // debug
);
```

#### `start()`
```typescript
manager.start(); // 감지 시작
```

#### `addEventListener(listener)`
```typescript
const unsubscribe = manager.addEventListener((event) => {
  console.log('Scope changed:', event);
});
```

**ScopeChangeEvent**:
```typescript
interface ScopeChangeEvent {
  previousScopes: Scope[];
  currentScopes: Scope[];
  triggeredBy: string;
  timestamp: number;
}
```

---

## React Hooks

### useActiveScopes

```typescript
function useActiveScopes(): Scope[]
```

**설명**: 현재 활성화된 모든 스코프 반환

**Returns**: 우선순위 순 스코프 배열

**예시**:
```tsx
function MyComponent() {
  const activeScopes = useActiveScopes();

  return (
    <div>
      Active: {activeScopes.join(', ')}
    </div>
  );
}
```

---

### useScopeCheck

```typescript
function useScopeCheck(scope: Scope): boolean
```

**설명**: 특정 스코프가 활성화되어 있는지 확인

**Parameters**:
- `scope`: 확인할 스코프

**Returns**: 활성화 여부 (boolean)

**예시**:
```tsx
function EditorTools() {
  const isEditorActive = useScopeCheck('editor');

  if (!isEditorActive) return null;

  return <div>Editor tools...</div>;
}
```

---

### usePrimaryScope

```typescript
function usePrimaryScope(): Scope
```

**설명**: 가장 우선순위가 높은 스코프 반환

**Returns**: 주 스코프 (Scope)

**예시**:
```tsx
function StatusBar() {
  const primaryScope = usePrimaryScope();

  return <div>Mode: {primaryScope}</div>;
}
```

---

### useScopeMultiCheck

```typescript
function useScopeMultiCheck(
  scopes: Scope[],
  mode?: 'some' | 'every'
): boolean
```

**설명**: 여러 스코프 조건 체크

**Parameters**:
- `scopes`: 확인할 스코프 배열
- `mode`: 'some' (하나라도) 또는 'every' (모두), 기본: 'some'

**Returns**: 조건 만족 여부

**예시**:
```tsx
function EditButton() {
  const canEdit = useScopeMultiCheck(['editor', 'canvas'], 'some');

  return (
    <button disabled={!canEdit}>
      Edit
    </button>
  );
}
```

---

### useScopeTransition

```typescript
function useScopeTransition(
  callback: (prev: Scope[], current: Scope[]) => void,
  deps?: React.DependencyList
): void
```

**설명**: 스코프 전환 시 콜백 실행

**Parameters**:
- `callback`: 전환 시 실행할 함수
- `deps`: 의존성 배열

**예시**:
```tsx
function AutoSaveEditor() {
  const [content, setContent] = useState('');

  useScopeTransition((prev, current) => {
    if (prev.includes('editor') && !current.includes('editor')) {
      saveContent(content);
    }
  }, [content]);

  return <Editor value={content} onChange={setContent} />;
}
```

---

### useScopeHistory

```typescript
function useScopeHistory(count?: number): ScopeTransition[]
```

**설명**: 최근 스코프 전환 히스토리 조회

**Parameters**:
- `count`: 조회할 개수 (기본: 10)

**Returns**: 스코프 전환 이벤트 배열

**예시**:
```tsx
function ScopeDebug() {
  const history = useScopeHistory(20);

  return (
    <ul>
      {history.map((t, i) => (
        <li key={i}>
          {t.from.join(',')} → {t.to.join(',')}
        </li>
      ))}
    </ul>
  );
}
```

---

### useScopeRegistration

```typescript
function useScopeRegistration(
  scope: Scope,
  options?: {
    enabled?: boolean;
    debugId?: string;
  }
): void
```

**설명**: Hook 방식으로 스코프 등록

**Parameters**:
- `scope`: 등록할 스코프
- `options.enabled`: 활성화 여부 (기본: true)
- `options.debugId`: 디버그 ID (기본: auto)

**예시**:
```tsx
function FloatingToolbar() {
  const [isVisible, setIsVisible] = useState(true);

  useScopeRegistration('overlay', {
    enabled: isVisible,
    debugId: 'floating-toolbar'
  });

  if (!isVisible) return null;
  return <div>Toolbar</div>;
}
```

---

### useMemoizedScopeCheck

```typescript
function useMemoizedScopeCheck(
  predicate: (scopes: Scope[]) => boolean
): boolean
```

**설명**: 메모이제이션된 복잡한 스코프 조건 체크

**Parameters**:
- `predicate`: 스코프 배열을 받아 boolean 반환하는 함수

**Returns**: 조건 만족 여부

**예시**:
```tsx
function ComplexButton() {
  const canPerform = useMemoizedScopeCheck((scopes) => {
    const hasEditor = scopes.includes('editor');
    const noModal = !scopes.includes('modal');
    const canvasActive = scopes.includes('canvas');
    return hasEditor && noModal && canvasActive;
  });

  return <button disabled={!canPerform}>Perform</button>;
}
```

---

## Redux

### scopeSlice

#### State Shape

```typescript
interface ScopeState {
  activeScopes: Scope[];
  history: ScopeTransition[];
  componentScopes: Record<string, {
    scope: Scope;
    componentId: string;
    mountedAt: number;
  }>;
  enabled: boolean;
  debug: boolean;
}
```

#### Actions

**scopeChanged**
```typescript
dispatch(scopeChanged({
  scopes: ['modal', 'global'],
  trigger: 'detector'
}))
```

**registerComponentScope**
```typescript
dispatch(registerComponentScope({
  componentId: 'modal-123',
  scope: 'modal'
}))
```

**unregisterComponentScope**
```typescript
dispatch(unregisterComponentScope('modal-123'))
```

**setScopeEnabled**
```typescript
dispatch(setScopeEnabled(true))
```

**setScopeDebug**
```typescript
dispatch(setScopeDebug(true))
```

**clearScopeHistory**
```typescript
dispatch(clearScopeHistory())
```

---

### Selectors

#### selectActiveScopes

```typescript
const activeScopes = useSelector(selectActiveScopes);
// Returns: Scope[]
```

#### selectIsScopeActive

```typescript
const isModalActive = useSelector(selectIsScopeActive('modal'));
// Returns: boolean
```

#### selectPrimaryScope

```typescript
const primary = useSelector(selectPrimaryScope);
// Returns: Scope
```

#### selectScopeHistory

```typescript
const history = useSelector(selectScopeHistory);
// Returns: ScopeTransition[]
```

#### selectRecentScopeTransitions

```typescript
const recent = useSelector(selectRecentScopeTransitions(10));
// Returns: ScopeTransition[] (최근 10개)
```

#### selectComponentScopes

```typescript
const components = useSelector(selectComponentScopes);
// Returns: Record<string, ComponentScopeData>
```

---

## React Components

### ScopeProvider

```typescript
function ScopeProvider(props: {
  scope: Scope;
  children: ReactNode;
  when?: boolean;
  debugId?: string;
}): JSX.Element
```

**설명**: 선언적 스코프 등록 컴포넌트

**Props**:
- `scope`: 제공할 스코프
- `children`: 자식 컴포넌트
- `when`: 조건부 활성화 (기본: true)
- `debugId`: 디버그 ID (기본: auto)

**예시**:
```tsx
function Modal({ isOpen, children }) {
  return (
    <ScopeProvider scope="modal" when={isOpen}>
      <div className="modal">
        {children}
      </div>
    </ScopeProvider>
  );
}
```

---

## Types

### Scope

```typescript
type Scope =
  | 'global'
  | 'canvas'
  | 'sidebar'
  | 'editor'
  | 'tooltip'
  | 'overlay'
  | 'modal';
```

**우선순위** (높은 순):
```
modal (1000) > overlay (900) > tooltip (800) >
editor (700) > sidebar (600) > canvas (500) > global (100)
```

---

### ScopeTransition

```typescript
interface ScopeTransition {
  from: Scope[];
  to: Scope[];
  timestamp: number;
  trigger: string;
}
```

**Trigger 값**:
- `'detector'`: Detector에서 감지
- `'user-action'`: 사용자 액션
- `'component-mount'`: 컴포넌트 마운트
- `'force-update'`: 강제 업데이트
- `'dom-mutation'`: DOM 변경
- `'focus-in'`: 포커스 인
- `'focus-out'`: 포커스 아웃

---

### DetectorConfig

```typescript
interface DetectorConfig {
  useMutationObserver?: boolean;
  useFocusEvents?: boolean;
  fallbackPollingInterval?: number;
  debug?: boolean;
}
```

**기본값**:
```typescript
{
  useMutationObserver: true,
  useFocusEvents: true,
  fallbackPollingInterval: 1000,
  debug: false
}
```

---

## Utilities

### SCOPE_PRIORITY

```typescript
const SCOPE_PRIORITY: Record<Scope, number> = {
  global: 100,
  canvas: 500,
  sidebar: 600,
  editor: 700,
  tooltip: 800,
  overlay: 900,
  modal: 1000,
};
```

**사용**:
```typescript
import { SCOPE_PRIORITY } from '@/engine/utils/KeyboardTypes';

const priority = SCOPE_PRIORITY.modal; // 1000
```

---

## 통합 예시

### 전체 플로우

```tsx
// 1. Redux Store 설정
import { store } from '@/store';

// 2. Detector 초기화 (App.tsx)
useEffect(() => {
  const detector = new DOMScopeDetector({ debug: true });
  const manager = new ScopeManager(detector);

  // Redux와 동기화
  manager.addEventListener((event) => {
    store.dispatch(scopeChanged({
      scopes: event.currentScopes,
      trigger: event.triggeredBy
    }));
  });

  manager.start();

  return () => manager.dispose();
}, []);

// 3. 컴포넌트에서 사용
function MyApp() {
  return (
    <>
      <Canvas /> {/* canvas scope */}

      <ScopeProvider scope="sidebar">
        <Sidebar />
      </ScopeProvider>

      <Modal /> {/* modal scope (ScopeProvider 내부) */}

      <DynamicToolbar /> {/* useActiveScopes 사용 */}
    </>
  );
}

function DynamicToolbar() {
  const activeScopes = useActiveScopes();
  const isModal = useScopeCheck('modal');

  if (isModal) return null;

  return (
    <div>
      {activeScopes.includes('canvas') && <CanvasTools />}
      {activeScopes.includes('editor') && <EditorTools />}
    </div>
  );
}
```

---

## 성능 가이드

### 최적화 팁

1. **메모이제이션 사용**
```tsx
// ❌ 매번 재계산
const canEdit = activeScopes.includes('editor') && !activeScopes.includes('modal');

// ✅ 메모이제이션
const canEdit = useMemoizedScopeCheck(scopes =>
  scopes.includes('editor') && !scopes.includes('modal')
);
```

2. **선택적 구독**
```tsx
// ❌ 전체 스코프 구독
const activeScopes = useActiveScopes();
const isEditor = activeScopes.includes('editor');

// ✅ 특정 스코프만 구독
const isEditor = useScopeCheck('editor');
```

3. **조건부 렌더링**
```tsx
// ✅ ScopeProvider로 조건부 등록
<ScopeProvider scope="modal" when={isOpen}>
  <Modal />
</ScopeProvider>
```

---

**관련 문서**:
- [00-overview.md](./00-overview.md) - 프로젝트 개요
- [01-architecture.md](./01-architecture.md) - 시스템 아키텍처
- [06-testing-strategy.md](./06-testing-strategy.md) - 테스트 전략
