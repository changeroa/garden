## 1. Behavioral Authentication Systems

### A. Handwritten Signatures
* **Status:** Still a standard for contracts and banking in many countries (though Europe is moving to PINs).
* **Weakness:** Easy to forge (using tracing paper, pantographs, or practice).
* **Modern Application:**
    * **Online Signature Services:** Legally accepted.
    * **Signature Tablets:** Record not just the image, but the *process* (speed, pressure, rhythm) for verification.

### B. Voice Recognition
* **Definition:** Identifying a person based on their unique **Voiceprint**.
* **vs. Speech Recognition:**
    * *Voice Recognition:* "Who is speaking?" (Needs voiceprint).
    * *Speech Recognition:* "What are they saying?" (Needs dictionary, pronunciation models).
* **Threats:**
    * **Replay Attacks (Voice Spoofing):** Attackers record a user's voice commands and replay them to fool assistants (Siri, Alexa).
    * *Reference:* [Void: A fast and light voice liveness detection system, USENIX 2020].

### C. Keystroke Dynamics
* **Definition:** Identifying individuals based on their typing rhythm and manner.
* **Raw Measurements:**
    1.  **Press Time (Hold Time):** Duration a key is pressed.
    2.  **Flight Time:** Duration between releasing one key and pressing the next.
* **Feature Extraction:**
    * For a password like "abc123", the system extracts: Hold time, Pressure, Finger Area, Accelerometer values (X,Y,Z).
    * *Dimensions:* A 10-character password yields 10 Hold Time values and 9 Flight Time (Up-Down) values.

### D. Touch Gestures (MotionID)
* **Problem:** Traditional login only authenticates at the start. It cannot detect if the user changes during the session.
* **Solution:** **Continuous Authentication** using built-in motion sensors (Gyroscope, Accelerometer) while touching the screen.
* **Process:**
    1.  **Collection:** Capture touch data segments (1~3 sec).
    2.  **Preprocessing:** Rescale and reshape data.
    3.  **Modeling:** Use **LSTM Autoencoders** or **One-class SVM** to build a user profile (.tflite).
    4.  **Decision:**
        * Normal → Keep unlocked.
        * Anomaly → Lock device.
* **Usability Issue:** "False Rejection" (Locking the valid owner).
    * *Mitigation:* **Majority Voting** (e.g., Lock only after 5 consecutive failures).

---

## 3. Location-based Authentication (LocID)

### Concept
Using location data to improve security. Devices remain unlocked ("Smart Lock") when in a "Trusted Place."

### Limitation of GPS (Android Smart Lock)
* Current Android Smart Lock relies on GPS.
* **Accuracy:** Radius of ~80m.
* **Issue:** Fails to distinguish fine-grained indoor locations (e.g., specific rooms).

### Proposed Solution: LocID System
* **Method:** Combines **Wi-Fi RSSI** (Signal Strength) + **Light Sensor** features.
* **Goal:** Precise indoor location authentication to keep phones unlocked in specific rooms.
* **Key Techniques:**
    1.  **LSS (Location-Wise Signal Signature):** Selects "Top-ranked" network nodes that are stable and strong.
    2.  **Feature Extraction:** Vectorizes RSSI matrix and Light fingerprints.
    3.  **Classification:** Uses SVM or KNN models.
* **Performance:**
    * **Wi-Fi + Light Combined:** F1 Score 92% ~ 100%.
    * **Battery Efficiency:** Consumes only 1.44% ~ 5.2% battery during continuous sensing (highly efficient).
    * **Storage:** Model size is minimal (KB).

---

## 4. References & Readings
* *Strengthening Password Authentication using Keystroke Dynamics*, ICICM 2019.
* *Void: Voice Liveness Detection*, USENIX 2020.
* *LocID: Indoor Location-based Authentication*, IEEE JIOT 2022.