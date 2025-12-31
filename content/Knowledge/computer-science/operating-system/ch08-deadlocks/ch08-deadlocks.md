System consists of **resources($R_n$)**.
	Resource types are e.g. CPU cycles, memory space, I/O devices
Each resource type $R_i$ has $W_i$ instances.
Each process utilizes a resource as follows:
	**request** => **use** => **release**

# Deadlock with Semaphores 
* Data : 
	* A semaphore $s_1$ initialized to 1
	* A semaphore $s_2$ initialized to 1
* Two processes P1 and P2
* P1 :
	```
	wait(s1)
	wait(s2)
	```
	
* P2 :
	```
	wait(s2)
	wait(s1)
	```

# Deadlock Charatecrization
Deadlock can arise if four conditions hold simultaneously.

* **Mutual exclusion** : only one process at a time can use a resource.
* **[[Hold and wait]]** : a process holding at least one resource is waiting to acquire additional resources held by other processes.
* **No [[preemption]]** : a resource can be released only voluntarily by the process holding it, after that process process has completed its task.
* ==**Circular wait**== : there exists a set {$P_1, P_2, ... , P_n$} of waiting processes such that $P_0$ is waiting for a resource that is held by $P_1$, $P_1$ is waiting for a resource that is held by $P_2, ...,P_{n-1}$ is waiting for a resource that is held by $P_n$, and $P_n$ is waiting for a resource that is held by $P_0$.

[[왜 앞의 3가지는 "현실적 전제(Default)"인가?]] 
	-> Circular wait가 성립하는지 확인하라
		1. 그래프에 cycle이 있는가?
		2. Circular wait가 성립하는가? (==자원 대기 관계(Dependency Chain)를 추적했을 때, 그 경로가 순환하여 다시 자기 자신에게 도달하는가?==)

---
# Resource-Allocation Graph
A set of vertices $V$ and a set of edges $E$,
* V is partitioned into two types:
	* P = {$P_1, P_2, ..., P_n$}, the set consisting of all the processes in the system.
	* R = {$R_1, R_2, ... R_m$}, the set consisting of all resource types in the system.
* request edge - directed edge $P_i -> R_j$
* assignment edge - directed edge $R_j -> P_i$

![ch08-deadlocks-20251217004909296.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938149/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909296.png)
이 그래프가 Deadlock이 아닌 이유:
	프로세스간 cycle이 없음. (Circular자체가 성립 x)



![ch08-deadlocks-20251217004909340.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938150/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909340.png)
이 그래프가 Deadlock이 아닌 이유:
	프로세스간 cycle이 있지만 circular wait가 성립을 안함. 

---

# Methods for Handling Deadlocks
Ensure that the system will never enter a deadlock state: 
• Deadlock prevention  
• ==Deadlock avoidance== 
	1. Allow the system to enter a deadlock state and then recover
	2. Ignore the problem and pretend that deadlocks never occur in the system.

---

# Deadlock Prevention
Invalidate one of the four necessary conditions for deadlock:
**But why it is so hard?**
* Mutual Exclusion is not required for sharable resources (e.g., read-only files); must hold for **non-sharable resources**. 
* "Hold and Wait" must guarantee that whenever a process requests a resource, it **does not hold any other resources**. 
	* Require process to request and be allocated all its resources before it begins execution, or allow process to request resources only when the process has none allocated to it. => Low resource utilization; starvation possible
* No Preemption :
	* If a process that is holding some resources requests another resource that cannot be immediately allocated to it, then all resources currently being held are released
	* Preempted resources are added to the list of resources for which the process is waiting.
	* Process will be restarted only when it can regain its old resources, as well as the new ones that it is requesting.
	=> 즉 프로세스가 원하는 것을 얻기 위해 선점된 자원을 모두 반납시키는데, 그러면 이 프로세스는 본인이 선점했던 자원도 반납하고 이제는 이미 가지고 있던 자원, 그리고 얻어야하는 자원을 모두 기다려야하는 멍청 상태가 된다.
* Circular Wait :
	* Impose a total ordering of all resource types, and require that each process requests resources in an increasing order of enumeration => 즉 결혼식 뷔페같은 곳을 만드는거임.
	* Simply assign each resource (i.e., mutex locks) a unique number. -> Resources must be ==acquired in order==.
	  [[실제 코드 예시]]

---

# Deadlock Avoidance
Deadlock Avoidance Requires that the system has some additional **a priori** information available
* Simplest and most useful model requires that each process declare the **maximum number of resources** of each type that it may need.
* The deadlock-avoidance algorithm **dynamically examines** the resource-allocation state to ensure that there can never be a circular-wait condition
* Resource-allocation state is defined by the number of **available** and **allocated** resources, and the **maximum demands** of the processes
=> Safe state안에 머물도록 감시하고 조정.

# Safe State ("지금 당장 자원이 없어도, 미래에 해결될 것이 확실한가?")
* When a process requests an available resource, system must decide if immediate allocation leaves the system in a safe state.
* System is in safe state if there exists a sequence <$P_1,P_2, ..., P_3$> of ALL the processes in the systems such that for each $P_i$, the resources that $P_i$ can still request can be satisfied by ==currently available resources== + ==resources held by all the $p_j$==, with $j$ < $i$
	* If Pi resource needs are not immediately available, then Pi can wait until all Pj have finished 
	* When Pj is finished, Pi can obtain needed resources, execute, return allocated resources, and terminate 
	* When Pi terminates, Pi +1 can obtain its needed resources, and so on


# Basic Facts
![ch08-deadlocks-20251217004909390.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938151/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909390.png)
* If a system is in safe state -> no deadlocks
* If a system is in unsafe state -> possibility of deadlock
* Avoidance -> ensure that a system will never enter an unsafe state

# Avoidance Algorithms
* Single instance of a resource type
  ->  Use a ==resource-allocation graph==
* Multiple instances of a resource type
  -> Use the ==Banker's Algorithm==

## Resource-Allocation graph
![ch08-deadlocks-20251217004909417.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938151/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909417.png)
## 예약 간선 (Claim Edge, $P_i \to R_j$)
- **의미:** "나 당장 필요한 건 아닌데, 나중에 밥 먹다가 **소금($R_j$)** 달라고 할지도 몰라."
- **시각화:** **점선 (Dashed Line)**으로 표시합니다.
- **특징:** 당장 달라는 게 아니라, **미래의 가능성(Intention)**을 미리 표시해 두는 것입니다.

## Process
① 예약 $\rightarrow$ 요청 (Claim $\to$ Request)
- **상황:** 밥을 먹다가 진짜로 소금이 필요해졌습니다. "소금 주세요!"
- **변화:** **점선**이 **실선**으로 바뀝니다. ($P_i \to R_j$)
- **의미:** "찜해놨던 걸 **실제로 요청**함."
② 요청 $\rightarrow$ 할당 (Request $\to$ Assignment)
- **상황:** 식당 주인이 소금을 가져다줍니다. "여기 있습니다."
- **변화:** 화살표 방향이 반대로 뒤집힙니다. ($R_j \to P_i$)
- **의미:** 자원이 프로세스 손에 들어감.
③ 할당 $\rightarrow$ 예약 (Assignment $\to$ Claim) **[중요!]**
- **상황:** 소금을 다 쓰고 다시 돌려줍니다. "다 썼어요."
- **변화:** 화살표가 사라지는 게 아니라, **다시 원래의 점선(Claim Edge)**으로 돌아갑니다. ($P_i \to R_j$)  
- **의미:** "지금은 반납하지만, 나중에 **또 달라고 할 수도 있으니까(Claim)** 점선으로 남겨둬."

# Unsafe State In Resource-Allocation Graph
![ch08-deadlocks-20251217004909457.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938152/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909457.png)
The request can be granted only if ==converting the request edge to an assignment edge== does not result in the formation of a ==cycle== in the resource allocation graph

# Banker's Algorithm
This algorithm checks whether the system is in a **Safe State** (i.e., if there exists a ==sequence of execution to avoid deadlock==).

## Safety Algorithm
![ch08-deadlocks-20251217004909480.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938153/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909480.png)
[[Safety Algorithm Pseudo-Code]]

## Resource-Request Algorithm
![ch08-deadlocks-20251217004909512.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938154/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909512.png)

![ch08-deadlocks-20251217004909536.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938154/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909536.png) 
![ch08-deadlocks-20251217004909573.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938155/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909573.png)

[[Resource-Request Algorithm Pseudo-Code]]

![ch08-deadlocks-20251217004909636.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938156/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909636.png)
- **이제 다시 감사(Safety Check)를 시작합니다.**
    
    - **현재 잔고 (2, 3, 0)**으로 누구를 끝낼 수 있나?
        
    - 오! 바로 $P_1$ 본인의 남은 필요량 **(0, 2, 0)**을 해결할 수 있습니다.
        
    - $P_1$이 끝나고 돈을 다 갚으면 잔고가 확 늘어납니다. ((2,3,0) + (3,0,2) = (5,3,2))
        
    - 늘어난 잔고로 $P_3, P_4 \dots$ 줄줄이 해결 가능합니다.
        

> **최종 결론:** "고객님, 이 돈을 빌려드려도 우리 은행은 망하지 않겠네요. **대출 승인합니다!**"

---
# Deadlock Detection

## Single Instance of Each Resource Type
![ch08-deadlocks-20251217004909663.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938157/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909663.png)
- **대기 그래프 (Wait-for Graph) 사용:**    
    - 기존의 '자원 할당 그래프'에서 **자원 노드를 지우고 프로세스끼리만 연결**한 그래프입니다.
    - **노드:** 프로세스 ($P_i$)
    - **간선 ($P_i \to P_j$):** $P_i$가 $P_j$가 가진 자원을 기다리고 있음.
        
- **탐지 방법:**
    - 주기적으로 알고리즘을 돌려 그래프에 **사이클(Cycle, 원)**이 있는지 확인합니다.
    - **사이클이 있다 $\rightarrow$ 데드락이 존재한다.**
    
- **오버헤드 (비용):**
	- 그래프의 정점(프로세스) 개수가 $n$일 때, 사이클을 찾는 연산 비용은 **$O(n^2)$** 정도 듭니다.

## Several Instances of a Resource Type
When resources have **multiple instances** (e.g., 3 printers), a cycle in the graph is not sufficient to confirm a deadlock. We must use an algorithm similar to the Banker's Algorithm.

#### **Data Structures**

- **Available:** A vector of length $m$ indicating the number of available resources.
- **Allocation:** An $n \times m$ matrix defining the number of resources **currently held** by each process.
- **Request:** An $n \times m$ matrix indicating the **current request** of each process.
    - _Note:_ Unlike the Banker's Algorithm which uses `Need` (Max - Allocation), this algorithm uses `Request` (what the process is asking for _right now_).
    - If `Request[i][j] = k`, process $P_i$ is requesting $k$ more instances of resource $R_j$.


![ch08-deadlocks-20251217004909690.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938157/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909690.png)
**Execution Sequence:**

1. **$P_0$**: Request is (0,0,0). Finishes. `Work` becomes **(0, 1, 0)**.
2. **$P_2$**: Request is (0,0,0). Finishes. `Work` becomes **(3, 1, 3)**.
3. **$P_3$**: Request (1,0,0) $\le$ Work (3,1,3). Finishes. `Work` becomes **(5, 2, 4)**.
4. **$P_1$**: Request (2,0,2) $\le$ Work (5,2,4). Finishes.
5. **$P_4$**: Finishes.

- **Result:** `Finish[i] = true` for all $i$. **No Deadlock.**

### What if
![ch08-deadlocks-20251217004909710.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938158/obsidian/Knowledge/computer-science/operating-system/ch08-deadlocks/assets/ch08-deadlocks-20251217004909710.png)
1. **$P_0$**: Request (0,0,0). Finishes. `Work` becomes **(0, 1, 0)** (Reclaims resources held by $P_0$).
2. **Check Others with Work (0, 1, 0):**
    - $P_1$: Request (2,0,2) > Work. **Wait.**
    - $P_2$: Request (0,0,1) > Work (C is 0). **Wait.**
    - $P_3$: Request (1,0,0) > Work (A is 0). **Wait.**
    - $P_4$: Request (0,0,2) > Work. **Wait.**
3. **Result:** No other process can be satisfied. `Finish` is false for $P_1, P_2, P_3, P_4$.
4. **Conclusion:** **Deadlock exists** involving $P_1, P_2, P_3, P_4$.
    

## When and how often should we invoke this algorithm?
- **Frequency of Deadlock:** If deadlocks occur frequently, invoke it often.
- **Rolled-back Processes:** Deadlocks usually require rolling back processes. If we detect it late, the cycle may grow (many processes involved), making recovery expensive.
- **Issues with arbitrary invocation:**
    - If invoked too infrequently, there may be **many cycles** in the resource graph.
    - It becomes difficult to tell **which process "caused" the deadlock** among the many involved.

---

# Recovery from Deadlock : Process Termination
## Strategies
#### Process Termination
* Abort all deadlocked processes 
* Abort one process at a time until the deadlock cycle is eliminated
	* In which order should we choose to abort?
		1. **Priority** of the process 
		2. **How long** process has computed, and how much longer to completion 
		3. **Resources** the process **has used** 
		4. **Resources** process **needs to complete** 
		5. How many processes **will need to be terminated**
		6. Is process **interactive** or **batch**?
#### Resource Preemption
* Selecting a victim – **minimize cost**
* Rollback – **return to some safe state**, restart process for that state
* Starvation – same process may always be picked as victim, include number of rollback in cost factor
	* 많이 뺏긴 놈은 가중치를 줘서 다음번엔 희생양으로 안 뽑히게 보호해 줍니다.