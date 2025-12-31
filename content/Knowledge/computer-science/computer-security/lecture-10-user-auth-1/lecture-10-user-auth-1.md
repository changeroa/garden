# What is User Authentication?

User authentication is a fundamental process that **ensures only authorized users can access** specific systems, applications, or data.

---
# More about Authentication
Authentication verifies a user’s identity by **comparing** the **credentials** they provide (such as a username and password) with a **trusted [[stored]] data**.
* Any authentication system should
	* Ensures that the authentication process is both **reliable** and **user-friendly**. 
	* Balancing between **security** and **usability**. 
	* Without a **strong authentication system**, your app becomes an easy target for attacks
---
# Identification vs. Authentication
## Identification: 
This defines **who the user is**, such as their account name, user ID, or card number.

## Authentication: 
This is **how the user proves** they are the legitimate account holder.

## Steps of the identification and authentication:
1) When you want to log in, the system asks for the **identification** (username, User ID, Email address, phone number, or credit card number) and **authentication** factor (e.g., password, fingerprint, secret code, ….). 
2) The system **verifies** that the information is correct or not. 
3) If it is, the system authenticates your identity and grants you access to systems and resources.
---
## Different Types of Identification
* Username: This is a name of your choice that identifies your online account. 
* User ID: A user ID is usually **granted** from the server or admin side, so it could be a random alphanumeric pattern, a series of digits or part of your name or email address. 
* Guest ID: it’s a one-time session ID that likely holds no extra information. An example is **purchasing tickets** for a sports or music event; it doesn’t matter what the identity is as the ticket is anonymous. (e.g HUFS Guest Wi-Fi: can be access using student ID or phone number)

---
# Types of Authentication
![lecture-10-user-auth-1-20251215205733190.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938116/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733190.png)
## 1) What you know (**Knowledge-based** Authentication) 
▪ Something you know such as **passwords**, **pattern locks**, or **PINs** 
▪ The primary methods used to authenticate users on systems. 

## 2) What you have (**Token-based** Authentication) 
▪ Any token a user has can be a **key**, **access card**, or **USB**. 
▪ Something you have or something you are buckets. 
▪ Can be used to access sensitive areas or to authenticate systems. 
▪ However, a token can be lost or stolen, which could result in unauthorized access.

## 3) What you are (**Biometrics-based** Authentication)
▪ Something specific to a person is based on his body attributes. 
▪ Physiological: **Face**, **fingerprint**, **[[iris]]**, **hand geometry**. 
▪ Behavioral: **Voice**, **[[Keystroke typing]]**, **[[Gait pattern]]**, **Touch gestures**.

## 4) Where you are (**Location-based** Authentication) 
▪ Something about the location a user physically reside in. 
▪ **IP address**, **GPS**, **Wi-Fi signals**, **Light signals**,
▪ Used to safe trusted areas or get access in pre-determined zones.

---

# User Verification
Verification is the process of confirming a digital identity and often takes place at the beginning of a relationship between a user and a company
![lecture-10-user-auth-1-20251215205733206.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938117/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733206.png)
[[What is the difference between Authentication and Verification?]]

---

# User Authorization 
![lecture-10-user-auth-1-20251215205733228.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938118/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733228.png)
Authorization ensures that users can **only access** the applications, data, and systems for which they have been **granted privileges**. (Define level of user’s access to system)
* Authorization usually come after authentication.
* It is about **grant or denial permissions** to a user.
* Permissions are granted and monitored by organization.
* It is not visible or changeable by the user.
* Sometimes, a company may require **more authentication checks** to raise the authorization level. (은행 어플 생각해보셈)

---

# How does User Authentication work with AI?
## True Accept (TA):
The legitimate user is correctly matched to the corresponding stored templet. 
## True Reject (TR):
An imposter is correctly denied when its data not matched to any stored template. 
## False Accept (FA):
The imposter was incorrectly matched to a legitimate user stored template. 
## False Reject (FR):
The legitimate user is incorrectly rejected from the system.

---

# Authentication Evaluation criteria

## False rejection rate (FRR):
![lecture-10-user-auth-1-20251215205733252.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938119/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733252.png)
FRR refers to the false alarm rate which indicates the amount number (percentage ratio) of legitimate users who are falsely rejected out of the total number of **legitimate users**.

## False acceptance rate (FAR):
![lecture-10-user-auth-1-20251215205733269.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938120/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733269.png)
FAR indicates the amount number (percentage ratio) of attackers who are falsely accepted out of the total number **illegitimate users**
[[confusion matrix]]

---

# Knowledge based Authentication (Password)

## Usability problems 
* **Forgotten** passwords might not be recoverable. 
* Entering passwords is **inconvenient**. 
* If password is disclosed to unauthorized user, he can immediately access protected data. 
	* Unless we use multi-factor authentication

## Password : 
A sequence of symbols that only you know for authentication.

## Common Security issues : 
1. Share passwords with others (family members)!
2. Use a single password across multiple sites!
3. Use easy-to-remember and easy-to-guess passwords
	1. Favorite (something)?
	2.  Name + (number)?
4. Use easy “authentication” questions
	1. Father’s [[maiden]] name?
	2. Mother’s born city?

## Password Selection Guidelines

> [!CHECK] **Best Practices**
> - **No Default/Sequential:** Avoid defaults like `admin`, `pass`, or consecutive strings like `ABCD1234`.
> - **Complexity:** Use a mix of **upper/lowercase letters, digits, and symbols**.
> - **Length:** At least **12 characters** (ideally ==16 characters or more==).
> - **Unique:** You must use a **unique password** for each online account.
> - **No PII:** Do not include personal information (e.g., birthday, address) as attackers can easily compromise this data.

### 💡 Mechanism: Passphrase to Password
A useful technique to create strong, memorable passwords using initials.

> **Example:**
> "I **h**ate **w**hen **s**ystem **a**sks **m**e **t**o **c**hange **p**assword"
> 👇
> `Ihwsam2cp`

## Real-world Reality & Threats

### 😓 Why Users Fail?
Even when taught how to create secure passwords, users often choose not to do so because:
* **Memory Load:** They feel it is difficult to remember complex passwords.
* **No Accountability:** They lack a sense of responsibility.
* **Indifference:** They do not feel that security is important.

### 🏴‍☠️ Password Related Threats

| Threat Type  | Description                                                                                                          |
| :----------- | :------------------------------------------------------------------------------------------------------------------- |
| **Guessing** | Attackers manually or automatically try common or simple passwords.                                                  |
| **Spoofing** | Attackers trick users into revealing their passwords (e.g., fake login pages).                                       |
| **Cracking** | Hackers steal hashed password files from a server and use tools like `John the Ripper` or `Hashcat` to recover them. |

## How the system helps to improve password security.
> **1. Password Ageing**
> * Enforces users to **change their passwords periodically**.
> * Often prohibits the reuse of old passwords.
>
> **2. Limit Login Attempts**
> * Temporarily **blocks the account** after a certain number of login failures.
> * Prevents brute-force guessing.
>
> **3. Inform User**
> * Notifies the user about the **last successful login time** and the **number of unsuccessful attempts**.
> * Helps users detect suspicious activity.


---

# Attack on Knowledge based Authentication
![lecture-10-user-auth-1-20251215205733294.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938121/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733294.png)

## How to avoid
* Limit physical access to your computer.
* Use on-screen keyboards for sensitive logins.

## How to avoid/detect?
* Use strong, complex passwords with **mixed characters**.
* Enforce **account lockout** after multiple failed attempts.
* Do not re-use password across sites: use a **unique password** for **each online account**.

---

# Password Guessing methods
## Brute Force
Try all possible combinations. -> May work if the easy password and length is small

## Intelligent Search
Search possible passwords in a **restricted space**
	Related to the user
		girlfriend/boyfriend name, wife/child info, car brand, phone number, birth date


---

# Brute-forcing passwords is exponential
![lecture-10-user-auth-1-20251215205733316.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938122/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733316.png)
비밀번호가 길어질수록 해킹하는 데 걸리는 시간이 기하급수적(Exponential)으로 늘어난다

---

# Password Spoofing
## Attacker sends a fake login page or email
(e.g., fake “Bank Login” screen) to steal credentials. 

## How to avoid/detect? 
▪ Always **verify website URLs**, use twofactor authentication (**2FA**), and **avoid clicking suspicious links**.

## Remote login is even worse
* Putty, TeamViewer, AnyDisk 
* Telnet sends passwords in clear 
* **Use [[SSH]]** (Secure Shell)
* Use strong and separate password for remote access!

## Avoid Cracking the password file
Passwords are generally stored hashed -> Adding **password salt** would help
![lecture-10-user-auth-1-20251215205733330.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938122/obsidian/Knowledge/computer-science/computer-security/lecture-10-user-auth-1/assets/lecture-10-user-auth-1-20251215205733330.png)
