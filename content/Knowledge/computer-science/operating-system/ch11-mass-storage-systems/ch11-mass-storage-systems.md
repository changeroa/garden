## 1. 대용량 저장 장치 구조 개요 (Overview of Mass Storage Structure)

현대 컴퓨터의 보조 저장 장치(Secondary Storage)는 주로 **HDD(하드 디스크 드라이브)**와 **NVM(비휘발성 메모리)** 장치로 구성됩니다.

### 1.1 하드 디스크 드라이브 (HDDs)
![[annotated_img-20251218085307158]]

- **구조:** 자성 물질로 코팅된 플래터(Platter)가 회전하며, 읽기-쓰기 헤드(Head)가 데이터를 처리합니다.
    
- **물리적 특성:**
    
    - 회전 속도: 초당 60~250회 ([[RPM]] 기준 5400, 7200, 10000, 15000 등).
        
    - **전송 속도 (Transfer Rate):** 드라이브와 컴퓨터 간의 데이터 흐름 속도.
        
    - **위치 지정 시간 (Positioning Time / Random-access Time):**
        
        - **탐색 시간 (Seek time):** 디스크 암(Arm)이 원하는 ==실린더==로 이동하는 시간.
            
        - **회전 지연 (Rotational latency):** 원하는 섹터가 ==헤드== 아래로 올 때까지 회전하는 시간.
            
- **위험 요소:** 헤드 충돌(Head crash)은 디스크 표면과 헤드가 접촉하여 데이터를 손상시키는 치명적인 오류입니다.
    

> [!INFO] **HDD 성능 계산 예시**
> 
> - ==평균 접근 시간 = 평균 탐색 시간 + 평균 회전 지연==
> - 평균 탐색 시간 = 전체 트랙의 1/3
>     
> - 평균 회전 지연 = ==$\frac{1}{2} \times \frac{60}{RPM}$==
>     
> - 예: 7200 RPM 디스크의 경우, 평균 회전 지연은 약 4.17ms입니다.
>     

### 1.2 비휘발성 메모리 장치 (NVM Devices)

기계적인 부품이 없는 전자적 저장 장치입니다.

- **종류:** SSD(Solid-State Disks), USB 드라이브, 스마트폰 스토리지 등.
    
- **특징:**
    
    - HDD보다 안정적이고 빠르며, 탐색 시간이나 회전 지연이 없습니다.
        
    - 용량당 비용이 비싸고 용량이 상대적으로 적습니다.
        
    - **인터페이스:** 기존 버스(SATA 등)는 느릴 수 있어, PCI 버스에 직접 연결하는 **==NVMe==** 기술이 사용됩니다.
        
- **NAND 플래시의 제약 사항:**
    
    - **덮어쓰기 불가:** 데이터를 덮어쓰려면 먼저 지워야(Erase) 합니다.
        
    - **단위 불일치:** 쓰기는 '==페이지(Page)==' 단위, 지우기는 더 큰 '==블록(Block)==' 단위로 수행됩니다.
        
    - **수명:** 셀 당 지우기 횟수 제한이 있습니다. (예: 100,000회)
        
- **관리 기술:**
    
    - **FTL (Flash Translation Layer):** 논리 블록을 물리적 페이지로 매핑.
        
    - **가비지 컬렉션 (Garbage Collection):** 유효하지 않은 페이지 공간을 회수.
        
    - **마모 평준화 (Wear Leveling):** 모든 셀에 쓰기 작업을 고르게 분산하여 수명 연장.
        
    - **오버프로비저닝 (Overprovisioning):** 가비지 컬렉션을 위한 예비 공간 할당.
        

### 1.3 기타 저장 장치

- **휘발성 메모리 (RAM Drives):** DRAM을 보조 저장 장치처럼 사용. 매우 빠르지만 전원 차단 시 데이터가 손실됩니다. (예: Linux의 `/dev/ram`, `/tmp`)
    
- **자기 테이프 (Magnetic Tape):** 대용량 백업 및 아카이브용. 순차 접근(Sequential Access)만 가능하며 랜덤 접근 속도가 매우 느립니다.
    

---

## 2. 디스크 스케줄링 (Disk Scheduling)

운영체제는 하드웨어 사용 효율성을 높이기 위해 접근 시간(Seek time)을 최소화하고 대역폭(Bandwidth)을 최대화해야 합니다.

### 2.1 HDD 스케줄링 알고리즘

요청 큐(Queue)에 있는 I/O 요청들을 처리하는 순서를 결정합니다.

1. **FCFS (First-Come, First-Served):** 먼저 온 요청을 먼저 처리. 공정하지만 헤드 이동이 비효율적일 수 있습니다.
    
2. **SCAN (Elevator Algorithm):** 디스크 암이 한쪽 끝에서 반대쪽 끝으로 이동하며 경로상의 모든 요청을 처리합니다. 끝에 도달하면 방향을 바꿉니다.
    
3. **C-SCAN (Circular SCAN):** 한쪽 방향으로만 이동하며 요청을 처리합니다. 끝에 도달하면 처리 없이 즉시 시작점으로 되돌아갑니다. (대기 시간을 더 균일하게 만듦)
    

### 2.2 NVM 스케줄링

NVM은 헤드 이동이 없으므로 전통적인 디스크 스케줄링(SCAN 등)이 불필요합니다.

- 주로 **FCFS**를 사용하며, **NOOP** (스케줄링 없음) 정책을 쓰기도 합니다.
    
- 인접한 LBA(논리 블록 주소) 요청을 병합하여 처리 효율을 높입니다.
    
- **성능 지표:** IOPS(초당 입출력 횟수)가 중요합니다.
    

---

## 3. 저장 장치 관리 및 부착 (Management & Attachment)

### 3.1 오류 감지 및 수정 (Error Detection and Correction)

- **패리티 비트 (Parity Bit):** 오류 발생 여부(Detection)만 확인.
    
- **CRC (Cyclic Redundancy Check):** 해시 함수를 이용한 다중 비트 오류 감지.
    
- **ECC (Error-Correction Code):** 오류 감지뿐만 아니라 일부 오류는 스스로 수정 가능.
    

### 3.2 저장 장치 관리

- **포맷팅 (Formatting):**
    
    - **물리적 포맷팅:** 디스크를 섹터 단위로 나누고 헤더/ECC를 기록.
        
    - **논리적 포맷팅:** 파일 시스템(File System)을 생성.
        
- **부팅 (Booting):**
  [[상세한 부팅 과정]]
    ![ch11-mass-storage-systems-20251218091854498.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938195/obsidian/Knowledge/computer-science/operating-system/ch11-mass-storage-systems/assets/ch11-mass-storage-systems-20251218091854498.png)
    - **MBR (Master Boot Record):** 부트 코드가 저장된 디스크의 첫 번째 섹터.
        
    - **부트 로더:** 커널을 로드하는 프로그램.
        


### 3.3 스왑 공간 관리(Swap-Space Management)
운영체제는 물리 메모리(DRAM)가 모든 프로세스를 수용하기에 부족할 때, 보조 저장 장치를 메모리의 확장으로 사용합니다.
![ch11-mass-storage-systems-20251218091854555.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938195/obsidian/Knowledge/computer-science/operating-system/ch11-mass-storage-systems/assets/ch11-mass-storage-systems-20251218091854555.png)
#### 목적 및 특징

- **기능:** 전체 프로세스(Swapping) 또는 페이지(Paging)를 DRAM에서 보조 저장 장치로 이동시킵니다.
    
- **성능 중요성:** 보조 저장 장치는 DRAM보다 훨씬 느리기 때문에, 스왑 공간의 성능을 최적화하는 것이 매우 중요합니다.
    

#### 관리 방법

- **다중 스왑 공간:** 여러 저장 장치에 스왑 공간을 분산하면 I/O 부하를 줄일 수 있어 유리합니다.
    
- **전용 장치 사용:** 가능하면 별도의 전용 디스크나 파티션을 사용하는 것이 가장 좋습니다.
    
- **구현 형태:**
    
    - **Raw 파티션:** 파일 시스템 없이 원시 파티션을 스왑 공간으로 사용 (성능 우수).
        
    - **파일 시스템 내 파일:** 일반 파일 시스템 내에 스왑 파일을 생성하여 사용 (추가 및 관리가 편리함).
        

#### 리눅스의 스왑 관리

- 리눅스는 스왑 영역을 관리하기 위해 **스왑 맵(Swap Map)**과 같은 데이터 구조를 사용합니다.
    
- 스왑 파티션이나 스왑 파일 내의 페이지 슬롯 상태(사용 중 여부 등)를 추적합니다

### 3.3 저장 장치 연결 방식 (Storage Attachment)

1. **Host-Attached:** 로컬 I/O 포트(SATA, USB, FC 등)를 통해 직접 연결.
    ![ch11-mass-storage-systems-20251218091854618.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938196/obsidian/Knowledge/computer-science/operating-system/ch11-mass-storage-systems/assets/ch11-mass-storage-systems-20251218091854618.png)
2. **NAS (Network-Attached Storage):** 네트워크(NFS, CIFS)를 통해 파일 시스템 단위로 접근 (프로토콜: NFS, CIFS).
    
3. **Cloud Storage:** 네트워크를(Internet OR WAN) 통해 API로 접근. (예: AWS S3).
    ![ch11-mass-storage-systems-20251218091854681.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938197/obsidian/Knowledge/computer-science/operating-system/ch11-mass-storage-systems/assets/ch11-mass-storage-systems-20251218091854681.png)
4. **SAN (Storage Area Network):** 서버와 저장 장치를 연결하는 전용 고속 네트워크. 블록 단위 접근이 가능하며 유연성이 높음.
    

---

## 4. RAID 구조 (RAID Structure)
![ch11-mass-storage-systems-20251218091854720.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938197/obsidian/Knowledge/computer-science/operating-system/ch11-mass-storage-systems/assets/ch11-mass-storage-systems-20251218091854720.png)

**RAID (Redundant Array of Independent Disks)**는 여러 개의 디스크를 묶어 신뢰성과 성능을 향상시키는 기술입니다.

### 4.1 주요 RAID 레벨

- **RAID 0 (Striping):** 데이터를 여러 디스크에 분산 저장. **성능**은 좋으나 **중복성(Redundancy)**이 없어 디스크 하나만 고장 나도 전체 데이터 손실.
    
- **RAID 1 (Mirroring):** 데이터를 복제하여 저장. 신뢰성이 높으나 비용이 많이 듦.
    
- **RAID 4, 5, 6 (Parity):** 패리티 비트를 사용하여 적은 용량으로 데이터 복구 기능을 제공.
    
    - **RAID 5:** 패리티 정보를 여러 디스크에 분산 저장 (가장 대중적).
        
    - **RAID 6:** 두 개의 패리티(P+Q)를 사용하여 디스크 2개 고장까지 견딤.
        ![ch11-mass-storage-systems-20251218091929043.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938198/obsidian/Knowledge/computer-science/operating-system/ch11-mass-storage-systems/assets/ch11-mass-storage-systems-20251218091929043.png)
- **RAID 0+1 / 1+0:** 스트라이핑과 미러링을 혼합하여 성능과 신뢰성을 모두 잡음. (RAID 1+0이 더 높은 안정성을 가짐)
    

### 4.2 추가 기능

- **스냅샷 (Snapshot):** 특정 시점의 파일 시스템 상태 저장.
    
- **복제 (Replication):** 재해 복구를 위해 다른 사이트로 데이터 자동 복제.
    
- **핫 스페어 (Hot Spare):** 장애 발생 시 즉시 투입되어 데이터를 재구성(Rebuild)하는 대기용 디스크.
    

---

## 5. 고급 파일 시스템 및 객체 스토리지

### 5.1 ZFS (Zettabyte File System)

- RAID의 한계를 넘어 데이터와 메타데이터 모두에 **체크섬(Checksum)**을 적용하여 데이터 무결성을 보장합니다.
    
- **스토리지 풀(Storage Pool):** 물리적 디스크를 통합 관리하며 파티션 개념을 없애고 공간을 유동적으로 할당합니다.
    

### 5.2 객체 스토리지 (Object Storage)

- 대규모 데이터를 위한 방식으로, 파일 계층 구조(디렉터리) 대신 평면적인 **객체(Object)** 단위로 관리합니다.
    
- **특징:**
    
    - 객체 ID를 통해 접근.
        
    - 비정형 데이터(Unstructured Data) 저장에 적합.
        
    - 수평적 확장성(Scale-out)이 뛰어남. (예: Hadoop HDFS, Ceph).
        

---

> [!TIP] **요약**
> 
> - **HDD**는 기계적 구동으로 인해 스케줄링(SCAN 등)이 중요합니다.
>     
> - **NVM(SSD)**은 빠르지만 쓰기 수명 관리(FTL, Wear Leveling)가 필요합니다.
>     
> - **RAID**는 디스크를 묶어 성능(Striping)과 안정성(Mirroring, Parity)을 제공합니다.
>     
> - 대규모 시스템은 **SAN, NAS, Object Storage** 등을 통해 데이터를 관리합니다.
>