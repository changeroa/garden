# Basic Usage Examples

> 기본적인 Scope Management 사용 예제

---

## 예제 1: Detector 초기화

```typescript
import { DOMScopeDetector } from '@/engine/utils/scope';

// Detector 생성 및 초기화
const detector = new DOMScopeDetector({
  debug: true,
  useMutationObserver: true,
  useFocusEvents: true,
});

detector.initialize();

// 스코프 변경 감지
detector.onScopeChange((scopes) => {
  console.log('Active scopes:', scopes);
});

// 정리
window.addEventListener('beforeunload', () => {
  detector.dispose();
});
```

---

## 예제 2: ScopeManager 사용

```typescript
import { ScopeManager } from '@/engine/utils/ScopeManager';
import { DOMScopeDetector } from '@/engine/utils/scope';

// Manager 생성
const detector = new DOMScopeDetector();
const manager = new ScopeManager(detector, true);

// 시작
manager.start();

// 리스너 추가
const unsubscribe = manager.addEventListener((event) => {
  console.log('Scope transition:', {
    from: event.previousScopes,
    to: event.currentScopes,
    trigger: event.triggeredBy,
  });
});

// 나중에 정리
unsubscribe();
manager.dispose();
```

---

## 예제 3: React Hook 사용

```tsx
import { useActiveScopes, useScopeCheck } from '@/hooks';

function MyComponent() {
  // 현재 활성 스코프
  const activeScopes = useActiveScopes();

  // 특정 스코프 체크
  const isEditorActive = useScopeCheck('editor');

  return (
    <div>
      <p>Active: {activeScopes.join(', ')}</p>
      {isEditorActive && <p>Editor is active!</p>}
    </div>
  );
}
```

---

## 예제 4: ScopeProvider 사용

```tsx
import { ScopeProvider } from '@/components/Common/ScopeProvider';

function Modal({ isOpen, children }) {
  return (
    <ScopeProvider scope="modal" when={isOpen}>
      <div className="modal">
        {children}
      </div>
    </ScopeProvider>
  );
}

// 사용
function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        Open Modal
      </button>

      <Modal isOpen={modalOpen}>
        <h2>Settings</h2>
      </Modal>
    </>
  );
}
```

---

## 예제 5: Redux 통합

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { scopeChanged, selectActiveScopes } from '@/store/slices/scopeSlice';

function ScopeDebug() {
  const dispatch = useDispatch();
  const activeScopes = useSelector(selectActiveScopes);

  const handleForceUpdate = () => {
    dispatch(scopeChanged({
      scopes: ['canvas', 'global'],
      trigger: 'manual'
    }));
  };

  return (
    <div>
      <p>Scopes: {activeScopes.join(', ')}</p>
      <button onClick={handleForceUpdate}>
        Force Update
      </button>
    </div>
  );
}
```

---

더 많은 예제는 [advanced-patterns.md](./advanced-patterns)를 참조하세요.
