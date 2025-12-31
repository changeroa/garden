# Chapter 14: File System Implementation - 4단계 학습 자료

---

## 1단계: 초등학생도 이해하는 [핵심 컨셉]

**파일 시스템은 "디스크 창고 관리 시스템"이다.**

컴퓨터의 디스크는 거대한 창고와 같고, 파일 시스템은 이 창고를 체계적으로 관리하는 시스템입니다. 창고에 물건(파일)을 어디에 보관할지 결정하고(할당 방법), 어느 선반이 비어있는지 기록하며(빈 공간 관리), 물건 목록표(디렉토리)를 만들어 빠르게 찾을 수 있게 합니다. 마치 도서관에서 책의 위치를 카드 목록으로 관리하듯, 파일 시스템은 메타데이터(파일 정보)를 통해 수많은 파일들을 효율적으로 관리합니다.

---

## 2단계: 흐름 파악을 위한 [논리 구조화]

### A. 파일 시스템의 계층 구조 (위에서 아래로)
- **Application Programs**: 사용자 프로그램이 파일을 요청
- **Logical File System**: 파일 이름 → 파일 번호 변환, 메타데이터(FCB/inode) 관리
- **File Organization Module**: 논리 블록 번호 → 물리 블록 번호 변환, 빈 공간 관리
- **Basic File System**: "블록 123 가져와" 같은 명령을 장치 드라이버에 전달, 버퍼/캐시 관리
- **I/O Control**: 장치 드라이버가 하드웨어 명령으로 변환
- **Devices**: 실제 저장 장치

### B. 디스크 상의 메타데이터 구조
- **Boot Control Block**: OS 부팅 정보 (볼륨의 첫 블록)
- **Volume Control Block (S
- uperblock)**: 전체 블록 수, 빈 블록 수, 블록 크기 등
- **Directory Structure**: 파일 이름과 inode 번호 연결
- **FCB (File Control Block)**: 파일별 상세 정보 (권한, 크기, 날짜, 데이터 블록 포인터)

### C. 메모리 상의 구조
- **Mount Table**: 마운트된 파일 시스템 정보
- **System-wide Open-file Table**: 열린 파일들의 FCB 복사본
- **Per-process Open-file Table**: 프로세스별로 열린 파일 포인터

### D. 디렉토리 구현 방법
- **Linear List**: 단순하지만 검색 느림 (O(n))
- **Hash Table**: 검색 빠름, 충돌(Collision) 문제 존재

### E. 디스크 블록 할당 방법 (3가지)

#### 1. Contiguous (연속 할당)
- 장점: 최고 성능, 단순함 (시작 위치 + 길이만 저장)
- 단점: 외부 단편화, 파일 크기 예측 필요, Compaction 필요

#### 2. Linked (연결 할당)
- 장점: 외부 단편화 없음
- 단점: 순차 접근만 효율적, 포인터 손상 시 데이터 손실
- 개선: FAT (File Allocation Table) - 포인터를 테이블로 분리

#### 3. Indexed (인덱스 할당)
- 장점: 임의 접근 가능, 외부 단편화 없음
- 단점: 인덱스 블록 오버헤드
- 대용량 지원: Linked scheme, Two-level index, Combined (UNIX UFS)

### F. 빈 공간 관리
- **Bit Map (Bit Vector)**: 각 블록을 1비트로 표현 (1=free, 0=occupied)
- 연속 빈 블록 찾기 용이, 추가 공간 필요

### G. 성능 최적화
- **Buffer Cache / Page Cache**: 자주 사용하는 블록을 메모리에 보관
- **Asynchronous Write**: 버퍼에 쓰고 나중에 디스크에 기록 (빠름)
- **Synchronous Write**: 디스크에 완전히 기록될 때까지 대기 (안전)
- **Read-ahead**: 순차 접근 시 다음 블록 미리 읽기
- **Free-behind**: 사용 완료된 페이지 즉시 해제

---

## 3단계: 원문 정복을 위한 [심층 해설 및 용어]

### 핵심 용어 해설

| 용어                              | 설명                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------- |
| **FCB (File Control Block)**    | 파일 하나의 모든 메타데이터를 담은 구조체. UNIX에서는 **inode**라고 부름. 권한, 크기, 날짜, 데이터 블록 포인터 등 포함 |
| **Superblock**                  | 볼륨 전체 정보를 담은 블록. 총 블록 수, 빈 블록 수, 블록 크기 등 저장. NTFS에서는 **Master File Table**   |
| **Extent**                      | 연속된 블록들의 묶음. 연속 할당의 단점을 보완하여 파일을 여러 extent로 구성 (Veritas File System)         |
| **FAT (File Allocation Table)** | Linked 할당의 개선판. 포인터들을 볼륨 시작 부분의 테이블에 모아놓아 캐시 가능                              |
| **External Fragmentation**      | 빈 공간이 조각나서 큰 파일을 연속 저장 못하는 문제 (연속 할당의 문제)                                    |
| **Internal Fragmentation**      | 블록 내부에 낭비되는 공간 (클러스터링 시 발생)                                                  |

### 시험에 나올 법한 중요 수치/계산

#### 1. Contiguous 할당 - 주소 변환
```
LA/512 = Q ... R
→ 물리 블록 = Q + 시작 주소
→ 블록 내 변위 = R
```

#### 2. Linked 할당 - 주소 변환 (포인터 1바이트 사용 가정)
```
LA/511 = Q ... R
→ Q번째 블록을 따라가야 함
→ 블록 내 변위 = R + 1
```

#### 3. Indexed 할당 - Two-level index
- 4KB 블록, 4바이트 포인터 → 블록당 1,024개 포인터
- 최대 파일 크기 = 1,024 × 1,024 × 4KB = **4GB**

#### 4. Bit Map 크기 계산
- 블록 크기 = 4KB (2^12)
- 디스크 크기 = 1TB (2^40)
- 필요 비트 수 = 2^40 / 2^12 = **2^28 비트 = 32MB**
- 4블록 클러스터 사용 시 → **8MB**

### UNIX UFS의 Combined Index 구조
- **Direct blocks**: 작은 파일용 (12개)
- **Single indirect**: 1단계 인덱스
- **Double indirect**: 2단계 인덱스
- **Triple indirect**: 3단계 인덱스
→ 32비트 포인터로 표현 가능한 것보다 더 큰 파일 지원

---

## 4단계: 최종 점검 [빈칸 뚫기 테스트]

### 테스트 문제

1. 파일 시스템의 계층 중 파일 이름을 파일 번호로 변환하고 FCB를 관리하는 계층은 **(         )**이다.

2. 파일별 메타데이터를 저장하는 구조를 **(         )**라 하며, UNIX에서는 **(         )**라고 부른다.

3. 볼륨 전체 정보(총 블록 수, 빈 블록 수 등)를 담은 블록을 **(         )** 또는 Master File Table이라 한다.

4. 디렉토리 구현에서 검색 시간을 줄이기 위해 **(         )**를 사용하며, 두 파일명이 같은 위치로 매핑되는 **(         )** 문제가 발생할 수 있다.

5. 연속 할당(Contiguous Allocation)의 문제점은 **(         )**(빈 공간 조각화)이며, 이를 해결하기 위해 **(         )**이 필요하다.

6. Linked 할당을 개선하여 포인터를 볼륨 시작 부분 테이블에 모아놓은 방식을 **(         )**라 한다.

7. Indexed 할당에서 대용량 파일을 지원하기 위해 UNIX UFS는 direct blocks, single indirect, **(         )**, **(         )**를 사용한다.

8. 빈 공간 관리에서 각 블록을 1비트로 표현하는 방법을 **(         )**라 하며, 비트값 1은 **(         )**를 의미한다.

9. 성능 향상을 위해 자주 사용하는 블록을 메모리에 보관하는 영역을 **(         )**라 한다.

10. 순차 읽기 성능 향상을 위해 다음 블록을 미리 읽어오는 기법을 **(         )**라 한다.

---

### 정답

| 번호 | 정답 |
|:---:|------|
| 1 | Logical File System |
| 2 | FCB (File Control Block), inode |
| 3 | Volume Control Block (Superblock) |
| 4 | Hash Table, Collision (충돌) |
| 5 | External Fragmentation (외부 단편화), Compaction |
| 6 | FAT (File Allocation Table) |
| 7 | double indirect, triple indirect |
| 8 | Bit Map (Bit Vector), free (빈 블록) |
| 9 | Buffer Cache / Page Cache |
| 10 | Read-ahead |
