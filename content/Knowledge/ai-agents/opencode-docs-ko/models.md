# 모델

LLM 제공자 및 모델 구성.

OpenCode는 [AI SDK](https://ai-sdk.dev/)와 [Models.dev](https://models.dev)를 사용하여 **75개 이상의 LLM 제공자**를 지원하며, 로컬 모델 실행도 지원합니다.

---

## 제공자

대부분의 인기 있는 제공자는 기본적으로 미리 로드됩니다. `/connect` 명령을 통해 제공자에 대한 자격 증명을 추가하면 OpenCode를 시작할 때 사용할 수 있습니다.

[제공자에 대해 자세히 알아보기](/docs/providers).

---

## 모델 선택

제공자를 구성한 후 다음을 입력하여 원하는 모델을 선택할 수 있습니다:

```
/models
```

---

## 권장 모델

많은 모델이 있으며 매주 새로운 모델이 출시됩니다.

> **Tip**: 권장하는 모델 중 하나를 사용하는 것을 고려하세요.

그러나 코드 생성과 도구 호출 모두에 좋은 모델은 소수에 불과합니다.

다음은 OpenCode와 잘 작동하는 여러 모델입니다(순서 무관, 완전한 목록 아님):

- GPT 5.1
- GPT 5.1 Codex
- Claude Sonnet 4.5
- Claude Haiku 4.5
- Kimi K2
- GLM 4.6
- Qwen3 Coder
- Gemini 3 Pro

---

## 기본값 설정

이들 중 하나를 기본 모델로 설정하려면 OpenCode 설정에서 `model` 키를 설정할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "lmstudio/google/gemma-3n-e4b"
}
```

여기서 전체 ID는 `provider_id/model_id`입니다. 예를 들어, [OpenCode Zen](/docs/zen)을 사용하는 경우 GPT 5.1 Codex에 `opencode/gpt-5.1-codex`를 사용합니다.

[사용자 정의 제공자](/docs/providers#custom)를 구성한 경우 `provider_id`는 설정의 `provider` 부분의 키이고, `model_id`는 `provider.models`의 키입니다.

---

## 모델 설정

설정을 통해 모델의 옵션을 전역적으로 구성할 수 있습니다.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "models": {
        "gpt-5": {
          "options": {
            "reasoningEffort": "high",
            "textVerbosity": "low",
            "reasoningSummary": "auto",
            "include": ["reasoning.encrypted_content"],
          },
        },
      },
    },
    "anthropic": {
      "models": {
        "claude-sonnet-4-5-20250929": {
          "options": {
            "thinking": {
              "type": "enabled",
              "budgetTokens": 16000,
            },
          },
        },
      },
    },
  },
}
```

여기서 두 개의 내장 모델에 대한 전역 설정을 구성하고 있습니다: `openai` 제공자를 통해 액세스하는 `gpt-5`와 `anthropic` 제공자를 통해 액세스하는 `claude-sonnet-4-20250514`. 내장 제공자 및 모델 이름은 [Models.dev](https://models.dev)에서 찾을 수 있습니다.

사용 중인 모든 에이전트에 대해서도 이러한 옵션을 구성할 수 있습니다. 에이전트 설정은 여기의 모든 전역 옵션을 재정의합니다. [자세히 알아보기](/docs/agents/#additional).

---

## 모델 로딩

OpenCode가 시작될 때 다음 우선순위 순서로 모델을 확인합니다:

1. `--model` 또는 `-m` 명령줄 플래그. 형식은 설정 파일과 동일: `provider_id/model_id`.

2. OpenCode 설정의 모델 목록.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

형식은 `provider/model`입니다.

3. 마지막으로 사용한 모델.

4. 내부 우선순위를 사용하는 첫 번째 모델.
