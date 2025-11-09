# 반응형 디자인

## 🔗 연결
- **상위:** [[/tailwind-css-master-guide]]
- **이전:** [[/02-Essential-Tools/Tailwind CLI]]
- **다음:** [[state-management-hover-focus]]
- **관련:** [[Mobile First]], [[CSS Media Queries]]

## 📝 핵심 정리
Tailwind CSS는 `sm`, `md`, `lg`, `xl`, `2xl` 같은 반응형 접두사(prefix)를 사용하여 모바일 우선(Mobile-First) 접근법으로 반응형 웹 디자인을 매우 쉽게 구현할 수 있도록 지원합니다.

## 💻 코드 예제 (반응형 카드 컴포넌트)

/**
 * ==========================================
 * [기능명]: 반응형 그리드 카드 레이아웃
 * ==========================================
 *
 * 📖 목적: 화면 크기에 따라 카드의 레이아웃과 스타일이 동적으로 변경되도록 합니다.
 * 🏗️ 구조: 기본 스타일은 모바일용으로, `md:` 접두사를 붙인 클래스는 태블릿 사이즈 이상에서, `lg:`는 데스크탑 사이즈 이상에서 적용됩니다.
 * 🔄 흐름: 브라우저 창의 너비가 `tailwind.config.js`에 정의된 브레이크포인트(e.g., `md: 768px`)를 넘어설 때마다 해당 접두사를 가진 클래스가 활성화됩니다.
 * 🎯 학습포인트: 작은 화면에서 큰 화면 순서로 스타일을 정의하는 모바일 우선 접근법을 자연스럽게 익힙니다.
 */

```html
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="md:shrink-0">
      <!-- 기본: w-full, md 이상: w-48 -->
      <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/store.jpg" alt="Man looking at a store">
    </div>
    <div class="p-8">
      <!-- 기본: text-center, md 이상: text-left -->
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</div>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Finding customers for your new business</a>
      <p class="mt-2 text-slate-500">Getting a new business off the ground is a lot of work. Here are five ideas you can use to find your first customers.</p>
    </div>
  </div>
</div>
```

## 🔍 상세 분석

### 반응형 접두사 (Breakpoints)
- **`sm:` (640px)**: 작은 태블릿 및 큰 스마트폰
- **`md:` (768px)**: 일반적인 태블릿
- **`lg:` (1024px)**: 작은 랩탑 및 데스크탑
- **`xl:` (1280px)**: 일반적인 데스크탑
- **`2xl:` (1536px)**: 큰 데스크탑

*기본적으로 아무 접두사가 없는 클래스는 모든 화면 크기에 적용됩니다. (모바일 우선)*

### 적용 방식
- `class="w-full md:w-48"`: 기본적으로 너비를 100%로 설정하고, `md` 브레이크포인트(768px) 이상에서는 너비를 `12rem` (192px)으로 변경합니다.
- `class="text-center md:text-left"`: 기본적으로 텍스트를 중앙 정렬하고, `md` 이상에서는 왼쪽 정렬로 변경합니다.

### 실무 포인트
- **모바일 우선 사고**: 항상 가장 작은 화면에서의 모습을 먼저 디자인하고, 점차 화면이 커짐에 따라 필요한 스타일을 추가하는 방식으로 작업하는 것이 효율적입니다.
- **브레이크포인트 커스터마이징**: `tailwind.config.js`의 `theme.screens` 객체에서 기존 브레이크포인트를 수정하거나 새로운 브레이크포인트를 추가할 수 있습니다.

## ⚡ 다음 학습
- [[state-management-hover-focus]]를 통해 사용자와의 상호작용에 반응하는 동적인 UI를 만드는 법을 배웁니다.
- [[component-extraction]]을 통해 복잡해진 반응형 클래스들을 재사용 가능한 컴포넌트로 만드는 방법을 알아봅니다.
