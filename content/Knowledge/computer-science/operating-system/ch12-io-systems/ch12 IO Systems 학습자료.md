# Chapter 12: I/O Systems - 4단계 학습 자료

---

## 1단계: 초등학생도 이해하는 [핵심 컨셉]

컴퓨터는 키보드, 마우스, 하드디스크 같은 다양한 장치들과 "대화"해야 하는데, 이 대화를 책임지는 것이 **I/O 시스템**입니다. 마치 통역사가 서로 다른 언어를 쓰는 사람들 사이에서 중간 역할을 하듯, **디바이스 드라이버**가 각기 다른 장치들의 "방언"을 OS가 이해할 수 있는 공통 언어로 바꿔줍니다. CPU가 일일이 장치를 감시하면 너무 바쁘니까, **인터럽트**와 **DMA** 같은 기술로 "알아서 하고 끝나면 알려줘" 방식을 사용합니다.

---

## 2단계: 흐름 파악을 위한 [논리 구조화]

### A. I/O 하드웨어 구성요소
- **Port**: 장치가 컴퓨터에 연결되는 접속점
- **Bus**: 여러 장치를 연결하는 통로 (PCIe, expansion bus, SAS 등)
- **Controller (Host Adapter)**: 포트, 버스, 장치를 실제로 조작하는 전자회로

### B. CPU와 장치 간 통신 방식 3가지

#### 1. Polling (폴링)
- CPU가 장치 상태를 계속 확인하며 기다림
- 장치가 빠르면 괜찮지만, 느리면 CPU 낭비가 심함

#### 2. Interrupt (인터럽트)
- 장치가 준비되면 CPU에게 신호를 보냄
- CPU는 다른 일 하다가 신호 받으면 처리
- Interrupt vector로 적절한 handler에게 전달

#### 3. DMA (Direct Memory Access)
- 대용량 데이터 전송 시 CPU를 거치지 않고 메모리에 직접 전송
- 완료 후 인터럽트로 CPU에게 알림

### C. Application I/O Interface
- **Block device**: 디스크 (read, write, seek)
- **Character device**: 키보드, 마우스 (get, put)
- **Network socket**: 네트워크 통신용 별도 인터페이스

### D. Kernel I/O Subsystem 기능
- **Scheduling**: I/O 요청 순서 정하기
- **Buffering**: 속도 차이 해결을 위한 임시 저장
- **Caching**: 빠른 접근을 위한 데이터 복사본 유지
- **Spooling**: 프린터처럼 한 번에 하나만 처리하는 장치용 대기열

### E. 성능 향상 방법
- Context switch 줄이기
- Data copying 줄이기
- DMA 활용
- 대용량 전송으로 인터럽트 횟수 줄이기

---

## 3단계: 원문 정복을 위한 [심층 해설 및 용어]

### 핵심 용어 해설

| 용어                      | 설명                                                      |
| ----------------------- | ------------------------------------------------------- |
| **Device Driver**       | 장치의 세부사항을 숨기고, I/O subsystem에 **통일된 인터페이스**를 제공하는 소프트웨어 |
| **Memory-mapped I/O**   | 장치 레지스터를 CPU의 주소 공간에 매핑하여, 메모리 접근처럼 장치 제어 가능            |
| **Busy-wait (Polling)** | status register의 busy bit가 0이 될 때까지 반복 확인하는 방식          |
| **Interrupt vector**    | 인터럽트 번호에 따라 올바른 핸들러로 분기시키는 테이블                          |
| **Cycle stealing**      | DMA가 버스를 사용할 때 CPU의 버스 사이클을 "훔쳐" 쓰는 것                   |

### 시험에 나올 중요 디테일

1. **장치 레지스터 4종류**: data-in, data-out, status, control register (보통 1-4 bytes)

2. **폴링 과정 5단계**:
   - (1) busy bit 확인 → (2) read/write bit 설정 → (3) command-ready bit 설정 → (4) controller가 실행 → (5) 완료 시 bit들 클리어

3. **DMA 6단계 과정**:
   - CPU가 DMA command block(source, destination, count)을 메모리에 작성 → DMA controller에 위치 전달 → Bus mastering으로 직접 전송 → 완료 시 인터럽트

4. **I/O 장치 분류 기준**:
   - data-transfer mode: character vs block
   - access method: sequential vs random
   - transfer schedule: synchronous vs asynchronous
   - sharing: dedicated vs sharable
   - I/O direction: read-only, write-only, read-write

5. **Blocking vs Nonblocking vs Asynchronous**:
   - Blocking: I/O 완료까지 프로세스 중단
   - Nonblocking: 가능한 만큼 즉시 반환
   - Asynchronous: I/O 실행 중에도 프로세스 계속 실행, 완료 시 신호

6. **macOS 데스크톱 예시**: 10초에 23,000개 인터럽트 발생 (초당 수백~수천 개)

---

## 4단계: 최종 점검 [빈칸 뚫기 테스트]

다음 빈칸을 채우세요:

1. I/O 장치와 컴퓨터를 연결하는 접속점을 ( ① )라 하고, 여러 장치를 연결하는 통로를 ( ② )라 한다.

2. ( ③ )는 장치의 세부사항을 캡슐화하여 I/O subsystem에 통일된 인터페이스를 제공한다.

3. 장치의 상태를 반복적으로 확인하며 기다리는 방식을 ( ④ )이라 하며, 이는 장치가 느릴 경우 CPU 자원을 낭비한다.

4. CPU가 매 명령어 실행 후 확인하는, I/O 장치가 발생시키는 신호를 처리하는 라인을 ( ⑤ )이라 한다.

5. 대용량 데이터 전송 시 CPU를 우회하여 메모리에 직접 접근하는 방식을 ( ⑥ )라 하며, DMA가 CPU의 버스 사용 기회를 빼앗는 것을 ( ⑦ )이라 한다.

6. 장치 레지스터를 프로세서 주소 공간에 매핑하는 방식을 ( ⑧ )라 한다.

7. I/O가 완료될 때까지 프로세스가 중단되는 방식을 ( ⑨ ), 프로세스가 계속 실행되며 완료 시 신호를 받는 방식을 ( ⑩ )라 한다.

8. 프린터처럼 한 번에 하나의 요청만 처리할 수 있는 장치를 위해 출력을 대기시키는 것을 ( ⑪ )이라 한다.

---

### 정답

| 번호 | 정답 |
|------|------|
| ① | Port |
| ② | Bus |
| ③ | Device driver |
| ④ | Polling (또는 busy-wait) |
| ⑤ | Interrupt-request line |
| ⑥ | DMA (Direct Memory Access) |
| ⑦ | Cycle stealing |
| ⑧ | Memory-mapped I/O |
| ⑨ | Blocking |
| ⑩ | Asynchronous |
| ⑪ | Spooling |
