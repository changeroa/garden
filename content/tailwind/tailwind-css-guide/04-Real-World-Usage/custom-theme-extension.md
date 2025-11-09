# 커스텀 테마 확장

## 🔗 연결
- **상위:** [[/tailwind-css-master-guide]]
- **이전:** [[plugin-usage]]
- **관련:** [[tailwind-config-js-setup]], [[디자인 시스템 토큰]]

## 📝 핵심 정리
`tailwind.config.js`의 `theme` 객체를 깊이 있게 활용하여, 프로젝트의 고유한 디자인 시스템을 완벽하게 구축하는 고급 설정 방법을 다룹니다. 색상 팔레트, 폰트, 간격 단위를 넘어서 커스텀 유틸리티를 직접 정의할 수도 있습니다.

## 💻 코드 예제 (고급 테마 설정)

/**
 * ==========================================
 * [기능명]: 테마 객체와 커스텀 유틸리티 확장
 * ==========================================
 *
 * 📖 목적: 기본 디자인 시스템을 넘어서는 복잡한 요구사항을 `tailwind.config.js` 내에서 해결합니다.
 * 🏗️ 구조: `theme.extend`를 사용하여 새로운 값을 추가하고, `plugins` 함수를 통해 직접 새로운 유틸리티 클래스를 생성합니다.
 * 🔄 흐름: 빌드 시 Tailwind는 이 설정들을 읽어, `text-shadow-md` 같은 새로운 커스텀 유틸리티를 생성하고, `animate-fade-in` 같은 커스텀 애니메이션을 등록합니다.
 * 🎯 학습포인트: `theme`와 `plugins`를 조합하면 거의 모든 CSS 요구사항을 Tailwind의 시스템 안에서 해결할 수 있음을 이해합니다.
 */

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      // 새로운 애니메이션과 키프레임 추가
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // 커스텀 text-shadow 유틸리티를 위한 값 정의
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.25)',
        md: '2px 2px 4px rgba(0, 0, 0, 0.25)',
        lg: '4px 4px 8px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [
    // 커스텀 유틸리티를 생성하는 플러그인
    plugin(function({ addUtilities, theme }) {
      const newUtilities = {}
      const textShadows = theme('textShadow')
      for (const key in textShadows) {
        newUtilities[`.text-shadow-${key}`] = {
          textShadow: textShadows[key],
        }
      }
      addUtilities(newUtilities)
    })
  ],
}
```

## 🔍 상세 분석

### 고급 확장 기법
- **애니메이션**: `theme.extend.animation`과 `theme.extend.keyframes`를 함께 사용하여 CSS 애니메이션을 등록하고 `animate-` 클래스로 사용할 수 있습니다.
- **임의의 테마 값 추가**: `theme.extend` 안에 `textShadow`처럼 완전히 새로운 속성을 정의하고, 이를 플러그인 내에서 `theme()` 함수로 참조하여 새로운 유틸리티를 동적으로 생성할 수 있습니다.
- **`addUtilities` 함수**: 플러그인 내에서 이 함수를 호출하여 새로운 유틸리티 클래스를 등록합니다.
- **`addComponents` 함수**: 버튼, 카드처럼 여러 스타일이 조합된 더 복잡한 컴포넌트 클래스를 등록할 때 사용합니다.
- **`addVariant` 함수**: `group-open:` 처럼 새로운 상태 변형(variant)을 직접 만들 수 있습니다.

### 실무 포인트
- **디자인 시스템의 원천(Source of Truth)**: `tailwind.config.js`를 프로젝트 디자인 시스템의 유일한 원천으로 삼아, 모든 시각적 요소가 이곳에서부터 파생되도록 설계하는 것이 좋습니다.
- **점진적인 확장**: 처음부터 모든 것을 커스터마이징하기보다는, 기본 설정을 최대한 활용하고 꼭 필요한 부분만 점진적으로 확장해나가는 것이 효율적입니다.

## ⚡ 다음 학습
- 이로써 Tailwind CSS의 핵심 개념부터 실용적인 적용, 고급 확장까지의 학습 과정이 마무리되었습니다. 이제 실제 프로젝트에 적용하며 경험을 쌓는 것이 중요합니다.
- [Awesome Tailwind CSS](https://github.com/aniftyco/awesome-tailwindcss) 같은 리소스를 탐색하며 더 넓은 생태계를 경험해보세요.
