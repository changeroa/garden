# Tokens: Something You Have
![Pasted image 20251214230744.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938104/obsidian/Attachments/Pasted_image_20251214230744.png)
A token is a physical device that generates a temporary authentication code. Smartcards and smart tokens are the best examples.It is used as a second factor in Two-Factor Authentication (2FA)

## How does token works?
❖ Each token contains a unique secret seed, shared only with the authentication server. 
❖ The device has a clock synchronized to UTC. 
❖ Using the **seed** + **current time**, the device generates a **one-time password (OTP)** that changes periodically (e.g., every 30 or 60 sec). 
❖ At login, the user enters: 
	▪ A **[[PIN]]** (something they know)
	▪ A **token code (OTP)** (something they have)
❖ Final passcode = PIN + Token code

## Key Properties
1. **Unique** per user (seed is different for each token)
2. Codes **expire quickly** (every 60 seconds or less)
3. **Cannot be reused / replayed**
4. Requires the **physical token** to generate the passcode

## Why is this secure?
1. Even if someone sees the code, it expires quickly
2. Brute-force attacks are useless because code lifetime is short.
3. The attacker must possess the physical device and know the PIN.
4. No secret is transmitted over the network— only the OTP.

---

# Advantages/Limitations of Token-Based Authentication
* Advantages
	* ✓ Strong security compared to passwords alone 
	* ✓ Offline operation (time-based) 
	* ✓ No need for network connectivity to generate OTP 
	* ✓ Works on both hardware and mobile devices 
* Limitations 
	* ✓ Token can be lost, stolen, or damaged
	* ✓ User must carry the token 
	* ✓ Hardware tokens have cost

---
# Example: Time-Based One-Time Password (TOTP)
## Assume:
• Secret key = ABC123 
• Time = 2025/11/16 23:00:00 (rounded to 60-sec interval) 
• TOTP algorithm generates: 159759

## User types:
PIN (2468) + 159759 → 2468159759

---

# Token : Two Factor Authentication
![Pasted image 20251214232356.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938105/obsidian/Attachments/Pasted_image_20251214232356.png)
• First factor: what user **knows** 
• Second factor: what user **has** 
• Without the second factor, user cannot log in.

---

# What is Biometrics?
![Screenshot from 2025-12-14 23-27-39.png](https://res.cloudinary.com/dnwyqgjwk/image/upload/v1766938106/obsidian/Attachments/Screenshot_from_2025-12-14_23-27-39.png)
A biometric is a **measurable physiological, behavioral, and biological features** that can be used for automated recognition to identify individuals
* Physiological biometrics (involve the **structure of your body**)
	* Fingerprint, Face, Eye (iris),….
* Behavioral biometrics (**patterns unique** to each person).
	* How you sign, **speak(voice recognition, 즉 말하는 것도 패턴이니까)**, or even type on a keyboard.
* Biological biometrics (use traits at a **genetic** level)
	* DNA

---

# Face Recognition
## Background
Humans have used facial features for identification since ancient times — it is the most natural biometric
The human brain is extremely good at recognizing and remembering faces even with changes (glasses, haircut, aging, expression).

## Automating face recognition - Applications
* ### Passport control booths (the easiest): 
	• Subject looks straight at the camera, and their face is compared with the one on file.
	• Example: e-passport gates at airports 
	
* ### In Forensics (harder), 법의학에서
	• Find whether a suspect’s face fits a low-quality recording on a security video. 

* ### In Surveillance (the hardest), 감시에서 
	• CCTVs **scan a moving crowd of people** at an airport and try to pick out anyone who is on a wanted list. 

* ### Mobile phone authentication
	• Apple FaceID with structured light & 3D IR sensor 
	• Samsung, Xiaomi, Huawei use camera + IR


## How does face recognition work?
### Core idea
Face recognition systems analyze **unique facial landmarks**, extract features, and convert them into a numerical representation called a **face embeddings** or **faceprint**.

### Facial Features / Landmarks
• Distance between eyes 
• Nose width & shape 
• Jawline structure 
• Depth of [[eye sockets]]
• Cheekbone shape 
• Lip and eyebrow curves


### Face Recognition Pipeline
1. Face Detection – locate the face in an image 
2. Alignment & normalization – adjust angle, lighting, rotation 
3. Feature Extraction – using deep neural networks
4. Embedding / Faceprint Generation 
5. Matching – compare against a database using similarity scores 
6. Decision – accept/reject or identify user

### Challenges & Limitations in Face recognition
| Challenge | Example |
| :--- | :--- |
| **Lighting variations** | Day vs night, shadows |
| **Face pose** | Side view vs frontal view |
| **Expressions** | Smile, anger, talking |
| **Aging** | Child vs adult vs elderly |
| **Occlusion** | Masks, sunglasses, hats |
| **Dataset bias** | May fail for certain demographics |
| **Spoofing** | Photos, masks, deepfakes |


### Security & Spoofing Defense Methods
❖ Liveness detection (blinking, texture analysis): 
	❖ Checks whether the face shows real human movement or skin texture instead of a flat photo or video. 
❖ 3D depth sensing (FaceID):
	❖ Uses structured light or infrared dots to measure the 3D shape of the face so printed photos and screens cannot fool it. 
❖ Infrared and thermal detection:
	❖ Verifies heat signatures or IR reflection to confirm the face belongs to a living person, not a mask or picture.

❖ Anti-deepfake recognition AI models:
	❖ Uses AI to detect subtle artifacts or inconsistencies produced by deepfake videos or synthetic faces.

---
# 