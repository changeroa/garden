## 1. Network Overview
### Internet Basics
![lecture-13-network-security-20251215210338217.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938141/obsidian/Knowledge/computer-science/computer-security/lecture-13-network-security/assets/lecture-13-network-security-20251215210338217.png)
* **Internetworking:** Technologies interconnecting multiple networks.
* **Internet (noun):** A set of interconnected networks (Laptops, servers, switches, routers).
    * **Components:**
        * *Core Network:* Backbone, Routers.
        * *Access Network:* [[ADSL]], Cable, [[FTTH]], Wireless (Last Mile).
        * *Home/Enterprise Network:* Local LANs, Modems, APs.

### Layered Models
![lecture-13-network-security-20251215210338254.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938142/obsidian/Knowledge/computer-science/computer-security/lecture-13-network-security/assets/lecture-13-network-security-20251215210338254.png)
#### TCP/IP Model (5 Layers - De facto Standard)
![lecture-13-network-security-20251215210338293.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938143/obsidian/Knowledge/computer-science/computer-security/lecture-13-network-security/assets/lecture-13-network-security-20251215210338293.png)
1.  **Application:** Supports network applications (HTTP, SMTP, FTP, P2P).
2.  **Transport:** Data transfer between processes (TCP, UDP).
3.  **Network (Internet):** Routing of [[datagrams]] (IP, ICMP).
4.  **Data Link:** [[Frame]] delivery between neighboring elements (Ethernet, Wi-Fi).
5.  **Physical:** Bits on the wire.
[[How can I distinguish between datagram and frame?]]

#### OSI Reference Model (7 Layers - Theoretical)
* Application, Presentation, Session, Transport, Network, Data Link, Physical.
* *Note:* TCP/IP condensed the top 3 OSI layers into "Application".

---
## Network Routing & Forwarding

![lecture-13-network-security-20251215210338326.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938143/obsidian/Knowledge/computer-science/computer-security/lecture-13-network-security/assets/lecture-13-network-security-20251215210338326.png)
### Routing
to determine a route, the end-to-end path from source to destination.
-> routing protocol is required => it constructs a routing table for packet forwarding.
[[왜 라우터에 목적지가 두 개 적혀있지?]]
### Forwarding
to move packets within a router from an input to an appropriate output based on the routing table.
- **IP header processing:** 패킷이 들어오면 헤더를 읽어 목적지 주소를 확인합니다.
- **Routing table lookup:** 위쪽(라우팅)에서 만들어준 '포워딩 테이블'을 참조합니다.
- **Next hop forwarding:** 테이블에 적힌 대로 다음 라우터로 패킷을 쏘아 보냅니다.

---

### TCP/IP - Encapsulation
![lecture-13-network-security-20251215210338352.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938144/obsidian/Knowledge/computer-science/computer-security/lecture-13-network-security/assets/lecture-13-network-security-20251215210338352.png)
▪ each layer 
	• takes a message (data) from its upper layer, but 
	• does not modify any bit of the message, and 
	• appends additional information (header) 
	• delivers [[PDU (header + data)]] to its lower layer

## TCP/IP - Decapsulation
![lecture-13-network-security-20251215210338378.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938145/obsidian/Knowledge/computer-science/computer-security/lecture-13-network-security/assets/lecture-13-network-security-20251215210338378.png)
* Interfacing towards upper layers
	* each layer 
	* has a **specific field** in its header
	* to **indicate the upper layer protocol** for the [[SDU]] to be delivered

---

## 2. Network Attacks
**Definition:** Illegal access to a network to steal info, modify data, or cause harm.

### Common Types of Attacks
1.  **Man-in-the-Middle (MitM)**
2.  **DoS (Denial of Service)**
3.  **DDoS (Distributed Denial of Service)**
4.  **Phishing**
5.  **DNS Spoofing**

---

### A. Man-in-the-Middle (MitM)
**Concept:** Attacker secretly sits between two parties (A ↔ Attacker ↔ B), intercepting, modifying, or relaying messages.

#### Common Scenarios
1.  **Fake Wi-Fi Access Point (Evil Twin):**
    * Attacker sets up "Free_Cafe_WiFi" with a strong signal.
    * Victim connects → Attacker captures all traffic.
2.  **Email Hijacking (BEC - Business Email Compromise):**
    * Compromise a CEO/Manager's email.
    * Send fake invoices to clients to steal money.
3.  **Session Hijacking (Cookie Theft):**
    * Stealing "Session Cookies" over unencrypted Wi-Fi.
    * Access victim's accounts (e.g., Facebook) without a password.
4.  **SSL Stripping:**
    * Downgrades **HTTPS** to **HTTP**.
    * Victim sees the site looks normal (but no padlock) → Enters credentials → Sent in plaintext.

#### Real-World Examples
* **Equifax (2017):** MitM vulnerability led to data breach.
* **Tesla (2024):** "Tesla Guest" fake Wi-Fi used to steal cars via MitM.

#### Defenses
* **HTTPS/TLS:** Ensure `https://` and valid certificates.
* **HSTS:** Enforce HTTPS to prevent SSL stripping.
* **VPN:** Encrypt traffic on public Wi-Fi.
* **MFA (Multi-Factor Authentication):** Protects account even if password/cookie is stolen.

---

### B. DoS (Denial of Service)
**Concept:** Overloading a server with fake traffic so legitimate users cannot access it.

#### Types of DoS
1.  **Bandwidth Attacks:** Flooding network capacity (e.g., 5 Gbps junk on a 1 Gbps link).
2.  **Protocol Attacks:**
    * **TCP SYN Flood:** Exploits the 3-way handshake (consumes memory).
    * **Ping Flood (ICMP):** Overwhelms with oversized/many ICMP packets.

#### Impact
* Financial loss, Reputation damage, Resource exhaustion (CPU/RAM).

### C. DDoS (Distributed Denial of Service)
**Concept:** DoS attack launched from **many** devices simultaneously (Botnet).

#### Mechanism
1.  **Botnet Creation:** Infect thousands of devices (Zombies) with malware.
2.  **Command & Control:** Attacker sends "Attack" command.
3.  **Flood:** All zombies attack the target at once.

| Feature | DoS | DDoS |
| :--- | :--- | :--- |
| **Source** | Single Device | Many Devices (Botnet) |
| **Traffic** | Lower | Extremely High |
| **Blocking** | Easier (Block 1 IP) | Very Hard (Distributed IPs) |

#### Defenses
* **Firewalls:** Block suspicious patterns.
* **IDS (Intrusion Detection Systems):** Alert on traffic spikes.
* **Redundancy:** Use multiple data centers/servers.
* **Rate Limiting:** Limit requests per user/IP.

---

### D. Phishing
**Concept:** Social engineering to trick users into revealing credentials or financial info by pretending to be trustworthy.

#### Types
1.  **Email Phishing:** Generic mass emails (e.g., "Reset your password").
2.  **Spear Phishing:** Targeted attack on specific individuals (e.g., "Hello [Name], please pay this invoice").
3.  **Clone Phishing:** Copying a legitimate email but replacing links with malicious ones.
4.  **Vishing (Voice Phishing):** Phone calls pretending to be bank/support.

#### Prevention
* Verify sender address.
* Do not click suspicious links.
* **Anti-Phishing Software:** Tools like *Ironscales*, *Perception Point*.

---

### E. DNS Spoofing
**Concept:** Deception/Forgery of DNS responses.
* **Normal DNS:** Translates `google.com` → Real IP.
* **Spoofed DNS:** Translates `google.com` → **Fake/Malicious IP**.

#### Mechanism
* Attacker corrupts the DNS cache or acts as a fake DNS server.
* Victim types a correct URL but is silently redirected to a fake website.
* **Risk:** The fake site looks identical → Victim enters credentials → Data stolen.

#### Vulnerabilities
* Unsecured DNS servers.
* Default configurations.
* Lack of **DNSSEC** (Security Extensions).