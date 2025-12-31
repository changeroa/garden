# 네트워크

프록시 및 사용자 정의 인증서 구성.

OpenCode는 엔터프라이즈 네트워크 환경을 위한 표준 프록시 환경 변수와 사용자 정의 인증서를 지원합니다.

---

## 프록시

OpenCode는 표준 프록시 환경 변수를 존중합니다.

```bash
# HTTPS 프록시 (권장)
export HTTPS_PROXY=https://proxy.example.com:8080

# HTTP 프록시 (HTTPS를 사용할 수 없는 경우)
export HTTP_PROXY=http://proxy.example.com:8080

# 로컬 서버에 대한 프록시 우회 (필수)
export NO_PROXY=localhost,127.0.0.1
```

> **Caution**: TUI는 로컬 HTTP 서버와 통신합니다. 라우팅 루프를 방지하려면 이 연결에 대해 프록시를 우회해야 합니다.

[CLI 플래그](/docs/cli#run)를 사용하여 서버의 포트 및 호스트 이름을 구성할 수 있습니다.

---

### 인증

프록시에 기본 인증이 필요한 경우 URL에 자격 증명을 포함합니다.

```bash
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

> **Caution**: 암호를 하드코딩하지 마세요. 환경 변수나 안전한 자격 증명 저장소를 사용하세요.

NTLM 또는 Kerberos와 같은 고급 인증이 필요한 프록시의 경우 인증 방법을 지원하는 LLM 게이트웨이 사용을 고려하세요.

---

## 사용자 정의 인증서

엔터프라이즈에서 HTTPS 연결에 사용자 정의 CA를 사용하는 경우 OpenCode가 이를 신뢰하도록 구성합니다.

```bash
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

이것은 프록시 연결과 직접 API 액세스 모두에 작동합니다.
