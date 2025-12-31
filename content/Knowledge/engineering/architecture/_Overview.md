# E. Architecture, Networking & Security

Created:: 2025-11-28
Tags:: #knowledge #architecture #networking #security

---

## 학습 목표
HTTP 아래 레이어(TCP, TLS, DNS)까지 이해하고,
분산 시스템의 일관성/가용성 트레이드오프를 인지하며,
장애/에러가 기본인 환경을 먼저 가정하는 **Failure-First 설계**,
그리고 보안 취약점을 사전에 막는 구조 설계.

---

## 구성

| 섹션 | 주제 | 핵심 |
|------|------|------|
| [[E1_Networking/_Overview\|E1]] | System Boundary & Networking | TCP/TLS/HTTP, API 설계, Load Balancing |
| [[E2_Consistency_Sync/_Overview\|E2]] | Consistency Models & Sync | CAP, CRDT, Logical Clock |
| [[E3_Failure_Design/_Overview\|E3]] | Failure-First Design & Reliability | Retry, Circuit Breaker, Degradation |
| [[E4_Security/_Overview\|E4]] | Security Engineering | Crypto, AuthN/AuthZ, Web Security |

---

## 연관 영역
- [[A4_Local_First/_Overview|A4. Local-First]] - 클라이언트 동기화
- [[D3_Observability/_Overview|D3. Observability]] - 장애 추적
