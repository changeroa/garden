# Troubleshooting - 트러블슈팅 가이드

> **문제 해결을 위한 완벽 가이드**

---

## 📋 목차

1. [일반적인 문제](#일반적인-문제)
2. [성능 이슈](#성능-이슈)
3. [통합 문제](#통합-문제)
4. [디버깅 도구](#디버깅-도구)
5. [FAQ](#faq)

---

## 일반적인 문제

### 문제 1: 스코프가 업데이트되지 않음

**증상**:
```tsx
const activeScopes = useActiveScopes();
// 모달을 열었는데 activeScopes가 ['global']에서 변경되지 않음
```

**원인**:
1. ScopeManager가 시작되지 않음
2. Redux 동기화가 비활성화됨
3. Detector가 DOM 변경을 감지하지 못함

**해결**:

```typescript
// 1. ScopeManager 시작 확인
useEffect(() => {
  const manager = GlobalKeyboardManager.getInstance().getScopeManager();
  manager.start(); // ✅ 시작 필수
}, []);

// 2. Redux 동기화 확인
const manager = GlobalKeyboardManager.getInstance().getScopeManager();
manager.setupReduxSync(); // ✅ Redux 동기화 활성화

// 3. Detector 초기화 확인
const detector = new DOMScopeDetector({ debug: true });
detector.initialize(); // ✅ 초기화 필수
```

**검증**:
```bash
# Redux DevTools에서 확인:
# - scope/scopeChanged 액션이 발생하는지
# - state.scope.activeScopes가 업데이트되는지
```

---

### 문제 2: 스코프가 너무 자주 변경됨

**증상**:
```
[Scope] Changed: ['global'] → ['global', 'canvas'] (trigger: dom-mutation)
[Scope] Changed: ['global', 'canvas'] → ['global'] (trigger: dom-mutation)
[Scope] Changed: ['global'] → ['global', 'canvas'] (trigger: dom-mutation)
# 무한 반복...
```

**원인**:
- DOM 변경이 스코프 변경을 유발하고, 스코프 변경이 다시 DOM 변경을 유발하는 순환

**해결**:

```typescript
// ❌ 잘못된 패턴
useScopeTransition((prev, current) => {
  // DOM 조작 (다시 스코프 변경 유발)
  document.querySelector('.canvas')?.classList.toggle('active');
});

// ✅ 올바른 패턴
useScopeTransition((prev, current) => {
  // 상태만 변경 (DOM은 React가 처리)
  setIsCanvasActive(current.includes('canvas'));
});
```

**추가 검증**:
```typescript
// DOMScopeDetector에 debounce 추가
export class DOMScopeDetector {
  private updateDebounceTimer: number | null = null;

  private scheduleUpdate(trigger: string): void {
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }

    this.updateDebounceTimer = window.setTimeout(() => {
      this.updateScopes(trigger);
      this.updateDebounceTimer = null;
    }, 50); // 50ms debounce
  }
}
```

---

### 문제 3: TypeScript 타입 에러

**증상**:
```typescript
const scope: Scope = 'my-custom-scope';
// Error: Type '"my-custom-scope"' is not assignable to type 'Scope'
```

**원인**:
- 동적 스코프를 사용하는데 타입이 정의되지 않음

**해결**:

```typescript
// Phase 4 동적 스코프 사용 시
type DynamicScope = `panel:${string}` | `widget:${string}`;
type Scope = BaseScope | DynamicScope;

const scope: Scope = 'panel:chat-123'; // ✅

// 또는 타입 단언
const scope = 'my-custom-scope' as Scope;
```

---

### 문제 4: ScopeProvider가 작동하지 않음

**증상**:
```tsx
<ScopeProvider scope="modal" when={isOpen}>
  <Modal />
</ScopeProvider>
// 모달이 열려도 스코프가 'modal'로 변경되지 않음
```

**원인**:
1. Redux Provider가 없음
2. `when` prop이 항상 false
3. componentScope 등록이 안 됨

**해결**:

```tsx
// 1. Redux Provider 확인
<Provider store={store}>
  <App />
</Provider>

// 2. when prop 확인
console.log('isOpen:', isOpen); // ✅ true인지 확인

// 3. 디버그 ID로 추적
<ScopeProvider scope="modal" when={isOpen} debugId="settings-modal">
  <Modal />
</ScopeProvider>

// Redux DevTools에서:
// state.scope.componentScopes['settings-modal'] 확인
```

---

## 성능 이슈

### 문제 5: DOM 쿼리가 많음

**증상**:
```
Performance Monitor:
DOM Queries: 500/sec
```

**원인**:
- MutationObserver가 비활성화되고 폴링 모드로 동작

**해결**:

```typescript
// 1. MutationObserver 활성화 확인
const detector = new DOMScopeDetector({
  useMutationObserver: true, // ✅ true로 설정
  useFocusEvents: true,
  fallbackPollingInterval: 1000, // 폴백만 느리게
});

// 2. 폴링 모드 완전 비활성화
const detector = new DOMScopeDetector({
  useMutationObserver: true,
  useFocusEvents: true,
  fallbackPollingInterval: Infinity, // 폴링 비활성화
});
```

**검증**:
```typescript
detector.getDebugInfo();
// {
//   mode: 'mutation-observer', // ✅ 확인
//   queriesPerSecond: 5 // ✅ 낮아야 함
// }
```

---

### 문제 6: React 리렌더링이 많음

**증상**:
```tsx
function MyComponent() {
  const activeScopes = useActiveScopes();
  console.log('Rendered'); // 너무 자주 출력됨
}
```

**원인**:
- 스코프가 변경될 때마다 모든 컴포넌트가 리렌더링됨

**해결**:

```tsx
// ❌ 전체 스코프 구독
const activeScopes = useActiveScopes();
const isEditor = activeScopes.includes('editor');

// ✅ 특정 스코프만 구독
const isEditor = useScopeCheck('editor');

// ✅ 메모이제이션
const canEdit = useMemoizedScopeCheck((scopes) => {
  return scopes.includes('editor') && !scopes.includes('modal');
});
```

**추가 최적화**:
```tsx
// React.memo로 컴포넌트 메모이제이션
export const MyComponent = React.memo(() => {
  const isEditor = useScopeCheck('editor');
  return <div>{isEditor ? 'Editor' : 'Default'}</div>;
});
```

---

### 문제 7: 메모리 누수

**증상**:
```
Memory usage keeps increasing
Heap size: 100MB → 200MB → 300MB...
```

**원인**:
1. 이벤트 리스너 미해제
2. 히스토리 무제한 증가
3. Detector dispose 누락

**해결**:

```typescript
// 1. 리스너 정리
useEffect(() => {
  const unsubscribe = detector.onScopeChange((scopes) => {
    // ...
  });

  return () => {
    unsubscribe(); // ✅ 정리 필수
  };
}, []);

// 2. 히스토리 제한 (이미 구현됨)
// scopeSlice.ts에서 자동으로 100개 제한

// 3. Detector dispose
useEffect(() => {
  const detector = new DOMScopeDetector();
  detector.initialize();

  return () => {
    detector.dispose(); // ✅ 정리 필수
  };
}, []);
```

---

## 통합 문제

### 문제 8: Redux DevTools에서 액션이 보이지 않음

**증상**:
- Redux DevTools를 열어도 `scope/scopeChanged` 액션이 안 보임

**원인**:
1. Redux 동기화가 안 됨
2. Redux DevTools Extension 미설치
3. Store 설정 문제

**해결**:

```typescript
// 1. Redux 동기화 확인
const manager = GlobalKeyboardManager.getInstance().getScopeManager();
manager.setupReduxSync(); // ✅

// 2. Redux DevTools Extension 설치
// Chrome: https://chrome.google.com/webstore/detail/redux-devtools

// 3. Store 설정 확인
export const store = configureStore({
  reducer: {
    scope: scopeReducer, // ✅ scope reducer 추가
  },
  devTools: process.env.NODE_ENV !== 'production', // ✅ DevTools 활성화
});
```

---

### 문제 9: 기존 코드와 충돌

**증상**:
```
Error: ScopeManager is already running
```

**원인**:
- 기존 ScopeManager와 새 ScopeManager가 동시에 실행됨

**해결**:

```typescript
// ❌ 중복 시작
const manager1 = new ScopeManager();
manager1.start();

const manager2 = new ScopeManager();
manager2.start(); // Error!

// ✅ 싱글톤 사용
const keyboardManager = GlobalKeyboardManager.getInstance();
const scopeManager = keyboardManager.getScopeManager();
scopeManager.start(); // OK
```

**마이그레이션 호환성**:
```typescript
// Phase 1: 기존 코드 유지하면서 새 코드 추가
const manager = new ScopeManager(new DOMScopeDetector());

// 기존 API 계속 사용 가능
manager.startAutoDetection(100); // deprecated but works

// 새 API로 전환
manager.start(); // ✅ 권장
```

---

## 디버깅 도구

### 1. Debug Mode 활성화

```typescript
// Detector 디버그
const detector = new DOMScopeDetector({ debug: true });

// ScopeManager 디버그
const manager = new ScopeManager(detector, true);

// Redux 디버그
dispatch(setScopeDebug(true));
```

**출력 예시**:
```
[DOMScopeDetector] Modal detected: true
[DOMScopeDetector] Active scopes: ['modal', 'global']
[ScopeManager] Scope changed: ['global'] → ['modal', 'global']
[Scope] Component registered: settings-modal modal
```

### 2. Performance Monitor

```typescript
// src/components/Debug/ScopePerformanceMonitor.tsx

export function ScopePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    queriesPerSecond: 0,
    avgUpdateTime: 0,
  });

  useEffect(() => {
    const detector = GlobalKeyboardManager.getInstance()
      .getScopeManager()
      .getDetector();

    const interval = setInterval(() => {
      const debugInfo = detector.getDebugInfo();
      setMetrics({
        queriesPerSecond: debugInfo.queriesPerSecond || 0,
        avgUpdateTime: debugInfo.avgUpdateTime || 0,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="perf-monitor">
      <div>Queries/sec: {metrics.queriesPerSecond.toFixed(1)}</div>
      <div>Avg Update: {metrics.avgUpdateTime.toFixed(2)}ms</div>
    </div>
  );
}
```

### 3. Scope Inspector

```typescript
// src/components/Debug/ScopeInspector.tsx

export function ScopeInspector() {
  const activeScopes = useActiveScopes();
  const history = useScopeHistory(10);
  const componentScopes = useSelector(selectComponentScopes);

  return (
    <div className="scope-inspector">
      <h3>Active Scopes</h3>
      <ul>
        {activeScopes.map((scope) => (
          <li key={scope}>{scope}</li>
        ))}
      </ul>

      <h3>Recent History</h3>
      <ul>
        {history.map((t, i) => (
          <li key={i}>
            {t.from.join(',')} → {t.to.join(',')}
          </li>
        ))}
      </ul>

      <h3>Component Scopes</h3>
      <table>
        <thead>
          <tr>
            <th>Component ID</th>
            <th>Scope</th>
            <th>Mounted At</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(componentScopes).map(([id, data]) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{data.scope}</td>
              <td>{new Date(data.mountedAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 4. Chrome DevTools Integration

```typescript
// 전역 디버그 함수 노출
if (process.env.NODE_ENV === 'development') {
  (window as any).__SCOPE_DEBUG__ = {
    getActiveScopes: () => {
      const manager = GlobalKeyboardManager.getInstance().getScopeManager();
      return manager.getActiveScopes();
    },

    forceUpdate: () => {
      const manager = GlobalKeyboardManager.getInstance().getScopeManager();
      manager.forceRefreshContext();
    },

    getHistory: () => {
      return store.getState().scope.history;
    },

    getMetrics: () => {
      const detector = GlobalKeyboardManager.getInstance()
        .getScopeManager()
        .getDetector();
      return detector.getDebugInfo();
    },
  };

  console.log('Scope Debug API available: window.__SCOPE_DEBUG__');
}
```

**Chrome Console 사용**:
```javascript
// 현재 스코프 조회
__SCOPE_DEBUG__.getActiveScopes()

// 강제 업데이트
__SCOPE_DEBUG__.forceUpdate()

// 히스토리 조회
__SCOPE_DEBUG__.getHistory()

// 성능 메트릭
__SCOPE_DEBUG__.getMetrics()
```

---

## FAQ

### Q1: Phase 1만 구현하고 나머지는 나중에 해도 되나요?

**A**: 네, 가능합니다. Phase 1은 완전히 독립적이며 하위 호환성을 유지합니다.

```typescript
// Phase 1만 구현:
const detector = new DOMScopeDetector();
const manager = new ScopeManager(detector);
manager.start();

// 나중에 Phase 2 추가:
manager.setupReduxSync();

// 나중에 Phase 3 추가:
// React Hooks 사용 시작
```

---

### Q2: 기존 코드를 수정해야 하나요?

**A**: Phase 1은 기존 코드를 수정할 필요가 없습니다. 기존 API가 계속 작동합니다.

```typescript
// 기존 코드 (계속 작동):
manager.startAutoDetection(100);

// 새 코드 (권장):
manager.start();
```

---

### Q3: 성능이 개선되지 않으면?

**A**: 다음 체크리스트를 확인하세요:

```typescript
// 1. MutationObserver 활성화 확인
const config = {
  useMutationObserver: true, // ✅
  useFocusEvents: true, // ✅
};

// 2. 폴링 비활성화
const config = {
  fallbackPollingInterval: Infinity, // ✅
};

// 3. 성능 메트릭 확인
detector.getDebugInfo();
// queriesPerSecond < 10 이어야 함
```

---

### Q4: 테스트는 어떻게 작성하나요?

**A**: MockScopeDetector를 사용하세요.

```typescript
import { MockScopeDetector } from '@/engine/utils/scope/MockScopeDetector';

test('should update scopes', () => {
  const mockDetector = new MockScopeDetector();
  const manager = new ScopeManager(mockDetector);

  manager.start();

  // 모킹
  mockDetector.setMockScopes(['modal', 'global']);
  mockDetector.triggerChange();

  // 검증
  expect(manager.getActiveScopes()).toEqual(['modal', 'global']);
});
```

---

### Q5: 프로덕션 배포 시 주의사항은?

**A**: 다음 사항을 확인하세요:

```typescript
// 1. Debug mode 비활성화
const detector = new DOMScopeDetector({
  debug: process.env.NODE_ENV === 'development', // ✅
});

// 2. Redux DevTools 비활성화
export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production', // ✅
});

// 3. Performance monitoring
// 프로덕션에서는 샘플링만
const shouldMonitor = Math.random() < 0.01; // 1% 샘플링
```

---

## 추가 도움말

### 문제 보고

GitHub Issues에 다음 정보와 함께 보고해주세요:

```
1. 증상 (스크린샷/에러 메시지)
2. 재현 방법
3. 환경 정보:
   - 브라우저 버전
   - React 버전
   - Phase (1/2/3/4)
4. Debug 출력:
   - detector.getDebugInfo()
   - Redux DevTools 스크린샷
```

### 커뮤니티 지원

- GitHub Discussions
- Discord (프로젝트 Discord 링크)
- Stack Overflow (`tag: ideallm-scope-management`)

---

**관련 문서**:
- [06-testing-strategy.md](./06-testing-strategy) - 테스트 전략
- [07-migration-guide.md](./07-migration-guide) - 마이그레이션 가이드
- [08-api-reference.md](./08-api-reference) - API 문서
