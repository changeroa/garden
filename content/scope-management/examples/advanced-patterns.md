# Advanced Patterns - 고급 패턴

> 실전에서 사용하는 고급 스코프 패턴 모음

---

## 📋 목차

1. [Conditional Scope](#conditional-scope)
2. [Nested Scopes](#nested-scopes)
3. [Scope Composition](#scope-composition)
4. [Time-based Scopes](#time-based-scopes)
5. [Context-aware Actions](#context-aware-actions)
6. [Scope Animations](#scope-animations)

---

## Conditional Scope

### 패턴: 조건부 스코프 활성화

여러 조건을 만족할 때만 스코프를 활성화합니다.

```tsx
function ConditionalEditor({
  hasPermission,
  isOnline,
  documentLoaded
}: {
  hasPermission: boolean;
  isOnline: boolean;
  documentLoaded: boolean;
}) {
  // 모든 조건을 만족해야 에디터 스코프 활성화
  const canEdit = hasPermission && isOnline && documentLoaded;

  useScopeRegistration('editor', {
    enabled: canEdit,
    debugId: 'conditional-editor',
  });

  if (!canEdit) {
    return (
      <div className="editor-disabled">
        {!hasPermission && <p>No permission</p>}
        {!isOnline && <p>Offline mode</p>}
        {!documentLoaded && <p>Loading...</p>}
      </div>
    );
  }

  return <Editor />;
}
```

### 패턴: Feature Flag 기반 스코프

```tsx
function FeatureGatedScope({ featureFlag }: { featureFlag: string }) {
  const features = useSelector(selectFeatureFlags);
  const isEnabled = features[featureFlag];

  useScopeRegistration('canvas', {
    enabled: isEnabled,
    debugId: `feature-${featureFlag}`,
  });

  if (!isEnabled) {
    return <FeatureDisabledMessage />;
  }

  return <FeatureContent />;
}
```

---

## Nested Scopes

### 패턴: 중첩 스코프 우선순위

```tsx
function NestedScopeExample() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <ScopeProvider scope="canvas" debugId="main-canvas">
      <Canvas />

      {/* 사이드바 (우선순위: 600) */}
      <ScopeProvider scope="sidebar" debugId="main-sidebar">
        <Sidebar />

        {/* 사이드바 내부 에디터 (우선순위: 700) */}
        <ScopeProvider scope="editor" debugId="sidebar-editor">
          <InlineEditor />
        </ScopeProvider>
      </ScopeProvider>

      {/* 모달 (최고 우선순위: 1000) */}
      {modalOpen && (
        <ScopeProvider scope="modal" when={modalOpen} debugId="settings-modal">
          <Modal onClose={() => setModalOpen(false)}>
            <h2>Settings</h2>

            {/* 모달 내부 툴팁 (우선순위: 800) */}
            {tooltipVisible && (
              <ScopeProvider scope="tooltip" when={tooltipVisible}>
                <Tooltip />
              </ScopeProvider>
            )}
          </Modal>
        </ScopeProvider>
      )}
    </ScopeProvider>
  );
}
```

**결과**:
```
modalOpen && tooltipVisible:
  activeScopes = ['modal', 'tooltip', 'editor', 'sidebar', 'canvas', 'global']
  primaryScope = 'modal' (1000)

!modalOpen:
  activeScopes = ['editor', 'sidebar', 'canvas', 'global']
  primaryScope = 'editor' (700)
```

---

## Scope Composition

### 패턴: Higher-Order Component로 스코프 주입

```tsx
// HOC: withScope
function withScope<P extends object>(
  Component: React.ComponentType<P>,
  scope: Scope,
  options?: { debugId?: string }
) {
  return function WithScope(props: P) {
    useScopeRegistration(scope, {
      enabled: true,
      debugId: options?.debugId,
    });

    return <Component {...props} />;
  };
}

// 사용
const EditorWithScope = withScope(Editor, 'editor', { debugId: 'main-editor' });
const SidebarWithScope = withScope(Sidebar, 'sidebar', { debugId: 'main-sidebar' });

function App() {
  return (
    <>
      <EditorWithScope content="Hello" />
      <SidebarWithScope items={[]} />
    </>
  );
}
```

### 패턴: Render Props로 스코프 제공

```tsx
function ScopeRenderer({
  scope,
  children,
}: {
  scope: Scope;
  children: (scopeProps: { isActive: boolean; isPrimary: boolean }) => React.ReactNode;
}) {
  const activeScopes = useActiveScopes();
  const primaryScope = usePrimaryScope();

  const isActive = activeScopes.includes(scope);
  const isPrimary = primaryScope === scope;

  useScopeRegistration(scope, { enabled: isActive });

  return <>{children({ isActive, isPrimary })}</>;
}

// 사용
<ScopeRenderer scope="editor">
  {({ isActive, isPrimary }) => (
    <div className={`editor ${isActive ? 'active' : ''} ${isPrimary ? 'primary' : ''}`}>
      <Editor />
    </div>
  )}
</ScopeRenderer>;
```

---

## Time-based Scopes

### 패턴: 자동 해제되는 임시 스코프

```tsx
function TemporaryScopeProvider({
  scope,
  duration = 3000,
  children,
}: {
  scope: Scope;
  duration?: number;
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useScopeRegistration(scope, { enabled: isActive });

  if (!isActive) return null;

  return <>{children}</>;
}

// 사용: 3초 후 자동으로 사라지는 툴팁
function AutoDismissTooltip() {
  return (
    <TemporaryScopeProvider scope="tooltip" duration={3000}>
      <div className="tooltip">This will disappear in 3 seconds</div>
    </TemporaryScopeProvider>
  );
}
```

### 패턴: 지연 활성화 스코프

```tsx
function DelayedScope({
  scope,
  delay = 1000,
  children,
}: {
  scope: Scope;
  delay?: number;
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useScopeRegistration(scope, { enabled: isReady });

  return (
    <>
      {!isReady && <LoadingSpinner />}
      {isReady && children}
    </>
  );
}
```

---

## Context-aware Actions

### 패턴: 스코프별 다른 동작

```tsx
function SmartSaveButton() {
  const activeScopes = useActiveScopes();

  const handleSave = () => {
    if (activeScopes.includes('editor')) {
      // 에디터 내용 저장
      saveEditorContent();
      toast.success('Editor saved');
    } else if (activeScopes.includes('canvas')) {
      // 캔버스 저장
      saveCanvasState();
      toast.success('Canvas saved');
    } else if (activeScopes.includes('modal')) {
      // 모달 설정 저장
      saveModalSettings();
      toast.success('Settings saved');
    } else {
      // 전체 프로젝트 저장
      saveProject();
      toast.success('Project saved');
    }
  };

  const getButtonLabel = () => {
    if (activeScopes.includes('editor')) return 'Save Document';
    if (activeScopes.includes('canvas')) return 'Save Canvas';
    if (activeScopes.includes('modal')) return 'Save Settings';
    return 'Save Project';
  };

  return (
    <button onClick={handleSave} className="save-button">
      {getButtonLabel()}
    </button>
  );
}
```

### 패턴: 스코프 기반 단축키 핸들링

```tsx
function ScopeAwareShortcuts() {
  const activeScopes = useActiveScopes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();

        const primaryScope = activeScopes[0];

        switch (primaryScope) {
          case 'modal':
            saveModalSettings();
            break;
          case 'editor':
            saveDocument();
            break;
          case 'canvas':
            saveCanvas();
            break;
          default:
            saveProject();
        }
      }

      // Escape
      if (e.key === 'Escape') {
        // 우선순위 높은 스코프부터 닫기
        if (activeScopes.includes('modal')) {
          closeModal();
        } else if (activeScopes.includes('overlay')) {
          closeOverlay();
        } else if (activeScopes.includes('tooltip')) {
          closeTooltip();
        }
      }

      // Ctrl+Z (Undo)
      if (e.ctrlKey && e.key === 'z') {
        if (activeScopes.includes('editor')) {
          editorUndo();
        } else if (activeScopes.includes('canvas')) {
          canvasUndo();
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

## Scope Animations

### 패턴: 스코프 전환 애니메이션

```tsx
function AnimatedScopeTransition() {
  const [isAnimating, setIsAnimating] = useState(false);
  const primaryScope = usePrimaryScope();
  const prevScopeRef = useRef(primaryScope);

  useScopeTransition((prev, current) => {
    if (prev[0] !== current[0]) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  });

  return (
    <div
      className={`app-container ${isAnimating ? 'transitioning' : ''}`}
      data-scope={primaryScope}
    >
      {/* 스코프별 배경색 전환 애니메이션 */}
      <style>{`
        .app-container {
          transition: background-color 0.3s ease;
        }
        .app-container[data-scope="canvas"] {
          background-color: #f0f0f0;
        }
        .app-container[data-scope="editor"] {
          background-color: #fff;
        }
        .app-container[data-scope="modal"] {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <Content />
    </div>
  );
}
```

### 패턴: 스코프별 UI 전환

```tsx
function ScopeDrivenLayout() {
  const activeScopes = useActiveScopes();
  const isCanvasMode = activeScopes.includes('canvas');
  const isEditorMode = activeScopes.includes('editor');

  return (
    <motion.div
      layout
      animate={{
        gridTemplateColumns: isCanvasMode ? '1fr' : isEditorMode ? '300px 1fr' : '200px 1fr 300px',
      }}
      transition={{ duration: 0.3 }}
      className="layout-grid"
    >
      {!isCanvasMode && <Sidebar />}
      <MainContent />
      {!isCanvasMode && !isEditorMode && <RightPanel />}
    </motion.div>
  );
}
```

---

## 고급 패턴: Scope State Machine

### 패턴: 상태 머신으로 스코프 관리

```tsx
type AppState = 'idle' | 'editing' | 'reviewing' | 'publishing';

const scopesByState: Record<AppState, Scope[]> = {
  idle: ['global', 'canvas'],
  editing: ['editor', 'canvas', 'global'],
  reviewing: ['overlay', 'canvas', 'global'],
  publishing: ['modal', 'global'],
};

function StateMachineDrivenScopes() {
  const [appState, setAppState] = useState<AppState>('idle');
  const requiredScopes = scopesByState[appState];

  // 각 상태에 맞는 스코프 자동 등록
  requiredScopes.forEach((scope) => {
    useScopeRegistration(scope, {
      enabled: true,
      debugId: `state-${appState}-${scope}`,
    });
  });

  const transitionTo = (newState: AppState) => {
    // 상태 전환 로직
    console.log(`Transitioning: ${appState} → ${newState}`);
    setAppState(newState);
  };

  return (
    <div>
      <div className="state-controls">
        <button onClick={() => transitionTo('idle')}>Idle</button>
        <button onClick={() => transitionTo('editing')}>Edit</button>
        <button onClick={() => transitionTo('reviewing')}>Review</button>
        <button onClick={() => transitionTo('publishing')}>Publish</button>
      </div>

      <div className="current-state">
        <h3>Current State: {appState}</h3>
        <p>Active Scopes: {requiredScopes.join(', ')}</p>
      </div>

      {/* 상태별 컨텐츠 */}
      {appState === 'editing' && <Editor />}
      {appState === 'reviewing' && <ReviewOverlay />}
      {appState === 'publishing' && <PublishModal />}
    </div>
  );
}
```

---

## 고급 패턴: Scope Middleware

### 패턴: 스코프 변경 인터셉트

```tsx
function ScopeMiddleware({
  onBeforeChange,
  onAfterChange,
  children,
}: {
  onBeforeChange?: (prev: Scope[], next: Scope[]) => boolean; // false 반환 시 취소
  onAfterChange?: (prev: Scope[], next: Scope[]) => void;
  children: React.ReactNode;
}) {
  const activeScopes = useActiveScopes();
  const prevScopesRef = useRef(activeScopes);

  useScopeTransition((prev, current) => {
    // Before 훅
    if (onBeforeChange) {
      const shouldProceed = onBeforeChange(prev, current);
      if (!shouldProceed) {
        // 스코프 변경 취소 (rollback)
        console.warn('Scope change cancelled by middleware');
        return;
      }
    }

    // After 훅
    if (onAfterChange) {
      onAfterChange(prev, current);
    }

    prevScopesRef.current = current;
  });

  return <>{children}</>;
}

// 사용: Unsaved changes 경고
function UnsavedChangesGuard() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  return (
    <ScopeMiddleware
      onBeforeChange={(prev, next) => {
        // 에디터를 떠나려 할 때
        if (prev.includes('editor') && !next.includes('editor')) {
          if (hasUnsavedChanges) {
            const confirmed = window.confirm('You have unsaved changes. Continue?');
            return confirmed;
          }
        }
        return true;
      }}
      onAfterChange={(prev, next) => {
        console.log('Scope changed:', prev, '→', next);
      }}
    >
      <Editor onChange={() => setHasUnsavedChanges(true)} />
    </ScopeMiddleware>
  );
}
```

---

## 고급 패턴: Scope Analytics

### 패턴: 사용자 행동 추적

```tsx
function ScopeAnalyticsTracker() {
  const history = useScopeHistory(100);

  useEffect(() => {
    // 스코프 전환 패턴 분석
    const transitions = history.reduce((acc, t) => {
      const key = `${t.from.join(',')} → ${t.to.join(',')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 가장 빈번한 전환 찾기
    const mostCommon = Object.entries(transitions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    console.log('Most common transitions:', mostCommon);

    // Analytics 서버로 전송
    sendAnalytics('scope_patterns', {
      transitions: mostCommon,
      totalTransitions: history.length,
    });
  }, [history]);

  return null;
}
```

---

**관련 문서**:
- [basic-usage.md](./basic-usage) - 기본 사용법
- [integration-examples.md](./integration-examples) - 통합 예시
- [04-phase3-react-hooks.md](../04-phase3-react-hooks) - React Hooks
