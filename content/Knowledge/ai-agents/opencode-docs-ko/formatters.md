# 포매터

OpenCode는 언어별 포매터를 사용합니다.

OpenCode는 언어별 포매터를 사용하여 파일이 작성되거나 편집된 후 자동으로 형식을 지정합니다. 이렇게 하면 생성된 코드가 프로젝트의 코드 스타일을 따릅니다.

---

## 내장

OpenCode에는 인기 있는 언어와 프레임워크를 위한 여러 내장 포매터가 함께 제공됩니다. 아래는 포매터, 지원되는 파일 확장자, 필요한 명령 또는 설정 옵션 목록입니다.

| 포매터 | 확장자 | 요구 사항 |
|--------|--------|----------|
| gofmt | .go | `gofmt` 명령 사용 가능 |
| mix | .ex, .exs, .eex, .heex, .leex, .neex, .sface | `mix` 명령 사용 가능 |
| prettier | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml 등 | `package.json`에 `prettier` 의존성 |
| biome | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml 등 | `biome.json(c)` 설정 파일 |
| zig | .zig, .zon | `zig` 명령 사용 가능 |
| clang-format | .c, .cpp, .h, .hpp, .ino 등 | `.clang-format` 설정 파일 |
| ktlint | .kt, .kts | `ktlint` 명령 사용 가능 |
| ruff | .py, .pyi | 설정과 함께 `ruff` 명령 사용 가능 |
| rubocop | .rb, .rake, .gemspec, .ru | `rubocop` 명령 사용 가능 |
| dart | .dart | `dart` 명령 사용 가능 |
| terraform | .tf, .tfvars | `terraform` 명령 사용 가능 |
| gleam | .gleam | `gleam` 명령 사용 가능 |
| nixfmt | .nix | `nixfmt` 명령 사용 가능 |
| shfmt | .sh, .bash | `shfmt` 명령 사용 가능 |

프로젝트의 `package.json`에 `prettier`가 있으면 OpenCode가 자동으로 이를 사용합니다.

---

## 작동 방식

OpenCode가 파일을 작성하거나 편집하면:

1. 활성화된 모든 포매터에 대해 파일 확장자를 확인합니다.
2. 파일에서 적절한 포매터 명령을 실행합니다.
3. 형식 변경 사항을 자동으로 적용합니다.

이 프로세스는 백그라운드에서 발생하여 수동 단계 없이 코드 스타일이 유지되도록 합니다.

---

## 설정

OpenCode 설정의 `formatter` 섹션을 통해 포매터를 사용자 정의할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {}
}
```

각 포매터 설정은 다음을 지원합니다:

| 속성 | 타입 | 설명 |
|------|------|------|
| `disabled` | boolean | 포매터를 비활성화하려면 `true`로 설정 |
| `command` | string[] | 형식 지정을 위해 실행할 명령 |
| `environment` | object | 포매터 실행 시 설정할 환경 변수 |
| `extensions` | string[] | 이 포매터가 처리해야 할 파일 확장자 |

### 포매터 비활성화

**모든** 포매터를 전역적으로 비활성화하려면 `formatter`를 `false`로 설정합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": false
}
```

**특정** 포매터를 비활성화하려면 `disabled`를 `true`로 설정합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "disabled": true
    }
  }
}
```

### 사용자 정의 포매터

명령, 환경 변수 및 파일 확장자를 지정하여 내장 포매터를 재정의하거나 새 포매터를 추가할 수 있습니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-markdown-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

명령의 **`$FILE` 플레이스홀더**는 형식이 지정되는 파일의 경로로 대체됩니다.
