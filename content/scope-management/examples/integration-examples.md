# Integration Examples - 통합 예시

> 실제 프로젝트에 Scope Management를 통합하는 완전한 예시

---

## 📋 목차

1. [전체 애플리케이션 통합](#전체-애플리케이션-통합)
2. [Canvas 통합](#canvas-통합)
3. [에디터 통합](#에디터-통합)
4. [모달/다이얼로그 통합](#모달다이얼로그-통합)
5. [키보드 매니저 통합](#키보드-매니저-통합)
6. [Redux 전체 통합](#redux-전체-통합)

---

## 전체 애플리케이션 통합

### App.tsx - 초기화 및 설정

```tsx
// src/App.tsx

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { GlobalKeyboardManager } from '@/engine/utils/GlobalKeyboardManager';
import { DOMScopeDetector } from '@/engine/utils/scope/DOMScopeDetector';

// 디버그 컴포넌트 (개발 환경만)
import { ScopeInspector } from '@/components/Debug/ScopeInspector';
import { ScopePerformanceMonitor } from '@/components/Debug/ScopePerformanceMonitor';

// 메인 컴포넌트
import { CanvasView } from '@/components/Canvas/CanvasView';
import { Sidebar } from '@/components/Sidebar';
import { ChatPanel } from '@/components/Chat/ChatPanel';

function App() {
  // Scope Manager 초기화
  useEffect(() => {
    console.log('[App] Initializing Scope Manager...');

    // 1. Detector 생성
    const detector = new DOMScopeDetector({
      useMutationObserver: true,
      useFocusEvents: true,
      fallbackPollingInterval: Infinity, // 폴링 비활성화
      debug: process.env.NODE_ENV === 'development',
    });

    detector.initialize();

    // 2. ScopeManager 가져오기 (싱글톤)
    const keyboardManager = GlobalKeyboardManager.getInstance();
    const scopeManager = keyboardManager.getScopeManager();

    // 3. Redux 동기화 활성화
    scopeManager.setupReduxSync();

    // 4. 시작
    scopeManager.start();

    console.log('[App] Scope Manager initialized');

    // 5. 정리
    return () => {
      console.log('[App] Cleaning up Scope Manager...');
      scopeManager.dispose();
      detector.dispose();
    };
  }, []);

  return (
    <Provider store={store}>
      <div className="app-container">
        {/* 메인 레이아웃 */}
        <Sidebar />
        <CanvasView />
        <ChatPanel />

        {/* 디버그 패널 (개발 환경만) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <ScopeInspector />
            <ScopePerformanceMonitor />
          </div>
        )}
      </div>
    </Provider>
  );
}

export default App;
```

---

## Canvas 통합

### CanvasView.tsx

```tsx
// src/components/Canvas/CanvasView.tsx

import { useEffect, useRef } from 'react';
import { useScopeRegistration } from '@/hooks/useScopeRegistration';
import { useScopeCheck } from '@/hooks/useScopeCheck';
import { CanvasEngine } from '@/engine/core/CanvasEngine';

export function CanvasView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CanvasEngine | null>(null);

  // Canvas 스코프 등록
  const [isFocused, setIsFocused] = useState(false);

  useScopeRegistration('canvas', {
    enabled: isFocused,
    debugId: 'main-canvas',
  });

  // 모달이 열려있으면 Canvas 비활성화
  const isModalActive = useScopeCheck('modal');

  useEffect(() => {
    if (!canvasRef.current) return;

    // Canvas Engine 초기화
    const engine = new CanvasEngine(canvasRef.current, {
      enablePerformanceMonitoring: true,
    });

    engine.start();
    engineRef.current = engine;

    console.log('[Canvas] Engine initialized');

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // 포커스 추적
  const handleFocus = () => {
    console.log('[Canvas] Focused');
    setIsFocused(true);
  };

  const handleBlur = () => {
    console.log('[Canvas] Blurred');
    setIsFocused(false);
  };

  return (
    <div
      className={`canvas-container ${isModalActive ? 'disabled' : ''}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <canvas ref={canvasRef} />

      {isModalActive && (
        <div className="canvas-overlay">
          <p>Canvas is disabled while modal is open</p>
        </div>
      )}
    </div>
  );
}
```

---

## 에디터 통합

### Editor.tsx

```tsx
// src/components/Editor/Editor.tsx

import { useState, useEffect } from 'react';
import { ScopeProvider } from '@/components/Common/ScopeProvider';
import { useScopeTransition } from '@/hooks/useScopeTransition';
import { useScopeCheck } from '@/hooks/useScopeCheck';

export function Editor() {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isEditorActive = useScopeCheck('editor');

  // 에디터를 떠날 때 자동 저장
  useScopeTransition((prev, current) => {
    const wasEditor = prev.includes('editor');
    const isEditor = current.includes('editor');

    if (wasEditor && !isEditor && isDirty) {
      console.log('[Editor] Auto-saving on scope exit...');
      saveContent(content);
      setIsDirty(false);
    }
  }, [content, isDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    saveContent(content);
    setIsDirty(false);
  };

  return (
    <ScopeProvider scope="editor" when={isFocused} debugId="main-editor">
      <div className="editor-container">
        <div className="editor-toolbar">
          <button onClick={handleSave} disabled={!isDirty}>
            Save {isDirty && '*'}
          </button>
          <span className="scope-indicator">
            {isEditorActive ? '🟢 Editor Active' : '⚪ Editor Inactive'}
          </span>
        </div>

        <textarea
          value={content}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Start typing..."
          className="editor-textarea"
        />
      </div>
    </ScopeProvider>
  );
}

async function saveContent(content: string) {
  // API 호출
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  console.log('[Editor] Saved');
}
```

---

## 모달/다이얼로그 통합

### Modal.tsx

```tsx
// src/components/Common/Modal/Modal.tsx

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ScopeProvider } from '@/components/Common/ScopeProvider';
import { useScopeCheck } from '@/hooks/useScopeCheck';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  debugId?: string;
}

export function Modal({ isOpen, onClose, title, children, debugId }: ModalProps) {
  const isModalActive = useScopeCheck('modal');

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalActive) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isModalActive, onClose]);

  // Body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <ScopeProvider scope="modal" when={isOpen} debugId={debugId || 'modal'}>
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button onClick={onClose} className="modal-close">
              ✕
            </button>
          </div>

          <div className="modal-body">{children}</div>
        </div>
      </div>
    </ScopeProvider>,
    document.body
  );
}

// 사용 예시
export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" debugId="settings-modal">
      <div className="settings-form">
        <label>
          Theme:
          <select>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </label>

        <label>
          Language:
          <select>
            <option>English</option>
            <option>한국어</option>
          </select>
        </label>

        <button onClick={onClose}>Save</button>
      </div>
    </Modal>
  );
}
```

---

## 키보드 매니저 통합

### GlobalShortcutHandler.tsx

```tsx
// src/components/Common/GlobalShortcutHandler.tsx

import { useEffect } from 'react';
import { useActiveScopes } from '@/hooks/useActiveScopes';
import { usePrimaryScope } from '@/hooks/usePrimaryScope';
import { GlobalKeyboardManager } from '@/engine/utils/GlobalKeyboardManager';

export function GlobalShortcutHandler() {
  const activeScopes = useActiveScopes();
  const primaryScope = usePrimaryScope();

  useEffect(() => {
    const keyboardManager = GlobalKeyboardManager.getInstance();

    // Canvas 스코프 단축키
    keyboardManager.registerShortcut({
      key: 'Ctrl+D',
      scope: 'canvas',
      action: () => {
        console.log('[Shortcut] Duplicate on canvas');
        duplicateSelectedPieces();
      },
      description: 'Duplicate selected pieces',
    });

    // Editor 스코프 단축키
    keyboardManager.registerShortcut({
      key: 'Ctrl+B',
      scope: 'editor',
      action: () => {
        console.log('[Shortcut] Bold in editor');
        applyBoldFormatting();
      },
      description: 'Bold text',
    });

    // Global 스코프 단축키 (항상 동작)
    keyboardManager.registerShortcut({
      key: 'Ctrl+K',
      scope: 'global',
      action: () => {
        console.log('[Shortcut] Open command palette');
        openCommandPalette();
      },
      description: 'Open command palette',
    });

    // Modal 스코프 단축키
    keyboardManager.registerShortcut({
      key: 'Escape',
      scope: 'modal',
      action: () => {
        console.log('[Shortcut] Close modal');
        closeTopModal();
      },
      description: 'Close modal',
    });

    console.log('[Shortcuts] Registered all shortcuts');

    return () => {
      // 정리 (필요시)
    };
  }, []);

  // 스코프 변경 로그
  useEffect(() => {
    console.log('[Shortcuts] Active scopes:', activeScopes);
    console.log('[Shortcuts] Primary scope:', primaryScope);
  }, [activeScopes, primaryScope]);

  return null;
}

// Helper functions
function duplicateSelectedPieces() {
  // Canvas 피스 복제 로직
}

function applyBoldFormatting() {
  // 에디터 볼드 처리
}

function openCommandPalette() {
  // 커맨드 팔레트 열기
}

function closeTopModal() {
  // 최상위 모달 닫기
}
```

---

## Redux 전체 통합

### store/index.ts

```typescript
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducers
import pieceReducer from './slices/pieceSlice';
import chatReducer from './slices/chatSlice';
import uiLayoutReducer from './slices/uiLayoutSlice';
import scopeReducer from './slices/scopeSlice'; // ✅ 추가

// Middleware
import { scopeLoggerMiddleware } from './middleware/scopeLogger';

// Persist 설정
const uiLayoutPersistConfig = {
  key: 'uiLayout',
  storage,
  whitelist: ['chatPanelWidth', 'sidebarCollapsed'],
};

const scopePersistConfig = {
  key: 'scope',
  storage,
  whitelist: ['debug'], // debug 모드만 영속화
};

export const store = configureStore({
  reducer: {
    pieces: pieceReducer,
    chat: chatReducer,
    uiLayout: persistReducer(uiLayoutPersistConfig, uiLayoutReducer),
    scope: persistReducer(scopePersistConfig, scopeReducer), // ✅ 추가
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(scopeLoggerMiddleware), // ✅ 미들웨어 추가
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### middleware/scopeLogger.ts

```typescript
// src/store/middleware/scopeLogger.ts

import { Middleware } from '@reduxjs/toolkit';

export const scopeLoggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type.startsWith('scope/')) {
    const stateBefore = store.getState().scope;

    console.group(`[Redux Scope] ${action.type}`);
    console.log('Payload:', action.payload);
    console.log('State before:', stateBefore);

    const result = next(action);

    const stateAfter = store.getState().scope;
    console.log('State after:', stateAfter);
    console.groupEnd();

    return result;
  }

  return next(action);
};
```

---

## 전체 통합 예시

### main.tsx

```tsx
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import App from './App';
import './index.css';

// Global Shortcut Handler
import { GlobalShortcutHandler } from '@/components/Common/GlobalShortcutHandler';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Global shortcuts */}
        <GlobalShortcutHandler />

        {/* Main App */}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
```

### index.css

```css
/* src/index.css */

/* Scope-based 스타일 */
.app-container[data-scope='canvas'] {
  --primary-color: #4a90e2;
}

.app-container[data-scope='editor'] {
  --primary-color: #50c878;
}

.app-container[data-scope='modal'] {
  --primary-color: #f39c12;
}

/* Modal 열릴 때 배경 blur */
.app-container.modal-active .canvas-container,
.app-container.modal-active .sidebar {
  filter: blur(3px);
  pointer-events: none;
}

/* Canvas 비활성화 오버레이 */
.canvas-container.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.canvas-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
}
```

---

## 디버그 컴포넌트

### ScopeInspector.tsx

```tsx
// src/components/Debug/ScopeInspector.tsx

import { useActiveScopes } from '@/hooks/useActiveScopes';
import { usePrimaryScope } from '@/hooks/usePrimaryScope';
import { useScopeHistory } from '@/hooks/useScopeHistory';
import { useSelector } from 'react-redux';
import { selectComponentScopes } from '@/store/selectors/scopeSelectors';

export function ScopeInspector() {
  const activeScopes = useActiveScopes();
  const primaryScope = usePrimaryScope();
  const history = useScopeHistory(10);
  const componentScopes = useSelector(selectComponentScopes);

  return (
    <div className="scope-inspector">
      <h3>🔍 Scope Inspector</h3>

      <div className="section">
        <h4>Active Scopes</h4>
        <ul>
          {activeScopes.map((scope, i) => (
            <li key={scope} className={i === 0 ? 'primary' : ''}>
              {scope} {i === 0 && '⭐'}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>Primary Scope</h4>
        <div className="primary-scope">{primaryScope}</div>
      </div>

      <div className="section">
        <h4>Recent History (10)</h4>
        <ul className="history">
          {history.map((t, i) => (
            <li key={i}>
              <span className="from">{t.from.join(', ')}</span>
              <span className="arrow">→</span>
              <span className="to">{t.to.join(', ')}</span>
              <small>{new Date(t.timestamp).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>Component Scopes</h4>
        <table>
          <thead>
            <tr>
              <th>Component ID</th>
              <th>Scope</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(componentScopes).map(([id, data]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{data.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 프로덕션 배포 체크리스트

```typescript
// 1. Debug 모드 비활성화
const detector = new DOMScopeDetector({
  debug: process.env.NODE_ENV === 'development', // ✅
});

// 2. Redux DevTools 비활성화
export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production', // ✅
});

// 3. 디버그 컴포넌트 제거
{
  process.env.NODE_ENV === 'development' && <ScopeInspector />;
}

// 4. 성능 모니터링 (프로덕션에서는 샘플링)
const enableMonitoring =
  process.env.NODE_ENV === 'development' || Math.random() < 0.01; // 1% 샘플링

// 5. 에러 핸들링
try {
  scopeManager.start();
} catch (error) {
  console.error('[Scope] Failed to start:', error);
  // Fallback to old system or disable scope features
}
```

---

**관련 문서**:
- [basic-usage.md](./basic-usage) - 기본 사용법
- [advanced-patterns.md](./advanced-patterns) - 고급 패턴
- [07-migration-guide.md](../07-migration-guide) - 마이그레이션 가이드
