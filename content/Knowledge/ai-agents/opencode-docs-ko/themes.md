# 테마

내장 테마를 선택하거나 직접 정의.

OpenCode에서는 여러 내장 테마 중에서 선택하거나, 터미널 테마에 맞는 테마를 사용하거나, 사용자 정의 테마를 정의할 수 있습니다.

기본적으로 OpenCode는 자체 `opencode` 테마를 사용합니다.

---

## 터미널 요구 사항

테마가 전체 색상 팔레트로 올바르게 표시되려면 터미널이 **truecolor**(24비트 색상)를 지원해야 합니다. 대부분의 최신 터미널은 기본적으로 이를 지원하지만 활성화해야 할 수 있습니다:

- **지원 확인**: `echo $COLORTERM` 실행 - `truecolor` 또는 `24bit`를 출력해야 함
- **truecolor 활성화**: 셸 프로필에서 `COLORTERM=truecolor` 환경 변수 설정
- **터미널 호환성**: 터미널 에뮬레이터가 24비트 색상을 지원하는지 확인 (iTerm2, Alacritty, Kitty, Windows Terminal 및 최신 버전의 GNOME Terminal과 같은 대부분의 최신 터미널이 지원함)

truecolor 지원 없이는 테마가 감소된 색상 정확도로 나타나거나 가장 가까운 256색 근사치로 대체될 수 있습니다.

---

## 내장 테마

OpenCode에는 여러 내장 테마가 함께 제공됩니다.

| 이름 | 설명 |
|------|------|
| `system` | 터미널의 배경색에 맞게 조정 |
| `tokyonight` | [Tokyonight](https://github.com/folke/tokyonight.nvim) 테마 기반 |
| `everforest` | [Everforest](https://github.com/sainnhe/everforest) 테마 기반 |
| `ayu` | [Ayu](https://github.com/ayu-theme) 다크 테마 기반 |
| `catppuccin` | [Catppuccin](https://github.com/catppuccin) 테마 기반 |
| `catppuccin-macchiato` | [Catppuccin](https://github.com/catppuccin) 테마 기반 |
| `gruvbox` | [Gruvbox](https://github.com/morhetz/gruvbox) 테마 기반 |
| `kanagawa` | [Kanagawa](https://github.com/rebelot/kanagawa.nvim) 테마 기반 |
| `nord` | [Nord](https://github.com/nordtheme/nord) 테마 기반 |
| `matrix` | 해커 스타일 그린 온 블랙 테마 |
| `one-dark` | [Atom One](https://github.com/Th3Whit3Wolf/one-nvim) Dark 테마 기반 |

그리고 더 많은 테마가 계속 추가되고 있습니다.

---

## 시스템 테마

`system` 테마는 터미널의 색 구성표에 자동으로 맞게 설계되었습니다. 고정된 색상을 사용하는 전통적인 테마와 달리 *system* 테마는:

- **그레이 스케일 생성**: 터미널의 배경색을 기반으로 최적의 대비를 보장하는 사용자 정의 그레이 스케일 생성
- **ANSI 색상 사용**: 터미널의 색상 팔레트를 존중하는 구문 강조 및 UI 요소에 표준 ANSI 색상(0-15) 활용
- **터미널 기본값 유지**: 터미널의 기본 모양을 유지하기 위해 텍스트 및 배경 색상에 `none` 사용

시스템 테마는 다음과 같은 사용자를 위한 것입니다:

- OpenCode가 터미널 모양과 일치하기를 원하는 사용자
- 사용자 정의 터미널 색 구성표를 사용하는 사용자
- 모든 터미널 애플리케이션에서 일관된 모양을 선호하는 사용자

---

## 테마 사용

`/theme` 명령으로 테마 선택을 불러올 수 있습니다. 또는 [설정](/docs/config)에서 지정할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "tokyonight"
}
```

---

## 사용자 정의 테마

OpenCode는 사용자가 쉽게 테마를 만들고 사용자 정의할 수 있는 유연한 JSON 기반 테마 시스템을 지원합니다.

### 계층 구조

테마는 다음 순서로 여러 디렉토리에서 로드되며, 나중 디렉토리가 이전 디렉토리를 재정의합니다:

1. **내장 테마** - 바이너리에 내장됨
2. **사용자 설정 디렉토리** - `~/.config/opencode/themes/*.json` 또는 `$XDG_CONFIG_HOME/opencode/themes/*.json`에 정의됨
3. **프로젝트 루트 디렉토리** - `<project-root>/.opencode/themes/*.json`에 정의됨
4. **현재 작업 디렉토리** - `./.opencode/themes/*.json`에 정의됨

여러 디렉토리에 같은 이름의 테마가 포함된 경우 우선순위가 높은 디렉토리의 테마가 사용됩니다.

### 테마 만들기

사용자 정의 테마를 만들려면 테마 디렉토리 중 하나에 JSON 파일을 만듭니다.

사용자 전체 테마의 경우:

```bash
mkdir -p ~/.config/opencode/themes
vim ~/.config/opencode/themes/my-theme.json
```

프로젝트별 테마의 경우:

```bash
mkdir -p .opencode/themes
vim .opencode/themes/my-theme.json
```

### JSON 형식

테마는 다음을 지원하는 유연한 JSON 형식을 사용합니다:

- **Hex 색상**: `"#ffffff"`
- **ANSI 색상**: `3` (0-255)
- **색상 참조**: `"primary"` 또는 사용자 정의 정의
- **다크/라이트 변형**: `{"dark": "#000", "light": "#fff"}`
- **색상 없음**: `"none"` - 터미널의 기본 색상 또는 투명 사용

### 색상 정의

`defs` 섹션은 선택 사항이며 테마에서 참조할 수 있는 재사용 가능한 색상을 정의할 수 있습니다.

### 터미널 기본값

모든 색상에 특수 값 `"none"`을 사용하여 터미널의 기본 색상을 상속할 수 있습니다. 이는 터미널의 색 구성표와 원활하게 혼합되는 테마를 만드는 데 특히 유용합니다:

- `"text": "none"` - 터미널의 기본 전경색 사용
- `"background": "none"` - 터미널의 기본 배경색 사용
