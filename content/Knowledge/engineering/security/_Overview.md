# E4. Security Engineering

Created:: 2025-11-28
Tags:: #knowledge #security #auth #web-security

---

## 학습 목표
- 전형적인 취약점(XSS, CSRF, SQL Injection 등)을 "알고"만 있는 게 아니라,
  **사전에 막을 수 있는 구조**를 설계

---

## 세부 학습 항목

### 1. Cryptography Basics
- 대칭키 vs 비대칭키 암호
- Hash 함수 (SHA-256 등), Salt, Pepper
- 디지털 서명 개념
- Key 관리 (환경변수, Secret Manager)

### 2. AuthN / AuthZ Architecture
- 인증(AuthN) vs 인가(AuthZ)
- 세션 기반 vs 토큰 기반 (JWT)
- OAuth2 / OpenID Connect 기본 흐름
- 권한 모델: RBAC, ABAC

### 3. Web Security Essentials
- **XSS**: Reflected / Stored / DOM-based, 방어 (Output Encoding, CSP)
- **CSRF**: Cookie + CSRF 토큰, SameSite Cookie
- **Clickjacking**: X-Frame-Options, frame-ancestors
- **CORS**: Origin, preflight, credential 포함 요청

### 4. Secure Coding with TS & Rust
- Rust: 메모리 안전성으로 막는 취약점, unsafe 최소화
- TS/JS: eval 지양, 사용자 입력 검증, 스키마 기반 validation
- Dependency Security: npm audit, cargo-audit

---

## 실습 / 훈련

- [ ] 로그인/권한 시스템: 세션 기반 vs JWT 기반 비교
- [ ] 의도적 XSS/CSRF 페이지 → 공격 후 방어 적용
- [ ] OAuth2 흐름 시퀀스 다이어그램 그리기

---

## 관련 노트
- 
