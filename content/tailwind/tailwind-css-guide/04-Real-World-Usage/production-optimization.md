# 프로덕션 최적화

## 🔗 연결
- **상위:** [[/tailwind-css-master-guide]]
- **이전:** [[/03-Practical-Implementation/component-extraction]]
- **관련:** [[PurgeCSS]], [[Minification]], [[jit-compiler]]

## 📝 핵심 정리
Tailwind CSS는 프로덕션 빌드 시 사용되지 않는 모든 유틸리티 클래스를 제거(Purge)하고, 결과물을 압축(Minify)하여 최종 CSS 파일의 크기를 극적으로 줄입니다. 대부분의 프로젝트에서 10KB 미만을 유지할 수 있습니다.

## 💻 코드 예제 (최적화 과정)

/**
 * ==========================================
 * [기능명]: 프로덕션 빌드를 위한 Purge 및 Minify
 * ==========================================
 *
 * 📖 목적: 최종 배포 시 CSS 파일의 크기를 최소화하여 로딩 성능을 향상시킵니다.
 * 🏗️ 구조: JIT 컴파일러가 `content` 경로의 모든 파일을 스캔하여 사용된 클래스만 식별하고, 나머지 스타일은 최종 파일에 포함시키지 않습니다.
 * 🔄 흐름: 1. `content` 파일 스캔 → 2. 사용된 클래스 목록 생성 → 3. 해당 클래스에 대한 CSS만 생성 → 4. CSS 파일 압축.
 * 🎯 학습포인트: `content` 설정의 중요성과 `minify` 옵션이 성능에 미치는 영향을 이해합니다.
 */

**1. `tailwind.config.js`의 `content` 설정 확인**
```javascript
// tailwind.config.js
module.exports = {
  // 이 경로에 있는 파일들만 스캔하여 사용된 클래스를 찾습니다.
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // 다른 경로가 있다면 추가
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**2. 프로덕션 빌드 명령어 실행**
```bash
# Tailwind CLI 사용 시
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify

# Next.js, Vite 등 프레임워크 사용 시 (자동으로 처리됨)
npm run build
```

**결과**
- **개발 중 (`output.css`)**: 수만 줄의 CSS 코드 (수 MB)
- **빌드 후 (`output.css`)**: 수백 줄의 CSS 코드 (대부분 <10KB)

## 🔍 상세 분석

### 최적화 원리
- **Purging (제거)**: JIT 컴파일러의 핵심 기능입니다. `content` 옵션에 지정된 모든 HTML, JavaScript, 템플릿 파일을 정규 표현식으로 스캔하여 `bg-red-500`, `text-lg` 같은 클래스 패턴을 찾아냅니다. 그리고 찾아낸 클래스에 해당하는 CSS 규칙만 생성합니다.
- **Minification (압축)**: `--minify` 플래그나 상위 빌드 도구(e.g., Vite, Webpack)의 설정을 통해 CSS 파일에서 모든 주석, 공백, 줄바꿈을 제거하여 파일 크기를 한 번 더 줄입니다.

### 실무 포인트
- **`content` 경로를 정확하게 설정**: 가장 중요한 부분입니다. 만약 동적으로 클래스 이름을 생성하는 로직이 있다면 (`const myClass = `text-${color}-500``), JIT는 이를 감지하지 못합니다. 이런 경우, 전체 클래스 이름을 코드 어딘가에 명시해주어야 합니다: `const myClass = "text-red-500"` 또는 `safelist` 옵션을 사용해야 합니다.
- **`safelist` 옵션**: 동적으로 클래스명을 조합하는 등 정적 분석으로 찾아낼 수 없는 클래스가 있을 경우, `tailwind.config.js`의 `safelist` 배열에 직접 추가하여 Purge 과정에서 제거되지 않도록 보호할 수 있습니다.

```javascript
// tailwind.config.js
safelist: [
  'bg-red-500',
  'text-green-500',
  { 
    pattern: /bg-(red|green|blue)-500/, // 정규식으로도 가능
  },
]
```

## ⚡ 다음 학습
- [[plugin-usage]]을 통해 Tailwind의 기본 기능을 넘어서는 유틸리티를 추가하는 방법을 알아봅니다.
