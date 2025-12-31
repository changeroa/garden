# E1. System Boundary & Networking Fundamentals

Created:: 2025-11-28
Tags:: #knowledge #networking #http #tcp

---

## 학습 목표
- HTTP 위에서만 노는 게 아니라, 그 아래 레이어(TCP, TLS, DNS)까지 이해
- 네트워크 이슈를 **설계 단계에서 고려**

---

## 세부 학습 항목

### 1. TCP/UDP 기초
- TCP Handshake (3-way handshake)
- Connection teardown (FIN/ACK)
- Flow Control, Congestion Control
- UDP의 특성과 사용처

### 2. TLS & HTTPS
- TLS Handshake 개략
- 대칭/비대칭 키 사용 시점
- 인증서, CA, 체인

### 3. HTTP/1.1, HTTP/2, HTTP/3
- Keep-Alive, pipelining
- HTTP/2 multiplexing
- HTTP/3 (QUIC) 기본 개념

### 4. DNS & Name Resolution
- DNS 질의 흐름
- A/AAAA/CNAME 레코드
- DNS 캐싱, TTL

### 5. API Boundary Design
- REST vs gRPC vs WebSocket vs SSE vs WebTransport
- Payload 크기, Latency, 양방향성에 따른 선택 기준
- API versioning

### 6. Load Balancing
- L4 vs L7 Load Balancer
- Sticky session / Session affinity
- Health Check / Circuit Breaking

---

## 실습 / 훈련

- [ ] curl -v, openssl s_client로 TLS handshake 확인
- [ ] nginx/envoy로 L7 path 기반 라우팅 설정
- [ ] 동일 기능을 REST, WebSocket, SSE로 구현 후 latency 비교

---

## 관련 노트
- 
