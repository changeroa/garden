# Computer Science MOC

Created:: 2025-12-24
Tags:: #MOC #computer-science

---

## Overview
컴퓨터 과학 핵심 분야를 다루는 지식 맵입니다.

---

## Domains

### Operating System
시스템 소프트웨어의 핵심 개념들입니다.

| Chapter | Topic |
|---------|-------|
| Ch.8 | [[01_Knowledge/Computer Science/Operating System/ch8 Deadlocks/\|Deadlocks]] |
| Ch.9 | [[01_Knowledge/Computer Science/Operating System/ch9 Main Memory/\|Main Memory]] |
| Ch.10 | [[01_Knowledge/Computer Science/Operating System/ch10 Virtual Memory/\|Virtual Memory]] |
| Ch.11 | [[01_Knowledge/Computer Science/Operating System/ch11 Mass-Storage Systems/\|Mass-Storage Systems]] |
| Ch.12 | [[01_Knowledge/Computer Science/Operating System/ch12 IO Systems/\|I/O Systems]] |
| Ch.13 | [[01_Knowledge/Computer Science/Operating System/ch13 File-System Interface/\|File-System Interface]] |
| Ch.14 | [[01_Knowledge/Computer Science/Operating System/ch14 File System Implementation/\|File System Implementation]] |

### Computer Security
보안 원리와 실제 적용을 다룹니다.

| Lecture | Topic |
|---------|-------|
| 08-09 | [[01_Knowledge/Computer Science/Computer Security/CompSec_Lecture08_Cryptography (Part 5)/Main\|Cryptography (Part 5-6)]] |
| 10 | [[01_Knowledge/Computer Science/Computer Security/CompSec_Lecture10_User Authentication (Part 1)/Main\|User Authentication (Part 1)]] |
| 11 | [[01_Knowledge/Computer Science/Computer Security/CompSec_Lecture11_User Authentication (Part 2)/User Authentication Security (Part 2)\|User Authentication (Part 2)]] |
| 12 | [[01_Knowledge/Computer Science/Computer Security/CompSec_Lecture12_User Authentication (Part 3)/User Authentication Security (Part 3)\|User Authentication (Part 3)]] |
| 13 | [[01_Knowledge/Computer Science/Computer Security/CompSec_Lecture13_Network Security/Main\|Network Security]] |
| 14 | [[01_Knowledge/Computer Science/Computer Security/CompSec_Lecture14_Software Security/Software Security\|Software Security]] |

---

## Recent Notes
```dataview
TABLE file.mtime as "Modified", file.folder as "Topic"
FROM "01_Knowledge/Computer Science"
WHERE file.name != "MOC_Computer_Science" AND !contains(file.path, "assets")
SORT file.mtime DESC
LIMIT 15
```

## Notes by Topic
```dataview
TABLE length(rows) as "Count"
FROM "01_Knowledge/Computer Science"
WHERE !contains(file.path, "assets")
GROUP BY file.folder
SORT length(rows) DESC
```

## Needs Attention
```dataview
LIST
FROM "01_Knowledge/Computer Science"
WHERE (contains(Status, "seedling") OR !Status) AND !contains(file.path, "assets")
LIMIT 10
```
