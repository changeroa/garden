# 컴포넌트 추출

## 🔗 연결
- **상위:** [[/tailwind-css-master-guide]]
- **이전:** [[state-management-hover-focus]]
- **다음:** [[/04-Real-World-Usage/production-optimization]]
- **관련:** [[React Components]], [[Vue Components]], [[ DRY (Don't Repeat Yourself)]]

## 📝 핵심 정리
반복적으로 사용되는 유틸리티 클래스 조합을 재사용 가능한 컴포넌트나 `@apply` 지시어를 통해 추상화하여 코드의 중복을 줄이고 유지보수성을 높이는 방법을 다룹니다.

## 💻 코드 예제 (버튼 컴포넌트 추출)

/**
 * ==========================================
 * [기능명]: `@apply`를 사용한 컴포넌트 클래스 생성
 * ==========================================
 *
 * 📖 목적: 반복되는 버튼 유틸리티 클래스들을 하나의 CSS 클래스(`.btn-primary`)로 묶어 재사용합니다.
 * 🏗️ 구조: 메인 CSS 파일에 새로운 클래스를 정의하고, `@apply` 지시어 뒤에 기존 유틸리티 클래스들을 나열합니다.
 * 🔄 흐름: 빌드 시, Tailwind는 `@apply` 부분을 해당하는 CSS 규칙으로 변환하여 최종 `output.css`에 포함시킵니다.
 * 🎯 학습포인트: 유틸리티의 장점을 유지하면서도, 필요할 때 전통적인 CSS 컴포넌트 방식으로 전환할 수 있음을 이해합니다.
 */

**1. CSS 파일에 `@apply` 사용 (`./src/input.css`)**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
  .btn-secondary {
    @apply py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75;
  }
}
```

**2. HTML에서 사용**
```html
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
```

## 🔍 상세 분석

### 추출 방법
1.  **`@apply` 지시어**: 가장 직접적인 방법. CSS 파일 내에서 유틸리티를 조합해 새로운 클래스를 만듭니다. `@layer components` 안에 작성하는 것이 권장됩니다.
2.  **프레임워크 컴포넌트 (권장)**: React, Vue, Svelte 같은 컴포넌트 기반 프레임워크를 사용한다면, 스타일링된 JSX/Vue 파일을 컴포넌트로 만드는 것이 더 나은 추상화 방법입니다.

**React 컴포넌트 예시**
```jsx
// Button.jsx
export default function Button({ children, className }) {
  return (
    <button 
      className={`py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${className}`}>
      {children}
    </button>
  );
}

// PrimaryButton.jsx
import Button from './Button';

export default function PrimaryButton({ children }) {
  return (
    <Button className="bg-blue-500 text-white hover:bg-blue-700 focus:ring-blue-400">
      {children}
    </Button>
  );
}
```

### 실무 포인트
- **`@apply`는 신중하게**: `@apply`를 너무 남용하면 결국 전통적인 CSS의 문제점(e.g., 복잡한 클래스 관리)으로 돌아갈 수 있습니다. 정말로 여러 곳에서 반복되는 소수의 컴포넌트(버튼, 폼 요소 등)에만 사용하는 것이 좋습니다.
- **컴포넌트 기반 추상화 선호**: 대부분의 경우, 프레임워크의 컴포넌트 기능을 사용하여 UI 조각을 캡슐화하는 것이 더 유연하고 유지보수하기 좋습니다. 로직과 마크업, 스타일을 한 곳에서 관리할 수 있기 때문입니다.

## ⚡ 다음 학습
- [[/04-Real-World-Usage/production-optimization]]에서 이렇게 만들어진 CSS가 최종적으로 어떻게 최적화되는지 알아봅니다.
