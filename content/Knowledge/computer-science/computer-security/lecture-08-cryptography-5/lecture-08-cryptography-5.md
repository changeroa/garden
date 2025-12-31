---
date created: 2025-12-15 22:37
date modified: 2025-12-28 18:40
---
### Symmetric Ciphers
use the Same key for both encryption and decryption.
- Two main types
	- Stream ciphers
	- Block ciphers

### Public Key
Unlike symmetric systems, Public-Key Cryptography (PKC) uses two different keys:
	1. **Public Key ($pk$):** Known by **everyone**. Used to **encrypt** messages or verify signatures.
	2. **Private Key ($sk$):** Known only to the **owner**. Used to **decrypt** messages or create signatures.
	Characteristics :
		1. **The Mailbox Analogy:** Anyone can put a letter in the mailbox (using the Public Key), but only the owner with the key can open it (Private Key).
		2. **Feasibility:** The keys are mathematically related, but it is computationally infeasible to derive the Private Key from the Public Key.
		3. **History:** Invented by Diffie and Hellman (1976) to solve [[key distribution problems]] and enable digital signatures.
	   Formal Definition : A PKC system consists of three algorithms.
	   - $G()$: Generates the key pair ($pk, sk$).
	   - $E(pk, m)$: Encrypts message $m$ into ciphertext $c$.
	   - $D(sk, c)$: Decrypts ciphertext $c$ back to message $m$.

### Mathematical Foundations (Slides 5-10)
To understand RSA, you must understand modular arithmetic.
**Modular Arithmetic:**
- $a \equiv b \pmod n$ means $a$ and $b$ have the same remainder when divided by $n$.
- **Property:** $((a \pmod n) + (b \pmod n)) \pmod n = (a + b) \pmod n$. (This applies to multiplication as well).

**Inverses:**
- **Additive Inverse(– 𝒙 mod 𝒏):** A number added to $x$ to get $0 \pmod n$.
- **Multiplicative Inverse ($x^{-1}$):** A number multiplied by $x$ to get $1 \pmod n$.
	  - _Note:_ The multiplicative inverse only exists if $x$ and $n$ are **relatively prime** (their Greatest Common Divisor, GCD, is 1).
- **Euler's Totient Function $\phi(n)$:
	- **$\phi(n)$ counts how many positive integers less than $n$ are relatively prime to $n$.
	* ***Crucial for RSA:** If $p$ and $q$ are prime numbers, then  $\phi(pq) = (p-1)(q-1)$.

### The RSA Algorithm
Invented by Rivest, Shamir, and Adleman (MIT, 1977). Its security relies on the difficulty of [[factoring]] large integers.
* Key Generation Process :
  1. Choose two large prime numbers $p$ and$ $q$.
  2. Compute $n = p \times q$.(This $n$ is the [[modulus]])
  3. Compute Euler's function $\phi(n) = (p-1)(q-1)$
  4. Choose a public exponent $e$ such that 1 < $e$ < $\phi(n)$ and $gcd(e, \phi(n)) = 1$.
  5. Calculate the private exponent $d$ such that $e \cdot d \equiv 1 \pmod{\phi(n)}$. (This means $d$ is the multiplicative inverse of $e$)
**Usage:**
- **Public Key:** $\{e, n\}$
- **Private Key:** $\{d, n\}$
* ***Encryption:** $C = M^e \pmod n$
- **Decryption:** $M = C^d \pmod n$

### RSA Examples & Limitations

#### Example 1 (Successful)

- **Setup:** Primes $p=3, q=11$.
    - $n = 33$.
    - $\phi(n) = (2)(10) = 20$.
    - Choose $e=3$ (relatively prime to 20).
    - Calculate $d=7$ (because $3 \times 7 = 21 \equiv 1 \pmod{20}$).
- **Encryption:** Message $M = 8$ ("H").
    - $C = 8^3 \pmod{33} = 512 \pmod{33} = 17$.
- **Decryption:** Ciphertext $C = 17$.
  - $M = 17^7 \pmod{33} = 8$. (Original message recovered).

#### Example 3 (The Failure Case)

- **Setup:** Same keys ($n=33, e=3, d=7$).
 - **Scenario:** Encrypting Message "HI" where $M = 89$.
 - **Encryption:** $C = 89^3 \pmod{33} = 23$.
 - **Decryption:** $M = 23^7 \pmod{33} = 23$.
 - **Result:** The decrypted message is 23, NOT 89.
 - **Why? (Slide Question):** RSA requires that the message $M$ must be smaller than the modulus $n$ ($M < n$). Here, $89 > 33$, so [[the information was lost during the modulo operation before encryption even finished]]. To fix this, you must use a larger $n$ or split the message into smaller blocks.