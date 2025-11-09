# Testing Strategy - 테스트 전략 완전 가이드

> **목표**: 테스트 커버리지 80% 달성

---

## 📋 목차

1. [테스트 개요](#테스트-개요)
2. [단위 테스트](#단위-테스트)
3. [통합 테스트](#통합-테스트)
4. [E2E 테스트](#e2e-테스트)
5. [성능 테스트](#성능-테스트)
6. [테스트 설정](#테스트-설정)

---

## 테스트 개요

### 테스트 피라미드

```
         ╱╲
        ╱E2E╲         5%  - 전체 플로우 검증
       ╱────────╲
      ╱ Integration ╲    15% - 모듈 간 통합
     ╱──────────────────╲
    ╱   Unit Tests      ╲  80% - 개별 함수/클래스
   ╱────────────────────────╲
```

### 테스트 커버리지 목표

| 컴포넌트 | 목표 | 우선순위 |
|----------|------|----------|
| IScopeDetector | 100% | P0 |
| DOMScopeDetector | 90% | P0 |
| ScopeManager | 90% | P0 |
| React Hooks | 85% | P1 |
| Redux Slice | 80% | P1 |
| Integration | 70% | P2 |

---

## 단위 테스트

### 1. DOMScopeDetector 테스트

**파일**: `tests/unit/scope/DOMScopeDetector.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DOMScopeDetector } from '@/engine/utils/scope/DOMScopeDetector';
import type { Scope } from '@/engine/utils/KeyboardTypes';

describe('DOMScopeDetector', () => {
  let detector: DOMScopeDetector;
  let container: HTMLDivElement;

  beforeEach(() => {
    // DOM 컨테이너 생성
    container = document.createElement('div');
    document.body.appendChild(container);

    // Detector 초기화
    detector = new DOMScopeDetector({ debug: false });
    detector.initialize();
  });

  afterEach(() => {
    // 정리
    detector.dispose();
    document.body.removeChild(container);
  });

  describe('Modal Detection', () => {
    it('should detect modal when role="dialog" is present', () => {
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.style.zIndex = '1000';
      container.appendChild(modal);

      expect(detector.isModalActive()).toBe(true);
    });

    it('should NOT detect hidden modal', () => {
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.zIndex = '1000';
      container.appendChild(modal);

      expect(detector.isModalActive()).toBe(false);
    });

    it('should NOT detect modal with low z-index', () => {
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.style.zIndex = '500'; // < 1000
      container.appendChild(modal);

      expect(detector.isModalActive()).toBe(false);
    });
  });

  describe('Editor Detection', () => {
    it('should detect contenteditable element', () => {
      const editor = document.createElement('div');
      editor.setAttribute('contenteditable', 'true');
      container.appendChild(editor);
      editor.focus();

      expect(detector.isEditorFocused()).toBe(true);
    });

    it('should detect monaco editor', () => {
      const editor = document.createElement('div');
      editor.className = 'monaco-editor';
      container.appendChild(editor);
      editor.focus();

      expect(detector.isEditorFocused()).toBe(true);
    });

    it('should NOT detect when editor is not focused', () => {
      const editor = document.createElement('div');
      editor.setAttribute('contenteditable', 'true');
      container.appendChild(editor);
      // focus() 하지 않음

      expect(detector.isEditorFocused()).toBe(false);
    });
  });

  describe('Scope Change Events', () => {
    it('should notify listeners on scope change', (done) => {
      const listener = vi.fn((scopes: Scope[]) => {
        expect(scopes).toContain('modal');
        expect(listener).toHaveBeenCalledTimes(1);
        done();
      });

      detector.onScopeChange(listener);

      // Modal 추가 → Scope 변경 트리거
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.style.zIndex = '1000';
      container.appendChild(modal);

      // MutationObserver가 비동기이므로 약간 대기
      setTimeout(() => {
        detector.forceUpdate();
      }, 100);
    });

    it('should unsubscribe listener', () => {
      const listener = vi.fn();
      const unsubscribe = detector.onScopeChange(listener);

      unsubscribe();

      // Modal 추가해도 호출되지 않음
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.style.zIndex = '1000';
      container.appendChild(modal);

      setTimeout(() => {
        expect(listener).not.toHaveBeenCalled();
      }, 100);
    });
  });

  describe('Performance', () => {
    it('should handle rapid DOM changes efficiently', () => {
      const startTime = performance.now();

      // 100번 빠른 변경
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.className = 'test-element';
        container.appendChild(div);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 100ms 이내에 완료되어야 함
      expect(duration).toBeLessThan(100);
    });

    it('should not trigger excessive scope updates', () => {
      const listener = vi.fn();
      detector.onScopeChange(listener);

      // 100번 DOM 변경
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        container.appendChild(div);
      }

      // 하지만 스코프는 변경되지 않으므로 호출되지 않음
      setTimeout(() => {
        expect(listener).toHaveBeenCalledTimes(0);
      }, 200);
    });
  });
});
```

### 2. ScopeManager 테스트

**파일**: `tests/unit/scope/ScopeManager.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScopeManager } from '@/engine/utils/ScopeManager';
import { MockScopeDetector } from '@/engine/utils/scope/MockScopeDetector';
import type { Scope } from '@/engine/utils/KeyboardTypes';

describe('ScopeManager', () => {
  let mockDetector: MockScopeDetector;
  let manager: ScopeManager;

  beforeEach(() => {
    mockDetector = new MockScopeDetector();
    manager = new ScopeManager(mockDetector, false);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('should initialize with global scope', () => {
    manager.start();
    expect(manager.getActiveScopes()).toEqual(['global']);
  });

  it('should update scopes when detector changes', () => {
    manager.start();

    const listener = vi.fn();
    manager.addEventListener(listener);

    // Mock detector에서 modal 활성화
    mockDetector.setMockScopes(['modal', 'global']);
    mockDetector.triggerChange();

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        currentScopes: ['modal', 'global'],
      })
    );
  });

  it('should sort scopes by priority', () => {
    const scopes: Scope[] = ['global', 'modal', 'canvas'];
    const sorted = manager.sortScopesByPriority(scopes);

    expect(sorted).toEqual(['modal', 'canvas', 'global']);
  });

  it('should dispose cleanly', () => {
    manager.start();
    manager.dispose();

    // dispose 후에는 이벤트 발생하지 않음
    const listener = vi.fn();
    manager.addEventListener(listener);

    mockDetector.setMockScopes(['modal']);
    mockDetector.triggerChange();

    expect(listener).not.toHaveBeenCalled();
  });
});
```

### 3. MockScopeDetector 구현

**파일**: `src/engine/utils/scope/MockScopeDetector.ts`

```typescript
/**
 * 테스트용 Mock Scope Detector
 */

import type { IEnhancedScopeDetector, ScopeChangeCallback } from './IScopeDetector';
import type { Scope } from '../KeyboardTypes';

export class MockScopeDetector implements IEnhancedScopeDetector {
  private mockScopes: Scope[] = ['global'];
  private listeners: ScopeChangeCallback[] = [];

  // 스코프 설정
  setMockScopes(scopes: Scope[]): void {
    this.mockScopes = scopes;
  }

  // 변경 트리거
  triggerChange(): void {
    this.listeners.forEach((listener) => listener(this.mockScopes));
  }

  // IScopeDetector 구현
  isModalActive(): boolean {
    return this.mockScopes.includes('modal');
  }

  isOverlayActive(): boolean {
    return this.mockScopes.includes('overlay');
  }

  isTooltipActive(): boolean {
    return this.mockScopes.includes('tooltip');
  }

  isEditorFocused(): boolean {
    return this.mockScopes.includes('editor');
  }

  isTextInputFocused(): boolean {
    return this.mockScopes.includes('editor');
  }

  isSidebarFocused(): boolean {
    return this.mockScopes.includes('sidebar');
  }

  isCanvasFocused(): boolean {
    return this.mockScopes.includes('canvas');
  }

  // IEnhancedScopeDetector 구현
  onScopeChange(callback: ScopeChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  getActiveScopes(): Scope[] {
    return [...this.mockScopes];
  }

  forceUpdate(): void {
    this.triggerChange();
  }
}
```

---

## 통합 테스트

### React Hook 통합 테스트

**파일**: `tests/integration/scope/useActiveScopes.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useActiveScopes } from '@/hooks/useActiveScopes';
import { store } from '@/store';
import { scopeChanged } from '@/store/slices/scopeSlice';

describe('useActiveScopes integration', () => {
  it('should return active scopes from Redux', () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useActiveScopes(), { wrapper });

    expect(result.current).toEqual(['global']);
  });

  it('should update when Redux state changes', () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useActiveScopes(), { wrapper });

    act(() => {
      store.dispatch(
        scopeChanged({
          scopes: ['modal', 'global'],
          trigger: 'test',
        })
      );
    });

    expect(result.current).toEqual(['modal', 'global']);
  });
});
```

---

## 성능 테스트

### 벤치마크 테스트

**파일**: `tests/performance/scope-performance.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { DOMScopeDetector } from '@/engine/utils/scope/DOMScopeDetector';

describe('Scope Performance Benchmarks', () => {
  it('should detect scope changes in <16ms', () => {
    const detector = new DOMScopeDetector();
    detector.initialize();

    const startTime = performance.now();

    // Modal 추가
    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.style.zIndex = '1000';
    document.body.appendChild(modal);

    detector.forceUpdate();

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(16); // 1 frame

    document.body.removeChild(modal);
    detector.dispose();
  });

  it('should handle 1000 DOM mutations efficiently', () => {
    const detector = new DOMScopeDetector();
    detector.initialize();

    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div');
      document.body.appendChild(div);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // 1초 이내에 완료
    expect(duration).toBeLessThan(1000);

    detector.dispose();
  });
});
```

---

## 테스트 설정

### Vitest 설정

**파일**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

**파일**: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 각 테스트 후 자동 정리
afterEach(() => {
  cleanup();
});
```

---

## 테스트 실행

```bash
# 모든 테스트 실행
npm run test

# Watch 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage

# 특정 파일만
npm run test DOMScopeDetector

# 성능 테스트만
npm run test:perf
```

---

**관련 문서**:
- [02-phase1-performance.md](./02-phase1-performance) - 구현 가이드
- [08-api-reference.md](./08-api-reference) - API 문서
