# Tailwind CLI

## 🔗 연결
- **상위:** [[../Tailwind CSS 마스터 가이드]]
- **이전:** [[개발 환경 설정]]
- **다음:** [[../03-Practical-Implementation/반응형 디자인]]
- **관련:** [[npm scripts]], [[빌드 프로세스]]

## 📝 핵심 정리
Tailwind CLI는 터미널에서 직접 Tailwind CSS를 빌드하고, 개발 중 변경사항을 감시하며, 프로덕션용으로 최적화하는 데 사용되는 커맨드 라인 인터페이스 도구입니다.

## 💻 코드 예제 (CLI 명령어 사용)

/**
 * ==========================================
 * [기능명]: Tailwind CLI를 이용한 CSS 빌드 및 감시
 * ==========================================
 *
 * 📖 목적: 개발 중이거나 프로덕션 배포를 위해 CSS 파일을 생성합니다.
 * 🏗️ 구조: `tailwindcss` 실행 파일에 `-i` (input), `-o` (output) 옵션을 주어 빌드를 수행합니다.
 * 🔄 흐름: 1. 개발 시: `--watch` 플래그로 파일 변경을 감시하고 자동으로 CSS를 다시 빌드. 2. 프로덕션 시: `--minify` 플래그로 CSS를 압축하고 최적화.
 * 🎯 학습포인트: `watch` 모드와 `build` 모드의 차이점, 그리고 `minify` 옵션의 중요성을 이해합니다.
 */

**1. 개발 중 실시간 빌드 (Watch 모드)**
```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```
* `input.css` 파일이나 `tailwind.config.js`에서 참조하는 모든 파일의 변경사항을 감지하여 `output.css`를 자동으로 업데이트합니다.

**2. 프로덕션용 빌드**
```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
```
* `--minify` 옵션은 모든 공백과 주석을 제거하여 파일 크기를 최소화합니다.

**3. `package.json`에 스크립트로 등록**
```json
// package.json
"scripts": {
  "dev": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch",
  "build": "tailwindcss -i ./src/input.css -o ./dist/output.css --minify"
}
```
* `npm run dev`, `npm run build` 명령어로 더 쉽게 CLI를 사용할 수 있습니다.

## 🔍 상세 분석

### 주요 옵션
- **`-i, --input <file>`**: 처리할 원본 CSS 파일의 경로를 지정합니다. (`@tailwind` 지시어가 있는 파일)
- **`-o, --output <file>`**: 생성될 CSS 파일의 경로를 지정합니다.
- **`--watch`**: 파일 변경을 감시하여 자동으로 다시 빌드합니다.
- **`--minify`**: 최종 CSS 파일을 압축합니다. 프로덕션 빌드 시 필수입니다.
- **`-c, --config <file>`**: 사용할 `tailwind.config.js` 파일의 경로를 직접 지정할 수 있습니다.

### 실무 포인트
- **`npm scripts` 활용**: CLI 명령어를 직접 입력하기보다 `package.json`의 `scripts`에 등록하여 사용하는 것이 일반적입니다. 이는 팀원 모두가 동일한 명령어를 사용하도록 보장합니다.
- **빌드 도구 통합**: Vite, Webpack, Parcel과 같은 상위 레벨의 빌드 도구를 사용하면, 해당 도구의 설정 파일 안에서 Tailwind CLI 대신 PostCSS 플러그인으로 처리하는 경우가 더 많습니다. CLI는 간단한 프로젝트나 특정 목적의 빌드에 유용합니다.

## ⚡ 다음 학습
- 이제 개발 환경이 준비되었으니, [[../03-Practical-Implementation/반응형 디자인]]을 통해 실제 UI를 만들어봅니다.
