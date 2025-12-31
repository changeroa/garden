# Lecture 14: Software Security

## 1. Insider Attacks
### Definition
**Insiders** are individuals who have authorized access to an organization's systems or data due to their job role. Because they are trusted and have legitimate access, they can cause harm intentionally or unintentionally.

### Why are they dangerous?
> [!WARNING] key Challenge
> Insiders cannot be blocked by standard defenses like firewalls or locked doors because they already hold keys/permissions.

### Types of Insider Threats
#### A. Mistaken Insider Attacks (Unintentional)
Insiders often cause breaches without malicious intent due to negligence or lack of awareness.
* **Misconfiguration:** Leaving databases or systems open to the internet.
* **Phishing:** Clicking suspicious links or downloading malware.
* **Weak Credentials:** Using guessable passwords.

#### B. Malicious/Compromised Insiders (Intentional/Targeted)
1.  **Employees:** Admins stealing data or workers leaking secrets to competitors.
2.  **Former Employees:** Fired staff using old credentials or taking data before leaving.
3.  **Business Partners:** Vendors with shared access misusing information.

---

## 2. Malware (Malicious Software)
**Definition:** Software intentionally created to infiltrate systems, steal data, disrupt operations, or damage resources.

### Common Types
* **Ransomware**
* Trojan Horses
* Viruses & Worms
* Spyware & Adware
* Backdoors

### Goals of Malware
* **Theft:** Stealing passwords, credit cards, or PII (Personal Identifiable Information).
* **Destruction:** Deleting or corrupting files.
* **Disruption:** Stopping normal system operations.
* **Extortion:** Encrypting data for ransom.
* **Surveillance:** Keylogging or monitoring activity.
* **Control:** Creating botnets for remote control.

---

## 3. Ransomware
**Definition:** A specific type of malware designed to **deny access** to systems or files until a ransom is paid (usually in cryptocurrency).

### Impact & Cost
* **Financial:** Ransom payments, forensic costs, system restoration.
* **Operational:** Downtime and productivity loss.
* **Reputational:** Damage to the organization's brand.
* **Data:** Permanent loss or exposure of sensitive data.
* *Statistic:* Global costs predicted to reach significant billions annually (e.g., $57B forecast for 2025).

### Two Main Types of Ransomware

| Type | Description | Target | Recovery |
| :--- | :--- | :--- | :--- |
| **Crypto Ransomware** | Encrypts specific files so they cannot be opened. | User files (Docs, Images, PDFs). | Difficult without backup or key. |
| **Locker Ransomware** | Prevents the user from logging into the OS entirely. | System files / Boot process. | Easier (Reinstall OS). |

> [!NOTE] Fake Authority Scams
> Locker ransomware often mimics law enforcement (FBI, Police), claiming the computer was locked due to illegal activity to scare victims into paying (e.g., *Reveton Ransomware*).

---

## 4. Research Safety Protocols
> [!DANGER] STRICT WARNING
> **Do NOT** visit malware distribution sites or download live malware samples on personal or university networks. It violates laws and policies.

### How Professionals Handle Live Ransomware
Real security researchers follow strict protocols in controlled environments:

1.  **Institutional Approval (Mandatory):**
    * Must obtain **IRB (Institutional Review Board)** ethical approval.
    * Unauthorized downloading is strictly prohibited.

2.  **Dedicated Lab Environment (Isolated):**
    * **Air-Gapped Network:** No connection to the internet/university network.
    * **Hardware Isolation:** Physical machines dedicated to analysis.
    * **Dynamic Analysis Tools:** * *Cuckoo Sandbox:* Automated analysis platform.
        * *Wireshark:* Capturing traffic *only* inside the sandbox.

3.  **Safe Alternatives (For Students):**
    * Use **Feature-based Datasets** (e.g., CSV files with pre-extracted features).
    * These contain NO executable code (benign vs. malware labels).
    * Used for training classifiers or clustering without risk.

---

## 5. Countermeasures
Strategies to protect against Software Security threats:

1.  **Threat-Informed Email Protection:**
    * First line of defense.
    * Detects known **IoCs (Indicators of Compromise)** in emails.

2.  **Security Awareness Training:**
    * Focuses on the **Human** element (avoiding phishing/bad links).
    * Mandatory training for employees.

3.  **Backup Strategy:**
    * The *best* reaction to encryption.
    * Restore from clean backups rather than paying the ransom.

4.  **Network Segmentation:**
    * Breaking a large network into smaller, isolated segments.
    * Stops malware from spreading (lateral movement) to the entire organization if one host is infected.