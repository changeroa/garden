# Node.js 빌드 스크립트

Created: 2025-12-27 00:17
Modified: 2025-12-27 00:17
TemplateVersion: v1
Status: #status/growing
Tags: #knowledge #nodejs #build-script #automation
Up:: 
Related::

---

Node.js 빌드 스크립트는 fs 모듈로 파일을 읽고 가공하여 정적 파일을 생성하는 자동화 스크립트이다.

---

## Core Idea
fs/promises로 비동기 파일 읽기/쓰기를 수행한다.
JSON 데이터와 HTML 템플릿을 결합하여 최종 HTML을 생성한다.
package.json의 type: module로 ESM import/export를 사용한다.

## Why It Matters
- JAMstack의 핵심으로 빌드 타임에 정적 파일을 생성한다.
- 프레임워크 없이도 템플릿 시스템을 구현할 수 있다.

## Explanation
- import fs from 'fs/promises';로 ESM 방식으로 fs 모듈을 가져온다.
- await fs.readFile('data.json', 'utf-8')로 파일을 읽는다.
- template.replace('{{PLACEHOLDER}}', data)로 플레이스홀더를 치환한다.

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: package.json에서 ESM을 활성화하려면 어떻게 하는가?
- A: "type": "module" 추가
- Q: fs와 fs/promises의 차이는 무엇인가?
- A: fs는 콜백/동기, fs/promises는 async/await 사용 가능
