---
excalidraw-plugin: parsed
tags:
  - excalidraw
---
### 2. Overview of Hash Functions (Slides 6-9)

Definition:

A cryptographic hash function is a mathematical algorithm that takes an **arbitrarily large message** as input and generates a **fixed-length** fingerprint (also called a [[digest]]).

- **Notation:** $h = H(M)$
    
    - $M$: Variable length message.
        
    - $H$: The hash function.
        
    - $h$: Fixed length output.
        
- **Speed:** Good hash functions are very fast to compute (faster than symmetric ciphers).
    

**Characteristics:**

- **Fixed Output Size:** Regardless of whether the input is "Hello" or a massive file, the output length is always the same for a specific algorithm.
    
    - **MD5:** Outputs 128 bits.
        
    - **SHA-1:** Outputs 160 bits (approx. 40 hex characters).
        
    - **SHA-2:** Outputs 224, 256, 384, or 512 bits (SHA-256 has approx. 64 hex characters).
        
- **Format:** Outputs are typically represented in hexadecimal format.
    

---

### 3. Requirements & Security Properties (Slides 10-13)

To be considered "cryptographically strong," a hash function must satisfy these properties:

1. **One-Way Property ([[Pre-Image]] Resistance):**
    
    - It is **irreversible**.
        
    - Given a hash value $h$, it is [[computationally infeasible]] to find the original message $x$ such that $h = H(x)$.
        
2. **Weak Collision Resistance ([[Second Pre-Image Resistance]]):**
    
    - Given a specific input $M$ and its hash $h(M)$, it is infeasible to find a _different_ input $M'$ such that $h(M) = h(M')$.
        
    - If you can find such a duplicate easily, the algorithm is broken.
        
3. **Avalanche Effect:**
    
    - A tiny change in the input (e.g., adding a single comma) results in a **massive change** in the output hash. The two outputs should look completely unrelated.
        
4. **Deterministic:**
    
    - The same input always produces the exact same output.
        
5. **Hash Speed:**
    
    - Generally, they should be fast (e.g., for website connections).
        
    - _Exception:_ Password hashing sometimes prefers slower algorithms to prevent brute-force attacks.
        

---

### 4. How Hash Functions Work: Structure (Slides 14-16)

Merkle-Damgård Scheme:

Most hash functions use this iterative structure.

1. **Segmentation:** The input string is split into equal-sized **blocks**.
    
2. **Padding:** If the message length doesn't fit the block size perfectly, **padding** (1s and 0s) is added to the end to make it fit.
    
3. **Processing:**
   ![lecture-09-cryptography-6-20251215205718956.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938109/obsidian/Knowledge/computer-science/computer-security/lecture-09-cryptography-6/assets/lecture-09-cryptography-6-20251215205718956.png)
    - It starts with an **Initial Vector (IV)** (random value).
        
    - It processes blocks one by one, mixing the current block with the previous result using a [[**Compression Function**]].
        
    - Simple compression might use bit-by-bit XOR or circular shifts (rotation), though real algorithms are much more complex.
        

---

### 5. Practical Applications (Slides 17-18)

Hash functions are used for:

1. **Password Storage:** Servers store the hash of your password, not the password itself. When you login, the system hashes your input and compares it to the stored hash.
    
2. **Data Integrity:** Verifying that files, emails, or software have not been altered.
    
3. **Blockchain & Cryptocurrency:** Used heavily in [["Proof-of-Work"]] (e.g., Bitcoin).
    

---

### 6. Common Hashing Algorithms (Slides 19-29)
![lecture-09-cryptography-6-20251215205718973.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938110/obsidian/Knowledge/computer-science/computer-security/lecture-09-cryptography-6/assets/lecture-09-cryptography-6-20251215205718973.png)


#### **1. MD5 ([[Message Digest]] 5)**
![lecture-09-cryptography-6-20251215205718997.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938111/obsidian/Knowledge/computer-science/computer-security/lecture-09-cryptography-6/assets/lecture-09-cryptography-6-20251215205718997.png)
- Designed by Ron Rivest (1992).
    
- **Output:** 128-bit (32 hex characters).
    
- **Block Size:** 512 bits.
    
- **Status:** **Least secure.** Primarily used for file integrity checks (checking for [[corruption]]), not for security against attacks.
- process
> 	1. **Input Preparation:**
> 	   - The input message is padded to ensure its length is [[congruent]] to [[448 modulo 512]]. This means the message length will be extended to 64 bits less than a multiple of 512.
> 	     - Padding involves adding a single '1' bit followed by '0' bits until the desired length is reached.
> 	2. **Appending Length:**
> 		- After padding, the original message length (in bits) is appended as a 64-bit integer at the end of the padded message.
> 	3. **Dividing into Blocks:**
> 		- The padded message is divided into blocks of 512 bits each.
> 	4. **Initialization of State Variables:**
> 		- MD buffer including Four state variables (A, B, C, D) are initialized with specific constants.
> 		- These variables hold the "current state" of the hash calculation and will pass the result of one block to the next.
> 	5. **Processing Each Block:**
> 		- Each 512-bit block undergoes multiple rounds of processing using [[non-linear functions]] and [[bitwise operations]].
> 		- A [[series of operations are applied through four main rounds involving various functions (F, G, H, I)]].
> 		- - **Crucial Step (Chaining):**
> 			- Before processing a block, the current values of A, B, C, D are saved.
> 			- After the rounds are finished, the result is _added_ to the saved values (e.g., $A = A + A_{saved}$).
> 			- This updated MD buffer becomes the starting state for the _next_ block.
> 	6. **Finalization:**
> 		- After all blocks have been processed, the final hash value is obtained by concatenating the state variables A, B, C, and D.
> 	7. **Output:**
> 		- The final output is a 128-bit hash value represented as a string of 32 hexadecimal characters.
> 	


#### **2. SHA-1 (Secure Hash Algorithm 1)**


- **Output:** 160 bits.
    
- **Status:** **Insecure.** Vulnerabilities have been found, so it is no longer recommended for digital signatures.
    

#### **3. SHA-2 Family (The Current Standard)**
![lecture-09-cryptography-6-20251215205719019.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938111/obsidian/Knowledge/computer-science/computer-security/lecture-09-cryptography-6/assets/lecture-09-cryptography-6-20251215205719019.png)

- Includes SHA-224, **SHA-256**, SHA-384, **SHA-512**.
    
- **SHA-256:** Produces a **256-bit hash**. Widely used for verifying data authenticity.
    
- **SHA-512:** Produces a **512-bit hash**. Used for high-security applications.
    
- **Security:** Longer hash values generally mean higher security.
    

#### **SHA-512 Structure & Calculation Example (Slides 27-28)**
![lecture-09-cryptography-6-20251215205719038.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938112/obsidian/Knowledge/computer-science/computer-security/lecture-09-cryptography-6/assets/lecture-09-cryptography-6-20251215205719038.png)

- **Word Size:** 64 bits.
    
- **Block Size:** 1024 bits.
    
- Padding Formula:
    
    $$Padding = (-Message\_bits - Length\_bits) \pmod{1024}$$
    
    (Note: Length_bits for SHA-512 is usually 128 bits)
    
    **Example Calculation:**
    
    - **Scenario:** Message length is 2590 bits.
        
    - Calculation:
        
        $$Padding = -2590 - 128 \pmod{1024}$$
        
        $$= -2718 \pmod{1024}$$
        
        $$= 354 \text{ bits}$$
        
    - **Result:** We add 354 bits of padding. The total size becomes $2590 + 354 + 128 = 3072$ bits, which fits exactly into 3 blocks ($3 \times 1024$).
        

---

### 7. Digital Signatures (Slides 30-33)

Concept:

Digital signatures combine Hashing and Public Key Cryptography to prove [[Authenticity and Integrity]].

### Digital Signatures – General Model
![[annotated_Pasted image 20251214205111]]

### 1. Left Side: Bob signs a message (Signing)

**Goal:** Bob wants to send a message ($M$) and prove that he wrote it and that it hasn't been changed.

1. **Message ($M$):** This is the original document Bob wants to send.
    
2. **Hashing:**
    
    - The message ($M$) is passed through a **Cryptographic hash function**.
        
    - This creates a **hash value ($h$)**. Think of this as a unique digital "fingerprint" of the document.
        
3. **Signature Generation:**
    
    - This hash ($h$) is then processed by the **Digital signature generation algorithm**.
        
    - **Key Point:** Bob uses his **Private Key** (which only he possesses) to encrypt this hash.
        
4. **Result:**
    
    - This generates the **Signature ($S$)**.
        
    - The signature ($S$) is attached to the original Message ($M$) to create the **Signed Document**, which is sent to Alice.
        

---

### 2. Right Side: Alice verifies the signature (Verification)

**Goal:** Alice receives the document and wants to verify that it really came from Bob and remains unchanged.

1. **Receive:** Alice receives the **Message ($M$)** and the **Signature ($S$)**.
    
2. **Two-Step Check:**
    
    - **Path 1 (Hashing):** Alice takes the Message ($M$) and runs it through the _same_ **Cryptographic hash function**. She gets a calculated hash value ($h$).
        
    - **Path 2 (Decryption):** She takes the Signature ($S$) and processes it with the **Digital signature verification algorithm**.
        
    - **Key Point:** She uses **Bob’s Public Key** (which is available to everyone) to decrypt the signature.
        
3. **Comparison:**
    
    - Alice compares the **hash she calculated** (from Path 1) with the **hash retrieved from the signature** (from Path 2).
        
4. **Conclusion:**
    
    - **If they match (Valid):** It proves the message was signed by Bob (Authentication) and the content has not been altered (Integrity).
        
    - **If they do not match (Not Valid):** The message was either altered in transit, or it was not signed by Bob.

### Digital Signatures - Email Data Integrity
![lecture-09-cryptography-6-20251215205719064.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938113/obsidian/Knowledge/computer-science/computer-security/lecture-09-cryptography-6/assets/lecture-09-cryptography-6-20251215205719064.png)

**Process (Alice sending to Bob):**

1. **Sign:** Alice creates a hash of her message. She encrypts this hash with her **Private Key**. This is the "Signature".
    
2. **Send:** She sends the original message + the Signature.
    
3. **Verify:**
    
    - Bob receives the message and hashes it himself.
        
    - Bob decrypts Alice's signature using Alice's **Public Key** to reveal the hash she sent.
        
    - **Compare:** If Bob's calculated hash matches the decrypted hash, the message is authentic and has not been modified (Integrity).
        

Example (Email Integrity):

If a Man-in-the-Middle modifies the email content, the hash of the modified message will not match the hash inside the digital signature. The verification will fail ("Red flags"), and Bob will know not to trust the email.

==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'



