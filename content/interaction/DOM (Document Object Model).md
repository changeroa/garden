# DOM (Document Object Model)

태그: #Fundamental

DOM은 웹 페이지의 콘텐츠와 구조를 표현하는 프로그래밍 인터페이스입니다. 브라우저는 HTML 문서를 읽어들여, 이를 노드(Node)와 객체(Object)로 이루어진 트리(Tree) 구조로 변환합니다. 이 트리가 바로 DOM입니다.

- **문서 (Document)**: 전체 페이지를 나타내는 최상위 노드
- **요소 (Element)**: `<div>`, `<p>`, `<span>` 등 HTML 태그에 해당하는 노드
- **텍스트 (Text)**: 요소 안에 있는 텍스트에 해당하는 노드
- **속성 (Attribute)**: 요소의 `class`, `id`, `href` 같은 속성

## 왜 중요한가?

스코프 관리 시스템은 **현재 사용자가 어떤 UI 요소와 상호작용하고 있는지** 정확히 알아야 합니다. 예를 들어, 사용자가 모달 창 안의 입력 필드를 클릭했는지, 아니면 캔버스 위의 객체를 선택했는지를 구분해야 합니다.

자바스크립트는 DOM API를 통해 이 트리 구조에 접근하고, 수정하고, 이벤트를 감지할 수 있습니다. 우리의 시스템은 바로 이 DOM을 탐색하여 현재 활성화된 스코프가 무엇인지 판단하게 됩니다.

```javascript
// 예시: 현재 활성화된 요소를 찾는 방법
const activeElement = document.activeElement;

// 예시: 특정 요소의 부모를 찾는 방법
const parent = activeElement.parentElement;
```

## 관련 개념

- [[02. Phase 2 - 계층화된 오버레이 스코프]]
- [[웹 이벤트 (Web Events)]]

---
[맨 위로 돌아가기]([[00. 스코프 관리 시스템 구축 (Scope Management System)]])
