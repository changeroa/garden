# Phase 4: Advanced Features - 고급 기능 구현

> **목표**: 동적 스코프, 분석 대시보드, AI 통합 등 고급 기능 추가

---

## 📋 목차

1. [Phase 4 개요](#phase-4-개요)
2. [동적 스코프 시스템](#동적-스코프-시스템)
3. [스코프 분석 대시보드](#스코프-분석-대시보드)
4. [AI 통합](#ai-통합)
5. [플러그인 시스템](#플러그인-시스템)
6. [고급 최적화](#고급-최적화)

---

## Phase 4 개요

### 고급 기능 목표

```
Phase 1-3까지 구현:
  ✅ 성능 최적화 (99% DOM 쿼리 감소)
  ✅ Redux 통합
  ✅ React Hooks API

Phase 4 추가:
  🚀 런타임에 스코프 동적 생성
  📊 스코프 사용 패턴 분석
  🤖 AI 기반 스코프 추천
  🔌 플러그인 시스템
  ⚡ 추가 성능 최적화
```

### 예상 기간

**Week 7-8** (2주)

---

## 동적 스코프 시스템

### 개념

기존의 고정된 7개 스코프 외에 런타임에 동적으로 스코프를 생성/제거할 수 있는 시스템입니다.

### 사용 사례

```typescript
// 사용자 정의 패널마다 고유 스코프 생성
const panelId = 'chat-panel-123';
const dynamicScope = `panel:${panelId}`; // 'panel:chat-panel-123'

// 임시 스코프 (툴팁, 드롭다운 등)
const tooltipScope = `tooltip:${tooltipId}`;
```

### 구현

#### 1. DynamicScope 타입 확장

```typescript
// src/engine/utils/KeyboardTypes.ts

/**
 * 기본 스코프
 */
export type BaseScope =
  | 'global'
  | 'canvas'
  | 'sidebar'
  | 'editor'
  | 'tooltip'
  | 'overlay'
  | 'modal';

/**
 * 동적 스코프 (런타임 생성)
 */
export type DynamicScope = `panel:${string}` | `widget:${string}` | `custom:${string}`;

/**
 * 전체 스코프
 */
export type Scope = BaseScope | DynamicScope;

/**
 * 동적 스코프 우선순위 계산
 */
export function getDynamicScopePriority(scope: DynamicScope): number {
  if (scope.startsWith('panel:')) return 650; // sidebar < panel < editor
  if (scope.startsWith('widget:')) return 550; // canvas < widget < sidebar
  if (scope.startsWith('custom:')) return 400;
  return 100; // 기본 우선순위
}

/**
 * 스코프 우선순위 (동적 스코프 지원)
 */
export function getScopePriority(scope: Scope): number {
  const basePriorities: Record<BaseScope, number> = {
    global: 100,
    canvas: 500,
    sidebar: 600,
    editor: 700,
    tooltip: 800,
    overlay: 900,
    modal: 1000,
  };

  if (scope in basePriorities) {
    return basePriorities[scope as BaseScope];
  }

  // 동적 스코프
  return getDynamicScopePriority(scope as DynamicScope);
}
```

#### 2. Dynamic Scope Registry

```typescript
// src/engine/utils/scope/DynamicScopeRegistry.ts

/**
 * 동적 스코프 메타데이터
 */
export interface DynamicScopeMetadata {
  id: string;
  priority: number;
  createdAt: number;
  createdBy: string; // componentId
  persistent: boolean; // localStorage 저장 여부
}

/**
 * 동적 스코프 레지스트리
 */
export class DynamicScopeRegistry {
  private scopes = new Map<string, DynamicScopeMetadata>();

  /**
   * 동적 스코프 등록
   */
  register(
    scopeId: string,
    metadata: Omit<DynamicScopeMetadata, 'id' | 'createdAt'>
  ): void {
    if (this.scopes.has(scopeId)) {
      console.warn(`[DynamicScope] Already registered: ${scopeId}`);
      return;
    }

    this.scopes.set(scopeId, {
      id: scopeId,
      createdAt: Date.now(),
      ...metadata,
    });

    console.log(`[DynamicScope] Registered: ${scopeId}`);
  }

  /**
   * 동적 스코프 해제
   */
  unregister(scopeId: string): void {
    this.scopes.delete(scopeId);
    console.log(`[DynamicScope] Unregistered: ${scopeId}`);
  }

  /**
   * 스코프 존재 여부
   */
  has(scopeId: string): boolean {
    return this.scopes.has(scopeId);
  }

  /**
   * 모든 동적 스코프 조회
   */
  getAll(): DynamicScopeMetadata[] {
    return Array.from(this.scopes.values());
  }

  /**
   * 우선순위로 정렬된 스코프
   */
  getSorted(): DynamicScopeMetadata[] {
    return this.getAll().sort((a, b) => b.priority - a.priority);
  }
}
```

#### 3. useDynamicScope Hook

```typescript
// src/hooks/useDynamicScope.ts

import { useEffect, useId } from 'react';
import { useDispatch } from 'react-redux';
import { DynamicScopeRegistry } from '@/engine/utils/scope/DynamicScopeRegistry';
import type { DynamicScope } from '@/engine/utils/KeyboardTypes';

const registry = new DynamicScopeRegistry();

/**
 * 동적 스코프 등록 Hook
 *
 * @example
 * ```tsx
 * function CustomPanel({ id }) {
 *   useDynamicScope(`panel:${id}`, {
 *     priority: 650,
 *     persistent: false
 *   });
 *
 *   return <div>Custom Panel</div>;
 * }
 * ```
 */
export function useDynamicScope(
  scopeId: DynamicScope,
  options: {
    priority: number;
    persistent?: boolean;
  }
): void {
  const componentId = useId();
  const dispatch = useDispatch();

  useEffect(() => {
    // 등록
    registry.register(scopeId, {
      priority: options.priority,
      createdBy: componentId,
      persistent: options.persistent ?? false,
    });

    // Redux에도 등록
    dispatch(
      registerComponentScope({
        componentId: scopeId,
        scope: scopeId as any,
      })
    );

    // 해제
    return () => {
      registry.unregister(scopeId);
      dispatch(unregisterComponentScope(scopeId));
    };
  }, [scopeId, options.priority, options.persistent, componentId, dispatch]);
}
```

#### 4. 사용 예시

```tsx
function ChatPanel({ panelId }: { panelId: string }) {
  const dynamicScope = `panel:chat-${panelId}` as DynamicScope;

  useDynamicScope(dynamicScope, {
    priority: 650,
    persistent: true,
  });

  return (
    <div className="chat-panel">
      <h3>Chat Panel {panelId}</h3>
      {/* 패널 콘텐츠 */}
    </div>
  );
}

function WidgetContainer({ widgetId }: { widgetId: string }) {
  const dynamicScope = `widget:${widgetId}` as DynamicScope;

  useDynamicScope(dynamicScope, {
    priority: 550,
    persistent: false,
  });

  return <div>Widget {widgetId}</div>;
}
```

---

## 스코프 분석 대시보드

### 개념

스코프 사용 패턴을 시각화하여 UX 개선에 활용합니다.

### 수집 메트릭

```typescript
// src/analytics/ScopeAnalytics.ts

export interface ScopeMetrics {
  // 전환 통계
  totalTransitions: number;
  transitionsPerMinute: number;

  // 스코프별 사용 시간
  scopeDurations: Record<Scope, number>; // ms

  // 가장 많이 사용된 스코프
  mostUsedScope: Scope;

  // 평균 스택 깊이
  averageStackDepth: number;

  // 스코프 전환 패턴
  commonTransitions: Array<{
    from: Scope;
    to: Scope;
    count: number;
  }>;
}

export class ScopeAnalytics {
  private metrics: ScopeMetrics = {
    totalTransitions: 0,
    transitionsPerMinute: 0,
    scopeDurations: {} as any,
    mostUsedScope: 'global',
    averageStackDepth: 1,
    commonTransitions: [],
  };

  private lastScopeChange = Date.now();
  private scopeStartTimes = new Map<Scope, number>();

  /**
   * 스코프 전환 기록
   */
  recordTransition(from: Scope[], to: Scope[]): void {
    this.metrics.totalTransitions++;

    // 사용 시간 계산
    const now = Date.now();
    from.forEach((scope) => {
      const startTime = this.scopeStartTimes.get(scope) || now;
      const duration = now - startTime;
      this.metrics.scopeDurations[scope] =
        (this.metrics.scopeDurations[scope] || 0) + duration;
    });

    // 새 스코프 시작 시간 기록
    to.forEach((scope) => {
      this.scopeStartTimes.set(scope, now);
    });

    // 분당 전환 횟수 계산
    const timeSinceStart = now - this.lastScopeChange;
    this.metrics.transitionsPerMinute =
      (this.metrics.totalTransitions / timeSinceStart) * 60 * 1000;
  }

  /**
   * 메트릭 조회
   */
  getMetrics(): ScopeMetrics {
    return { ...this.metrics };
  }

  /**
   * 리셋
   */
  reset(): void {
    this.metrics = {
      totalTransitions: 0,
      transitionsPerMinute: 0,
      scopeDurations: {} as any,
      mostUsedScope: 'global',
      averageStackDepth: 1,
      commonTransitions: [],
    };
    this.scopeStartTimes.clear();
  }
}
```

### 대시보드 컴포넌트

```tsx
// src/components/Debug/ScopeAnalyticsDashboard.tsx

import { useEffect, useState } from 'react';
import { useScopeHistory } from '@/hooks/useScopeHistory';
import { ScopeAnalytics } from '@/analytics/ScopeAnalytics';

const analytics = new ScopeAnalytics();

export function ScopeAnalyticsDashboard() {
  const history = useScopeHistory(100);
  const [metrics, setMetrics] = useState(analytics.getMetrics());

  useEffect(() => {
    // 히스토리 변경 시 메트릭 업데이트
    history.forEach((transition) => {
      analytics.recordTransition(transition.from, transition.to);
    });
    setMetrics(analytics.getMetrics());
  }, [history]);

  return (
    <div className="scope-analytics-dashboard">
      <h2>Scope Analytics</h2>

      <div className="metric-card">
        <h3>Total Transitions</h3>
        <div className="value">{metrics.totalTransitions}</div>
      </div>

      <div className="metric-card">
        <h3>Transitions/min</h3>
        <div className="value">{metrics.transitionsPerMinute.toFixed(2)}</div>
      </div>

      <div className="metric-card">
        <h3>Most Used Scope</h3>
        <div className="value">{metrics.mostUsedScope}</div>
      </div>

      <div className="scope-durations">
        <h3>Time in Each Scope</h3>
        {Object.entries(metrics.scopeDurations).map(([scope, duration]) => (
          <div key={scope} className="duration-bar">
            <span>{scope}</span>
            <div className="bar" style={{ width: `${duration / 1000}%` }} />
            <span>{(duration / 1000).toFixed(1)}s</span>
          </div>
        ))}
      </div>

      <div className="common-transitions">
        <h3>Common Transitions</h3>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {metrics.commonTransitions.map((t, i) => (
              <tr key={i}>
                <td>{t.from}</td>
                <td>{t.to}</td>
                <td>{t.count}</td>
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

## AI 통합

### 스코프 추천 시스템

AI가 사용자의 행동 패턴을 학습하여 적절한 스코프를 추천합니다.

```typescript
// src/ai/ScopeRecommender.ts

export interface ScopeRecommendation {
  scope: Scope;
  confidence: number; // 0-1
  reason: string;
}

export class ScopeRecommender {
  /**
   * 현재 컨텍스트 기반 스코프 추천
   */
  async recommend(context: {
    currentScopes: Scope[];
    recentHistory: ScopeTransition[];
    userAction?: string;
  }): Promise<ScopeRecommendation[]> {
    // 간단한 규칙 기반 추천 (나중에 ML로 확장)
    const recommendations: ScopeRecommendation[] = [];

    // 패턴 1: 에디터 후 항상 캔버스
    if (
      context.currentScopes.includes('editor') &&
      context.recentHistory.some((t) => t.from.includes('editor'))
    ) {
      recommendations.push({
        scope: 'canvas',
        confidence: 0.8,
        reason: 'Users often go to canvas after editing',
      });
    }

    // 패턴 2: 모달 닫힌 후 이전 스코프 복원
    const lastModal = context.recentHistory
      .reverse()
      .find((t) => t.from.includes('modal'));
    if (lastModal && !context.currentScopes.includes('modal')) {
      const previousScope = lastModal.from.find((s) => s !== 'modal' && s !== 'global');
      if (previousScope) {
        recommendations.push({
          scope: previousScope,
          confidence: 0.9,
          reason: 'Restore previous scope after modal',
        });
      }
    }

    return recommendations;
  }

  /**
   * 사용자 행동 패턴 학습
   */
  async learn(transitions: ScopeTransition[]): Promise<void> {
    // ML 모델 학습 로직 (나중에 구현)
    console.log(`[AI] Learning from ${transitions.length} transitions`);
  }
}
```

### 사용 예시

```tsx
function SmartScopeAssistant() {
  const activeScopes = useActiveScopes();
  const history = useScopeHistory(20);
  const [recommendations, setRecommendations] = useState<ScopeRecommendation[]>([]);

  useEffect(() => {
    const recommender = new ScopeRecommender();
    recommender
      .recommend({
        currentScopes: activeScopes,
        recentHistory: history,
      })
      .then(setRecommendations);
  }, [activeScopes, history]);

  if (recommendations.length === 0) return null;

  return (
    <div className="scope-assistant">
      <h4>Suggested Scopes</h4>
      {recommendations.map((rec) => (
        <div key={rec.scope} className="recommendation">
          <button onClick={() => activateScope(rec.scope)}>
            {rec.scope}
          </button>
          <span className="confidence">{(rec.confidence * 100).toFixed(0)}%</span>
          <small>{rec.reason}</small>
        </div>
      ))}
    </div>
  );
}
```

---

## 플러그인 시스템

### 개념

외부 패키지가 자체 스코프 및 키보드 단축키를 등록할 수 있도록 합니다.

### 플러그인 인터페이스

```typescript
// src/plugins/IScopePlugin.ts

export interface IScopePlugin {
  /**
   * 플러그인 ID
   */
  id: string;

  /**
   * 플러그인 이름
   */
  name: string;

  /**
   * 플러그인 초기화
   */
  initialize(context: PluginContext): void | Promise<void>;

  /**
   * 플러그인 정리
   */
  dispose(): void | Promise<void>;

  /**
   * 제공하는 스코프
   */
  getScopes(): Scope[];

  /**
   * 제공하는 키보드 단축키
   */
  getShortcuts(): KeyboardShortcut[];
}

export interface PluginContext {
  registerScope(scope: Scope, priority: number): void;
  registerShortcut(shortcut: KeyboardShortcut): void;
  scopeManager: ScopeManager;
  store: Store;
}
```

### 플러그인 예시

```typescript
// example-plugin/src/MyPlugin.ts

export class MyCustomPlugin implements IScopePlugin {
  id = 'my-custom-plugin';
  name = 'My Custom Plugin';

  initialize(context: PluginContext): void {
    // 커스텀 스코프 등록
    context.registerScope('custom:myplugin' as Scope, 750);

    // 단축키 등록
    context.registerShortcut({
      key: 'Ctrl+Shift+P',
      scope: 'custom:myplugin',
      action: () => {
        console.log('Plugin shortcut triggered!');
      },
    });

    console.log(`[Plugin] ${this.name} initialized`);
  }

  dispose(): void {
    console.log(`[Plugin] ${this.name} disposed`);
  }

  getScopes(): Scope[] {
    return ['custom:myplugin' as Scope];
  }

  getShortcuts(): KeyboardShortcut[] {
    return [
      {
        key: 'Ctrl+Shift+P',
        scope: 'custom:myplugin',
        action: () => {},
      },
    ];
  }
}
```

### 플러그인 매니저

```typescript
// src/plugins/PluginManager.ts

export class PluginManager {
  private plugins = new Map<string, IScopePlugin>();

  /**
   * 플러그인 등록
   */
  async register(plugin: IScopePlugin, context: PluginContext): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin already registered: ${plugin.id}`);
    }

    await plugin.initialize(context);
    this.plugins.set(plugin.id, plugin);

    console.log(`[PluginManager] Registered: ${plugin.name}`);
  }

  /**
   * 플러그인 해제
   */
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    await plugin.dispose();
    this.plugins.delete(pluginId);

    console.log(`[PluginManager] Unregistered: ${plugin.name}`);
  }

  /**
   * 모든 플러그인 조회
   */
  getAll(): IScopePlugin[] {
    return Array.from(this.plugins.values());
  }
}
```

---

## 고급 최적화

### 1. Lazy Scope Detection

스코프 감지를 필요한 시점에만 수행합니다.

```typescript
export class LazyDOMScopeDetector extends DOMScopeDetector {
  private lastCheck = 0;
  private checkInterval = 100; // ms

  override getActiveScopes(): Scope[] {
    const now = Date.now();

    // 최근 체크했으면 캐시 반환
    if (now - this.lastCheck < this.checkInterval) {
      return this.cachedScopes;
    }

    this.lastCheck = now;
    return super.getActiveScopes();
  }
}
```

### 2. Scope Predictor

다음 스코프를 예측하여 미리 준비합니다.

```typescript
export class ScopePredictor {
  private transitionMatrix = new Map<string, Map<Scope, number>>();

  /**
   * 전환 기록
   */
  recordTransition(from: Scope, to: Scope): void {
    if (!this.transitionMatrix.has(from)) {
      this.transitionMatrix.set(from, new Map());
    }

    const transitions = this.transitionMatrix.get(from)!;
    transitions.set(to, (transitions.get(to) || 0) + 1);
  }

  /**
   * 다음 스코프 예측
   */
  predict(currentScope: Scope): Scope | null {
    const transitions = this.transitionMatrix.get(currentScope);
    if (!transitions) return null;

    // 가장 빈번한 전환
    let maxCount = 0;
    let predicted: Scope | null = null;

    transitions.forEach((count, scope) => {
      if (count > maxCount) {
        maxCount = count;
        predicted = scope;
      }
    });

    return predicted;
  }
}
```

### 3. Batch Scope Updates

여러 스코프 변경을 배치 처리합니다.

```typescript
export class BatchedScopeManager extends ScopeManager {
  private updateQueue: Scope[][] = [];
  private batchTimer: number | null = null;

  override updateActiveScopes(trigger: string): void {
    const newScopes = this.detector.getActiveScopes();

    // 큐에 추가
    this.updateQueue.push(newScopes);

    // 배치 타이머 설정
    if (!this.batchTimer) {
      this.batchTimer = window.setTimeout(() => {
        this.flushUpdates(trigger);
      }, 16); // 1 frame
    }
  }

  private flushUpdates(trigger: string): void {
    if (this.updateQueue.length === 0) return;

    // 마지막 상태만 적용
    const finalScopes = this.updateQueue[this.updateQueue.length - 1];
    this.updateQueue = [];
    this.batchTimer = null;

    // 실제 업데이트
    super.updateActiveScopes(trigger);
  }
}
```

---

## 마이그레이션 체크리스트

- [ ] 동적 스코프 시스템 구현
- [ ] DynamicScopeRegistry 생성
- [ ] useDynamicScope Hook 구현
- [ ] ScopeAnalytics 클래스 구현
- [ ] 분석 대시보드 컴포넌트 생성
- [ ] ScopeRecommender (AI) 구현
- [ ] 플러그인 인터페이스 정의
- [ ] PluginManager 구현
- [ ] Lazy Detection 최적화
- [ ] Scope Predictor 구현
- [ ] Batch Updates 구현
- [ ] 모든 고급 기능 테스트
- [ ] 문서화 완료

---

## 성능 목표

| 메트릭 | Phase 3 | Phase 4 목표 |
|--------|---------|--------------|
| DOM 쿼리/초 | ~5 | ~2 |
| 스코프 전환 지연 | <16ms | <8ms |
| 메모리 사용 | ~50KB | ~60KB |
| 플러그인 로딩 | N/A | <100ms |

---

**관련 문서**:
- [04-phase3-react-hooks.md](./04-phase3-react-hooks) - 이전 단계
- [08-api-reference.md](./08-api-reference) - API 문서
- [10-performance-benchmarks.md](./10-performance-benchmarks) - 성능 벤치마크
