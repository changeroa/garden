# 상태 관리 (Hover, Focus 등)

## 🔗 연결
- **상위:** [[/tailwind-css-master-guide]]
- **이전:** [[responsive-design]]
- **다음:** [[component-extraction]]
- **관련:** [[CSS Pseudo-classes]], [[Event Handling]]

## 📝 핵심 정리
Tailwind는 `hover:`, `focus:`, `active:`, `disabled:` 등과 같은 상태 변형(variant) 접두사를 사용하여 사용자의 입력이나 상태 변화에 따른 스타일을 직관적으로 적용할 수 있게 해줍니다.

## 💻 코드 예제 (상태에 따라 변하는 입력 필드)

/**
 * ==========================================
 * [기능명]: 동적 상태를 가진 입력(Input) 필드
 * ==========================================
 *
 * 📖 목적: 사용자의 상호작용(포커스, 입력 등)에 따라 입력 필드의 스타일이 시각적으로 변하도록 합니다.
 * 🏗️ 구조: `focus:` 접두사는 요소가 포커스되었을 때, `disabled:`는 비활성화되었을 때 적용될 스타일을 정의합니다.
 * 🔄 흐름: 사용자가 입력 필드를 클릭하면(`focus`), 테두리 색상이 파란색으로 변합니다. 만약 `disabled` 속성이 추가되면, 배경색이 회색으로 바뀌고 마우스 커서가 `not-allowed`로 변경됩니다.
 * 🎯 학습포인트: CSS 의사 클래스(pseudo-class)를 Tailwind의 접두사 시스템으로 얼마나 쉽게 제어할 수 있는지 이해합니다.
 */

```html
<input 
  class="
    mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
    invalid:border-pink-500 invalid:text-pink-600
    focus:invalid:border-pink-500 focus:invalid:ring-pink-500
  "
  type="email"
  placeholder="you@example.com"
/>
```

## 🔍 상세 분석

### 주요 상태 변형 (Variants)
- **`hover`**: 마우스 커서가 요소 위에 올라갔을 때
- **`focus`**: 요소가 포커스되었을 때 (e.g., 텍스트 입력 필드 클릭)
- **`active`**: 요소가 활성화되었을 때 (e.g., 버튼을 클릭하고 있는 동안)
- **`disabled`**: 요소가 비활성화 속성을 가질 때
- **`focus-within`**: 자식 요소 중 하나가 포커스되었을 때 (부모 요소에 적용)
- **`focus-visible`**: 키보드 탐색 등으로 포커스되었을 때 (마우스 클릭 제외)
- **`group-hover`**: 부모 요소에 `group` 클래스가 있고, 그 부모에 마우스가 올라갔을 때 (자식 요소에 적용)
- **`peer-focus`**: 형제 요소가 포커스되었을 때 (다른 형제 요소에 적용)

### 실무 포인트
- **`group`과 `peer` 활용**: 복잡한 드롭다운 메뉴나 상호 연관된 UI 요소들을 만들 때 `group`과 `peer` 변형은 매우 강력합니다. CSS만으로는 구현하기 까다로운 로직을 마크업만으로 해결할 수 있습니다.
- **접근성 향상**: `focus-visible`을 사용하여 키보드 사용자에게 명확한 포커스 링을 제공하고, 마우스 사용자에게는 불필요한 시각적 노이즈를 줄여줄 수 있습니다.

## ⚡ 다음 학습
- [[component-extraction]]을 통해 이렇게 길어진 클래스 목록을 어떻게 깔끔하게 관리하고 재사용하는지 알아봅니다.
