# 제공자

OpenCode에서 어떤 LLM 제공자든 사용하기.

OpenCode는 [AI SDK](https://ai-sdk.dev/)와 [Models.dev](https://models.dev)를 사용하여 **75개 이상의 LLM 제공자**를 지원하며, 로컬 모델 실행도 지원합니다.

제공자를 추가하려면:

1. `/connect` 명령을 사용하여 제공자의 API 키를 추가합니다.
2. OpenCode 설정에서 제공자를 구성합니다.

---

## 자격 증명

`/connect` 명령으로 제공자의 API 키를 추가하면 `~/.local/share/opencode/auth.json`에 저장됩니다.

---

## 설정

OpenCode 설정의 `provider` 섹션을 통해 제공자를 사용자 정의할 수 있습니다.

### 기본 URL

`baseURL` 옵션을 설정하여 모든 제공자의 기본 URL을 사용자 정의할 수 있습니다. 프록시 서비스나 사용자 정의 엔드포인트를 사용할 때 유용합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.anthropic.com/v1"
      }
    }
  }
}
```

---

## OpenCode Zen

OpenCode Zen은 OpenCode 팀이 테스트하고 검증한 모델 목록입니다. [자세히 알아보기](/docs/zen).

> **Tip**: 처음이라면 OpenCode Zen으로 시작하는 것을 권장합니다.

1. TUI에서 `/connect` 명령을 실행하고, opencode를 선택한 후 [opencode.ai/auth](https://opencode.ai/auth)로 이동합니다.
2. 로그인하고, 결제 정보를 추가한 다음, API 키를 복사합니다.
3. API 키를 붙여넣습니다.
4. TUI에서 `/models`를 실행하여 권장 모델 목록을 확인합니다.

---

## 디렉토리

### Amazon Bedrock

Amazon Bedrock을 OpenCode와 함께 사용하려면:

1. Amazon Bedrock 콘솔의 **Model catalog**로 이동하여 원하는 모델에 대한 액세스를 요청합니다.
2. 다음 환경 변수 중 하나를 설정해야 합니다:
   - `AWS_ACCESS_KEY_ID`: IAM 사용자를 생성하고 액세스 키를 생성하여 얻을 수 있습니다.
   - `AWS_PROFILE`: AWS IAM Identity Center(또는 AWS SSO)를 통해 `aws sso login`으로 로그인한 후 사용할 프로필 이름을 가져옵니다.
   - `AWS_BEARER_TOKEN_BEDROCK`: Amazon Bedrock 콘솔에서 장기 API 키를 생성할 수 있습니다.

### Anthropic

[Claude Pro](https://www.anthropic.com/news/claude-pro) 또는 [Max](https://www.anthropic.com/max)에 가입하는 것을 권장합니다.

1. 가입 후 `/connect` 명령을 실행하고 Anthropic을 선택합니다.
2. **Claude Pro/Max** 옵션을 선택하면 브라우저가 열리고 인증을 요청합니다.
3. 이제 `/models` 명령을 사용할 때 모든 Anthropic 모델을 사용할 수 있습니다.

### OpenAI

1. [OpenAI Platform 콘솔](https://platform.openai.com/api-keys)로 이동하여 **Create new secret key**를 클릭하고 키를 복사합니다.
2. `/connect` 명령을 실행하고 OpenAI를 검색합니다.
3. 제공자의 API 키를 입력합니다.
4. `/models` 명령을 실행하여 원하는 모델을 선택합니다.

### GitHub Copilot

GitHub Copilot 구독을 opencode와 함께 사용하려면:

> **Note**: 일부 모델은 [Pro+ 구독](https://github.com/features/copilot/plans)이 필요할 수 있습니다.

1. `/connect` 명령을 실행하고 GitHub Copilot을 검색합니다.
2. [github.com/login/device](https://github.com/login/device)로 이동하여 코드를 입력합니다.
3. `/models` 명령을 실행하여 원하는 모델을 선택합니다.

### Ollama

OpenCode를 구성하여 Ollama를 통해 로컬 모델을 사용할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama2": {
          "name": "Llama 2"
        }
      }
    }
  }
}
```

### 사용자 정의 제공자

`/connect` 명령에 나열되지 않은 **OpenAI 호환** 제공자를 추가하려면:

1. `/connect` 명령을 실행하고 **Other**로 스크롤합니다.
2. 제공자에 대한 고유 ID를 입력합니다.
3. 제공자의 API 키를 입력합니다.
4. 프로젝트 디렉토리에 `opencode.json` 파일을 생성하거나 업데이트합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My AI Provider Display Name",
      "options": {
        "baseURL": "https://api.myprovider.com/v1"
      },
      "models": {
        "my-model-name": {
          "name": "My Model Display Name"
        }
      }
    }
  }
}
```

---

## 문제 해결

제공자 구성에 문제가 있는 경우:

1. **인증 설정 확인**: `opencode auth list`를 실행하여 제공자의 자격 증명이 설정에 추가되었는지 확인합니다.
2. 사용자 정의 제공자의 경우 opencode 설정을 확인하고:
   - `/connect` 명령에 사용된 제공자 ID가 opencode 설정의 ID와 일치하는지 확인합니다.
   - 제공자에 올바른 npm 패키지가 사용되었는지 확인합니다.
   - `options.baseURL` 필드에 올바른 API 엔드포인트가 사용되었는지 확인합니다.
